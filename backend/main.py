import os
from datetime import datetime
from fastapi import FastAPI, Depends, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

import time
from sqlalchemy.exc import OperationalError

from pathlib import Path
from alembic import command
from alembic.config import Config

from database import get_db, SessionLocal, DATABASE_URL
from passlib.context import CryptContext
from models import (
    User,
    SIEFile,
    Receipt,
    Company,
    CompanyMember,
    Customer,
    Product,
    CompanySIEState,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------
# Pydantic Schemas
# -------------------------
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ResetPasswordRequest(BaseModel):
    email: EmailStr
    new_password: str


class RoleUpdateRequest(BaseModel):
    role: str


class SIEFileCreate(BaseModel):
    user_id: int
    filename: str
    storage_path: str
    period: str | None = None


class ReceiptCreate(BaseModel):
    user_id: int
    filename: str
    storage_path: str
    note: str | None = None


class CompanyCreate(BaseModel):
    user_id: int  # creator
    company_name: str
    organization_number: str | None = None
    address: str | None = None
    postal_code: str | None = None
    city: str | None = None
    country: str | None = None
    vat_number: str | None = None
    fiscal_year_start: str | None = None
    fiscal_year_end: str | None = None
    accounting_standard: str | None = None


class CompanyUpdate(BaseModel):
    company_name: str
    organization_number: str | None = None
    address: str | None = None
    postal_code: str | None = None
    city: str | None = None
    country: str | None = None
    vat_number: str | None = None
    fiscal_year_start: str | None = None
    fiscal_year_end: str | None = None
    accounting_standard: str | None = None


class CompanySIEStateUpsert(BaseModel):
    user_id: int
    sie_content: str


class CustomerCreate(BaseModel):
    user_id: int
    company_id: int | None = None
    type: str
    name: str
    organization_number: str | None = None
    email: str | None = None
    phone: str | None = None
    address: str
    postal_code: str
    city: str
    country: str


class CustomerUpdate(BaseModel):
    type: str
    name: str
    organization_number: str | None = None
    email: str | None = None
    phone: str | None = None
    address: str
    postal_code: str
    city: str
    country: str


class ProductCreate(BaseModel):
    user_id: int
    company_id: int | None = None
    name: str
    description: str | None = None
    price: float
    includes_vat: bool = False
    vat_rate: float = 25
    unit: str | None = None


class ProductUpdate(BaseModel):
    name: str
    description: str | None = None
    price: float
    includes_vat: bool = False
    vat_rate: float = 25
    unit: str | None = None


# -------------------------
# Password helpers
# -------------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


# -------------------------
# Health + migrations
# -------------------------
@app.get("/health")
def health():
    # Also attempt a DB check when using postgres
    try:
        db = SessionLocal()
        db.execute("SELECT 1")
        db.close()
        return {"status": "ok", "db": "ok"}
    except Exception:
        return {"status": "ok", "db": "unavailable"}


def run_migrations():
    backend_dir = Path(__file__).resolve().parent
    alembic_ini = backend_dir / "alembic.ini"
    if not alembic_ini.exists():
        return
    cfg = Config(str(alembic_ini))
    cfg.set_main_option("sqlalchemy.url", DATABASE_URL)
    command.upgrade(cfg, "head")


# run migrations on startup (like you do now)
try:
    run_migrations()
except Exception:
    # Keep server running even if migrations fail in dev environments
    pass


# -------------------------
# Users + Auth
# -------------------------
@app.get("/users")
def list_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return [{"id": user.id, "email": user.email, "name": user.name, "role": user.role} for user in users]


@app.post("/users")
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    user = User(email=payload.email, password=hash_password(payload.password), name=payload.name, role="user")
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Email already exists")
    db.refresh(user)
    return {"id": user.id, "email": user.email, "name": user.name}


@app.post("/auth/login")
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password):
        return {"success": False, "error": "Invalid email or password"}

    return {
        "success": True,
        "user": {"id": user.id, "email": user.email, "name": user.name, "role": user.role},
    }


@app.post("/auth/reset")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.password = hash_password(payload.new_password)
    db.commit()
    return {"success": True}


@app.patch("/users/{user_id}/role")
def update_user_role(
    user_id: int,
    payload: RoleUpdateRequest,
    db: Session = Depends(get_db),
    admin_token: str | None = Header(default=None, alias="X-Admin-Token"),
):
    header_token = admin_token or ""
    configured_token = os.getenv("ADMIN_TOKEN", "")
    if not configured_token or header_token != configured_token:
        raise HTTPException(status_code=401, detail="Unauthorized")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = payload.role
    db.commit()
    return {"success": True, "user": {"id": user.id, "email": user.email, "name": user.name, "role": user.role}}


