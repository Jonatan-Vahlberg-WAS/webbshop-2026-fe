const dummyProducts = [
  {
    "Category": "Skafferi",
    "Product-title": "Finkrossade tomater",
    "Product-description": "Grekiska solmogna finkrossade tomater med hög sötma och tydlig syra som gör att de påminner mer om färska. Perfekt sötma och syra i såsen, soppan, grytan och gratängen.",
    "Product-weight": "400 g",
    "Product-producer": "Fontana",
    "Product-price": "8,00 kr",
    "Product-image-url": "https://productimages.motatos.com/MS250161/ms250161_1-92537e81-098c-407e-9716-955925b959de.png?tr=w-2034,h-2034,c-at_max,bg-ffffff",
    "Matsmart-url": "https://www.matsmart.se/produkt/fontana-finkrossade-tomater-400g"
  },
  {
    "Category": "Skafferi",
    "Product-title": "Röda linser",
    "Product-description": "Röda linser från GoGreen. Helt vanlig produkt - inte räddad, bara en vanlig vara med låg risk att svinnas.",
    "Product-weight": "230 g",
    "Product-producer": "GoGreen",
    "Product-price": "13,00 kr",
    "Product-image-url": "https://productimages.motatos.com/MS119195/799228-8481ec73-b368-499d-bc6d-a91f6b2cd424.png?tr=w-2034,h-2034,c-at_max,bg-ffffff",
    "Matsmart-url": "https://www.matsmart.se/produkt/gogreen-roda-linser"
  },
  {
    "Category": "Skafferi",
    "Product-title": "Spaghetti",
    "Product-description": "Ett paket spagetti pasta på durumvete.",
    "Product-weight": "400 g",
    "Product-producer": "Fiorelli",
    "Product-price": "13,00 kr",
    "Product-image-url": "https://productimages.motatos.com/MS235699/789729-bed8ee41-6fc0-487b-86c3-c14ace7604af.png?tr=w-2034,h-2034,c-at_max,bg-ffffff",
    "Matsmart-url": "https://www.matsmart.se/produkt/fiorelli-spaghetti-1"
  },
  {
    "Category": "Skafferi",
    "Product-title": "Krossade Tomater 8-pack",
    "Product-description": "Amore mio, dessa krossade tomater kan vara din nya bästis i köket.",
    "Product-weight": "8 x 390 g",
    "Product-producer": "Motatos",
    "Product-price": "89,00 kr",
    "Product-image-url": "https://productimages.motatos.com/MS206175/ms206175-8-pack-chopped-tomatoes-390g-cc0388fb-02d0-4d08-8c2f-6895023dd30c.jpg?tr=w-2034,h-2034,c-at_max,bg-ffffff",
    "Matsmart-url": "https://www.matsmart.se/produkt/motatos-krossade-tomater-8-pack-0"
  },
  {
    "Category": "Skafferi",
    "Product-title": "Havregryn",
    "Product-description": "Havre är fullproppat med näringsämnen",
    "Product-weight": "750 g",
    "Product-producer": "Motatos",
    "Product-price": "15,00 kr",
    "Product-image-url": "https://productimages.motatos.com/MS235187/ms235187_1234-2a5862b9-4ff9-4b3d-950e-7cb987366372.png?tr=w-2034,h-2034,c-at_max,bg-ffffff",
    "Matsmart-url": "https://www.matsmart.se/produkt/motatos-havregryn"
  },
  {
    "Category": "Drycker",
    "Product-title": "Coca-Cola 30-pack",
    "Product-description": "Klassiska favoriten Coca-Cola. 30-pack med 33 cl burkar.",
    "Product-weight": "30 x 330ml",
    "Product-producer": "Coca-Cola",
    "Product-price": "199,00 kr",
    "Product-image-url": "https://productimages.motatos.com/MS212591/ms212591-86034387-649d-40ce-85d6-446093c9e74f.jpg?tr=w-2034,h-2034,c-at_max,bg-ffffff",
    "Matsmart-url": "https://www.matsmart.se/produkt/coca-cola-coca-cola-30-pack"
  },
  {
    "Category": "Drycker",
    "Product-title": "Trocadero Zero 20-pack",
    "Product-description": "Trocadero, som lanserades i Sverige i början av 50-talet, är en läsk med en alldeles egen smak och karaktär.",
    "Product-weight": "20 x 33 cl",
    "Product-producer": "Trocadero",
    "Product-price": "119,00 kr",
    "Product-image-url": "https://productimages.motatos.com/MS209600/ms209600_1-773129b1-f05d-4fed-9aea-4fe8947cc280.png?tr=w-2034,h-2034,c-at_max,bg-ffffff",
    "Matsmart-url": "https://www.matsmart.se/produkt/trocadero-trocadero-zero-20-pack"
  },
  {
    "Category": "Drycker",
    "Product-title": "Ramlösa Granatäpple 20-Pack",
    "Product-description": "Ramlösa är ett naturligt mineralvatten som njutits sedan 1707 och tappas direkt vid källan i Ramlösa hälsobrunn.",
    "Product-weight": "20 x 33 cl",
    "Product-producer": "Ramlösa",
    "Product-price": "119,00 kr",
    "Product-image-url": "https://productimages.motatos.com/MS205525/ms205525_1-91abbfb8-9a48-4f69-9524-b5d0950656ed.png?tr=w-2034,h-2034,c-at_max,bg-ffffff",
    "Matsmart-url": "https://www.matsmart.se/produkt/ramlosa-ramlosa-granatapple-20-pack"
  },
  {
    "Category": "Drycker",
    "Product-title": "Pepsi Max",
    "Product-description": "Pepsi Max, en sockerfri läskedryck med smak av Cola. Sätter guldkant på vardagen.",
    "Product-weight": "33 cl",
    "Product-producer": "Pepsi",
    "Product-price": "9,00 kr",
    "Product-image-url": "https://productimages.motatos.com/MS211023/ms211023_1-300e8c92-583e-4c56-85dd-f62913610481.png?tr=w-2034,h-2034,c-at_max,bg-ffffff",
    "Matsmart-url": "https://www.matsmart.se/produkt/pepsi-pepsi-max"
  },
  {
    "Category": "Drycker",
    "Product-title": "Fruktdryck Päron 27-pack",
    "Product-description": "Smarrig fruktdryck med päronsmak. Helt utan tillsatt socker. Det är alltid bra att ha med en Smakis på utflykten!",
    "Product-weight": "27 x 200 ml",
    "Product-producer": "Smakis",
    "Product-price": "169,00 kr",
    "Product-image-url": "https://productimages.motatos.com/MS100367/hl_smakis_paron_ny.jpg?tr=w-2034,h-2034,c-at_max,bg-ffffff",
    "Matsmart-url": "https://www.matsmart.se/produkt/smakis-fruktdryck-paron-27-pack"
  },
  {
    "Category": "Bageri",
    "Product-title": "Tortillabröd 10-pack",
    "Product-description": "Tortillabröd original. Gjorda på vete och kommer i ett 10 pack.",
    "Product-weight": "400 g",
    "Product-producer": "Santa Maria",
    "Product-price": "20,00 kr",
    "Product-image-url": "https://productimages.motatos.com/MS224946/ms224946_1-4e18d279-aab9-4622-b26b-014beb205a6b.png?tr=w-2034,h-2034,c-at_max,bg-ffffff",
    "Matsmart-url": "https://www.matsmart.se/produkt/santa-maria-tortillabrod-10-pack"
  },
  {
    "Category": "Bageri",
    "Product-title": "Delicatoboll Mini",
    "Product-description": "En liten delikat chokladboll med mockasmak och rullad i kokos - en kär klassiker.",
    "Product-weight": "18 g",
    "Product-producer": "Delicato",
    "Product-price": "4,00 kr",
    "Product-image-url": "https://productimages.motatos.com/MS237101/ms237101_1-4374309a-e63f-4f4f-ae9c-928690ec6fe1.png?tr=w-2034,h-2034,c-at_max,bg-ffffff",
    "Matsmart-url": "https://www.matsmart.se/produkt/delicato-delicatoboll-mini"
  },
  {
    "Category": "Bageri",
    "Product-title": "Riskex",
    "Product-description": "Krispiga och läckra kex som erbjuder en perfekt balans av sälta och smak. Idealiska som ett smakfullt mellanmål eller tilltugg.",
    "Product-weight": "150 g",
    "Product-producer": "Want Want",
    "Product-price": "14,00 kr",
    "Product-image-url": "https://productimages.motatos.com/MS241561/ms241561_1-72050dd7-a29e-40bb-81ff-8ea15b6d1ebe.png?tr=w-2034,h-2034,c-at_max,bg-ffffff",
    "Matsmart-url": "https://www.matsmart.se/produkt/want-want-riskex"
  },
  {
    "Category": "Bageri",
    "Product-title": "Naanbröd Vitlök 2-pack",
    "Product-description": "Mjuka och saftiga naanbröd med vitlök som passar utmärkt till all indisk mat. Santa Maria Naan vitlöksbröd är smaksatta med vitlök och örter.",
    "Product-weight": "260 g",
    "Product-producer": "Santa Maria",
    "Product-price": "25,00 kr",
    "Product-image-url": "https://productimages.motatos.com/MS247066/ms247066_1-f635b4a2-12fa-4c17-929f-cce4d7ef0385.png?tr=w-2034,h-2034,c-at_max,bg-ffffff",
    "Matsmart-url": "https://www.matsmart.se/produkt/santa-maria-naanbrod-vitlok-2-pack"
  },
  {
    "Category": "Bageri",
    "Product-title": "Chokladboll Mini",
    "Product-description": "Den populära chokladbollen från Swedish Fika här i singelförpackning, kan med fördel frysas in för att tas fram vid senare tillfällen.",
    "Product-weight": "37,5 g",
    "Product-producer": "Swedish Fika",
    "Product-price": "7,00 kr",
    "Product-image-url": "https://productimages.motatos.com/MS118164/ms118164_1-c972529d-d953-416e-8909-b7cef9de5b1f.png?tr=w-2034,h-2034,c-at_max,bg-ffffff",
    "Matsmart-url": "https://www.matsmart.se/produkt/swedish-fika-chokladboll-mini"
  },
  {
    "Category": "Hem & hushåll",
    "Product-title": "Wettex Disktrasa",
    "Product-description": "En singel wettex trasa i en läcker färg. Finns i 4 olika färger, men vilken färg just du får blir en överraskning!",
    "Product-weight": "1 pcs",
    "Product-producer": "Wettex",
    "Product-price": "5,00 kr",
    "Product-image-url": "https://productimages.motatos.com/MS233598/ms233598_1221-112eb518-bb46-4160-9a92-6072ab55f050.png?tr=w-2034,h-2034,c-at_max,bg-ffffff",
    "Matsmart-url": "https://www.matsmart.se/produkt/wettex-wettex-disktrasa"
  },
  {
    "Category": "Hem & hushåll",
    "Product-title": "Fryspåse 5 L",
    "Product-description": "Fryspåsar som rymmer 5 liter. 25 stycken.",
    "Product-weight": "25 pcs",
    "Product-producer": "Prima",
    "Product-price": "10,00 kr",
    "Product-image-url": "https://productimages.motatos.com/MS246146/ms246146_1-5759becf-0666-4a4d-89d7-94d7eaf760a0.png?tr=w-2034,h-2034,c-at_max,bg-ffffff",
    "Matsmart-url": "https://www.matsmart.se/produkt/prima-fryspase-5-l-0"
  },
  {
    "Category": "Hem & hushåll",
    "Product-title": "Avfallspåsar med Drawstring 20 L",
    "Product-description": "Avfallspåsar med dragsnöre gjort på återvunnet plast. 15 st påsar som rymmer 20 L.",
    "Product-weight": "15 pcs",
    "Product-producer": "Ninjaplast",
    "Product-price": "20,00 kr",
    "Product-image-url": "https://productimages.motatos.com/MS210371/avfallspasar-med-dragsnore-20ljpg-ed10723f-8b62-40e4-a066-8b623a024dd4.jpg?tr=w-2034,h-2034,c-at_max,bg-ffffff",
    "Matsmart-url": "https://www.matsmart.se/produkt/ninjaplast-avfallspasar-med-drawstring-20-l"
  },
  {
    "Category": "Hem & hushåll",
    "Product-title": "Toalettpapper Comfort 8-pack",
    "Product-description": "Toalettrullar som är mjuka och starka på samma gång. Ett test gjorde att rullarna tillverkades på två- istället för trelagerspapper. Men frukta inte! Papperskvalitén är fortfarande lika mjukt och starkt. Så att du kan ha en to(a)tally episk toaupplevelse. Och ingen vill ju missa en sån!",
    "Product-weight": "8 pcs",
    "Product-producer": "LOTUS",
    "Product-price": "39,00 kr",
    "Product-image-url": "https://productimages.motatos.com/MS224715/ms224715_1-c0e74b6a-cf7c-487c-af94-6af77af5e965.png?tr=w-2034,h-2034,c-at_max,bg-ffffff",
    "Matsmart-url": "https://www.matsmart.se/produkt/lotus-toalettpapper-comfort-8-pack"
  },
  {
    "Category": "Hem & hushåll",
    "Product-title": "Bastvätt Tvättmedel Kulör",
    "Product-description": "Ett skonsamt och parfymfritt tvättmedel som effektivt rengör färgade kläder utan att bleka eller skada tygerna. Med sin milda formula är det särskilt anpassat för känslig hud och hjälper till att bevara färgerna på dina plagg tvätt efter tvätt.",
    "Product-weight": "4.5 kg",
    "Product-producer": "Ocean",
    "Product-price": "120,00 kr",
    "Product-image-url": "https://productimages.motatos.com/MS242631/ms242631_1-aa6ffc54-e3c1-479c-8357-3212fc6f7cf8.png?tr=w-2034,h-2034,c-at_max,bg-ffffff",
    "Matsmart-url": "https://www.matsmart.se/produkt/ocean-bastvatt-tvattmedel-kulor"
  },
  {
    "Category": "Snacks och godis",
    "Product-title": "Polly Tropical 150g",
    "Product-description": "Polly Tropical är tropisk mix av härligt sega skumtoppar med smak av persika, passionsfrukt och apelsin. Följ med på en mental resa till ett tropiskt paradis! Kombinationen av ett frestande segt inre med smaken av choklad gör godispåsen så mumsig att det är omöjligt att bara ta en.",
    "Product-weight": "150 G",
    "Product-producer": "Cloetta",
    "Product-price": "13,00 kr",
    "Product-image-url": "https://productimages.motatos.com/MS249243/ms249243_1-656f89bf-efa8-4221-a13e-3ab05761459e.png?tr=w-2034,h-2034,c-at_max,bg-ffffff",
    "Matsmart-url": "https://www.matsmart.se/produkt/cloetta-polly-tropical-150g"
  },
  {
    "Category": "Snacks och godis",
    "Product-title": "Frosty Blueberry Winter Edition",
    "Product-description": "Pändy Frosty Blueberry är ett sötsyrligt skumgodis med smak av blåbär. Innehåller sötningsmedel. Ett Limited edition-godis som endast innehåller 1 g socker per påse.",
    "Product-weight": "50 g",
    "Product-producer": "Pändy",
    "Product-price": "17,00 kr",
    "Product-image-url": "https://productimages.motatos.com/MS245682/ms245682_123-b6dfab7c-0b14-4011-8256-4d2396f304cd.png?tr=w-2034,h-2034,c-at_max,bg-ffffff",
    "Matsmart-url": "https://www.matsmart.se/produkt/pandy-frosty-blueberry-winter-edition"
  },
  {
    "Category": "Snacks och godis",
    "Product-title": "Ölkorv Hot Amigo 20g",
    "Product-description": "Ölkorv Hot Amigo är en eldig och kryddstark korv med en djärv chilismak. Perfekt för dig som gillar heta smaker till ölen eller snackstallriken!",
    "Product-weight": "20 g",
    "Product-producer": "Ridderheims",
    "Product-price": "5,00 kr",
    "Product-image-url": "https://productimages.motatos.com/MS250321/ms250321_1-f15d5482-19b8-471f-a007-79619b3daad7.png?tr=w-2034,h-2034,c-at_max,bg-ffffff",
    "Matsmart-url": "https://www.matsmart.se/produkt/ridderheims-olkorv-hot-amigo-20g"
  },
  {
    "Category": "Snacks och godis",
    "Product-title": "Daim Orange Dubbel",
    "Product-description": "Klassiska Daim här i en ny spännande variant! Mjölkchoklad med apelsinsmak och mandelkrokant.",
    "Product-weight": "56g",
    "Product-producer": "Daim",
    "Product-price": "9,00 kr",
    "Product-image-url": "https://productimages.motatos.com/7622210981271/7622210981271-685dffb1-4e35-40a8-adc7-8aaa0693420f.png?tr=w-2034,h-2034,c-at_max,bg-ffffff",
    "Matsmart-url": "https://www.matsmart.se/produkt/daim-daim-orange-dubbel"
  },
  {
    "Category": "Snacks och godis",
    "Product-title": "Ahlgrens Bilar",
    "Product-description": "Ahlgrens bilar Original är en självklar favorit bland godispåsar. De mjuka bilarna erbjuds här i de klassiska Ahlgrens bilar färgerna rosa, vit och grön. Om bilarna smakar olika eller likadant, är och förblir en hemlighet. Under åren som gått har det tillkommit en del nya modeller men originalets smak är och förblir orörd. Har man Sveriges mest köpta bil så har man!",
    "Product-weight": "125 g",
    "Product-producer": "Ahlgrens",
    "Product-price": "16,00 kr",
    "Product-image-url": "https://productimages.motatos.com/MS115936/ms115936_-4b304f76-225f-40fb-ad15-17ccd8b4b86f.png?tr=w-2034,h-2034,c-at_max,bg-ffffff",
    "Matsmart-url": "https://www.matsmart.se/produkt/ahlgrens-ahlgrens-bilar-0"
  }

]

export default dummyProducts;
