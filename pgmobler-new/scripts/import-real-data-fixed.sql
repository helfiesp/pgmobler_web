-- =============================================
-- PG Møbler - Full production data import
-- Clears seed data and imports all real products
-- =============================================

-- Clear existing data
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM cart_items;
DELETE FROM carts;
DELETE FROM product_images;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM suppliers;
DELETE FROM cms_content;

-- SUPPLIERS
INSERT INTO suppliers (id, name, slug) VALUES (1, 'TopLine', 'topline');
INSERT INTO suppliers (id, name, slug) VALUES (2, 'Casø', 'caso');
INSERT INTO suppliers (id, name, slug) VALUES (3, 'Torpe', 'torpe');
INSERT INTO suppliers (id, name, slug) VALUES (4, 'Furnico', 'furnico');
INSERT INTO suppliers (id, name, slug) VALUES (5, 'Novasolo', 'novasolo');
INSERT INTO suppliers (id, name, slug) VALUES (6, 'Brumunddal Ullvare fabrikk', 'brumunddal-ullvare-fabrikk');

-- CATEGORIES (parents)
INSERT INTO categories (id, name, slug, parent_id) VALUES (1, 'Stue', 'stue', NULL);
INSERT INTO categories (id, name, slug, parent_id) VALUES (2, 'Spisestue', 'spisestue', NULL);
INSERT INTO categories (id, name, slug, parent_id) VALUES (3, 'Soverom', 'soverom', NULL);
INSERT INTO categories (id, name, slug, parent_id) VALUES (18, 'Hyttemøbler', 'hyttemobler', NULL);

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
INSERT INTO cms_content (key, value, section) VALUES ('footer_subtitle_1', 'Kvalitetsmøbler til stue, spisestue og soverom siden 1970-tallet. Besøk vår butikk i Stavanger.', 'footer');
INSERT INTO cms_content (key, value, section) VALUES ('footer_header_2', 'Kategorier', 'footer');
INSERT INTO cms_content (key, value, section) VALUES ('footer_header_3', 'Butikken', 'footer');
INSERT INTO cms_content (key, value, section) VALUES ('footer_header_4', 'Kontakt', 'footer');

-- =============================================
-- PRODUCTS - All from production database
-- =============================================

