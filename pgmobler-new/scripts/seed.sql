-- =============================================
-- PG Møbler Seed Data
-- Real categories and products from pgmobler.no
-- =============================================

-- SUPPLIERS
INSERT INTO suppliers (id, name, slug) VALUES (1, 'Brunstad', 'brunstad');
INSERT INTO suppliers (id, name, slug) VALUES (2, 'Casø Furniture', 'caso-furniture');
INSERT INTO suppliers (id, name, slug) VALUES (3, 'Hjellegjerde', 'hjellegjerde');
INSERT INTO suppliers (id, name, slug) VALUES (4, 'Nordisk Furu', 'nordisk-furu');
INSERT INTO suppliers (id, name, slug) VALUES (5, 'IMG', 'img');
INSERT INTO suppliers (id, name, slug) VALUES (6, 'Ekornes', 'ekornes');
INSERT INTO suppliers (id, name, slug) VALUES (7, 'Fjords', 'fjords');
INSERT INTO suppliers (id, name, slug) VALUES (8, 'Wonderland', 'wonderland');

-- CATEGORIES (parent categories)
INSERT INTO categories (id, name, slug, parent_id) VALUES (1, 'Stue', 'stue', NULL);
INSERT INTO categories (id, name, slug, parent_id) VALUES (2, 'Spisestue', 'spisestue', NULL);
INSERT INTO categories (id, name, slug, parent_id) VALUES (3, 'Soverom', 'soverom', NULL);

-- SUBCATEGORIES
INSERT INTO categories (id, name, slug, parent_id) VALUES (4, 'Modulsofa', 'modulsofa', 1);
INSERT INTO categories (id, name, slug, parent_id) VALUES (5, 'Sofa', 'sofa', 1);
INSERT INTO categories (id, name, slug, parent_id) VALUES (6, 'Salongbord', 'salongbord', 1);
INSERT INTO categories (id, name, slug, parent_id) VALUES (7, 'Hvilestol', 'hvilestol', 1);
INSERT INTO categories (id, name, slug, parent_id) VALUES (8, 'Lenestol', 'lenestol', 1);
INSERT INTO categories (id, name, slug, parent_id) VALUES (9, 'Senior Stol', 'senior-stol', 1);
INSERT INTO categories (id, name, slug, parent_id) VALUES (10, 'TV-Benk', 'tv-benk', 1);
INSERT INTO categories (id, name, slug, parent_id) VALUES (11, 'Skjenk & Kommode', 'skjenk-kommode', 1);
INSERT INTO categories (id, name, slug, parent_id) VALUES (12, 'Avlastningsbord', 'avlastningsbord', 1);
INSERT INTO categories (id, name, slug, parent_id) VALUES (13, 'Vitrineskap', 'vitrineskap', 1);
INSERT INTO categories (id, name, slug, parent_id) VALUES (14, 'Spisebord', 'spisebord', 2);
INSERT INTO categories (id, name, slug, parent_id) VALUES (15, 'Spisestoler', 'spisestoler', 2);
INSERT INTO categories (id, name, slug, parent_id) VALUES (16, 'Kontinentalsenger', 'kontinentalsenger', 3);
INSERT INTO categories (id, name, slug, parent_id) VALUES (17, 'Sovesofa', 'sovesofa', 1);
INSERT INTO categories (id, name, slug, parent_id) VALUES (18, 'Hyttemøbler', 'hyttemobler', NULL);

