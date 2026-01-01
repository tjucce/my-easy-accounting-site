// Swedish BAS Chart of Accounts (Kontoplan)
// This is a comprehensive list of common BAS accounts

import { BASAccount, AccountClass } from './types';

export const basAccounts: BASAccount[] = [
  // 1xxx - Assets (Tillgångar)
  // 10xx - Immateriella anläggningstillgångar
  { code: '1010', name: 'Utvecklingsutgifter', class: 'assets' },
  { code: '1019', name: 'Ack avskr utvecklingsutgifter', class: 'assets' },
  { code: '1030', name: 'Patent', class: 'assets' },
  { code: '1039', name: 'Ack avskr patent', class: 'assets' },
  { code: '1050', name: 'Hyresrätt', class: 'assets' },
  { code: '1059', name: 'Ack avskr hyresrätt', class: 'assets' },
  { code: '1070', name: 'Goodwill', class: 'assets' },
  { code: '1079', name: 'Ack avskr goodwill', class: 'assets' },
  
  // 11xx - Byggnader och mark
  { code: '1110', name: 'Byggnader', class: 'assets' },
  { code: '1119', name: 'Ack avskr byggnader', class: 'assets' },
  { code: '1130', name: 'Mark', class: 'assets' },
  { code: '1150', name: 'Markanläggningar', class: 'assets' },
  { code: '1159', name: 'Ack avskr markanläggningar', class: 'assets' },
  
  // 12xx - Maskiner och inventarier
  { code: '1210', name: 'Maskiner och andra tekniska anläggningar', class: 'assets' },
  { code: '1219', name: 'Ack avskr maskiner', class: 'assets' },
  { code: '1220', name: 'Inventarier och verktyg', class: 'assets' },
  { code: '1229', name: 'Ack avskr inventarier', class: 'assets' },
  { code: '1240', name: 'Bilar och andra transportmedel', class: 'assets' },
  { code: '1249', name: 'Ack avskr bilar', class: 'assets' },
  { code: '1250', name: 'Datorer', class: 'assets' },
  { code: '1259', name: 'Ack avskr datorer', class: 'assets' },
  
  // 13xx - Finansiella anläggningstillgångar
  { code: '1310', name: 'Andelar i koncernföretag', class: 'assets' },
  { code: '1320', name: 'Långfristiga fordringar hos koncernföretag', class: 'assets' },
  { code: '1330', name: 'Andelar i intresseföretag', class: 'assets' },
  { code: '1350', name: 'Andra långfristiga värdepappersinnehav', class: 'assets' },
  { code: '1380', name: 'Andra långfristiga fordringar', class: 'assets' },
  
  // 14xx - Lager
  { code: '1410', name: 'Lager av råvaror', class: 'assets' },
  { code: '1420', name: 'Lager av tillsatsmaterial', class: 'assets' },
  { code: '1440', name: 'Lager av produkter i arbete', class: 'assets' },
  { code: '1450', name: 'Lager av färdiga varor', class: 'assets' },
  { code: '1460', name: 'Lager av handelsvaror', class: 'assets' },
  { code: '1470', name: 'Pågående arbeten', class: 'assets' },
  { code: '1480', name: 'Förskott till leverantörer', class: 'assets' },
  
  // 15xx - Kundfordringar
  { code: '1510', name: 'Kundfordringar', class: 'assets' },
  { code: '1519', name: 'Nedskrivning av kundfordringar', class: 'assets' },
  { code: '1550', name: 'Konsignationsfordringar', class: 'assets' },
  { code: '1560', name: 'Kundfordringar hos koncernföretag', class: 'assets' },
  { code: '1580', name: 'Kontraktsfordringar', class: 'assets' },
  
  // 16xx - Övriga kortfristiga fordringar
  { code: '1610', name: 'Fordringar hos anställda', class: 'assets' },
  { code: '1630', name: 'Avräkning för skatter och avgifter', class: 'assets' },
  { code: '1640', name: 'Skattefordringar', class: 'assets' },
  { code: '1650', name: 'Momsfordran', class: 'assets' },
  
  // 17xx - Förutbetalda kostnader och upplupna intäkter
  { code: '1700', name: 'Förutbetalda kostnader och upplupna intäkter', class: 'assets' },
  { code: '1710', name: 'Förutbetalda hyreskostnader', class: 'assets' },
  { code: '1720', name: 'Förutbetalda leasingavgifter', class: 'assets' },
  { code: '1730', name: 'Förutbetalda försäkringspremier', class: 'assets' },
  { code: '1750', name: 'Upplupna hyresintäkter', class: 'assets' },
  { code: '1790', name: 'Övriga förutbetalda kostnader och upplupna intäkter', class: 'assets' },
  
  // 18xx - Kortfristiga placeringar
  { code: '1810', name: 'Andelar i börsnoterade bolag', class: 'assets' },
  { code: '1820', name: 'Obligationer', class: 'assets' },
  { code: '1830', name: 'Konvertibla skuldebrev', class: 'assets' },
  { code: '1880', name: 'Andra kortfristiga placeringar', class: 'assets' },
  { code: '1890', name: 'Nedskrivning kortfristiga placeringar', class: 'assets' },
  
  // 19xx - Kassa och bank
  { code: '1910', name: 'Kassa', class: 'assets' },
  { code: '1920', name: 'PlusGiro', class: 'assets' },
  { code: '1930', name: 'Företagskonto/checkräkning', class: 'assets' },
  { code: '1940', name: 'Övriga bankkonton', class: 'assets' },
  { code: '1950', name: 'Bankcertifikat', class: 'assets' },
  { code: '1960', name: 'Koncernkonto', class: 'assets' },
  
  // 2xxx - Equity & Liabilities (Eget kapital och skulder)
  // 20xx - Eget kapital
  { code: '2010', name: 'Eget kapital', class: 'equity_liabilities' },
  { code: '2011', name: 'Eget kapital, ingående balans', class: 'equity_liabilities' },
  { code: '2013', name: 'Privata uttag', class: 'equity_liabilities' },
  { code: '2018', name: 'Egen insättning', class: 'equity_liabilities' },
  { code: '2019', name: 'Årets resultat', class: 'equity_liabilities' },
  { code: '2081', name: 'Aktiekapital', class: 'equity_liabilities' },
  { code: '2085', name: 'Uppskrivningsfond', class: 'equity_liabilities' },
  { code: '2086', name: 'Reservfond', class: 'equity_liabilities' },
  { code: '2091', name: 'Balanserad vinst eller förlust', class: 'equity_liabilities' },
  { code: '2097', name: 'Överkursfond', class: 'equity_liabilities' },
  { code: '2098', name: 'Vinst eller förlust från föregående år', class: 'equity_liabilities' },
  { code: '2099', name: 'Årets resultat', class: 'equity_liabilities' },
  
  // 21xx - Obeskattade reserver
  { code: '2110', name: 'Periodiseringsfonder', class: 'equity_liabilities' },
  { code: '2120', name: 'Ackumulerade överavskrivningar', class: 'equity_liabilities' },
  { code: '2150', name: 'Ersättningsfond', class: 'equity_liabilities' },
  
  // 22xx - Avsättningar
  { code: '2210', name: 'Avsättningar för pensioner', class: 'equity_liabilities' },
  { code: '2220', name: 'Avsättning för garantier', class: 'equity_liabilities' },
  { code: '2290', name: 'Övriga avsättningar', class: 'equity_liabilities' },
  
  // 23xx - Långfristiga skulder
  { code: '2310', name: 'Obligations- och förlagslån', class: 'equity_liabilities' },
  { code: '2320', name: 'Konvertibla lån', class: 'equity_liabilities' },
  { code: '2330', name: 'Checkräkningskredit', class: 'equity_liabilities' },
  { code: '2340', name: 'Byggnadskreditiv', class: 'equity_liabilities' },
  { code: '2350', name: 'Skulder till kreditinstitut', class: 'equity_liabilities' },
  { code: '2360', name: 'Skulder till koncernföretag', class: 'equity_liabilities' },
  { code: '2390', name: 'Övriga långfristiga skulder', class: 'equity_liabilities' },
  
  // 24xx - Kortfristiga skulder till kreditinstitut
  { code: '2410', name: 'Kortfristiga skulder till kreditinstitut', class: 'equity_liabilities' },
  { code: '2417', name: 'Kortfristig del av långfristiga skulder', class: 'equity_liabilities' },
  { code: '2420', name: 'Förskott från kunder', class: 'equity_liabilities' },
  { code: '2430', name: 'Pågående arbeten för annans räkning', class: 'equity_liabilities' },
  { code: '2440', name: 'Leverantörsskulder', class: 'equity_liabilities' },
  { code: '2450', name: 'Fakturerad men ej utförd tjänst', class: 'equity_liabilities' },
  
  // 25xx - Skatteskulder
  { code: '2510', name: 'Skatteskulder', class: 'equity_liabilities' },
  { code: '2512', name: 'Beräknad inkomstskatt', class: 'equity_liabilities' },
  { code: '2514', name: 'Beräknad fastighetsskatt', class: 'equity_liabilities' },
  { code: '2518', name: 'Betald F-skatt', class: 'equity_liabilities' },
  
  // 26xx - Moms och särskilda punktskatter
  { code: '2610', name: 'Utgående moms, 25%', class: 'equity_liabilities' },
  { code: '2611', name: 'Utgående moms på varor, 25%', class: 'equity_liabilities' },
  { code: '2612', name: 'Utgående moms på tjänster, 25%', class: 'equity_liabilities' },
  { code: '2620', name: 'Utgående moms, 12%', class: 'equity_liabilities' },
  { code: '2630', name: 'Utgående moms, 6%', class: 'equity_liabilities' },
  { code: '2640', name: 'Ingående moms', class: 'equity_liabilities' },
  { code: '2650', name: 'Redovisningskonto för moms', class: 'equity_liabilities' },
  
  // 27xx - Personalens skatter, avgifter och löneavdrag
  { code: '2710', name: 'Personalskatt', class: 'equity_liabilities' },
  { code: '2730', name: 'Lagstadgade sociala avgifter', class: 'equity_liabilities' },
  { code: '2731', name: 'Avräkning sociala avgifter', class: 'equity_liabilities' },
  { code: '2732', name: 'Avräkning arbetsmarknadsförsäkringar', class: 'equity_liabilities' },
  { code: '2740', name: 'Avräkning pension', class: 'equity_liabilities' },
  { code: '2750', name: 'Avdrag för fackföreningsavgift', class: 'equity_liabilities' },
  { code: '2790', name: 'Övriga löneavdrag', class: 'equity_liabilities' },
  
  // 28xx - Övriga kortfristiga skulder
  { code: '2810', name: 'Avräkning för factoring och belånade fordringar', class: 'equity_liabilities' },
  { code: '2820', name: 'Kortfristiga skulder till koncernföretag', class: 'equity_liabilities' },
  { code: '2890', name: 'Övriga kortfristiga skulder', class: 'equity_liabilities' },
  
  // 29xx - Upplupna kostnader och förutbetalda intäkter
  { code: '2910', name: 'Upplupna löner', class: 'equity_liabilities' },
  { code: '2920', name: 'Upplupna semesterlöner', class: 'equity_liabilities' },
  { code: '2930', name: 'Upplupna sociala avgifter', class: 'equity_liabilities' },
  { code: '2940', name: 'Upplupna räntekostnader', class: 'equity_liabilities' },
  { code: '2950', name: 'Upplupna avtalade pensionskostnader', class: 'equity_liabilities' },
  { code: '2960', name: 'Upplupna räntekostnader koncern', class: 'equity_liabilities' },
  { code: '2970', name: 'Förutbetalda hyresintäkter', class: 'equity_liabilities' },
  { code: '2980', name: 'Övriga förutbetalda intäkter', class: 'equity_liabilities' },
  { code: '2990', name: 'Övriga upplupna kostnader och förutbetalda intäkter', class: 'equity_liabilities' },
  
  // 3xxx - Revenue (Intäkter)
  { code: '3000', name: 'Försäljning och utfört arbete', class: 'revenue' },
  { code: '3010', name: 'Försäljning varor', class: 'revenue' },
  { code: '3011', name: 'Försäljning varor, 25% moms', class: 'revenue' },
  { code: '3012', name: 'Försäljning varor, 12% moms', class: 'revenue' },
  { code: '3013', name: 'Försäljning varor, 6% moms', class: 'revenue' },
  { code: '3014', name: 'Försäljning varor, momsfri', class: 'revenue' },
  { code: '3040', name: 'Försäljning tjänster', class: 'revenue' },
  { code: '3041', name: 'Försäljning tjänster, 25% moms', class: 'revenue' },
  { code: '3042', name: 'Försäljning tjänster, 12% moms', class: 'revenue' },
  { code: '3043', name: 'Försäljning tjänster, 6% moms', class: 'revenue' },
  { code: '3044', name: 'Försäljning tjänster, momsfri', class: 'revenue' },
  { code: '3050', name: 'Fakturerade kostnader', class: 'revenue' },
  { code: '3060', name: 'Övrig försäljning', class: 'revenue' },
  { code: '3100', name: 'Försäljning inom Sverige', class: 'revenue' },
  { code: '3200', name: 'Försäljning utanför Sverige', class: 'revenue' },
  { code: '3300', name: 'Försäljning tjänster utomlands', class: 'revenue' },
  { code: '3400', name: 'Försäljning, exportaffär', class: 'revenue' },
  { code: '3500', name: 'Fakturerade frakter', class: 'revenue' },
  { code: '3510', name: 'Fakturerade frakter Sverige', class: 'revenue' },
  { code: '3520', name: 'Fakturerade frakter EU', class: 'revenue' },
  { code: '3530', name: 'Fakturerade frakter export', class: 'revenue' },
  { code: '3600', name: 'Rabatter och bonus', class: 'revenue' },
  { code: '3740', name: 'Öres- och kronutjämning', class: 'revenue' },
  { code: '3900', name: 'Övriga rörelseintäkter', class: 'revenue' },
  { code: '3910', name: 'Hyresintäkter', class: 'revenue' },
  { code: '3920', name: 'Provisionsintäkter', class: 'revenue' },
  { code: '3960', name: 'Valutakursvinster', class: 'revenue' },
  { code: '3970', name: 'Vinst vid avyttring av inventarier', class: 'revenue' },
  { code: '3980', name: 'Erhållna bidrag', class: 'revenue' },
  { code: '3990', name: 'Övriga ersättningar och intäkter', class: 'revenue' },
  
  // 4xxx - Cost of goods sold
  { code: '4000', name: 'Inköp av varor', class: 'expenses' },
  { code: '4010', name: 'Inköp varor, 25% moms', class: 'expenses' },
  { code: '4012', name: 'Inköp varor, 12% moms', class: 'expenses' },
  { code: '4013', name: 'Inköp varor, 6% moms', class: 'expenses' },
  { code: '4014', name: 'Inköp varor, momsfri', class: 'expenses' },
  { code: '4400', name: 'Förändring av lager', class: 'expenses' },
  { code: '4500', name: 'Övriga varukostnader', class: 'expenses' },
  { code: '4510', name: 'Frakt och transport', class: 'expenses' },
  { code: '4530', name: 'Tull- och speditionsavgifter', class: 'expenses' },
  { code: '4600', name: 'Legoarbeten och underentreprenörer', class: 'expenses' },
  
  // 5xxx - Local expenses
  { code: '5000', name: 'Lokalkostnader', class: 'expenses' },
  { code: '5010', name: 'Lokalhyra', class: 'expenses' },
  { code: '5020', name: 'El för lokal', class: 'expenses' },
  { code: '5030', name: 'Värme', class: 'expenses' },
  { code: '5040', name: 'Vatten och avlopp', class: 'expenses' },
  { code: '5050', name: 'Lokaltillbehör', class: 'expenses' },
  { code: '5060', name: 'Städning och renhållning', class: 'expenses' },
  { code: '5070', name: 'Reparation och underhåll av lokal', class: 'expenses' },
  { code: '5090', name: 'Övriga lokalkostnader', class: 'expenses' },
  
  // 51xx - Fastighetskostnader
  { code: '5110', name: 'Tomträttsavgäld/arrende', class: 'expenses' },
  { code: '5120', name: 'El för fastighet', class: 'expenses' },
  { code: '5130', name: 'Värme för fastighet', class: 'expenses' },
  { code: '5140', name: 'Vatten och avlopp för fastighet', class: 'expenses' },
  { code: '5170', name: 'Reparation och underhåll av fastighet', class: 'expenses' },
  { code: '5191', name: 'Fastighetsskatt', class: 'expenses' },
  
  // 52xx - Hyra av anläggningstillgångar
  { code: '5210', name: 'Hyra av maskiner', class: 'expenses' },
  { code: '5220', name: 'Hyra av inventarier', class: 'expenses' },
  { code: '5250', name: 'Hyra av datorer', class: 'expenses' },
  { code: '5290', name: 'Övriga hyreskostnader', class: 'expenses' },
  
  // 54xx - Förbrukningsinventarier och förbrukningsmaterial
  { code: '5410', name: 'Förbrukningsinventarier', class: 'expenses' },
  { code: '5420', name: 'Programvaror', class: 'expenses' },
  { code: '5460', name: 'Förbrukningsmaterial', class: 'expenses' },
  { code: '5480', name: 'Arbetskläder och skyddsmaterial', class: 'expenses' },
  
  // 55xx - Reparation och underhåll
  { code: '5510', name: 'Reparation och underhåll av maskiner', class: 'expenses' },
  { code: '5520', name: 'Reparation och underhåll av inventarier', class: 'expenses' },
  { code: '5530', name: 'Reparation och underhåll av installationer', class: 'expenses' },
  { code: '5550', name: 'Reparation och underhåll av datorer', class: 'expenses' },
  
  // 56xx - Kostnader för transportmedel
  { code: '5610', name: 'Personbilskostnader', class: 'expenses' },
  { code: '5611', name: 'Drivmedel för personbilar', class: 'expenses' },
  { code: '5612', name: 'Försäkring och skatt personbilar', class: 'expenses' },
  { code: '5613', name: 'Reparation och underhåll personbilar', class: 'expenses' },
  { code: '5615', name: 'Leasingavgifter personbilar', class: 'expenses' },
  { code: '5620', name: 'Lastbilskostnader', class: 'expenses' },
  { code: '5690', name: 'Övriga kostnader för transportmedel', class: 'expenses' },
  
  // 57xx - Frakter och transporter
  { code: '5710', name: 'Frakter, transporter och försäkring vid varuförsäljning', class: 'expenses' },
  { code: '5720', name: 'Tull- och speditionskostnader vid varuförsäljning', class: 'expenses' },
  
  // 58xx - Resekostnader
  { code: '5800', name: 'Resekostnader', class: 'expenses' },
  { code: '5810', name: 'Biljetter', class: 'expenses' },
  { code: '5820', name: 'Hyrbil', class: 'expenses' },
  { code: '5830', name: 'Kost och logi', class: 'expenses' },
  { code: '5890', name: 'Övriga resekostnader', class: 'expenses' },
  
  // 59xx - Reklam och PR
  { code: '5900', name: 'Reklam och PR', class: 'expenses' },
  { code: '5910', name: 'Annonsering', class: 'expenses' },
  { code: '5920', name: 'Reklamtrycksaker och direktreklam', class: 'expenses' },
  { code: '5930', name: 'Utställningar och mässor', class: 'expenses' },
  { code: '5940', name: 'Sponsring', class: 'expenses' },
  { code: '5990', name: 'Övrig reklam och PR', class: 'expenses' },
  
  // 6xxx - Other external expenses
  { code: '6000', name: 'Övriga externa kostnader', class: 'expenses' },
  { code: '6010', name: 'Kontorsmateriel och trycksaker', class: 'expenses' },
  { code: '6050', name: 'Facklitteratur och tidningar', class: 'expenses' },
  { code: '6060', name: 'Kontor och städmaterial', class: 'expenses' },
  { code: '6070', name: 'Representation och uppvaktning', class: 'expenses' },
  { code: '6071', name: 'Representation, avdragsgill', class: 'expenses' },
  { code: '6072', name: 'Representation, ej avdragsgill', class: 'expenses' },
  { code: '6100', name: 'Kontorsmaterial och trycksaker', class: 'expenses' },
  { code: '6110', name: 'Kontorsmateriel', class: 'expenses' },
  { code: '6150', name: 'Trycksaker', class: 'expenses' },
  { code: '6200', name: 'Tele och post', class: 'expenses' },
  { code: '6211', name: 'Fast telefoni', class: 'expenses' },
  { code: '6212', name: 'Mobiltelefon', class: 'expenses' },
  { code: '6230', name: 'Datakommunikation', class: 'expenses' },
  { code: '6250', name: 'Postbefordran', class: 'expenses' },
  { code: '6300', name: 'Företagsförsäkringar och övriga riskkostnader', class: 'expenses' },
  { code: '6310', name: 'Företagsförsäkringar', class: 'expenses' },
  { code: '6350', name: 'Förluster på kundfordringar', class: 'expenses' },
  { code: '6400', name: 'Förvaltningskostnader', class: 'expenses' },
  { code: '6410', name: 'Styrelsearvoden', class: 'expenses' },
  { code: '6420', name: 'Revisionsarvode', class: 'expenses' },
  { code: '6430', name: 'Management fees', class: 'expenses' },
  { code: '6440', name: 'Årsredovisning och delårsrapporter', class: 'expenses' },
  { code: '6450', name: 'Bolagsstämma', class: 'expenses' },
  { code: '6460', name: 'Publicering', class: 'expenses' },
  { code: '6490', name: 'Övriga förvaltningskostnader', class: 'expenses' },
  { code: '6500', name: 'Övriga externa tjänster', class: 'expenses' },
  { code: '6510', name: 'Redovisningstjänster', class: 'expenses' },
  { code: '6520', name: 'Advokat och juridisk rådgivning', class: 'expenses' },
  { code: '6530', name: 'Konsultarvoden', class: 'expenses' },
  { code: '6540', name: 'IT-tjänster', class: 'expenses' },
  { code: '6550', name: 'Konsultarvoden tekniska konsulter', class: 'expenses' },
  { code: '6560', name: 'Serviceavgifter', class: 'expenses' },
  { code: '6570', name: 'Bankkostnader', class: 'expenses' },
  { code: '6590', name: 'Övriga externa tjänster', class: 'expenses' },
  { code: '6800', name: 'Inhyrd personal', class: 'expenses' },
  { code: '6900', name: 'Övriga externa kostnader', class: 'expenses' },
  { code: '6970', name: 'Tidningsannonser', class: 'expenses' },
  { code: '6980', name: 'Föreningsavgifter', class: 'expenses' },
  { code: '6981', name: 'Föreningsavgifter, avdragsgilla', class: 'expenses' },
  { code: '6982', name: 'Föreningsavgifter, ej avdragsgilla', class: 'expenses' },
  { code: '6990', name: 'Övriga externa kostnader', class: 'expenses' },
  
  // 7xxx - Personnel costs
  { code: '7000', name: 'Personalkostnader', class: 'expenses' },
  { code: '7010', name: 'Löner till kollektivanställda', class: 'expenses' },
  { code: '7080', name: 'Lönekorrigeringar', class: 'expenses' },
  { code: '7081', name: 'Sjuklöner', class: 'expenses' },
  { code: '7082', name: 'Semesterlöner', class: 'expenses' },
  { code: '7090', name: 'Förändring av semesterlöneskuld', class: 'expenses' },
  { code: '7200', name: 'Löner tjänstemän', class: 'expenses' },
  { code: '7210', name: 'Löner till tjänstemän', class: 'expenses' },
  { code: '7280', name: 'Lönekorrigeringar tjänstemän', class: 'expenses' },
  { code: '7281', name: 'Sjuklöner tjänstemän', class: 'expenses' },
  { code: '7285', name: 'Semesterlöner tjänstemän', class: 'expenses' },
  { code: '7290', name: 'Förändring av semesterlöneskuld, tjänstemän', class: 'expenses' },
  { code: '7300', name: 'Kostnadsersättningar och förmåner', class: 'expenses' },
  { code: '7310', name: 'Kontanta extraersättningar', class: 'expenses' },
  { code: '7320', name: 'Traktamenten vid inrikes resor', class: 'expenses' },
  { code: '7321', name: 'Skattefria traktamenten, inrikes', class: 'expenses' },
  { code: '7322', name: 'Skattepliktiga traktamenten, inrikes', class: 'expenses' },
  { code: '7330', name: 'Bilersättningar', class: 'expenses' },
  { code: '7331', name: 'Skattefria bilersättningar', class: 'expenses' },
  { code: '7332', name: 'Skattepliktiga bilersättningar', class: 'expenses' },
  { code: '7380', name: 'Kostnader för förmåner till anställda', class: 'expenses' },
  { code: '7381', name: 'Personalrepresentation', class: 'expenses' },
  { code: '7382', name: 'Personalrepresentation, ej avdragsgill', class: 'expenses' },
  { code: '7385', name: 'Kostnader för fri bostad', class: 'expenses' },
  { code: '7399', name: 'Övriga kostnadsersättningar och förmåner', class: 'expenses' },
  { code: '7400', name: 'Sociala och andra avgifter enligt lag och avtal', class: 'expenses' },
  { code: '7410', name: 'Arbetsgivaravgifter', class: 'expenses' },
  { code: '7411', name: 'Arbetsgivaravgifter för kollektivanställda', class: 'expenses' },
  { code: '7412', name: 'Arbetsgivaravgifter för tjänstemän', class: 'expenses' },
  { code: '7420', name: 'Kollektiva avgifter', class: 'expenses' },
  { code: '7440', name: 'Löneskatt', class: 'expenses' },
  { code: '7450', name: 'Särskild löneskatt', class: 'expenses' },
  { code: '7460', name: 'Avgifter till arbetsmarknadspolitik', class: 'expenses' },
  { code: '7500', name: 'Pensionskostnader', class: 'expenses' },
  { code: '7510', name: 'Avtalsenliga pensionspremier', class: 'expenses' },
  { code: '7520', name: 'Premiebaserad pension', class: 'expenses' },
  { code: '7530', name: 'Förmånsbaserad pension', class: 'expenses' },
  { code: '7570', name: 'Premier för direktpension', class: 'expenses' },
  { code: '7600', name: 'Övriga personalkostnader', class: 'expenses' },
  { code: '7610', name: 'Utbildning', class: 'expenses' },
  { code: '7620', name: 'Sjuk- och hälsovård', class: 'expenses' },
  { code: '7621', name: 'Sjukvård', class: 'expenses' },
  { code: '7622', name: 'Friskvård', class: 'expenses' },
  { code: '7630', name: 'Personalrekrytering', class: 'expenses' },
  { code: '7690', name: 'Övriga personalkostnader', class: 'expenses' },
  
  // 78xx - Avskrivningar
  { code: '7800', name: 'Avskrivningar', class: 'expenses' },
  { code: '7810', name: 'Avskrivningar på immateriella anläggningstillgångar', class: 'expenses' },
  { code: '7820', name: 'Avskrivningar på byggnader och markanläggningar', class: 'expenses' },
  { code: '7830', name: 'Avskrivningar på maskiner och inventarier', class: 'expenses' },
  { code: '7832', name: 'Avskrivningar på inventarier och verktyg', class: 'expenses' },
  { code: '7834', name: 'Avskrivningar på bilar och transportmedel', class: 'expenses' },
  { code: '7835', name: 'Avskrivningar på datorer', class: 'expenses' },
  { code: '7840', name: 'Avskrivningar på förbättringsutgifter annans fastighet', class: 'expenses' },
  
  // 79xx - Övriga rörelsekostnader
  { code: '7900', name: 'Övriga rörelsekostnader', class: 'expenses' },
  { code: '7960', name: 'Valutakursförluster i rörelsen', class: 'expenses' },
  { code: '7970', name: 'Förlust vid avyttring av anläggningstillgångar', class: 'expenses' },
  { code: '7990', name: 'Övriga rörelsekostnader', class: 'expenses' },
  
  // 8xxx - Financial items
  { code: '8000', name: 'Finansiella poster', class: 'expenses' },
  { code: '8010', name: 'Resultat från andelar i koncernföretag', class: 'expenses' },
  { code: '8100', name: 'Resultat från aktier och andelar', class: 'expenses' },
  { code: '8110', name: 'Utdelning på aktier', class: 'expenses' },
  { code: '8120', name: 'Resultat vid avyttring av värdepapper', class: 'expenses' },
  { code: '8200', name: 'Ränteintäkter', class: 'expenses' },
  { code: '8210', name: 'Ränteintäkter från bank', class: 'expenses' },
  { code: '8211', name: 'Ränteintäkter från bank', class: 'expenses' },
  { code: '8212', name: 'Ränteintäkter från koncernföretag', class: 'expenses' },
  { code: '8220', name: 'Ränteintäkter koncern', class: 'expenses' },
  { code: '8230', name: 'Ränteintäkter kundfordringar', class: 'expenses' },
  { code: '8250', name: 'Ränteintäkter kortfristiga placeringar', class: 'expenses' },
  { code: '8300', name: 'Räntekostnader', class: 'expenses' },
  { code: '8310', name: 'Räntekostnader lån', class: 'expenses' },
  { code: '8311', name: 'Räntekostnader för checkräkningskredit', class: 'expenses' },
  { code: '8312', name: 'Räntekostnader för banklån', class: 'expenses' },
  { code: '8313', name: 'Räntekostnader koncernkonto', class: 'expenses' },
  { code: '8314', name: 'Räntekostnader till koncernföretag', class: 'expenses' },
  { code: '8330', name: 'Räntekostnader leverantörsskulder', class: 'expenses' },
  { code: '8340', name: 'Räntekostnader skatter', class: 'expenses' },
  { code: '8390', name: 'Övriga räntekostnader', class: 'expenses' },
  { code: '8400', name: 'Valutakursvinster/-förluster', class: 'expenses' },
  { code: '8410', name: 'Valutakursvinster', class: 'expenses' },
  { code: '8420', name: 'Valutakursförluster', class: 'expenses' },
  { code: '8500', name: 'Resultat från kortfristiga placeringar', class: 'expenses' },
  { code: '8600', name: 'Övriga finansiella intäkter', class: 'expenses' },
  { code: '8700', name: 'Övriga finansiella kostnader', class: 'expenses' },
  { code: '8800', name: 'Bokslutsdispositioner', class: 'expenses' },
  { code: '8810', name: 'Förändring av periodiseringsfonder', class: 'expenses' },
  { code: '8820', name: 'Förändring av överavskrivningar', class: 'expenses' },
  { code: '8850', name: 'Förändring av ersättningsfond', class: 'expenses' },
  { code: '8890', name: 'Övriga bokslutsdispositioner', class: 'expenses' },
  { code: '8900', name: 'Skatt på årets resultat', class: 'expenses' },
  { code: '8910', name: 'Skatt på årets resultat', class: 'expenses' },
  { code: '8920', name: 'Uppskjuten skatt', class: 'expenses' },
  { code: '8999', name: 'Årets resultat', class: 'expenses' },
];

// Get account by code
export function getAccountByCode(code: string): BASAccount | undefined {
  return basAccounts.find(account => account.code === code);
}

// Get accounts by class
export function getAccountsByClass(accountClass: AccountClass): BASAccount[] {
  return basAccounts.filter(account => account.class === accountClass);
}

// Search accounts
export function searchAccounts(query: string): BASAccount[] {
  const lowercaseQuery = query.toLowerCase();
  return basAccounts.filter(
    account =>
      account.code.includes(query) ||
      account.name.toLowerCase().includes(lowercaseQuery)
  );
}

// Get account class label
export function getAccountClassLabel(accountClass: AccountClass): string {
  switch (accountClass) {
    case 'assets':
      return 'Tillgångar (Assets)';
    case 'equity_liabilities':
      return 'Eget kapital & Skulder (Equity & Liabilities)';
    case 'revenue':
      return 'Intäkter (Revenue)';
    case 'expenses':
      return 'Kostnader (Expenses)';
  }
}