-- MODULSOFA
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('lazy', 'Lazy', 'Fantastisk loungesofa med super sittecomfort', 4, 'Lazy sofaen er akkurat det den høres ut som, det er en dyp og god sofa som kan slenges seg ned i. Sofaen har en 88cm rygghøyde og 43/48cm setehøyde avhengig av benvalg. Her kan du bestille sofaen i over 500 forskjellige valg og velge til din stil! Pynteputer med vaffelsøm koster 1100.-/stk', 39315, 33415, NULL, 'Over 1000 forskjellige kombinasjoner', '88', '113', NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('palermo', 'Palermo', 'Modulsofa', 4, 'Palermo er en solid og skikkelig modulsofa. Den leveres i mange oppsett, så valgmulighetene er store. Dette er en sofa som ikke er for dyp eller lav, slik at en sitter godt i de fleste aldre. Det er mange stoff å velge i, også de som nå er på kampanje.', 64590, 32295, 'Stoff, treverk', 'Mange fargevalg.', '86', '88', NULL, 1, 1);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('verona', 'Verona', 'Modulsofa', 4, 'Verona er en svært god sofa og er en av best-selgerne våre. Den har litt åpning til gulvet, som gir mer luft. Den kan settes sammen i et utall av kombinasjoner, og stoff.', 49900, 24980, 'Kaldskum/PES', 'Mange varianter tilgjengelige, flere hundre kombinasjoner', '229', '88', '266', 1, 1);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('verona-lux', 'Verona Lux', '275x148, utvalgte stoff', 4, 'Deilig sofa, litt dypere enn Verona som gir en mer avslappet følelse. Veldig mange oppsett å velge i. Stort stoff og fargevalg. Vendbare puter, og avtagbare trekk.', 43380, 23190, NULL, 'Mange varianter tilgjengelige, flere hundre kombinasjoner', '86', '275', '98', 1, 1);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('elle-loungesofa', 'Elle loungesofa', 'Modulsofa', 4, 'Elle er en ny modell som er litt dypere og lavere, og gir en lounge-følelse. Den finnes i mange stoff og moduler.', 33742, 28600, NULL, 'Mange varianter tilgjengelige, flere hundre kombinasjoner', '86', NULL, NULL, 1, 0);

-- SOFA
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('carnella-3s', 'Carnella 3s', 'Mulighet for 2s,2.5s, 3s, 4s eller hjørne', 5, 'Carnella er en sofa med suveren sittekomfort. Ikke for dyp eller lav å sitte i. Fås i mange stoff og farger. Leveres med eller uten duntopp.', NULL, 13495, 'Kaldskum eller duntopp i putene.', 'Valgfritt', '88', '240', '87', 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('fossano', 'Fossano', 'Moderne favoritt, 3s', 5, 'Særdeles myk og behagelig sofa, med et moderne uttrykk. Mulighet for flere størrelser, samt med chaiselounge.', 19020, 16995, 'Kaldskum', 'Valgfritt fra Top Line, flere hundre mulige kombinasjoner', '64', '233', '102', 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('malmoe-215cm', 'Malmø, 215cm', 'Kampanjestoff Loop', 5, 'Lekker sofa i klassisk stil, Finnes som 1, 2-5, 3, 4seter, samt hjørneløsning. Velg mellom faste ryggputer, eller flere løse puter.', 24760, 19995, 'Kaldskum m. duntopp', 'Valgfritt fra Top Line, flere hundre mulige kombinasjoner', '88', '215', '102', 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('dorte', 'Dorte', '2s 3s hjørne', 5, 'Klassisk nett sofa med treverk i eik. Sofaen er litt høyere i sete enn mange andre og gjør at man sitter svært godt. Tar liten plass.', 42325, 36995, 'Eik', 'Mange varianter tilgjengelige, flere hundre kombinasjoner', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('oliwer', 'Oliwer', 'Sofa', 5, 'Sofa med veldig god sittekomfort. Fås i 1s, 2s, 3s og hjørne. Finnes i mange stoff og fås også i hud.', 27920, 20995, 'Stoff/treverk', 'Mange varianter tilgjengelige, flere hundre kombinasjoner', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('miami', 'Miami', 'Sofa', 5, 'Klassisk sofa med buede armlener. God sittekomfort. Kan fås som sovesofa også. Mange stoff å velge i, og med og uten kappe. Vendbare puter.', 33790, 19995, 'stoff/treverk', 'Mange varianter tilgjengelige, flere hundre kombinasjoner', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('kiwi', 'Kiwi', 'Sofa', 5, 'Kiwi er en modulsofa som leveres i flere oppsett. 3s er en nett og klassisk sofa, som har god sittekomfort. Leveres i mange stoff og farger. 3 valgmuligheter på armlener.', 18250, 12770, 'Stoff/treverk', 'Mange varianter tilgjengelige, flere hundre kombinasjoner', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('kiwi-2', 'Kiwi', 'Modulsofa', 5, 'Klassisk og nett sofa, som finnes i mange oppsett. Flere valgmuligheter på stoff, sidevanger og type ben.', 16600, 11100, 'Stoff/treverk', 'Mange varianter tilgjengelige, flere hundre kombinasjoner', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('nordland', 'Nordland', 'Sofa', 5, 'Nordland er en klassisk sofa, som er nett i størrelsen, og tar lite plass. Finnes i stol, 2-seter, 3-seter og hjørne.', 38450, 27690, NULL, 'Mange varianter tilgjengelige, flere hundre kombinasjoner', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('prime-line', 'Prime Line', 'Premium 3-seter', 5, 'Prime Line er en premium sofa med uovertruffen komfort og holdbarhet.', 23899, 21899, 'Skinn', NULL, NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('inessa', 'Inessa', 'Modulsofa', 5, 'Inessa er en moderne og trendy loungesofa. Modulbasert, vist her i oppsett 3s med relax del. 310x223cm. Leveres med faste puter, og 4 løse pynteputer.', NULL, NULL, 'Tre, tekstil', 'Creme', '71', '100', NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('wellington', 'Wellington', 'Klassisk og elegant sofa', 5, 'Deilig og delikat 3s sofa i et klassisk uttrykk. God sittekomfort, og leveres i flere farger. På salg i utvalgte stoff.', 16995, 11995, NULL, 'Fargevalg', '88', '227', '93', 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('massimo', 'Massimo', '302x206cm', 1, 'Deilig "lounge" type sofa med god sittekomfort. Modulsofa som gir mange valgmuligheter både mht størrelse og stoff.', 32455, 27495, 'Stoff, treverk', 'Mange varianter tilgjengelige, flere hundre kombinasjoner', '87', '101', NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('preston-3s', 'Preston 3s', 'Elegant 3-seter sofa', 5, 'Preston er en elegant sofa med slank profil som passer perfekt i moderne hjem.', 14030, 12995, 'Tekstil', NULL, NULL, NULL, NULL, 1, 0);

-- HVILESTOL
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('jade-lux', 'Jade Lux', 'Recliner', 7, 'Smal og elegant recliner med lekre detaljer. Her kan en legge seg helt tilbake og få en god hvil. Finnes i mange skinn og stoff. Nå på kampanjepris i sort, brun eller cognac.', 32420, 21995, 'Eik, kaldskum, stål og skinn', 'Mange varianter tilgjengelige, flere hundre kombinasjoner', '116', '77', '80', 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('hvile-8022', 'Hvile 8022', 'Hvilestol', 7, 'Recliner med meget god sittekomfort og mange fargevalg. Nett og elegant design.', 15995, 11995, 'PES/Kaldskum', 'Mange varianter tilgjengelige, flere hundre kombinasjoner', '108', '76', '88', 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('enjoy', 'Enjoy', 'Lenestol', 7, 'Hvilestol med utrolig god sittekomfort, passe bakoverlent, og deilig å krype oppi. Knapper i ryggen, og mulighet for fotskammel.', 11990, 9995, 'Stoff/treverk', 'Mange varianter tilgjengelige, flere hundre kombinasjoner', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('lisa', 'Lisa', 'Ørelappstol', 7, 'Klassisk ørelappstol som finnes i mange fargevalg. Kan få fotpall med oppbevaring. Med og uten kappe.', 10930, 6295, 'tre/stoff', 'Mange varianter tilgjengelige, flere hundre kombinasjoner', NULL, NULL, NULL, 1, 1);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('olivia', 'Olivia', 'Regulerbar lenestol', 7, 'Deilig regulerbar lenestol med mulighet for fotpall til å åpne. Finnes i mange stoff. Nakkepute medfølger.', 14995, 9495, NULL, 'Mange varianter tilgjengelige, flere hundre kombinasjoner', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('duo-lenestol', 'Duo Lenestol', 'Regulerbar lenestol med krakk inkludert', 7, 'Duo er en nett lenestol med god sittekomfort og en regulerbar rygg. Med fotskammel. Finnes i blå, mørk grå og brun i stoff. Kan også fås i skinn 9.750.-', NULL, 7695, 'Polyester', 'Blå/Grå', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('diamond', 'Diamond', 'Luksus recliner', 7, 'Diamond er en luksusrecliner med mange justeringsmuligheter og premium materialer.', 20999, 15990, 'Skinn', NULL, NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('maria-stol', 'Maria stol', 'Lenestol', 7, 'Maria er en klassisk stol i dansk design, i heltre eik/bøk, med veldig god sittekomfort. Formsydd stoppet rygg, og stoppet sete.', 16650, 14995, NULL, 'Mange varianter tilgjengelige, flere hundre kombinasjoner', NULL, NULL, NULL, 1, 0);

-- LENESTOL
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('cuba', 'Cuba', 'Nett lenestol', 8, 'Nett og god lenestol, som ikke tar stor plass i stuen, og som passer til mange av våre sofamodeller. Løs setepute. Fåes med og uten nagler.', 8310, 4995, 'stoff/treverk', 'Mange varianter tilgjengelige, flere hundre kombinasjoner', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('flora', 'Flora', 'Liten lenestol', 8, 'Deilig og lett lenestol/avlastningsstol. Lekker til en sofagruppe eller alene. Tar liten plass, og lett å flytte på. Finnes med og uten sving, treben eller stålben.', NULL, 6540, 'Stoff/treverk', 'Mange varianter tilgjengelige, flere hundre kombinasjoner', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('country-hoy', 'Country høy', 'Lenestol, høy modell med sving', 8, 'Nett og fin lenestol, med fotskammel. Regulerbar rygg. Finnes i flere farger.', 11970, 8495, NULL, 'Mange varianter tilgjengelige, flere hundre kombinasjoner', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('country', 'Country', 'Lenestol, lav modell', 8, 'Nett og fin lenestol med sving og regulerbar rygg. Finnes i flere farger. På tilbud i kampanjestoff.', 8900, 6925, 'Stoff/metall', 'Stoff og skinn.', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('utah', 'Utah', 'Lenestol høy modell', 8, 'Lenestol med et litt retro uttrykk. Armlener og ben i eik. Finnes i mange stoff. Finnes i høy og lav modell. Kan få med pall.', 6830, 5795, NULL, 'Mange varianter tilgjengelige, flere hundre kombinasjoner', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('stripe', 'Stripe', 'Lenestol/avlastningsstol', 8, 'Veldig nett og fin lenestol med sving. Tar liten plass, og har svært god sittekomfort. Finnes i mange stoff og farger.', NULL, 6450, NULL, 'Mange varianter tilgjengelige, flere hundre kombinasjoner', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('nico', 'Nico', 'I utvalgte stoff', 8, 'God og romlig lenestol, med et stilrent og moderne uttrykk. Fås i mange farger og stoff. Kan også leveres med sving eller treramme nederst. Kan også fås med fotpall.', 15995, 8495, 'Stoff', 'Mange varianter tilgjengelige, flere hundre kombinasjoner', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('spider', 'Spider', 'Lenestol med sving', 8, 'Lenestol i moderne design med sving. Fås i mange stoff og farger.', NULL, 9995, 'stoff', 'Mange varianter tilgjengelige, flere hundre kombinasjoner', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('nelson', 'Nelson', 'Lenestol', 8, 'Nelson lenestol er en klassisk og elegant lenestol med god sittekomfort. Leveres med sort treramme.', NULL, 6995, NULL, 'Rust og gull velour. Beige, lys brun, grå, og creme', '75', '76', '89', 1, 0);

-- SPISEBORD
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('elegance-90x200', 'Elegance 90x200', 'Spisebord i heltre eik fra Casø', 14, 'Bordet finnes også i 100x240. Det er 3 forskjellige typer ben, samt 3 farger på platen å velge mellom. Mulighet for opp til 2 tilleggsplater på 90x50cm.', 15750, 13995, 'Eik', 'røkt, hvitoljet, gråoljet', '74', '90', '200', 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('elegance-100x200', 'Elegance 100x200', 'Spisebord i heltre eik fra Casø', 14, 'Bordet finnes også i 100x240. Det er 3 forskjellige typer ben, samt 3 farger på platen å velge mellom. Mulighet for opp til 2 tilleggsplater på 100x50cm.', NULL, 16095, 'Eik', 'røkt, hvitoljet, gråoljet', '74', '100', '240', 2, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('orn-rundt', 'Ørn Rundt', NULL, 14, 'Ørn Ø130 spisebord - heltre eik plate med kryssfot i tre. Bordet har plass til totalt 4x innleggsplater! Velg mellom flere flotte farger og fargekombinasjoner. Kan fås i Ø150cm 30.990.-', 27995, 25190, 'Eik', 'svartbeiset, hvitoljet, oljet, røkt, gråoljet', '75', '130', '130', 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('orn-220', 'Ørn 220', 'Spisebord', 14, 'Ørn er et massivt og kraftig spisebord levert i heltre eik. Hele eikelameller i platen, og kryssunderstell. Finnes i flere størrelser og fargevalg.', NULL, 29990, 'Heltre eik', 'Røkt, sort, gråoljet, hvitoljet og natur', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('hugin-220', 'Hugin 220', 'Spisebord', 14, 'Hugin er et massivt og gedigent spisebord i heltre eik med kraftige søyleføtter. Platen har hele lameller. Leveres flatpakket.', NULL, 32990, 'Heltre eik', 'Røkt, sort, gråoljet, hvitoljet, natur', '220', NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('121-spisebord', '121 Spisebord', 'Spisebord med butterflyplate', 14, 'Spisebord i heltre/eikefiner med mulighet for forlengelse med butterfly plate. Fås i hvitoljet, sortbeiset og naturoljet. 150/205x85cm', 11295, 9995, NULL, 'Hvitoljet, oljet eller svart eik', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('c-edge-1', 'C-Edge 1', 'Kjøkkenbord med klaff', 14, 'Spisebord i heltre eik med klaff, som kan brukes i stue eller kjøkken. Utrolig nett og fint spisebord. 75/115x75x75cm. Fås i hvitoljet/røkt eller naturoljet.', 6799, 6295, 'Treverk', 'Hvitoljet/røkt/naturfarget', '75', NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('c-edge-2', 'C-edge 2', 'Spisebord', 14, 'Kjøkkenbord i heltre eik med 1 klaff. Utrolig nett og praktisk bord. Leveres i hvitoljet, røkt eller naturoljet eik. 120/160x75x75cm', 7799, 6995, 'Heltre eik', 'Hvitoljet/røkt eller naturoljet eik', '75', '75', NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('gro-o120', 'Gro Ø120', 'Spisebord', 14, 'Gro er et flott rundt spisebord laget i heltre eik, med mulighet for innleggsplate. Det leveres i røkt eller hvitoljet eik, med spider understell.', 18250, 15995, 'Heltre eik', 'Hvitoljet, røkt', '75', '120', '120', 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('gro-o140', 'Gro Ø140', 'Spisebord', 14, 'Gro er et flott rundt spisebord i heltre eik med mulighet for 1 stk innleggsplate. Det har spider understell.', 18999, 17495, 'Heltre eik', 'Hvitoljet, røkt', '75', '140', NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('thor-spisebord-o115', 'Thor spisebord Ø115', 'Spisebord', 14, 'Thor er et rundt spisebord i heltre eik, med mulighet for 1 innleggsplate. Med plate vil det være 165cm.', NULL, 9899, 'Heltre eik', 'Hvitoljet, røkt og oljet', '75', '115', '115', 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('caso-701-langbord', 'Casø 701 Langbord', 'Spisebord', 14, 'Casø 701, er et flott spisebord på 200x100cm, som kan leveres med innleggsplater, og bli 500cm langt. 6 plater a 50cm. 3 plater kan oppbevares under bordplaten.', 24199, 19945, 'Eik heltre/finer', 'Hvitoljet eik', '75', '100', NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('eydis', 'Eydis', 'Spisebord', 14, 'Eydis er et ovalt spisebord i heltre eik med spider understell. Leveres i flere farger. 200x100x75cm', 18399, 16250, 'Heltre eik', 'Hvitoljet, røkt og sort beiset.', '75', '100', '200', 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('tucan-120-kjokkenbord', 'Tucan 120 kjøkkenbord', 'Kjøkkenbord', 14, 'Tucan 120 er et heltre eik spisebord, nett og fint som passer fint på kjøkken. Leveres flatpakket og kommer i flere farger. 120x100x75 inkl. 1 stk innleggsplate', NULL, 16990, 'Heltre eik', 'Røkt, sort, gråoljet, hvitoljet, natur', '75', '100', '120', 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('tribeca', 'Tribeca', 'Spisebord', 14, 'Tribeca er et rundt spisebord som kommer i flere størrelser. Bordet leveres med finert eik plate, og heltre eik ben. Det følger med 3 innleggsplater a 50cm.', NULL, 19995, 'eik, finert, heltre', 'Mange varianter tilgjengelige, flere hundre kombinasjoner', NULL, '120', NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('ashton-o135cm', 'Ashton Ø135cm m/6 plater', 'Spisebord', 14, 'Ashton spisebord er et rundt spisebord med uttrekks-mulighet, og med opptil 6 innleggsplater. Så dette bordet som er Ø135cm kan bli 435cm.', NULL, 34995, 'eik, finert, heltre', 'Sort, hvitoljet, gråoljet, røkt', NULL, '435', NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('120-spisebord', '120 Spisebord', 'Spisebord med butterflyplate', 2, 'Spisebord i heltre eik/eikefiner, som kan trekkes ut i midten med butterflyplate. 180/270x90x75cm. Fås i fargene hvitoljet/sortbeiset eller naturolje', 13099, 11995, 'Treverk', 'Hvitoljet/sortbeiset/naturoljet', NULL, NULL, NULL, 1, 0);

-- SPISESTOLER
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('sweet-seat-stoff', 'Sweet Seat', 'Spisestol i skinn og stoff fra Casø', 15, 'Stol med nydelig sittekomfort, leveres i flere stoffarger. Forskjellige understell børstet sort stål/treben eik.', 5799, 4900, 'Stoff, stål, eik', 'Mange varianter tilgjengelige', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('baxter', 'Baxter', 'Spisestol', 15, 'Baxter spisestol med helt suveren sittekomfort pga en "svikt", en liten gynge, i understellet. Finnes i flere farger.', NULL, 1795, 'Ben i sort metall, 100% polyester stoff', 'Mange forskjellige farger', '97', '45', '49', 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('maddox', 'Maddox', 'Spisestol', 15, 'Spisestol med en liten svikt i foten for ekstra komfort. Finnes i mange farger.', NULL, 2995, 'Ben i sort metall, 100% polyester stoff', 'Mange varianter tilgjengelige, flere hundre kombinasjoner', '98', '45', '65', 1, 1);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('maddox-armlen', 'Maddox', 'Spisestol med armlen', 15, 'Maddox er en spisestol med armlener, med en deilig sittekomfort pga myke puter i sete og rygg, samt et understell som gir litt behagelig "svikt" når en sitter.', NULL, 2999, NULL, 'beige, grå, rust og brun', '98', '45', '65', 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('peter', 'Peter', 'Spisestuestol', 15, 'Elegant design fra danske Casø. Stol i heltre eik, sort eller hvitoljet med skinnsete. Moderne uttrykk, svært god sittekomfort.', 4995, 3995, 'Eik, skinn', 'Hvitoljet/sortbeiset eik', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('sweet-seat-lav', 'Sweet Seat', 'Spisestol', 15, 'Veldig god spisestol, med litt svikt i setet. Finnes i mørk grå og rust velour. Sorte stålben, eller heltre eikeben.', 3099, 2500, 'Stoff, stål, eik', 'Rust/Mørk Grå', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('james', 'James', 'Spisestol', 15, 'Spisestol med veldig god sittekomfort. Finnes også med armlener.', 3550, 2595, 'Stoff/treverk', 'Mange varianter tilgjengelige, flere hundre kombinasjoner', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('james-spisestol', 'James spisestol', 'Med armlene', 15, 'Veldig god spisestol med armlener. Finnes med høy, 67cm, og lav, 63cm, armlen. Mange valgmuligheter mht stoff/farge på ben.', 4680, 3495, 'Stoff/eik', 'Mange varianter tilgjengelige, flere hundre kombinasjoner', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('annie', 'Annie', 'Høy modell', 15, 'Heltrukket spisestol med god sittekomfort, fåes i høy og lav modell. Smal modell. Heltre ben i eik, flere fargevalg.', NULL, 2460, 'Valgfritt', 'Mange varianter tilgjengelige', '100', '40', '68', 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('bristol-armlen', 'Bristol', 'Spisestol med armlen', 15, 'Bristol er en deilig spisestol med armlener, som gir god sittekomfort.', 3995, 3495, NULL, 'Sort velour, gull velour, grå, grønn, beige, og creme', '83', '57', '83', 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('bristol', 'Bristol', 'Spisestol', 15, 'Spisestol uten armlener, med god sittekomfort. Leveres i flere farger, med sorte ben.', 2695, 2695, NULL, 'sort, gull og rust velour. Grå, grønn, beige og creme stoff.', '83', '47', '60', 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('ada', 'Ada', 'Spisestol med sving', 15, 'Ada er en fast og god spisestol med armlener og sving funksjon. Finnes i flere farger, og sorte ben.', NULL, 2995, NULL, 'Beige, creme, grønn, sort og gull velour.', '86', '60', '63', 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('falk', 'Falk', 'Spisestol', 15, 'Falk er en spisestol i heltre eik, med høy rygg, og trukket sete. Kommer ferdig montert, fargevalg på treverk og sete. Kan leveres i stoff og skinn.', NULL, 2490, 'Heltre eik', 'Røkt, sort, gråoljet, hvitoljet, natur', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('fossekall-spisestol', 'Fossekall spisestol', 'Spisestol', 15, 'Fossekall er en heltrukket spisestol med sorte stålben. Er i kaldskum med god sittekomfort. Leveres i pakke a 2 stk.', NULL, 1290, 'Stoff/metall', '2 fargevalg, lys grå/beige, og brungrå', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('hauk-spisestol', 'Hauk spisestol', 'Spisestol', 15, 'Hauk er en spisestol med trukket sete og rygg, og sorte stålben. Den har en liten "svikt" når en sitter, som gjør den veldig komfortabel.', 2790, 2290, 'Stoff/metall', '2 fargevalg', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('esther', 'Esther', 'Spisestol', 15, 'Esther stol er en stol i heltre eik/finer, med trukket sete. Leveres i flere farger, og med skinnsete.', 4290, 3899, 'Eik, heltre/finer', 'Hvitoljet, røkt, sort, oljet', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('eva', 'Eva', 'Spisestol', 15, 'Eva er en klassisk stol med lav rygg i heltre eik, med trukket sete i skinn. Veldig god sittekomfort.', NULL, 4849, 'Heltre eik', 'Hvitoljet, naturoljet', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('anne', 'Anne', 'Spisestol', 15, 'Anne er en spisestol i heltre eik med trukket sete i skinn. Den er lav og fin i ryggen, men likevel med veldig god sittekomfort.', NULL, 4850, 'Heltre eik', 'Hvitoljet, naturoljet', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('carl', 'Carl', 'Spisestol', 15, 'Carl spisestol er en stol i heltre eik, med trukket rygg og sete, i stoff eller skinn. Leveres i flere farger.', NULL, 4899, 'Heltre eik/skinn', 'Hvitoljet, røkt', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('sweet-seat-skinn', 'Sweet seat skinn', 'Spisestol', 15, 'Sweet seat spisestol i skinn er en nydelig stol å se på, og helt super å sitte i. Leveres i 3 skinnfarger.', NULL, 5555, 'Skinn/stål', 'Mange varianter tilgjengelige', NULL, NULL, NULL, 2, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('sweet-seat-treverk', 'Sweet seat stol med treverk', 'Spisestol', 15, 'Sweet seat er en fantastisk god stol i skinn, med eik understell. Svært god sittekomfort.', NULL, 5745, 'Skinn/treverk', 'Cognac, sort, brun', NULL, NULL, NULL, 2, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('stol-9031-hk', 'Stol 9031 HK', 'Spisestol', 15, 'Stol med veldig god sittekomfort med stålben. Leveres i lys grå farge.', NULL, 1395, 'Stoff/metall', 'Mange stoff å velge i', '89', '46', '42', 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('stol-9069-hk', 'Stol 9069 HK', 'Spisestuestol med armlen', 15, 'Deilig spisestol med sving og regulerbar rygg. Veldig god sittekomfort. Leveres i flere valg av stoff og farge på understell.', NULL, 3350, 'Stoff/treverk', 'Mange fargevalg av stoff og treverk', '89', '58', '62', 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('stol-9017-hk', 'Stol 9017 HK', 'Spisestuestol', 15, 'Spisestol med sving, og lav og moderne rygg. Svært god å sitte i. Mange stoff og type ben å velge i.', NULL, 2400, 'Stoff/treverk/stål', 'Mange stoff å velge i', '84', '59', '43', 1, 0);

-- SALONGBORD
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('in-between', 'In between', 'Sofabord', 6, 'Sett av 3 salongbord, et rektangulært, 130x65x52, og 2 kvadratiske 57x57cm. Leveres i heltre eik plate, og metall understell.', 12095, 10885, 'Eik/metall', 'Hvitoljet, gråoljet, røkt, eller oljet eik', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('coffeebreak', 'Coffeebreak', 'Sofabord, selges som sett', 6, 'Sett salongbord bestående av 2 stk, i heltre eik plate med metall understell. Ø75/58cm.', 8799, 7500, 'treverk/metall', 'Røkt, hvitoljet, oljet, gråoljet, svartbeiset', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('thor-1', 'Thor 1', 'Sofabord', 6, 'Salongbord i heltre eik, 120x60x52cm. Fås i fargene, hvitoljet, røkt og naturoljet eik.', NULL, 7150, NULL, 'Hvitoljet eik', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('thor-6', 'Thor 6', 'Sofabord med klaff', 6, 'Sofabord i heltre eik med klaff, 110/145x75x52cm. Fås i fargene hvitoljet, røkt og naturoljet eik.', 8299, 7450, NULL, 'Hvitoljet/røkt/naturoljet eik', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('thor-4', 'Thor 4', 'Sofabord', 6, 'Thor salongbord i heltre eik. Fås i fargene hvitoljet, røkt eller naturoljet.', NULL, 8275, 'Treverk', 'Hvitoljet/røkt eller naturoljet eik', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('thor-5', 'Thor 5', 'Sidebord', 6, 'Sidebord/lampebord i heltre eik. Fås i fargene hvitoljet, røkt eller naturoljet.', NULL, 4150, 'Treverk', 'Hvitoljet eik/røkt/naturoljet', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('tucan-110', 'Tucan 110', 'Salongbord', 6, 'Salongbord i heltre eik, både plate og understell. Med hylle under. Et klassisk og skikkelig salongbord med god høyde. 110x60x54cm', NULL, 10990, 'Heltre eik', 'Røkt, gråoljet, hvitoljet og natur', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('tucan-qadrat', 'Tucan Qadrat', 'Salongbord', 6, 'Supert salongbord i heltre eik med hylle under. Leveres flatpakket, og det er flere farger å velge i. 80x80x54cm', NULL, 9990, 'Heltre eik', 'Røkt, gråoljet, hvitoljet og natur', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('tucan-classic', 'Tucan Classic', 'Salongbord med klaffer', 6, 'Salongbord i heltre eik med klaffer og plate under. Klassisk bord som er veldig praktisk. 73x93(145)x54cm. Utgående modell.', NULL, NULL, 'Heltre eik', 'Røkt, gråoljet, hvitoljet og natur', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('ravn-130', 'Ravn 130', 'Salongbord', 6, 'Ravn salongbord leveres i heltre eik med metall understell. Enkelt og stilrent. 130x70x52cm', 8990, 8095, 'Heltre eik', 'Røkt, sort, gråoljet, hvitoljet, natur', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('ravn-80-65', 'Ravn 80cm/65cm', 'Salongbord', 6, 'Ravn er en salongbordserie i heltre eik, og metall understell. Leveres i flere farger på platen.', NULL, 7990, 'Heltre eik/metall', 'Røkt, sort, gråoljet, hvitoljet, natur', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('caso-502-sofabord', 'Casø 502 sofabord', 'Salongbord', 6, 'Casø 502 er et salongbord i eik med et moderne preg. 2 åpne hyller under bordet. 125x70x50cm', NULL, 9199, 'Eik heltre/finer', 'Hvitoljet/sortbeiset', '50', '70', '125', 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('caso-500-o80', 'Casø 500, Ø80cm', 'Salongbord', 6, 'Salongbord i eik heltre/finer. Leveres i hvitoljet eik. Ø80cm h 45cm', 3199, 2700, 'Eik heltre/finer', 'Hvitoljet eik', '45', NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('caso-500-o60', 'Casø 500, Ø60cm', 'Salongbord', 6, 'Casø 500 er et lite salongbord/lampebord i eik som kan brukes alene eller under et tilsvarende bord i Ø80cm. Ø60cm h 42,5cm', 2899, 2500, 'Eik heltre/finer', 'Hvitoljet eik', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('coffeebreak-xl', 'Coffeebreak XL', 'Salongbord sett', 6, 'Sett bestående av 2 stk bord i heltre eik, med metall understell. Ø97 h47cm / Ø75cm h 40,5cm.', 12699, 11429, 'Eik, heltre/finer', 'Hvitoljet, røkt, sortbeiset(finer)', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('in-between-sortbeiset', 'In between, sortbeiset', 'Salongbord', 6, 'Elegant salongbordsett i sortbeiset eikefiner, bestående av 1 stk rektangulært bord og 2 stk kvadratiske.', 12699, 9999, 'Eikefiner', 'Sortbeiset', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('coffee-break', 'Coffee break', 'Salongbord sett', 6, 'Coffee break er et salongbord sett bestående av 2 stk bord. I beiset heltre eik, med sort metall understell.', NULL, 8900, 'Eikefiner/metall', 'Sortbeiset', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('broholm-salongbord', 'Broholm salongbord', 'Salongbord', 6, 'Moderne og likevel klassisk salongbord i heltre eik med spiler i eik på understellet. Avrundede kanter. 135x75x50', 11995, 9995, 'Heltre eik/finer', 'Røkt, hvitoljet og naturoljet', '75', '135', NULL, 1, 0);

-- STUE (diverse)
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('nico-pall', 'Nico pall', 'Fotpall', 1, 'Fotpall til Nico lenestol. Leveres i mange stoff og farger.', 4370, 2750, NULL, 'Mange varianter tilgjengelige', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('hauk-130', 'Hauk 130', 'Salongbord', 1, 'Hauk salongbord i heltre eik plate, sort metall understell. God høyde, 52cm. 130x70x52cm', 7990, 7190, NULL, 'Røkt, gråoljet, hvitoljet og natur', '52', NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('hauk-130-60-60', 'Hauk 130+60+60', 'Salongbord sett', 1, 'Sett med et salongbord 130x70cm og 2 lampebord 60x60cm i heltre eik. Flatpakket.', NULL, 14370, NULL, 'Røkt, gråoljet, hvitoljet og natur', '52', NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('hauk-80-60-60', 'Hauk 80+60+60', 'Settbord', 1, 'Hauk salongbord i heltre eik, bestående av et bord 80x80cm, og 2 stk 60x60cm.', 14370, 11995, NULL, 'Røkt, gråoljet, hvitoljet og natur', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('hauk-80', 'Hauk 80', 'Salongbord', 1, 'Salongbord i heltre eik, i flere fargevalg. Metall understell. 80x80x52cm', 5990, 5000, 'Heltre eik', 'Røkt, gråoljet, hvitoljet og natur', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('hauk-60', 'Hauk 60', 'Lampebord', 1, 'Lampebord/avlastningsbord i heltre eik. Metall understell. 60x60x52cm', NULL, 3890, NULL, 'Røkt, gråoljet, hvitoljet og natur', NULL, NULL, NULL, 3, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('tucan-135', 'Tucan 135', 'Salongbord', 1, 'Salongbord i heltre eik, både plate og understell. Hylle under. 135x75x54cm', NULL, 12990, 'Heltre eik', 'Røkt, gråoljet, hvitoljet og natur', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('tucan-classic-lampebord', 'Tucan Classic lampebord', 'Lampebord', 1, 'Tucan classic er et supert lampebord i heltre eik, med klaffer og hylle under. 50x67/103)x54cm', NULL, 9990, 'Heltre eik', 'Røkt, gråoljet, hvitoljet og natur', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('tucan-konsollbord', 'Tucan konsollbord', 'Konsollbord', 1, 'Klassisk og stilrent konsollbord i heltre eik, med 2 skuffer og hylle under. 100x36x70cm', NULL, 9990, 'Heltre eik', 'Røkt, gråoljet, hvitoljet og natur', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('tucan-73-fasan', 'Tucan 73 Fasan', 'Salongbord', 1, 'Salongbord kvadratisk i heltre eik med hylle under og mulighet for forlengelse. 73x73(121)x56-54cm', NULL, 12990, 'Heltre eik', 'Røkt, sort, gråoljet, hvitoljet og natur', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('tucan-oval', 'Tucan Oval', 'Salongbord', 1, 'Salongbord i heltre eik i en spennende oval form. Hylle under. 150x70x54cm', NULL, 13990, 'Heltre eik', 'Røkt, sort, gråoljet, hvitoljet og natur', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('ani-80-50', 'Ani 80+50', 'Salongbord', 1, 'Settbord med 2 stk salongbord i heltre eik plate med stålben i sort. Ø80+50cm', 9980, 5990, 'heltre eik/sort metall', 'Røkt, gråoljet, hvitoljet og natur', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('ani-40-50-60-80', 'Ani 40/50/60/80', 'Salongbord', 1, 'Ani salongbord/småbord leveres i heltre eik med sorte metallben. Flere størrelser.', NULL, 2500, 'Heltre eik/metall', 'Røkt, sort, gråoljet, hvitoljet og natur', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('fossekall-80-50', 'Fossekall 80+50', 'Salongbord', 1, 'Fossekall er en serie salongbord/småbord som leveres i heltre eik, både ben og plate. Sett Ø80+Ø50cm', 9980, 7490, 'Heltre eik', 'Røkt, sort, gråoljet, hvitoljet og natur', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('fossekall-40-50-60', 'Fossekall 40,50,60', 'Salongbord/småbord', 1, 'Fossekall bordserie består av bord heltre eik i forskjellige størrelser. De er supre å kombinere i sett.', NULL, 2500, 'Heltre eik', 'Røkt, sort, gråoljet, hvitoljet og natur', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('ara-80-60', 'Ara 80/60', 'Salongbord', 1, 'Ara er et moderne salongbord i heltre eik, med en søyle av lameller på understellet. Ø60cm h 52cm', 9990, 5900, 'Heltre eik', 'Røkt, sort, gråoljet, hvitoljet og natur', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('sule-salongbord', 'Sule Salongbord', 'Salongbord', 1, 'Sule er et moderne, elegant og nett salongbord, produsert i heltre eik. 136x60x51cm', 10990, 9890, 'Heltre eik', 'Røkt, sort, gråoljet, hvitoljet, natur', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('sule-lampebord', 'Sule lampebord', 'Lampebord', 1, 'Sule lampebord er et moderne og nett lampebord som leveres i heltre eik. 60x30x51cm', NULL, 6990, 'Heltre eik', 'Røkt, sort, gråoljet, hvitoljet, natur', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('ravn-pidestall', 'Ravn Pidestall', 'Pidestallbord', 1, 'Ravn pidestall er et bord i flere størrelser i heltre eik plate, og metall understell.', NULL, 2390, 'Heltre eik/metall', 'Røkt, sort, gråoljet, hvitoljet, natur', NULL, NULL, NULL, 3, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('tucan-skjenk', 'Tucan Skjenk', NULL, 1, 'Tucan skjenk er en skjenk levert i heltre eik. 3 skuffer i midten og en dør på hver side. 160x46x87cm', NULL, 22900, 'Heltre eik', 'Røkt, sort, gråoljet, hvitoljet, natur', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('bonzo', 'Bonzo', 'Lenestol', 1, 'Deilig lenestol i stoff med stålben. Moderne og tøft uttrykk. Leveres i mange stoff og farger.', NULL, 9650, NULL, 'Mange varianter tilgjengelige', '107', '85', NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('great-dane-stol', 'Great dane stol', 'Lenestol, ørelappstol', 1, 'Deilig stor og dyp lenestol med ørelapper. Kommer i mange stoff, og kan leveres med fotpall.', 11740, 9995, 'Tre, stoff', 'Mange varianter tilgjengelige', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('geilo-bokhylle', 'Geilo', 'Bokhylle', 1, 'Geilo er en serie møbler med et moderne uttrykk. Hyller øverst og 2 skuffer nederst. Finnes i flere farger.', NULL, 14995, NULL, 'Sort, hvitoljet, gråoljet', '200', '90', '35', 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('mood-bokhylle', 'Mood', 'Bokhylle', 1, 'Bokhylle produsert i finert eik, og med faste hyller. Finnes i flere farger.', NULL, 13995, 'Finert eik', 'Sort, oljet natur', '200', '100', '40', 5, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('caso-777-skjenk', 'Casø 777, skjenk', NULL, 1, 'Lekker høyskjenk fra Casø i dansk design.', NULL, 19995, NULL, NULL, NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('philip-lenestol', 'Philip Lenestol', NULL, 1, 'Moderne lenestol med god sittekomfort.', 11995, 9995, NULL, NULL, NULL, NULL, NULL, 1, 0);

-- SOVESOFA
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('epona', 'Epona', 'Sovesofa', 17, 'Fantastisk god sovesofa, med veldig god sitte- og liggekomfort. Finnes i 1s-80x200cm, 2s-120x200cm, 2.5s-140x200cm, og 3s-160x200cm. Her drar en i et håndtak, og hele madrassen folder seg ut.', 25775, 19995, 'stoff/metall/treverk', 'Mange varianter tilgjengelige, flere hundre kombinasjoner', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('young', 'Young', 'Sovesofa', 17, 'Praktisk og god sovesofa med oppbevaring. Madrassmål 140x200cm. Overmadrass kan bestilles.', 16860, 11995, 'Stoff/treverk', 'Mange varianter tilgjengelige, flere hundre kombinasjoner', NULL, NULL, NULL, 1, 0);

-- TV-BENK
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('broholm-tv-benk', 'Broholm TV-Benk', 'TV-benk i Broholm serien fra Casø', 10, 'TV-benk i Broholm serien, i hvitoljet eller røkt eik. Benken kan kombineres med andre møbler i samme serie.', 13599, 11559, 'Eikefiner/eik', 'røkt eller hvitoljet eik', '55', '124', '35', 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('broholm-xl', 'Broholm XL', 'Tv-benk 160x55x35cm', 10, 'Broholm tv-benk er en lang benk med 2 dører med spile-mønster, og 2 åpne hyller i midten.', 15995, 13995, 'Eik heltre/finer', 'Hvitoljet, røkt', '55', '35', NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('caso-700', 'Casø 700', 'Tv-bord', 10, 'Tv-bord i klassisk dansk design fra Casø. Består av 2 åpne hyller og 2 skuffer. 183x34x45cm', NULL, 13590, 'Eik', 'Mange varianter tilgjengelige', '45', '183', '34', 2, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('caso-501-tv-benk', 'Casø 501 tv-benk', 'Tv-benk', 10, 'Casø tv benk er en moderne tv-benk med 2 hyller, åpne rom. 120x45x40cm', NULL, 6399, 'Eik, heltre/finer', 'Hvitoljet eik', '45', '120', '40', 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('tucan-mediebenk', 'Tucan mediebenk', 'Tv-benk', 10, 'Tv-benk i Tucan serien, levert i heltre eik, med 2 skuffer og et åpent rom. 116x46x50cm', NULL, 12990, 'Heltre eik', 'Røkt, sort, gråoljet, hvitoljet og natur', NULL, NULL, NULL, 1, 0);

-- SKJENK & KOMMODE
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('broholm-skjenk', 'Broholm Skjenk', 'Skjenk i røkt eller hvitoljet eik fra Casø', 11, 'Flott skjenk fra Casø med fine spiledetaljer på dørene. Touch funksjon på skuffene.', 26995, 23995, 'Eikefiner/eik', 'røkt eller hvitoljet eik', '81', '184', '40', 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('caso-901-skjenk', 'Casø 901 skjenk', 'Skjenk', 11, 'Lekker skjenk fra danske Casø med 2 skyvedører og 4 skuffer. Touch-betjening. 194x80x44cm', NULL, 20499, 'Eik, heltre/finer', 'Hvitoljet eik', '80', '194', '44', 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('caso-900-skjenk', 'Casø 900 skjenk', 'Skjenk, 130cm', 11, 'Casø skjenk i hvitoljet eik, med 1 skyvedør og 4 skuffer. Touch betjening. 130x80x44cm', 16999, 14995, 'Eik heltre/finer', 'Hvitoljet eik', '80', '130', '44', 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('mood-skjenk', 'Mood', 'Skjenk', 11, 'Mood skjenk med 4 dører i finert eik. Moderne og rent uttrykk. Touch-system på skapdører.', NULL, 11995, 'Finert eik', 'Gråoljet, hvitoljet, røkt og sortbeiset eik', '80', '150', '40', 1, 0);

-- VITRINESKAP
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('broholm-vitrine', 'Broholm Vitrine', 'Vitrineskap i Broholm serien fra Casø', 13, 'Vitrineskap i røkt eller hvitoljet eik, med mulighet for lys i hyller. Lyspakke 6 lys, 1998.-', 27495, 23995, 'Eikefiner/eik', 'røkt eller hvitoljet eik', '197', '100', '40', 1, 0);

-- AVLASTNINGSBORD
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('sule-konsollbord', 'Sule konsollbord', 'Konsollbord', 12, 'Sule konsollbord er et elegant og nett konsollbord/avlastningsbord med hylle under. 120x40x70cm', NULL, 11990, 'Heltre eik', 'Røkt, sort, gråoljet, hvitoljet, natur', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('caso-500-skrivebord', 'Casø 500 skrivebord', 'Skrivebord', 12, 'Nett og pent skrivebord, som også kan brukes som avlastningsbord. En skuff og en hylle. 120x40x77cm', NULL, 7299, 'Eik, heltre/finer', 'Hvitoljet/sort beiset', '77', '120', '40', 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('mood-konsollbord', 'Mood', 'Konsollbord', 12, 'Mood konsollbord laget i finert eik. 2 skuffer med touch-åpning. 120x30x80cm', NULL, 8995, 'Finert eik', 'Gråoljet, hvitoljet, røkt. og lys eik', '80', '120', '30', 1, 0);

-- SPISESTUE (diverse)
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('verona-spisesofa', 'Verona', 'Spisesofa', 2, 'Stilren og moderne spisesofa som finnes i mange stoff og størrelser.', 22400, 13850, 'Stoff/treverk', 'Mange varianter tilgjengelige', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('medley-spisesofa', 'Medley spisesofa', 'Spisesofa', 2, 'Super spisesofa med fantastisk sittekomfort. Vendbare puter, finnes i mange størrelser og farger.', NULL, 14740, NULL, 'Mange varianter tilgjengelige', '82', NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('tucan-highboard', 'Tucan Highboard', 'Skap', 2, 'Tucan highboard er et skap i heltre eik med 3 glassdører, 2 skuffer, 2 dører og et åpent rom. 140x44x140cm', NULL, 29990, 'Heltre eik', 'Røkt, sort, gråoljet, hvitoljet, natur', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('tucan-vitrine', 'Tucan vitrine', 'Vitrineskap', 2, 'Tucan vitrine er et vitrineskap i heltre eik med 2 glassdører, og 2 skuffer nederst. 101x45x193cm', NULL, 24990, 'Heltre eik', 'Røkt, sort, gråoljet, hvitoljet og natur', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('caso-900-vitrine', 'Casø 900 Vitrine', 'Vitrineskap', 2, 'Casø 900 er et vitrineskap i hvitoljet eik, med skyvedør i glass. 96x169x44cm', NULL, 19999, 'Eik, heltre/finer', 'Hvitoljet eik', '196', '44', NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('stol-9063-hk', 'Stol 9063 HK', NULL, 2, 'Stilren spisestol med god sittekomfort.', 3350, 2995, NULL, NULL, NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('lean-back', 'Lean Back', NULL, 2, 'Komfortabel spisestol med god ryggstøtte.', NULL, 6990, NULL, NULL, NULL, NULL, NULL, 1, 0);

-- SOVEROM
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('de-kontinentalseng', 'DE Kontinentalseng', 'soverom', 3, 'Dream Economy kontinentalseng er en god seng til en god pris. Fjærmadrass med 4cm skum overmadras. Leveres i sort.', NULL, 8990, 'Skum/bonellfjær', 'Mange varianter tilgjengelige', NULL, NULL, NULL, 4, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('dc-kontinentalseng', 'DC kontinentalseng', 'soverom', 3, 'Dream Comfort er en kontinentalseng i topp kvalitet. Leveres med 5-soners pocketfjærer, og 4 cm latex overmadrass.', NULL, NULL, NULL, 'Mange varianter tilgjengelige', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('dream-delight-kontinental', 'Dream Delight Kontinental', 'soverom', 3, 'Dream delight kontinentalseng er en supergod seng med 5-soners pocket-fjærer og 5 cm latex overmadrass. Mange farger å velge i.', NULL, 14990, NULL, 'Mange stoffer og farger å velge i.', NULL, NULL, NULL, 4, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('vendbare-madrasser', 'Vendbare madrasser', NULL, 3, 'Vendbare madrasser med overmadrass. 17cm tykke fjærmadrasser med 4cm skum overmadras.', NULL, 2395, NULL, 'Mange varianter tilgjengelige', NULL, NULL, NULL, 4, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('josefine-kontinentalseng', 'Josefine Kontinentalseng', NULL, 3, 'Veldig god seng til god pris. 5-soners pocket fjær system. Overmadrass 4cm tykk latexkjerne. Fargevalg og valg av fasthet.', 19000, 10990, NULL, 'Fargevalg', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('sofie-kontinentalseng', 'Sofie kontinentalseng', NULL, 3, 'Sofie kontinentalseng er en drøm av en seng. Pocketfjærer og smartpocket fjærer, 6cm latex overmadrass.', 44000, 29990, NULL, 'Fargevalg', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('veslemoy-kontinentalseng', 'Veslemøy kontinentalseng', NULL, 3, 'Deilig kontinentalseng med 7-soners pocketfjær system. Overmadrassen har en latex kjerne på 6cm.', 38500, 24990, NULL, 'Mange varianter tilgjengelige', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('vendbare-madrasser-etter-mal', 'Vendbare madrasser etter mål', NULL, 3, 'Fantastiske 20cm tykke fjærmadrasser fra Brumunddal Ullvarefabrikk. Lages etter mål.', NULL, 3700, NULL, 'Dus grønn farge', NULL, NULL, NULL, 6, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('overmadrasser', 'Overmadrasser', '60 cm latex kjerne', 3, 'Kvalitets overmadrasser med en kjerne av 6cm tykk latex med vaskbart trekk. Nå 50% rabatt.', 11100, 5555, 'Latex/bomull', 'Hvit', '10', '150', '200', 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('broholm-nattbord', 'Broholm', 'Nattbord', 3, 'Elegant og moderne nattbord i eik med spilefront på skuffen. Henger på vegg. 40x40x35cm', 3899, 3319, 'Eik, heltre/finer', 'Røkt, hvitoljet og naturoljet', '40', '40', '35', 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('familiekoye', 'Familiekøye', 'soverom', 3, 'Familiekøye lages etter mål. Stige, sengehest, sengebunner og skruer inkludert.', NULL, 14900, 'Heltre furu', 'Leveres i den fargen du ønsker', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('aluna', 'Aluna', NULL, 3, 'Madrass med god komfort.', NULL, 3995, NULL, NULL, NULL, NULL, NULL, 1, 0);

-- KONTINENTALSENGER
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('karma-exclusive-pernille', 'Karma Exclusive, Pernille, kontinentalseng', NULL, 16, 'Dette er vår mest eksklusive kontinentalseng. 3 lag med fjærer: 2 lag pocketfjærer og et lag smartpocketfjærer. Overmadrassen har 6cm 100% latex. 180x200cm', 80160, 41998, NULL, 'Fargevalg', NULL, NULL, NULL, 1, 1);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('karma-lux-veslemoy', 'Karma Lux, Veslemøy, Kontinental', NULL, 16, 'En nydelig seng med det nye 7-soners fjærsystemet. Overmadrasen er svanemerket med latexkjerne på 8cm. 150x200cm', 38720, 23998, NULL, NULL, NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('karma-lux-evelyn', 'Karma lux, modell Evelyn, regulerbar seng', 'Regulerbar kontinentalseng', 16, 'Evelyn er en danskprodusert seng som er regulerbar i hode- og fotenden. Lamellbunn, 7 soners pocketfjær madrass, 6cm latex overmadrass.', 59360, 29998, NULL, 'Mange varianter tilgjengelige', NULL, NULL, NULL, 1, 0);

-- SENIOR STOL
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('lena-lux', 'Lena lux', 'Hvilestol', 9, 'Senior stol med pall og regulerbar rygg. Treverk i mørkbeiset bøk.', NULL, 7695, 'Stoff/treverk', 'Grå', '110', '66', NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('berit', 'Berit', 'Hvilestol', 9, 'Regulerbar senior stol med pall. Stoff med treverk i lys eik.', NULL, 11995, 'Stoff/treverk', 'Muldvarp', '102', '66', NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('berit-med-lift', 'Berit med lift', 'Lenestol', 9, 'Berit med lift funksjon, stol som kan heves slik at den nesten reiser deg opp. Regulerbar rygg. Pall følger med.', NULL, 16265, 'Stoff/treverk', 'Mange varianter tilgjengelige', '102', '66', NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('symphony', 'Symphony', 'Elektrisk recliner', 9, 'Symphony er en komfortabel senior stol med elektrisk recliner-funksjon og god støtte.', NULL, 18995, 'Skinn', NULL, NULL, NULL, NULL, 1, 0);

-- HYTTEMØBLER
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('garderobeskap', 'Garderobeskap', NULL, 18, 'Garderobeskap lages på mål. Alt i heltre furu, i den fargen du ønsker. Standard høyde 210cm, dybde 50cm.', NULL, 14900, 'Treverk', 'Alle farger, men det må være ncs-kode', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('hovik-kommode', 'Høvik kommode', NULL, 18, 'Høvik kommode i heltre furu med 4cm tykk heltre eik topplate.', NULL, NULL, NULL, 'Mange varianter tilgjengelige', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('nattbord-hytte', 'Nattbord', NULL, 18, 'Nattbord i heltre furu, lages etter mål. 1 skuff og 1 dør.', NULL, 6995, NULL, 'Mange varianter tilgjengelige', '50', '40', '30', 1, 0);

-- MOOD TV-benk / Salongbord
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('mood-tv-benk', 'Mood', 'TV-benk', 10, 'Mood TV-benk i finert eik med moderne design.', NULL, 11995, 'Finert eik', NULL, NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('mood-salongbord-130', 'Mood', 'Salongbord', 6, 'Stilrent og moderne salongbord i finert eik. 130x70x45cm', 8995, 6995, 'Finert eik', 'Hvitoljet, gråoljet, lys eik', '45', '70', '130', 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('mood-salongbord-sett', 'Mood', 'Salongbord', 6, 'Salongbord bestående av 2 små, og 1 stort bord. Finert eik og metall ben. 130x65, 57x50, 57 og 43cm høyt.', 8995, 6995, 'Finert eik, metall', 'Lys eik', NULL, NULL, NULL, 1, 0);
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('mood-sidebord', 'Mood', 'Sidebord rund', 6, 'Mood sidebord er et allsidig bord som kan brukes som sidebord eller deler av salongbord. Sortbeiset finert eik.', NULL, 3995, NULL, 'Sortbeiset', '55', NULL, NULL, 1, 0);

-- Elegance spisebord (original)
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('elegance', 'Elegance', 'Elegance spisebord fra Casø', 14, 'Bordet leveres i røkt eller hvitoljet eik. Det kan kjøpes med tilleggsplater a 50cm. 200x90cm eller 240x100cm.', NULL, NULL, 'Eik', 'Røkt eller hvitoljet', '75', '90', '200', 2, 0);

-- Broholm solid vitrine
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
INSERT INTO products (slug, title, subtitle, category_id, description, price, sale_price, material, color, height, width, depth, supplier_id, enabled, bestseller) VALUES
('broholm-solid', 'Broholm solid', NULL, 13, 'Vitrineskap med glass på sidene i Broholm serien.', 29999, 26499, NULL, NULL, NULL, NULL, NULL, 1, 0);