-- CMS CONTENT
INSERT INTO cms_content (key, value, section) VALUES ('front_page_header', 'Tidløse møbler for ditt hjem', 'page');
INSERT INTO cms_content (key, value, section) VALUES ('front_page_subtitle', 'Håndplukkede kvalitetsmøbler fra Skandinavias beste produsenter. Besøk vår butikk i Stavanger.', 'page');
INSERT INTO cms_content (key, value, section) VALUES ('front_page_button_text', 'Se alle produkter', 'page');
INSERT INTO cms_content (key, value, section) VALUES ('recent_product_header', 'Nytt i butikken', 'page');
INSERT INTO cms_content (key, value, section) VALUES ('recent_product_text', 'Siste tilskudd i sortimentet', 'page');
INSERT INTO cms_content (key, value, section) VALUES ('bestseller_header', 'Bestselgere', 'page');
INSERT INTO cms_content (key, value, section) VALUES ('bestseller_text', 'Våre mest populære møbler', 'page');
INSERT INTO cms_content (key, value, section) VALUES ('nav_item_1', 'Hjem', 'nav');
INSERT INTO cms_content (key, value, section) VALUES ('nav_item_2', 'Alle produkter', 'nav');
INSERT INTO cms_content (key, value, section) VALUES ('nav_item_3', 'Om oss', 'nav');
INSERT INTO cms_content (key, value, section) VALUES ('nav_item_4', 'Kontakt', 'nav');
INSERT INTO cms_content (key, value, section) VALUES ('street_address', 'Almedalsveien 4', 'business');
INSERT INTO cms_content (key, value, section) VALUES ('zip_code', '4007', 'business');
INSERT INTO cms_content (key, value, section) VALUES ('zip_code_area', 'Stavanger', 'business');
INSERT INTO cms_content (key, value, section) VALUES ('main_phone', '51 53 32 40', 'business');
INSERT INTO cms_content (key, value, section) VALUES ('main_email', 'post@pgmobler.no', 'business');
INSERT INTO cms_content (key, value, section) VALUES ('about_us_text', 'PG Møbler er en familiedrevet møbelbutikk som har holdt til i Stavanger siden 1970-tallet. Vi er stolte av å tilby et nøye utvalgt sortiment av kvalitetsmøbler fra Skandinavias ledende produsenter. Hos oss finner du alt fra sofaer og spisemøbler til senger og tilbehør — alltid med personlig veiledning og god service.', 'business');
INSERT INTO cms_content (key, value, section) VALUES ('footer_header_1', 'PG Møbler', 'footer');
INSERT INTO cms_content (key, value, section) VALUES ('footer_subtitle_1', 'Kvalitetsmøbler til stue, spisestue og soverom. Besøk vår butikk i Stavanger.', 'footer');
INSERT INTO cms_content (key, value, section) VALUES ('footer_header_2', 'Kategorier', 'footer');
INSERT INTO cms_content (key, value, section) VALUES ('footer_header_3', 'Butikken', 'footer');
INSERT INTO cms_content (key, value, section) VALUES ('footer_header_4', 'Kontakt', 'footer');

-- PRODUCTS (50 real products from pgmobler.no)
-- Sofaer
INSERT INTO products (id, slug, title, subtitle, category_id, price, sale_price, material, supplier_id, enabled, bestseller, description) VALUES
(1, 'cozy-sofa', 'Cozy sofa', '3-seter med høy komfort', 5, 30680, 21475, 'Tekstil', 1, 1, 1, 'Cozy er en romslig og komfortabel 3-seter sofa som inviterer til lange kvelder. Med myke puter og solid konstruksjon er dette en sofa som varer.'),
(2, 'palermo', 'Palermo', 'Hjørnesofa med mange muligheter', 4, 64590, 32295, 'Tekstil/Skinn', 1, 1, 1, 'Palermo er en fleksibel modulsofa som kan tilpasses ditt rom. Velg mellom ulike seksjoner og bygg din drømmesofa.'),
(3, 'malmoe-215cm', 'Malmø, 215cm', '2.5-seter i klassisk design', 5, 24760, 19995, 'Tekstil', 1, 1, 0, 'Malmø er en tidløs sofa med rene linjer og god sittekomfort. Perfekt for den som setter pris på skandinavisk design.'),
(4, 'miami', 'Miami', 'Stor hjørnesofa med sjeselong', 5, 33790, 19995, 'Tekstil', 1, 1, 0, 'Miami er en romslig hjørnesofa med bred sjeselong. Ideell for store stuer og familier som trenger god plass.'),
(5, 'massimo', 'Massimo', 'Moderne 3-seter', 5, 32455, 27495, 'Tekstil', 1, 1, 0, 'Massimo kombinerer moderne design med uslåelig komfort. Dype seter og myke puter gjør dette til en favoritt.'),
(6, 'preston-3s', 'Preston 3s', 'Elegant 3-seter sofa', 5, 14030, 12995, 'Tekstil', 1, 1, 0, 'Preston er en elegant sofa med slank profil som passer perfekt i moderne hjem.'),
(7, 'carnella-2-5s', 'Carnella 2.5s', 'Kompakt sofa i rust', 5, 20250, 11995, 'Tekstil', 1, 1, 0, 'Carnella i rust er en iøynefallende sofa som tilfører varme til ethvert rom.'),
(8, 'wellington', 'Wellington', 'Klassisk 2.5-seter', 5, 16995, 11995, 'Tekstil', 3, 1, 0, 'Wellington er en klassisk sofa med tidløst design og komfortable sitteplasser.'),
(9, 'dorte', 'Dorte', 'Stor hjørnesofa', 5, 42325, 36995, 'Tekstil/Skinn', 1, 1, 0, 'Dorte er en luksuriøs hjørnesofa med romslige seter og premium materialer.'),
(10, 'prime-line', 'Prime Line', 'Premium 3-seter', 5, 23899, 21899, 'Skinn', 3, 1, 0, 'Prime Line er en premium skinnssofa med uovertruffen komfort og holdbarhet.');