# -------------------------
# SIE files + receipts
# -------------------------
@app.post("/sie-files")
def create_sie_file(payload: SIEFileCreate, db: Session = Depends(get_db)):
    sie_file = SIEFile(
        user_id=payload.user_id,
        filename=payload.filename,
        storage_path=payload.storage_path,
        period=payload.period,
    )
    db.add(sie_file)
    db.commit()
    db.refresh(sie_file)
    return {"id": sie_file.id}


@app.post("/receipts")
def create_receipt(payload: ReceiptCreate, db: Session = Depends(get_db)):
    receipt = Receipt(
        user_id=payload.user_id,
        filename=payload.filename,
        storage_path=payload.storage_path,
        note=payload.note,
    )
    db.add(receipt)
    db.commit()
    db.refresh(receipt)
    return {"id": receipt.id}


# -------------------------
# Helpers for membership checks
# -------------------------
def require_company_access(db: Session, company_id: int, user_id: int) -> CompanyMember:
    membership = (
        db.query(CompanyMember)
        .filter(
            CompanyMember.company_id == company_id,
            CompanyMember.user_id == user_id,
            CompanyMember.status == "ACTIVE",
        )
        .first()
    )
    if not membership:
        raise HTTPException(status_code=403, detail="No access to this company")
    return membership


def require_company_admin(db: Session, company_id: int, user_id: int) -> CompanyMember:
    membership = require_company_access(db, company_id, user_id)
    if membership.role not in ("OWNER", "ADMIN"):
        raise HTTPException(status_code=403, detail="Admin access required")
    return membership


# -------------------------
# Company SIE State (per-company)
# Frontend still sends user_id, but now we use it only for access + auditing.
# -------------------------
@app.get("/companies/{company_id}/sie-state")
def get_company_sie_state(company_id: int, user_id: int, db: Session = Depends(get_db)):
    require_company_access(db, company_id, user_id)

    state = db.query(CompanySIEState).filter(CompanySIEState.company_id == company_id).first()
    if not state:
        return {
            "companyId": company_id,
            "sieContent": None,
            "version": None,
            "updatedAt": None,
        }

    return {
        "id": state.id,
        "companyId": state.company_id,
        "sieContent": state.sie_content,
        "version": state.version,
        "updatedAt": state.updated_at.isoformat() if state.updated_at else None,
        "updatedByUserId": state.updated_by_user_id,
    }


@app.put("/companies/{company_id}/sie-state")
def upsert_company_sie_state(company_id: int, payload: CompanySIEStateUpsert, db: Session = Depends(get_db)):
    require_company_access(db, company_id, payload.user_id)

    state = db.query(CompanySIEState).filter(CompanySIEState.company_id == company_id).first()

    if not state:
        state = CompanySIEState(
            company_id=company_id,
            sie_content=payload.sie_content,
            version=1,
            updated_by_user_id=payload.user_id,
        )
        db.add(state)
        db.commit()
        db.refresh(state)
        return {
            "id": state.id,
            "companyId": state.company_id,
            "version": state.version,
            "updatedAt": state.updated_at.isoformat() if state.updated_at else None,
        }

    # naive update (we will add lock + base_version later)
    state.sie_content = payload.sie_content
    state.version = (state.version or 1) + 1
    state.updated_by_user_id = payload.user_id
    db.commit()
    db.refresh(state)

    return {
        "id": state.id,
        "companyId": state.company_id,
        "version": state.version,
        "updatedAt": state.updated_at.isoformat() if state.updated_at else None,
    }


# -------------------------
# Customers
# -------------------------
@app.get("/customers")
def list_customers(user_id: int, db: Session = Depends(get_db)):
    customers = db.query(Customer).filter(Customer.user_id == user_id).all()
    return [
        {
            "id": c.id,
            "user_id": c.user_id,
            "company_id": c.company_id,
            "type": c.type,
            "name": c.name,
            "organizationNumber": c.organization_number,
            "email": c.email,
            "phone": c.phone,
            "address": c.address,
            "postalCode": c.postal_code,
            "city": c.city,
            "country": c.country,
        }
        for c in customers
    ]


@app.post("/customers")
def create_customer(payload: CustomerCreate, db: Session = Depends(get_db)):
    customer = Customer(
        user_id=payload.user_id,
        company_id=payload.company_id,
        type=payload.type,
        name=payload.name,
        organization_number=payload.organization_number,
        email=payload.email,
        phone=payload.phone,
        address=payload.address,
        postal_code=payload.postal_code,
        city=payload.city,
        country=payload.country,
    )
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return {"id": customer.id}


