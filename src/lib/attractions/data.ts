export interface QuickFact {
  label: string;
  value: string;
}

export interface KeyFact {
  label: string;
  value: string;
}

export interface Attraction {
  slug: string;
  name: string;
  shortName?: string;
  distanceBadge: string;
  tags: string[];
  category: 'Wildlife' | 'Heritage' | 'Temples' | 'Adventure';
  cardDescription: string;
  heroSubhead: string;
  quickFacts: QuickFact[];
  keyFacts: KeyFact[];
  intro: string[];
  whatToSeeAndDo: string[];
  howToGetThere: string;
  bestTimeToVisit: string;
  goodToKnow: string[];
  imageAlt: string;
  geo?: { lat: number; lng: number };
}

export const ATTRACTIONS: Attraction[] = [
  {
    slug: 'ratapani-tiger-reserve',
    name: 'Ratapani Tiger Reserve',
    distanceBadge: 'Adjacent',
    tags: ['Wildlife', 'Forest'],
    category: 'Wildlife',
    imageAlt:
      'A tiger walks along a forest track in Ratapani Tiger Reserve, with tall teak trees on either side',
    heroSubhead: "India's newest tiger reserve, beginning at the edge of the property.",
    cardDescription:
      "India's 57th tiger reserve wraps around Madhuban on three sides. Teak forests, sloth bears, leopards, and the slow patience of a real safari.",
    quickFacts: [
      { label: 'Distance from Madhuban', value: 'Adjacent' },
      { label: 'Drive Time', value: '30–60 min to entry gates' },
      { label: 'Best Season', value: 'Oct – Jun' },
      { label: 'Type', value: 'Tiger Reserve' },
    ],
    keyFacts: [
      { label: 'Notified as tiger reserve', value: '2 December 2024' },
      { label: 'Total area', value: '1,271 km²' },
      { label: 'Recognition', value: "India's 57th tiger reserve" },
      { label: 'Forest type', value: 'Dry & moist deciduous, ~55% teak' },
      { label: 'Wildlife', value: 'Tigers, leopards, sloth bears, sambar' },
      { label: 'Bird species', value: '150+' },
      { label: 'Sites within', value: 'Bhimbetka, Ginnaurgarh Fort' },
    ],
    intro: [
      'In December 2024, the forest you can see from your tent at Madhuban officially became Madhya Pradesh’s eighth tiger reserve. Ratapani had been a wildlife sanctuary since 1976, but the upgrade — announced under Section 38V of the Wildlife Protection Act — promoted it to the country’s 57th tiger reserve. With 763.8 sq km of core habitat and 507.6 sq km of buffer zone, the reserve now spans 1,271 sq km of forest, much of it dry deciduous teak rolling across the Vindhya hills between Bhopal and the Narmada.',
      'Tigers are the headline. But Ratapani is better understood as a layered ecosystem. Leopards, sloth bears, hyena, sambar, spotted deer, and over 150 species of birds share the forest. Two of the other places on this list — the Bhimbetka rock shelters and Ginnaurgarh Fort — sit inside the reserve’s boundaries. If you’ve come to Madhuban to actually be in central India’s wilderness rather than near it, this is where that happens.',
    ],
    whatToSeeAndDo: [
      'Jeep safaris from Delawadi and other entry gates (timings vary by season; book in advance)',
      'Birdwatching — kingfishers, hornbills, paradise flycatchers, raptors',
      'Trekking on permitted trails with a forest department guide',
      'A real chance of tiger and leopard sightings, though sloth bears are seen more often',
      'Ginnaurgarh Fort and Bhimbetka, both reachable as part of forest excursions',
    ],
    howToGetThere:
      'The reserve borders the property directly — the forest behind Madhuban is Ratapani. For organised safaris, the nearest entry gates are reachable by road in 30–60 minutes depending on which gate you choose. We can help arrange permits, jeeps, and a forest guide; speak to Shibajee or the front desk at least a day ahead, ideally two for weekend slots.',
    bestTimeToVisit:
      'October to June for safaris. The core zone closes during the monsoon (July–September). Early mornings (around 6:00 AM start) and late afternoons offer the best wildlife activity and the most comfortable light.',
    goodToKnow: [
      'Carry a government-issued ID — entry permits require it',
      'Wear muted colours (greens, browns, greys); avoid bright reds, oranges, whites',
      'Mobile signal inside the forest is patchy at best',
      'Photography is allowed; drones are strictly prohibited',
      'Safaris fill up during weekends and holiday weeks; book ahead',
    ],
  },
  {
    slug: 'bhimbetka-rock-shelters',
    name: 'Bhimbetka Rock Shelters',
    distanceBadge: '~50 km',
    tags: ['UNESCO', 'Heritage'],
    category: 'Heritage',
    imageAlt:
      'A large prehistoric rock shelter at Bhimbetka with smooth weathered sandstone walls and a wooden viewing platform',
    heroSubhead: 'A UNESCO World Heritage Site holding some of the oldest art on earth.',
    cardDescription:
      'Over 750 rock shelters and prehistoric paintings dating back 30,000 years — among the oldest known human art on earth.',
    quickFacts: [
      { label: 'Distance from Madhuban', value: '~50 km' },
      { label: 'Drive Time', value: '~1 hr 15 min' },
      { label: 'Best Season', value: 'Oct – Mar' },
      { label: 'Type', value: 'UNESCO World Heritage Site' },
    ],
    keyFacts: [
      { label: 'Status', value: 'UNESCO World Heritage Site (2003)' },
      { label: 'Total shelters', value: '750+' },
      { label: 'Painted shelters', value: '~500' },
      { label: 'Oldest paintings', value: 'c. 10,000 BCE' },
      { label: 'Habitation evidence', value: '100,000+ years' },
      { label: 'Pigments', value: 'Ochre, lime, charcoal, copper minerals' },
    ],
    intro: [
      'Some of the oldest evidence of human creativity in South Asia is painted on sandstone overhangs about an hour from Madhuban. Bhimbetka has more than 750 rock shelters spread across seven hills, and around 500 of them carry prehistoric paintings. The earliest are dated to roughly 10,000 BCE; the site itself shows traces of habitation going back over 100,000 years to the Acheulean period. UNESCO inscribed it as a World Heritage Site in 2003.',
      'The paintings are layered in time. Mesolithic hunters chasing deer. Bronze Age figures on horseback. Later imagery overlaid on the same walls, like a palimpsest of every civilisation that has passed through these hills. What makes Bhimbetka land differently than reading about it is scale. You walk between shelters. You stand inside the Auditorium Cave, which the archaeologist Robert Bednarik described as having a Gothic, cathedral-like atmosphere. The rock art is not behind glass.',
    ],
    whatToSeeAndDo: [
      'A walking circuit through the main 15 numbered shelters (about 1.5–2 hours)',
      'Paintings of bison, tigers, elephants, and hunting scenes — some in red ochre that has held its colour for thousands of years',
      'The Auditorium Cave and Zoo Rock — the most documented shelters',
      'Interpretive signage by the Archaeological Survey of India',
      'Optional ASI guides at the entrance, who add useful context',
    ],
    howToGetThere:
      'Approximately 50 km via the Bhopal–Hoshangabad road. Drive time is around 1 hour 15 minutes. The site is also inside the Ratapani Tiger Reserve boundary, so much of the drive runs through forest. Bhimbetka pairs naturally with Bhojpur Temple in a single day — they’re 25 km apart. Front desk can arrange a car and driver.',
    bestTimeToVisit:
      'October to March for comfortable walking weather. Mornings between 8:00 and 10:00 AM offer the best light for the paintings and the smallest crowds. Avoid summer afternoons — the rocks hold heat and the open path has little shade.',
    goodToKnow: [
      'Entry tickets: ₹40 for Indians, ₹600 for foreign visitors (verify at gate)',
      'ASI-licensed guides are worth hiring for context',
      'Wear closed shoes — uneven steps and loose gravel along the circuit',
      'Photography is allowed; flash is not',
      'Allow 2–3 hours including driving time at the site',
    ],
    geo: { lat: 22.9367, lng: 77.6117 },
  },
  {
    slug: 'bhojpur-temple',
    name: 'Bhojpur Temple',
    distanceBadge: '~45 km',
    tags: ['Heritage', 'Temple'],
    category: 'Heritage',
    imageAlt:
      'The unfinished Bhojeshwar Mahadev Temple at Bhojpur, a massive sandstone structure under restoration scaffolding',
    heroSubhead: "An unfinished 11th-century temple holding one of India’s largest Shiva lingams.",
    cardDescription:
      'An 11th-century Shiva temple, never finished, holding one of the largest stone lingams in India — 7.5 feet tall, carved from a single rock.',
    quickFacts: [
      { label: 'Distance from Madhuban', value: '~45 km' },
      { label: 'Drive Time', value: '~1 hr 30 min' },
      { label: 'Best Season', value: 'Oct – Mar' },
      { label: 'Type', value: 'ASI Monument' },
    ],
    keyFacts: [
      { label: 'Built', value: 'c. 1010–1055 CE' },
      { label: 'Patron', value: 'King Bhoja, Paramara dynasty' },
      { label: 'Status', value: 'ASI Monument of National Importance' },
      { label: 'Lingam height', value: '7.5 ft (40 ft with platform)' },
      { label: 'Lingam circumference', value: '17.8 ft' },
      { label: 'UNESCO', value: 'Tentative World Heritage List' },
      { label: 'Major festival', value: 'Maha Shivaratri' },
    ],
    intro: [
      'Bhojeshwar Mahadev was meant to be one of the great temples of the medieval Indian world. King Bhoja of the Paramara dynasty began construction in the early 11th century, and then — for reasons no historian has been able to settle — the work stopped. The architectural drawings were left etched into the surrounding rocks. The earthen ramps the masons used to haul sandstone blocks up the escarpment are still visible. The temple was simply walked away from, mid-build, around a thousand years ago.',
      'What stayed is extraordinary. The Shiva lingam inside the sanctum is 7.5 feet tall and 17.8 feet around, set on a 21.5-foot square platform — total height over 40 feet, making it one of the largest lingams in India. The temple sits above the Betwa river on a sandstone escarpment, walls rising window-less and severe. UNESCO has it on the tentative list of World Heritage Sites. ASI has designated it a Monument of National Importance.',
    ],
    whatToSeeAndDo: [
      'The main sanctum and the colossal monolithic lingam',
      'The unfinished architectural drawings carved into the surrounding rock',
      'Sculptures of Shiva-Parvati, Brahma-Savitri, Lakshmi-Narayan, and Sita-Rama on the bracket figures',
      'Views across the Betwa river valley',
      'Cave shrines and palace ruins of Raja Bhoj nearby (a short walk)',
    ],
    howToGetThere:
      'Approximately 45 km via Obedullaganj. Drive time is around 1 hour 30 minutes depending on traffic through Mandideep. The drive runs through farmland and small forest patches. Combinable with Bhimbetka in a single day if you start early — the two sites are about 25 km apart.',
    bestTimeToVisit:
      'October to March for cooler weather. Early morning or late afternoon is best — the sandstone floor heats up fast, and shoes have to come off at the entrance. Maha Shivaratri (February or March) draws thousands of devotees and a Bhojpur Utsav cultural event organised by MP Tourism.',
    goodToKnow: [
      'Entry is free; this is a living temple, so visit respectfully',
      'Modest dress is appreciated',
      'Carry water — only small snack stalls outside',
      'The roof is partly open to the sky — best avoided in heavy rain',
      'The site has no formal ticket counter; donation boxes at the entrance',
    ],
    geo: { lat: 23.2647, lng: 77.4692 },
  },
  {
    slug: 'salkanpur-devi-temple',
    name: 'Salkanpur Devi Temple',
    distanceBadge: '~5 km',
    tags: ['Temple', 'Pilgrimage'],
    category: 'Temples',
    imageAlt: 'The Salkanpur Devi temple complex with multiple shrine spires under a dramatic monsoon sky',
    heroSubhead: 'A hilltop shrine to Goddess Bijasan, five kilometres from the property.',
    cardDescription:
      'Hilltop shrine to Goddess Bijasan, an incarnation of Durga, perched 800 feet above the plains. Around 1,400 stone steps to the top, or take the ropeway.',
    quickFacts: [
      { label: 'Distance from Madhuban', value: '~5 km' },
      { label: 'Drive Time', value: '~15 min' },
      { label: 'Best Season', value: 'Year-round' },
      { label: 'Type', value: 'Hindu Pilgrimage Site' },
    ],
    keyFacts: [
      { label: 'Hilltop elevation', value: '800 ft' },
      { label: 'Stone steps to summit', value: '~1,400' },
      { label: 'Ropeway', value: 'Operational since 2001' },
      { label: 'Type', value: 'Siddhpeeth' },
      { label: 'Deity', value: 'Bijasan Mata (Vindhyavasini Devi)' },
      { label: 'Major festival', value: 'Navaratri (twice yearly)' },
      { label: 'Under construction', value: 'Devi Lok complex' },
    ],
    intro: [
      'Salkanpur is the closest major attraction to Madhuban — under 5 km if you’re heading toward Rehti town. The temple sits on top of an 800-foot hill, and is one of the most active pilgrimage sites in central Madhya Pradesh. The presiding deity is Maa Vindhyavasini Bijasan Devi, an incarnation of Durga, in a self-manifested (swayambhu) form that is said to have stood here for centuries. The name Bijasan — ‘destroyer of the seed’ — comes from the legend in which the goddess defeated the demon Raktabija by preventing his blood from spawning clones.',
      'There are two ways up. The traditional route is roughly 1,400 stone steps, and devotees climb barefoot, often chanting, often with family. The faster route is the ropeway, built in 2001. From the top, the view runs over forested hills toward the Narmada valley. During Navaratri (twice a year), the path fills with pilgrims and a fair sets up at the base. A larger Devi Lok complex, modelled on the Mahakal Lok at Ujjain, is currently under construction at an investment of around ₹280 crore.',
    ],
    whatToSeeAndDo: [
      'Darshan at the main shrine of Bijasan Devi',
      'The climb itself, if you’re up for it — the steps are well maintained',
      'The ropeway (faster, easier on knees, ticketed)',
      'Panoramic views of the Vindhya foothills and Ratapani forest',
      'The Navaratri fair, if you visit in March/April or September/October',
    ],
    howToGetThere:
      'About 5 km via Rehti. Less than 15 minutes by car. There’s a road that goes most of the way up to a parking area near the temple, after which it’s roughly a 650-metre walk. Front desk can arrange a car or auto.',
    bestTimeToVisit:
      'March to October is generally pleasant; the monsoon (July–September) makes the hill especially green. Navaratri is the busiest and most atmospheric time, but expect crowds and slower darshan. For a quieter visit, weekday mornings work well.',
    goodToKnow: [
      'Entry is free; ropeway tickets are paid separately at the base',
      'Footwear has to be removed before the inner shrine',
      'A side-entry option is available for elderly visitors who can’t queue',
      'Phone signal is reliable; food stalls operate near the base',
      'Modest dress is appropriate',
    ],
    geo: { lat: 22.8667, lng: 77.5833 },
  },
  {
    slug: 'ginnaurgarh-fort',
    name: 'Ginnaurgarh Fort',
    distanceBadge: '~35 km',
    tags: ['Heritage', 'Trek'],
    category: 'Heritage',
    imageAlt: 'The hill on which Ginnaurgarh Fort stands, viewed from the Ratapani forest',
    heroSubhead: 'A 15th-century Gond fort inside Ratapani, where a warrior queen made her last stand.',
    cardDescription:
      'A 15th-century Gond hilltop fort inside Ratapani, once held by Rani Kamlapati, the warrior queen whose name now belongs to a railway station.',
    quickFacts: [
      { label: 'Distance from Madhuban', value: '~35 km' },
      { label: 'Drive Time', value: '~1 hr 30 min' },
      { label: 'Best Season', value: 'Oct – Feb' },
      { label: 'Type', value: 'Protected Monument' },
    ],
    keyFacts: [
      { label: 'Elevation', value: '700 m (2,300 ft)' },
      { label: 'Earliest occupation', value: '11th-century Paramara' },
      { label: 'Major construction', value: '15th-century Gonds' },
      { label: 'Famous for', value: 'Last stand of Rani Kamlapati (1720s)' },
      { label: 'Captured by', value: 'Dost Muhammad Khan, c. 1723' },
      { label: 'Water sources', value: '25 wells + 4 ponds' },
      { label: 'Nearby', value: 'WWII POW camp ruins' },
    ],
    intro: [
      'Ginnaurgarh sits on a 700-metre rocky summit inside the Ratapani Tiger Reserve, the highest point in the area. The fort was built up in stages — Paramara-era foundations from the 11th century, expanded into a major stronghold by the Gonds in the 15th century, and ruled in the 18th century by Nizam Shah and later by Rani Kamlapati. Kamlapati was the warrior queen whose name now belongs to a Bhopal railway station, and whose final years played out in this fort. After her death around 1723, the fort was taken by Dost Muhammad Khan, the founder of the Bhopal princely state — by stealth, not by siege.',
      'The fort is a ruin now, slowly being claimed by the forest. There are remains of palaces, gatehouses, water cisterns (25 wells and four small ponds, all still holding water), and a Persian inscription dated 1725–26 on one of the gates. Nearby, the ruins of a much later World War II prisoner-of-war camp — built to hold 30,000 Italian and other Axis prisoners — adds a strange second layer of history. The whole site is protected by the Madhya Pradesh Department of Archaeology, though maintenance is sparse.',
    ],
    whatToSeeAndDo: [
      'Drive through the Ratapani forest on a permitted route from Delawadi',
      'Pass Badi Aam Kho — a perennial stream emerging from inside the mountain',
      'Trek the final 1 km up to the fort (steep in places, manageable for most)',
      'Three gateways leading to the palace complex at the top',
      'Panoramic views from the rooftop of the main court',
      'The WWII POW camp ruins, a short drive further',
    ],
    howToGetThere:
      'Roughly 35 km, but the route involves a permitted entry into the Ratapani buffer zone via Delawadi village. You will need a forest department guide (mandatory, around ₹300–400) and ideally a vehicle that handles forest tracks. The final climb is on foot. We strongly recommend arranging this through Madhuban’s front desk a day in advance — guide allocation, registration, and timing are easier with local help.',
    bestTimeToVisit:
      'October to February. Avoid summer afternoons (the climb is exposed) and heavy monsoon (forest tracks become difficult). Mornings are best — wildlife is more active and the light favours the views.',
    goodToKnow: [
      'This is reserve forest. Wild animals are present, including sloth bears and leopards',
      'Entry requires registration at the forest office and a guide',
      'Carry water and snacks; nothing is sold inside the reserve',
      'Wear sturdy shoes; the trek is moderate but rocky',
      'Mobile signal is unreliable',
    ],
  },
  {
    slug: 'saru-maru-caves',
    name: 'Saru Maru Caves',
    distanceBadge: '~25 km',
    tags: ['Heritage', 'Buddhist'],
    category: 'Heritage',
    imageAlt:
      'The interior of a sandstone cave shelter at Saru Maru, with weathered orange and purple rock walls',
    heroSubhead: 'A 3rd-century BCE monastic complex where Emperor Ashoka left his name in stone.',
    cardDescription:
      'A 3rd-century BCE monastic complex with two Ashokan inscriptions — one mentioning Emperor Ashoka’s visit while still a prince.',
    quickFacts: [
      { label: 'Distance from Madhuban', value: '~25 km' },
      { label: 'Drive Time', value: '~45–60 min' },
      { label: 'Best Season', value: 'Nov – Feb' },
      { label: 'Type', value: 'Archaeological Site' },
    ],
    keyFacts: [
      { label: 'Era', value: '3rd century BCE (Mauryan)' },
      { label: 'Discovered', value: '1975–76, by ASI' },
      { label: 'Total rock shelters', value: '45 across 40 km' },
      { label: 'Ashokan inscriptions', value: '2 (in main cave)' },
      { label: 'Famous edict', value: 'Minor Rock Edict No. 1' },
      { label: 'Distance from Sanchi', value: '~120 km' },
    ],
    intro: [
      'Saru Maru is the kind of place that feels almost too quiet for what it is. The site, near Pangoraria village in Sehore district, is an early Buddhist monastic complex dating to the 3rd century BCE — roughly the time of Emperor Ashoka. Among the natural rock shelters and small stupas, archaeologists found two Brahmi inscriptions in the main cave. One is a version of Ashoka’s Minor Rock Edict No. 1. The other is a personal commemoration that says, in translation, that ‘Piyadasi’ — the name Ashoka used for himself — visited this place while still a prince, with his unwedded consort.',
      'That second inscription is rare. It suggests Ashoka came here as a young viceroy of the region, decades before he converted to Buddhism after the Kalinga war. Around the caves are Buddhist graffiti — swastikas, triratna, kalasa symbols — left by monks who lived in these shelters across several centuries. The full archaeological group, including 45 rock shelters spread across 40 km, was first surveyed only in 1975–76. It remains relatively unknown.',
    ],
    whatToSeeAndDo: [
      'The main cave with the two Ashokan inscriptions (ASI signage explains the text)',
      'Several small Buddhist stupas on the hillside',
      'Natural rock shelters used by monks',
      'Buddhist graffiti — abstract symbols carved into the rock surface',
      'Quiet countryside walks; this is rural Sehore at its most undeveloped',
    ],
    howToGetThere:
      'Approximately 25 km via Budhni. Drive time is around 45 minutes to 1 hour, with the last stretch on rougher rural roads. The site itself requires a short walk from where the road ends. A local guide is helpful — front desk can arrange one.',
    bestTimeToVisit:
      'November to February for cooler weather; the site has limited shade. Early to mid-morning is best for light and temperature.',
    goodToKnow: [
      'This is an unprotected/lightly-managed site; please don’t touch the inscriptions or paintings',
      'No facilities — carry water, snacks, and any supplies',
      'Combinable with Salkanpur in a single half-day trip',
      'Of more interest to history enthusiasts than casual visitors',
    ],
  },
  {
    slug: 'kathotiya-rock-paintings',
    name: 'Kathotiya Rock Paintings',
    distanceBadge: '~40 km',
    tags: ['Adventure', 'Tribal'],
    category: 'Adventure',
    imageAlt:
      'Trekkers descending a hill trail in the Kathotiya forest with the Vindhya hills in the distance',
    heroSubhead: '17,000-year-old rock art and a tribal-led ecotourism village.',
    cardDescription:
      'Prehistoric paintings believed to be 17,000+ years old, in a forested village run as a tribal-led ecotourism site. Trekking, rock climbing, and Bhil culture.',
    quickFacts: [
      { label: 'Distance from Madhuban', value: '~40 km' },
      { label: 'Drive Time', value: '~1 hr 15 min' },
      { label: 'Best Season', value: 'Oct – Mar' },
      { label: 'Type', value: 'Heritage & Eco-tourism' },
    ],
    keyFacts: [
      { label: 'Age of paintings', value: '~17,000–18,000 years' },
      { label: 'Discovered', value: '1975 by Shankar Tiwari' },
      { label: 'Documented painted sites', value: '~32' },
      { label: 'Style', value: 'Closely related to Bhimbetka' },
      { label: 'Community', value: 'Bhil and Bhilala tribes' },
      { label: 'Operated by', value: 'MP Ecotourism Board + village committee' },
    ],
    intro: [
      'Kathotiya is a small forested village about 20 km from Bhopal in the Sehore Forest Division, named for the bowl-shaped (katori) hills that surround it. The site holds prehistoric rock paintings believed to be 17,000–18,000 years old — first documented by archaeologist Shankar Tiwari in 1975 and stylistically related to those at Bhimbetka. Some have been studied by visiting researchers from Spain, but the site sees a fraction of Bhimbetka’s visitor traffic.',
      'What makes Kathotiya distinctive is that it’s run as a community ecotourism project by the Bhil and Bhilala tribal communities who live in the village, in partnership with the Madhya Pradesh Ecotourism Development Board. Day visitors can combine the rock paintings with a jungle trek, rock climbing or rappelling sessions, and an introduction to Bhil tribal art and architecture. There’s also a waterfall nearby that locals use as a picnic spot.',
    ],
    whatToSeeAndDo: [
      'Guided walk to the rock-painting shelters (around 32 documented sites in the area)',
      'Jungle trek through the surrounding forest',
      'Rock climbing and rappelling (operated by the village ecotourism committee)',
      'A village walkthrough — vernacular tribal architecture, handicrafts, basket and pottery making',
      'Optional bird-watching at nearby Jhiriya',
      'A small waterfall, seasonal',
    ],
    howToGetThere:
      'Approximately 40 km via the Bhopal–Bairagarh route. Drive time is around 1 hour 15 minutes. The last few kilometres are on forest roads. We recommend pre-booking a day package with the village ecotourism committee — front desk can help coordinate.',
    bestTimeToVisit:
      'October to March. The rock paintings are best seen in morning light. The waterfall has water primarily during and just after the monsoon (August to October).',
    goodToKnow: [
      'Day packages available (around ₹500–800 per person, including a meal)',
      'Overnight stays possible in tents or a treetop machaan, but Madhuban is more comfortable',
      'Bookings go through the village committee; revenue supports the local community directly',
      'Wear walking shoes and carry water',
    ],
  },
  {
    slug: 'kolar-dam',
    name: 'Kolar Dam',
    distanceBadge: '~50 km',
    tags: ['Nature', 'Picnic'],
    category: 'Adventure',
    imageAlt:
      'The full length of Kolar Dam stretching across the reservoir under a blue sky with green hills behind',
    heroSubhead: 'A quiet reservoir in the Vindhya foothills, surrounded by deciduous forest.',
    cardDescription:
      'A 45-metre dam on the Kolar river surrounded by forest. Boating, birdwatching, and a slow afternoon away from anywhere busy.',
    quickFacts: [
      { label: 'Distance from Madhuban', value: '~50 km' },
      { label: 'Drive Time', value: '~1 hr 30 min' },
      { label: 'Best Season', value: 'Nov – Apr' },
      { label: 'Type', value: 'Reservoir & Picnic Spot' },
    ],
    keyFacts: [
      { label: 'Built on', value: 'Kolar river (Narmada tributary)' },
      { label: 'Completed', value: '1990' },
      { label: 'Height', value: '45 m' },
      { label: 'Storage capacity', value: '265 MCM' },
      { label: 'Catchment area', value: '1,347 km²' },
      { label: 'Supplies', value: '~60% of Bhopal’s drinking water' },
    ],
    intro: [
      'Kolar Dam was completed in 1990 on the Kolar river — a tributary of the Narmada — and supplies about 60% of Bhopal’s drinking water. It also happens to be one of the more peaceful water bodies in the region, partly because it sits a little further from the city and the road in keeps the casual day-tripper crowd thin. Forty-five metres tall, water storage capacity around 265 million cubic metres, surrounded by tropical deciduous forest with no industrial activity in its catchment.',
      'For a guest at Madhuban, Kolar makes sense as a half-day outing rather than a destination in itself. Boating is available seasonally. Birdwatching is good — the catchment is largely undisturbed. The drive is part of the appeal: small villages, forest patches, glimpses of farmland. It’s the kind of place to bring a thermos and a book, or a camera, and not much of a plan.',
    ],
    whatToSeeAndDo: [
      'Boating (when operational; ask at the dam site)',
      'Birdwatching — kingfishers, herons, cormorants, raptors',
      'Sunset over the reservoir',
      'Nature photography',
      'A long, quiet walk along the embankment',
    ],
    howToGetThere:
      'Approximately 50 km. Drive time around 1 hour 30 minutes. The route runs through Sehore district and small forest patches. Roads are mostly fine but the final approach can be uneven, especially in or after the monsoon. Check with the front desk before setting out — local conditions change.',
    bestTimeToVisit:
      'November to April. The reservoir is full and scenic in October and November after the monsoon. Avoid peak summer (heat and lower water levels) and active monsoon (poor roads).',
    goodToKnow: [
      'No entry fee',
      'Limited food options at the dam — bring your own',
      'No accommodation on site',
      'The road across the dam was closed to four-wheelers as of mid-2025; verify locally',
      'Visit in a small group rather than alone — this is a remote stretch',
    ],
  },
  {
    slug: 'satpura-tiger-reserve',
    name: 'Satpura Tiger Reserve',
    distanceBadge: '~120 km',
    tags: ['Wildlife', 'Day Trip'],
    category: 'Wildlife',
    imageAlt:
      'A tiger walks down a forest road at the entrance to Satpura Tiger Reserve in early morning light',
    heroSubhead:
      "India’s most underrated tiger reserve — known for walking safaris and the Denwa river.",
    cardDescription:
      "India’s most underrated tiger reserve — known for walking safaris, canoeing on the Denwa, and wildlife you actually have time to look at.",
    quickFacts: [
      { label: 'Distance from Madhuban', value: '~120 km' },
      { label: 'Drive Time', value: '~3 hrs' },
      { label: 'Best Season', value: 'Oct 16 – Jun (core)' },
      { label: 'Type', value: 'Tiger & Biosphere Reserve' },
    ],
    keyFacts: [
      { label: 'Established', value: '1981' },
      { label: 'Total area', value: '1,427 km²' },
      { label: 'Status', value: 'Tiger reserve; first MP biosphere reserve' },
      { label: 'Bird species', value: '300+' },
      { label: 'Unique experiences', value: 'Walking safari, canoe, jeep' },
      { label: 'Main entry gate', value: 'Madhai (boat across Denwa)' },
    ],
    intro: [
      'Satpura is the wildlife reserve that serious naturalists in central India quietly recommend over its more crowded cousins. Spread over 1,427 sq km in the Satpura hills near Pachmarhi, it’s the first biosphere reserve of Madhya Pradesh and one of the few Indian tiger reserves where you can do walking safaris and canoeing alongside the standard jeep drives. Tiger sightings are less frequent than at Bandhavgarh or Kanha — but leopards, sloth bears, gaur, sambar, langurs, giant squirrels, and over 300 bird species are common, and the experience is far less rushed.',
      'The most popular entry is the Madhai gate, which you reach by crossing the Denwa river by boat — the reserve effectively starts on the far bank. From Madhuban, Satpura is the longest of the recommended day trips: roughly 120 km, and most visitors prefer to leave very early or stay overnight near the reserve. If you have a full day, or two, it’s worth the effort.',
    ],
    whatToSeeAndDo: [
      'Jeep safari from Madhai or Churna gate (book in advance through the forest department or a registered operator)',
      'Walking safari — rare in Indian tiger reserves, and one of Satpura’s best experiences',
      'Canoe safari on the Denwa backwaters, especially good for birds',
      'Boat ride across the Denwa to the Madhai gate',
      'Possibility of seeing tiger, leopard, sloth bear, dhole (wild dog), gaur',
    ],
    howToGetThere:
      'Approximately 120 km to the Madhai gate via Hoshangabad. Drive time is around 3 hours one way. Plan to leave by 5:30 AM if you want to make a morning safari and return the same day. For a more relaxed experience, stay overnight at one of the lodges near Madhai and return the next day. We can help with planning either route.',
    bestTimeToVisit:
      'October 16 to June for core-zone safaris (the core closes in the monsoon). Buffer zones operate year-round. November to February is ideal for weather and wildlife visibility.',
    goodToKnow: [
      'Safari permits are limited and need to be booked well in advance (60–120 days ahead during peak season)',
      'Carry warm layers in November–February — early mornings on the Denwa are cold',
      'ID is mandatory for safari entry',
      'Walking safaris are guided by trained naturalists and forest staff; safe but require basic fitness',
      'This is the only attraction on this list that genuinely needs an overnight or a very early start',
    ],
    geo: { lat: 22.5667, lng: 78.0833 },
  },
];

export function getAttractionBySlug(slug: string): Attraction | undefined {
  return ATTRACTIONS.find((a) => a.slug === slug);
}

export function getOtherAttractions(currentSlug: string, count = 3): Attraction[] {
  return ATTRACTIONS.filter((a) => a.slug !== currentSlug).slice(0, count);
}