-- Modulsofa
INSERT INTO products (id, slug, title, subtitle, category_id, price, sale_price, material, supplier_id, enabled, bestseller, description) VALUES
(11, 'verona-lux', 'Verona Lux', 'Konfigurerbar modulsofa', 4, 43380, 23190, 'Tekstil', 1, 1, 1, 'Verona Lux er vår mest fleksible modulsofa. Konfigurer den akkurat slik du vil ha den.'),
(12, 'lazy', 'Lazy', 'Stor modulsofa med recliner', 4, 39315, 33415, 'Tekstil', 1, 1, 0, 'Lazy er en generøs modulsofa med integrert recliner-funksjon. Perfekt for filmkvelder.'),
(13, 'latifa', 'Latifa', 'Elegant hjørnesofa', 4, 54675, 32795, 'Tekstil', 1, 1, 0, 'Latifa er en sofistikert hjørnesofa med elegant design og premium komfort.'),
(14, 'elle-loungesofa', 'Elle loungesofa', 'Moderne loungesofa', 4, 33742, 28600, 'Tekstil', 1, 1, 0, 'Elle er en moderne loungesofa som er perfekt for å slappe av etter en lang dag.');

-- Spisebord
INSERT INTO products (id, slug, title, subtitle, category_id, price, sale_price, material, supplier_id, enabled, bestseller, description) VALUES
(15, 'c-edge-2', 'C-edge 2', 'Moderne spisebord i eik', 14, 7799, 6995, 'Eik', 2, 1, 1, 'C-edge 2 er et moderne spisebord i massiv eik med karakteristisk kant. Perfekt for 4-6 personer.'),
(16, 'orn-220', 'Ørn 220', 'Stort spisebord for hele familien', 14, NULL, 29990, 'Eik', NULL, 1, 0, 'Ørn 220 er et imponerende spisebord med plass til hele familien og gjester.'),
(17, 'eydis-spisebord', 'Eydis spisebord', 'Rundt spisebord i eik', 14, 13995, 11995, 'Eik', NULL, 1, 0, 'Eydis er et vakkert rundt spisebord som skaper en intim atmosfære rundt middagsbordet.'),
(18, 'tribeca-spisebord', 'Tribeca spisebord', 'Industrielt inspirert', 14, NULL, 19995, 'Eik/Metall', NULL, 1, 0, 'Tribeca er et spisebord med industriell stil som kombinerer massiv eik med metalldetaljer.'),
(19, 'gro-o120', 'Gro Ø120', 'Rundt spisebord', 14, 18250, 15995, 'Eik', NULL, 1, 0, 'Gro Ø120 er et elegant rundt spisebord i massiv eik med vakre detaljer.'),
(20, 'caso-701-langbord', 'Casø 701 Langbord', 'Langt spisebord i eik', 14, 24199, 19945, 'Eik', 2, 1, 0, 'Casø 701 er et langbord med tidløst design og plass til mange gjester.');