@app.put("/customers/{customer_id}")
def update_customer(customer_id: int, payload: CustomerUpdate, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    customer.type = payload.type
    customer.name = payload.name
    customer.organization_number = payload.organization_number
    customer.email = payload.email
    customer.phone = payload.phone
    customer.address = payload.address
    customer.postal_code = payload.postal_code
    customer.city = payload.city
    customer.country = payload.country
    db.commit()
    return {"success": True}


@app.delete("/customers/{customer_id}")
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    db.delete(customer)
    db.commit()
    return {"success": True}


# -------------------------
# Products
# -------------------------
@app.get("/products")
def list_products(user_id: int, db: Session = Depends(get_db)):
    products = db.query(Product).filter(Product.user_id == user_id).all()
    return [
        {
            "id": p.id,
            "user_id": p.user_id,
            "company_id": p.company_id,
            "name": p.name,
            "description": p.description,
            "price": p.price,
            "includesVat": p.includes_vat,
            "vatRate": p.vat_rate,
            "unit": p.unit,
        }
        for p in products
    ]


@app.post("/products")
def create_product(payload: ProductCreate, db: Session = Depends(get_db)):
    product = Product(
        user_id=payload.user_id,
        company_id=payload.company_id,
        name=payload.name,
        description=payload.description,
        price=payload.price,
        includes_vat=payload.includes_vat,
        vat_rate=payload.vat_rate,
        unit=payload.unit,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return {"id": product.id}


@app.put("/products/{product_id}")
def update_product(product_id: int, payload: ProductUpdate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product.name = payload.name
    product.description = payload.description
    product.price = payload.price
    product.includes_vat = payload.includes_vat
    product.vat_rate = payload.vat_rate
    product.unit = payload.unit
    db.commit()
    return {"success": True}


@app.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"success": True}


# -------------------------
# Companies (membership-based)
# Frontend continues to call /companies?user_id=...
# -------------------------
@app.get("/companies")
def list_companies(user_id: int, db: Session = Depends(get_db)):
    memberships = (
        db.query(CompanyMember)
        .filter(CompanyMember.user_id == user_id, CompanyMember.status == "ACTIVE")
        .all()
    )
    company_ids = [m.company_id for m in memberships]
    if not company_ids:
        return []

    companies = db.query(Company).filter(Company.id.in_(company_ids)).all()
    # preserve response shape expected by frontend mapCompanyFromApi
    return [
        {
            "id": company.id,
            "companyName": company.company_name,
            "organizationNumber": company.organization_number,
            "address": company.address,
            "postalCode": company.postal_code,
            "city": company.city,
            "country": company.country,
            "vatNumber": company.vat_number,
            "fiscalYearStart": company.fiscal_year_start,
            "fiscalYearEnd": company.fiscal_year_end,
            "accountingStandard": company.accounting_standard,
        }
        for company in companies
    ]


@app.post("/companies")
def create_company(payload: CompanyCreate, db: Session = Depends(get_db)):
    # Require org number for unique-company behavior
    org = (payload.organization_number or "").strip()
    if not org:
        raise HTTPException(status_code=400, detail="organization_number is required")

    # If company already exists, block creation (as per your requirement)
    existing = db.query(Company).filter(Company.organization_number == org).first()
    if existing:
        raise HTTPException(
            status_code=409,
            detail="Company with this organization_number already exists",
        )

    company = Company(
        company_name=payload.company_name,
        organization_number=org,
        address=payload.address,
        postal_code=payload.postal_code,
        city=payload.city,
        country=payload.country,
        vat_number=payload.vat_number,
        fiscal_year_start=payload.fiscal_year_start,
        fiscal_year_end=payload.fiscal_year_end,
        accounting_standard=payload.accounting_standard,
    )
    db.add(company)
    db.commit()
    db.refresh(company)

    # Create OWNER membership for creator
    membership = CompanyMember(
        company_id=company.id,
        user_id=payload.user_id,
        role="OWNER",
        status="ACTIVE",
    )
    db.add(membership)
    db.commit()

    return {"id": company.id}


@app.put("/companies/{company_id}")
def update_company(company_id: int, payload: CompanyUpdate, user_id: int, db: Session = Depends(get_db)):
    require_company_admin(db, company_id, user_id)

    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    # If orgnr changes, enforce uniqueness
    new_org = (payload.organization_number or "").strip() if payload.organization_number else None
    if new_org and new_org != company.organization_number:
        existing = db.query(Company).filter(Company.organization_number == new_org).first()
        if existing:
            raise HTTPException(status_code=409, detail="organization_number already in use")
        company.organization_number = new_org

    company.company_name = payload.company_name
    company.address = payload.address
    company.postal_code = payload.postal_code
    company.city = payload.city
    company.country = payload.country
    company.vat_number = payload.vat_number
    company.fiscal_year_start = payload.fiscal_year_start
    company.fiscal_year_end = payload.fiscal_year_end
    company.accounting_standard = payload.accounting_standard

    db.commit()
    return {"id": company.id}


@app.delete("/companies/{company_id}")
def delete_company(company_id: int, user_id: int, db: Session = Depends(get_db)):
    require_company_admin(db, company_id, user_id)

    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    # Delete related SIE state
    db.query(CompanySIEState).filter(CompanySIEState.company_id == company_id).delete()

    # Delete memberships then company
    db.query(CompanyMember).filter(CompanyMember.company_id == company_id).delete()
    db.delete(company)
    db.commit()

    return {"success": True}