-- Spisestoler
INSERT INTO products (id, slug, title, subtitle, category_id, price, sale_price, material, supplier_id, enabled, bestseller, description) VALUES
(21, 'maddox', 'Maddox', 'Moderne spisestol', 15, NULL, 2995, 'Tekstil/Tre', NULL, 1, 1, 'Maddox er en komfortabel spisestol med moderne design. Perfekt match til de fleste spisebord.'),
(22, 'james', 'James', 'Klassisk spisestol', 15, 3550, 2595, 'Tekstil/Tre', NULL, 1, 0, 'James er en klassisk spisestol med polstret sete og rygg for ekstra komfort.'),
(23, 'bristol', 'Bristol', 'Stol med karakter', 15, 3995, 3495, 'Tekstil/Tre', NULL, 1, 0, 'Bristol er en spisestol med personlighet og god sittekomfort.'),
(24, 'peter', 'Peter', 'Enkel og elegant', 15, 4995, 3995, 'Tekstil/Tre', NULL, 1, 0, 'Peter er en ren og enkel spisestol som passer inn overalt.'),
(25, 'hauk-spisestol', 'Hauk spisestol', 'Norsk kvalitetsstol', 15, 2790, 2290, 'Tre', NULL, 1, 0, 'Hauk er en solid norskprodusert spisestol i massivt tre.'),
(26, 'sweet-seat', 'Sweet Seat', 'Komfortabel spisestol', 15, 3099, 2500, 'Tekstil/Tre', NULL, 1, 0, 'Sweet Seat lever opp til navnet med ekstra god sittekomfort.');

-- Salongbord
INSERT INTO products (id, slug, title, subtitle, category_id, price, sale_price, material, supplier_id, enabled, bestseller, description) VALUES
(27, 'coffee-break', 'Coffee break', 'Settbord i eik', 6, 8990, 4995, 'Eik', NULL, 1, 1, 'Coffee Break er et stilig settbord i massiv eik. Perfekt som salongbord eller sidebord.'),
(28, 'thor-6', 'Thor 6', 'Rundt salongbord', 6, 8299, 7450, 'Eik', NULL, 1, 0, 'Thor 6 er et rundt salongbord med vakker eikefinish og tidløst design.'),
(29, 'mood-salongbord', 'Mood', 'Moderne salongbord', 6, 8995, 6995, 'Eik', NULL, 1, 0, 'Mood er et moderne salongbord med rene linjer og praktisk oppbevaring.'),
(30, 'vega', 'Vega', 'Elegant salongbord', 6, NULL, 7995, 'Eik/Glass', NULL, 1, 0, 'Vega er et elegant salongbord som kombinerer eik og glass i et harmonisk design.');

-- Hvilestoler
INSERT INTO products (id, slug, title, subtitle, category_id, price, sale_price, material, supplier_id, enabled, bestseller, description) VALUES
(31, 'lisa', 'Lisa', 'Klassisk hvilestol', 7, 10930, 6295, 'Tekstil', 5, 1, 1, 'Lisa er en klassisk hvilestol med ergonomisk design og justerbar rygg.'),
(32, 'jade-lux', 'Jade Lux', 'Premium recliner', 7, 32420, 21995, 'Skinn', 7, 1, 0, 'Jade Lux er en premium recliner med elektrisk justering og førsteklasses skinn.'),
(33, 'olivia', 'Olivia', 'Komfortabel hvilestol', 7, 14995, 9495, 'Tekstil', 5, 1, 0, 'Olivia er en deilig hvilestol som innbyr til avslapning og hvile.'),
(34, 'diamond', 'Diamond', 'Luksus recliner', 7, 20999, 15990, 'Skinn', 5, 1, 0, 'Diamond er en luksusrecliner med mange justeringsmuligheter og premium materialer.'),
(35, 'enjoy', 'Enjoy', 'Recliner med fotskammel', 7, 11990, 9995, 'Tekstil', 5, 1, 0, 'Enjoy er en behagelig recliner som leveres med matchende fotskammel.');

-- Lenestoler
INSERT INTO products (id, slug, title, subtitle, category_id, price, sale_price, material, supplier_id, enabled, bestseller, description) VALUES
(36, 'utha-hoy', 'Utha høy', 'Høyrygget lenestol', 8, 7280, 6495, 'Tekstil', NULL, 1, 0, 'Utha høy er en lenestol med høy rygg som gir god nakkestøtte.'),
(37, 'cuba', 'Cuba', 'Retro lenestol', 8, 8310, 4995, 'Tekstil', NULL, 1, 0, 'Cuba er en retro-inspirert lenestol med moderne komfort.'),
(38, 'nico', 'Nico', 'Designer lenestol', 8, 15995, 8495, 'Tekstil/Skinn', NULL, 1, 0, 'Nico er en designerlenestol med skulpturell form og premium materialer.'),
(39, 'flora', 'Flora', 'Feminin lenestol', 8, NULL, 6540, 'Tekstil', NULL, 1, 0, 'Flora er en vakker lenestol med myke former og god komfort.'),
(40, 'country', 'Country', 'Klassisk lenestol', 8, 8900, 6925, 'Tekstil', NULL, 1, 0, 'Country er en klassisk lenestol med tidløs sjarm.');

-- Soverom
INSERT INTO products (id, slug, title, subtitle, category_id, price, sale_price, material, supplier_id, enabled, bestseller, description) VALUES
(41, 'karma-exclusive-pernille', 'Karma Exclusive Pernille', 'Premium kontinentalseng', 16, 80160, 41998, 'Tekstil', 8, 1, 1, 'Karma Exclusive Pernille er vår mest eksklusive kontinentalseng med superior komfort og kvalitet.'),
(42, 'veslemoy-kontinentalseng', 'Veslemøy kontinentalseng', 'Norskprodusert seng', 16, 38500, 24990, 'Tekstil', 8, 1, 0, 'Veslemøy er en norskprodusert kontinentalseng med premium kvalitet og komfort.'),
(43, 'josefine-kontinentalseng', 'Josefine Kontinentalseng', 'Elegant kontinentalseng', 16, 19000, 10990, 'Tekstil', 8, 1, 0, 'Josefine er en elegant kontinentalseng til en fantastisk pris.');

-- TV-benker og skjenker
INSERT INTO products (id, slug, title, subtitle, category_id, price, sale_price, material, supplier_id, enabled, bestseller, description) VALUES
(44, 'caso-501-tv-benk', 'Casø 501 tv-benk', 'TV-benk i eik', 10, NULL, 6399, 'Eik', 2, 1, 0, 'Casø 501 er en stilren TV-benk i massiv eik med romslig oppbevaring.'),
(45, 'broholm-tv-benk', 'Broholm TV-Benk', 'Stor TV-benk', 10, 13599, 11559, 'Eik', NULL, 1, 0, 'Broholm TV-Benk er en romslig TV-benk med plass til alt mediautstyr.'),
(46, 'caso-900-skjenk', 'Casø 900 skjenk', 'Klassisk skjenk', 11, 16999, 14995, 'Eik', 2, 1, 0, 'Casø 900 er en klassisk skjenk med tidløst design og god oppbevaring.'),
(47, 'broholm-skjenk', 'Broholm Skjenk', 'Stor eikeskjenk', 11, 26995, 23995, 'Eik', NULL, 1, 0, 'Broholm Skjenk er en imponerende skjenk i massiv eik med romslige skuffer og skap.');

-- Sovesofa
INSERT INTO products (id, slug, title, subtitle, category_id, price, sale_price, material, supplier_id, enabled, bestseller, description) VALUES
(48, 'young', 'Young', 'Moderne sovesofa', 17, 16860, 11995, 'Tekstil', 1, 1, 0, 'Young er en moderne sovesofa som enkelt gjøres om til en komfortabel dobbeltseng.'),
(49, 'epona', 'Epona', 'Premium sovesofa', 17, 25775, 19995, 'Tekstil', 1, 1, 0, 'Epona er en premium sovesofa med enkel uttrekksmekanisme og god liggekomfort.');

-- Senior stoler
INSERT INTO products (id, slug, title, subtitle, category_id, price, sale_price, material, supplier_id, enabled, bestseller, description) VALUES
(50, 'symphony', 'Symphony', 'Elektrisk recliner', 9, NULL, 18995, 'Skinn', 5, 1, 0, 'Symphony er en komfortabel senior stol med elektrisk recliner-funksjon og god støtte.');
