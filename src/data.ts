import { TVETCentre } from './types';

export const RAW_DATA: { [key: string]: { centre: string; location: string; coordinates: { lat: number; lon: number } }[] } = {
  "Ghana": [
    {
      "centre": "Don Bosco Technical Institute-Ashaiman",
      "location": "Accra",
      "coordinates": {
        "lat": 5.6037,
        "lon": -0.187
      }
    },
    {
      "centre": "Don Bosco Technical Institute-Sunyani Brong",
      "location": "Ahafo",
      "coordinates": {
        "lat": 7.0,
        "lon": -2.45
      }
    },
    {
      "centre": "Don Bosco Technical Institute/Centre",
      "location": "Tatale",
      "coordinates": {
        "lat": 9.3333,
        "lon": 0.05
      }
    }
  ],
  "Liberia": [
    {
      "centre": "Don Bosco Technical High School",
      "location": "Monrovia",
      "coordinates": {
        "lat": 6.3156,
        "lon": -10.8074
      }
    }
  ],
  "Ivory Coast": [
    {
      "centre": "l'institut de formation professionnelle don Bosco Duékoué (ex CPAR)",
      "location": "Duekoue",
      "coordinates": {
        "lat": 6.7431,
        "lon": -7.3496
      }
    }
  ],
  "Togo": [
    {
      "centre": "Don Bosco Technical Institute",
      "location": "Lomé",
      "coordinates": {
        "lat": 6.1375,
        "lon": 1.2125
      }
    }
  ],
  "Nigeria": [
    {
      "centre": "John Bosco Institute of Technology Ondo",
      "location": "Ondo",
      "coordinates": {
        "lat": 7.1,
        "lon": 4.8333
      }
    },
    {
      "centre": "John Bosco Institute of Technology Onitsha",
      "location": "Onitsha",
      "coordinates": {
        "lat": 6.1667,
        "lon": 6.7833
      }
    },
    {
      "centre": "Don Bosco Vocational Traininig Centre, Koko",
      "location": "Koko",
      "coordinates": {
        "lat": 6.0,
        "lon": 5.4667
      }
    },
    {
      "centre": "Don Bosco Stitches Iju",
      "location": "Lagos",
      "coordinates": {
        "lat": 6.5244,
        "lon": 3.3792
      }
    },
    {
      "centre": "John Bosco Institute of Technology Ijebu-Ode",
      "location": "Ogun",
      "coordinates": {
        "lat": 7.0,
        "lon": 3.5833
      }
    },
    {
      "centre": "John Bosco Institute of Technology Abuja",
      "location": "FCT Abuja",
      "coordinates": {
        "lat": 9.0579,
        "lon": 7.4951
      }
    },
    {
      "centre": "John Bosco Institute of Technology, Ogidi",
      "location": "Ogidi",
      "coordinates": {
        "lat": 6.15,
        "lon": 6.8667
      }
    }
  ],
  "Ethiopia": [
    {
      "centre": "Mekanissa TVET College",
      "location": "Addis Ababa",
      "coordinates": {
        "lat": 9.03,
        "lon": 38.74
      }
    },
    {
      "centre": "Don Bosco Children Technical Institute",
      "location": "Addis Ababa",
      "coordinates": {
        "lat": 9.03,
        "lon": 38.74
      }
    },
    {
      "centre": "Mekelle Poly Technic College",
      "location": "Mekelle",
      "coordinates": {
        "lat": 13.4967,
        "lon": 39.4753
      }
    },
    {
      "centre": "Adwa TVET College",
      "location": "Adwa",
      "coordinates": {
        "lat": 14.1667,
        "lon": 38.9
      }
    },
    {
      "centre": "Dilla Technical Institute",
      "location": "Dilla",
      "coordinates": {
        "lat": 6.4,
        "lon": 38.3167
      }
    },
    {
      "centre": "Gambella TVET College",
      "location": "Gambella",
      "coordinates": {
        "lat": 8.25,
        "lon": 34.5833
      }
    }
  ],
  "Sudan": [
    {
      "centre": "Don Bosco Vocational Training Centre",
      "location": "EL Obeid",
      "coordinates": {
        "lat": 13.1833,
        "lon": 30.2167
      }
    },
    {
      "centre": "Saint Joseph's Vocational Training Centre",
      "location": "Khartoum",
      "coordinates": {
        "lat": 15.5007,
        "lon": 32.5599
      }
    }
  ],
  "South Sudan": [
    {
      "centre": "Don Bosco Vocational Training Centre Gumbo",
      "location": "Juba",
      "coordinates": {
        "lat": 4.8594,
        "lon": 31.5713
      }
    },
    {
      "centre": "Don Bosco Vocational Training Centre Wau",
      "location": "Wau",
      "coordinates": {
        "lat": 7.7,
        "lon": 28.0
      }
    }
  ],
  "Kenya": [
    {
      "centre": "Don Bosco Technical School Kakuma",
      "location": "Kakuma",
      "coordinates": {
        "lat": 3.7167,
        "lon": 34.8667
      }
    },
    {
      "centre": "Don Bosco Technical School - Makuyu",
      "location": "Makuyu",
      "coordinates": {
        "lat": -0.8,
        "lon": 37.1833
      }
    },
    {
      "centre": "Don Bosco Technical School Embu",
      "location": "Embu",
      "coordinates": {
        "lat": -0.5333,
        "lon": 37.45
      }
    },
    {
      "centre": "Don Bosco Technical School-Marsabit",
      "location": "Marsabit",
      "coordinates": {
        "lat": 2.3333,
        "lon": 37.9833
      }
    },
    {
      "centre": "Don Bosco Boys Town Technical Institute",
      "location": "Nairobi",
      "coordinates": {
        "lat": -1.2921,
        "lon": 36.8219
      }
    }
  ],
  "Tanzania": [
    {
      "centre": "Don Bosco Vocation Training Centre Oysterbay",
      "location": "Dar Es Salaam",
      "coordinates": {
        "lat": -6.7924,
        "lon": 39.2083
      }
    },
    {
      "centre": "Don Bosco Youth Training Centre",
      "location": "Iringa",
      "coordinates": {
        "lat": -7.7667,
        "lon": 35.7
      }
    },
    {
      "centre": "Don Bosco Technical Institute",
      "location": "Dodoma",
      "coordinates": {
        "lat": -6.1722,
        "lon": 35.7395
      }
    },
    {
      "centre": "KIITEC-ARUSHA",
      "location": "Arusha",
      "coordinates": {
        "lat": -3.3667,
        "lon": 36.6833
      }
    }
  ],
  "South Africa": [
    {
      "centre": "Don Bosco Educational Projects",
      "location": "Ennerdale",
      "coordinates": {
        "lat": -26.4167,
        "lon": 27.8333
      }
    },
    {
      "centre": "Salesian Institute Youth Projects",
      "location": "Cape Town",
      "coordinates": {
        "lat": -33.9249,
        "lon": 18.4241
      }
    }
  ],
  "Eswatini": [
    {
      "centre": "Bosco Youth Agricultural Centre",
      "location": "Manzini",
      "coordinates": {
        "lat": -26.5,
        "lon": 31.3667
      }
    }
  ],
  "Rwanda": [
    {
      "centre": "Don Bosco Technical School Gatenga",
      "location": "Kigali",
      "coordinates": {
        "lat": -1.9441,
        "lon": 30.0619
      }
    },
    {
      "centre": "Don Bosco TVET Centre-Rango",
      "location": "Huye",
      "coordinates": {
        "lat": -2.6,
        "lon": 29.75
      }
    },
    {
      "centre": "Don Bosco TVET Centre-Muhazi",
      "location": "Kigali",
      "coordinates": {
        "lat": -1.9441,
        "lon": 30.0619
      }
    }
  ],
  "Uganda": [
    {
      "centre": "Saint Joseph TVET Centre- Kamuli",
      "location": "Kamuli",
      "coordinates": {
        "lat": 0.9456,
        "lon": 33.1197
      }
    },
    {
      "centre": "Don Bosco TVET Centre-Bombo",
      "location": "Bombo",
      "coordinates": {
        "lat": 0.5833,
        "lon": 32.5333
      }
    },
    {
      "centre": "Don Bosco TVET centre- Palabek",
      "location": "Lamwo",
      "coordinates": {
        "lat": 3.5333,
        "lon": 32.8
      }
    }
  ],
  "Burundi": [
    {
      "centre": "Don Bosco TVET Centre-Buterere",
      "location": "Bujumbura",
      "coordinates": {
        "lat": -3.3822,
        "lon": 29.3644
      }
    },
    {
      "centre": "Don Bosco TVET centre- Rukago",
      "location": "Kayanza",
      "coordinates": {
        "lat": -2.9167,
        "lon": 29.6333
      }
    }
  ],
  "Zimbabwe": [
    {
      "centre": "Don Bosco Technical College",
      "location": "Hwange",
      "coordinates": {
        "lat": -18.3667,
        "lon": 26.5
      }
    },
    {
      "centre": "Don Bosco Technical Secondary School",
      "location": "Hwange",
      "coordinates": {
        "lat": -18.3667,
        "lon": 26.5
      }
    }
  ],
  "Malawi": [
    {
      "centre": "Don Bosco Youth Technical Institute",
      "location": "Lilongwe",
      "coordinates": {
        "lat": -13.9833,
        "lon": 33.7833
      }
    }
  ],
  "Zambia": [
    {
      "centre": "Don Bosco Tech Seondary School",
      "location": "Mansa",
      "coordinates": {
        "lat": -11.2,
        "lon": 28.8833
      }
    },
    {
      "centre": "Don Bosco Agriculture College",
      "location": "Lufubu",
      "coordinates": {
        "lat": -10.5167,
        "lon": 29.35
      }
    },
    {
      "centre": "Don Bosco Carpentry School",
      "location": "Kazembe",
      "coordinates": {
        "lat": -9.8333,
        "lon": 28.75
      }
    },
    {
      "centre": "Don Bosco Technical College and Secondary School",
      "location": "Chingola",
      "coordinates": {
        "lat": -12.5333,
        "lon": 27.85
      }
    },
    {
      "centre": "Don Bosco Skills Centre (Kabwe)",
      "location": "Makululu",
      "coordinates": {
        "lat": -14.4333,
        "lon": 28.45
      }
    }
  ],
  "Congo-Brazzaville": [
    {
      "centre": "Centre de formation professionnelle Don Bosco Masengo",
      "location": "Massengo",
      "coordinates": {
        "lat": -4.2167,
        "lon": 15.25
      }
    },
    {
      "centre": "Centre de formation professionnelle Don Bosco Pointe Noire",
      "location": "Pointe noire",
      "coordinates": {
        "lat": -4.7692,
        "lon": 11.8664
      }
    }
  ],
  "Democratic R. Congo": [
    {
      "centre": "Centre de Formation Professionnelle Don Bosco-Lukunga",
      "location": "Kinshasa",
      "coordinates": {
        "lat": -4.4419,
        "lon": 15.2663
      }
    },
    {
      "centre": "Collège technique Don Bosco Masina",
      "location": "Kinshasa",
      "coordinates": {
        "lat": -4.4419,
        "lon": 15.2663
      }
    },
    {
      "centre": "École de formation professionnelle Don Bosco Masina",
      "location": "Kinshasa",
      "coordinates": {
        "lat": -4.4419,
        "lon": 15.2663
      }
    },
    {
      "centre": "Institut de la Gombe 2 - Don Bosco",
      "location": "Kinshasa",
      "coordinates": {
        "lat": -4.4419,
        "lon": 15.2663
      }
    },
    {
      "centre": "Centre de la Formation Professionnelle Mwetu Don Bosco",
      "location": "Mbuji-Mayi",
      "coordinates": {
        "lat": -6.15,
        "lon": 23.6
      }
    },
    {
      "centre": "Ecole technique et professionnelle Maman Olive Lembe",
      "location": "Tshikapa",
      "coordinates": {
        "lat": -6.4167,
        "lon": 20.8
      }
    },
    {
      "centre": "Institut technique industriel et professionnel MOLK",
      "location": "Tshikapa",
      "coordinates": {
        "lat": -6.4167,
        "lon": 20.8
      }
    },
    {
      "centre": "Centre de Formation Professionnelle NDERERE",
      "location": "Bukavu",
      "coordinates": {
        "lat": -2.5,
        "lon": 28.8667
      }
    },
    {
      "centre": "Centre de la formation professionnelle Gangi",
      "location": "Goma",
      "coordinates": {
        "lat": -1.6585,
        "lon": 29.2205
      }
    },
    {
      "centre": "Institut Tecnique Don Bosco Ngangi",
      "location": "Goma",
      "coordinates": {
        "lat": -1.6585,
        "lon": 29.2205
      }
    },
    {
      "centre": "CFp FOYER MARGUERITE",
      "location": "Goma",
      "coordinates": {
        "lat": -1.6585,
        "lon": 29.2205
      }
    },
    {
      "centre": "Institut Technique Industriel de Goma (ITIG)",
      "location": "Goma",
      "coordinates": {
        "lat": -1.6585,
        "lon": 29.2205
      }
    },
    {
      "centre": "Institut Technique Don Bosco de Lubuye Kalemie",
      "location": "Kalemie",
      "coordinates": {
        "lat": -5.9333,
        "lon": 29.1833
      }
    },
    {
      "centre": "Centre de la formation professionnelle Cite des Jeunes Kasenga",
      "location": "Kasenga",
      "coordinates": {
        "lat": -10.3667,
        "lon": 28.6333
      }
    },
    {
      "centre": "Centre de Formation Professionnelle Artisanale Magone",
      "location": "Lubumbashi",
      "coordinates": {
        "lat": -11.6609,
        "lon": 27.4794
      }
    },
    {
      "centre": "Centre de la Formation Professionnelle Jacaranda",
      "location": "Lubumbashi",
      "coordinates": {
        "lat": -11.6609,
        "lon": 27.4794
      }
    },
    {
      "centre": "Centre de la Formation Professionnelle agricole Chem-Chem",
      "location": "Lubumbashi",
      "coordinates": {
        "lat": -11.6609,
        "lon": 27.4794
      }
    },
    {
      "centre": "Centre de la Formation Professionnelle Maison des Jeunes",
      "location": "Lubumbashi",
      "coordinates": {
        "lat": -11.6609,
        "lon": 27.4794
      }
    },
    {
      "centre": "Institut Technique Salama",
      "location": "Lubumbashi",
      "coordinates": {
        "lat": -11.6609,
        "lon": 27.4794
      }
    },
    {
      "centre": "Centre de la formation professionnelle Cite des Jeunes",
      "location": "Lubumbashi",
      "coordinates": {
        "lat": -11.6609,
        "lon": 27.4794
      }
    },
    {
      "centre": "Centre de Formation Professionnelle DON BOSCO YAKADAKA",
      "location": "Nyakadaka",
      "coordinates": {
        "lat": -2.4833,
        "lon": 28.85
      }
    },
    {
      "centre": "Centre de formation professionnelle DON BOSCO LAC",
      "location": "Goma",
      "coordinates": {
        "lat": -1.6585,
        "lon": 29.2205
      }
    },
    {
      "centre": "Centre de la Formation Professionnelle Saint Domnique Savio",
      "location": "Uvira",
      "coordinates": {
        "lat": -3.4,
        "lon": 29.1333
      }
    },
    {
      "centre": "Institut technique SAKANYA",
      "location": "SAKANYA",
      "coordinates": {
        "lat": -12.75,
        "lon": 28.5667
      }
    }
  ],
  "Benin": [
    {
      "centre": "College Prive d'Enseignement Technique Don Bosco (CPET)",
      "location": "Parakou",
      "coordinates": {
        "lat": 9.3333,
        "lon": 2.6167
      }
    },
    {
      "centre": "Ecole Professionnelle Salesienne Saint Jean Bosco (EPS)",
      "location": "Cotonou",
      "coordinates": {
        "lat": 6.3654,
        "lon": 2.4183
      }
    },
    {
      "centre": "Centre artisanal Garelli",
      "location": "Porto Novo",
      "coordinates": {
        "lat": 6.4969,
        "lon": 2.6283
      }
    },
    {
      "centre": "Maman Marguerite Cotonou",
      "location": "Cotonou",
      "coordinates": {
        "lat": 6.3654,
        "lon": 2.4183
      }
    }
  ],
  "Mali": [
    {
      "centre": "Centre Saint Jean Bosco de Sikasso",
      "location": "Sikasso",
      "coordinates": {
        "lat": 11.3167,
        "lon": -5.6667
      }
    },
    {
      "centre": "Centre Pere Michel de Bamako",
      "location": "Bamako",
      "coordinates": {
        "lat": 12.6392,
        "lon": -8.0029
      }
    },
    {
      "centre": "Complexe scolaire Saint Jean Bosco",
      "location": "Touba",
      "coordinates": {
        "lat": 13.0833,
        "lon": -6.45
      }
    }
  ],
  "Senegal": [
    {
      "centre": "Centre Socio Educatif Keur Don Bosco Nord Foire Dakar",
      "location": "Dakar",
      "coordinates": {
        "lat": 14.7167,
        "lon": -17.4677
      }
    },
    {
      "centre": "Centre de Formation Professionnelle et Technique Don Bosco Medinafall",
      "location": "Thies",
      "coordinates": {
        "lat": 14.7833,
        "lon": -16.9333
      }
    },
    {
      "centre": "Centre de Formation Professionnelle  Don Bosco  Tamba",
      "location": "Tambacounda",
      "coordinates": {
        "lat": 13.7667,
        "lon": -13.6667
      }
    }
  ],
  "Guinea Conackry": [
    {
      "centre": "Centre de Don Bosco de Siguiri",
      "location": "Siguiry",
      "coordinates": {
        "lat": 11.4167,
        "lon": -9.1667
      }
    },
    {
      "centre": "Centre de Formation Professionnelle de Don Bosco Kankan",
      "location": "Kankan",
      "coordinates": {
        "lat": 10.3833,
        "lon": -9.3
      }
    }
  ],
  "Burkina Faso": [
    {
      "centre": "Centre Socio Culturel Don Bosco -Ouagadougou",
      "location": "Ouagadougou",
      "coordinates": {
        "lat": 12.3714,
        "lon": -1.5197
      }
    },
    {
      "centre": "Centre Prive de Formation Professionnelle Don Bosco Bobo- Dioulasso",
      "location": "Bobo-Dioulasso",
      "coordinates": {
        "lat": 11.1833,
        "lon": -4.3
      }
    }
  ],
  "Cameroon": [
    {
      "centre": "Institut Technique de Don Bosco",
      "location": "Ebolowa",
      "coordinates": {
        "lat": 2.9167,
        "lon": 11.15
      }
    },
    {
      "centre": "Centre de Fomation Professionnelle",
      "location": "Yaounde",
      "coordinates": {
        "lat": 3.848,
        "lon": 11.5021
      }
    }
  ],
  "Chad": [
    {
      "centre": "Ecole Professionnelle de Don Bosco N'Djamena",
      "location": "N'Djamena",
      "coordinates": {
        "lat": 12.1348,
        "lon": 15.0557
      }
    },
    {
      "centre": "Complexe Agro-Sylvio Pastoral Don Bosco de Mandelia",
      "location": "N'Djamena",
      "coordinates": {
        "lat": 12.1348,
        "lon": 15.0557
      }
    },
    {
      "centre": "Centre Professionnel Don Bosco Doba",
      "location": "Doba",
      "coordinates": {
        "lat": 8.7333,
        "lon": 16.85
      }
    }
  ],
  "Central Africa": [
    {
      "centre": "Centre de Formation Professionnelle de Don Bosco",
      "location": "Bangui",
      "coordinates": {
        "lat": 4.3947,
        "lon": 18.5582
      }
    }
  ],
  "Equatorial Guinea": [
    {
      "centre": "Centro Profesional Don Bosco",
      "location": "Malabo",
      "coordinates": {
        "lat": 3.75,
        "lon": 8.7833
      }
    }
  ],
  "Madagascar": [
    {
      "centre": "Centre de Formation Professionnelle Don Bosco Antanimasaja",
      "location": "Mahajanga",
      "coordinates": {
        "lat": -15.7167,
        "lon": 46.3167
      }
    },
    {
      "centre": "Centre de Notre Dame de Claivaux",
      "location": "Antananarivo",
      "coordinates": {
        "lat": -18.8792,
        "lon": 47.5079
      }
    },
    {
      "centre": "Centre de Formation au Travail de Don Bosco",
      "location": "Fianarantsoa",
      "coordinates": {
        "lat": -21.4333,
        "lon": 47.0833
      }
    },
    {
      "centre": "Centre de Formation Professionnelle Don Bosco",
      "location": "Tuléar",
      "coordinates": {
        "lat": -23.35,
        "lon": 43.6667
      }
    }
  ],
  "Mauritius": [
    {
      "centre": "College Technique Saint Gabriel",
      "location": "Port Louis",
      "coordinates": {
        "lat": -20.1609,
        "lon": 57.5012
      }
    }
  ],
  "Mozambique": [
    {
      "centre": "Instituto Médio Salesiano de Inharrime",
      "location": "Inharrime",
      "coordinates": {
        "lat": -24.4833,
        "lon": 35.0333
      }
    },
    {
      "centre": "Centro de Formacao Profissional São José de Lhangene",
      "location": "Maputo",
      "coordinates": {
        "lat": -25.9692,
        "lon": 32.5732
      }
    },
    {
      "centre": "Instituto Médio Dom Bosco-Matundo",
      "location": "Matundo",
      "coordinates": {
        "lat": -16.1333,
        "lon": 33.6
      }
    },
    {
      "centre": "Centro  de Formacão Profissional Salesianos-Matola",
      "location": "Matola",
      "coordinates": {
        "lat": -25.9667,
        "lon": 32.4667
      }
    },
    {
      "centre": "Instituto Superior Dom Bosco",
      "location": "Maputo",
      "coordinates": {
        "lat": -25.9692,
        "lon": 32.5732
      }
    },
    {
      "centre": "Instituto Médio São José de Lhanguene",
      "location": "Maputo",
      "coordinates": {
        "lat": -25.9692,
        "lon": 32.5732
      }
    }
  ],
  "Angola": [
    {
      "centre": "Centro de Formação Profissional Dom Bosco Benguela",
      "location": "Benguela",
      "coordinates": {
        "lat": -12.5833,
        "lon": 13.4167
      }
    },
    {
      "centre": "Centro de Formação Profissional Dom Bosco do Dondo",
      "location": "Kwanza Norte",
      "coordinates": {
        "lat": -9.0,
        "lon": 15.0
      }
    },
    {
      "centre": "Centro de Formação Profissional Dom Bosco Sambizanga (Mabubas)",
      "location": "Luanda",
      "coordinates": {
        "lat": -8.839,
        "lon": 13.2894
      }
    },
    {
      "centre": "Centro de Formação Profissional Mamã Muxima Catete",
      "location": "Luanda",
      "coordinates": {
        "lat": -8.839,
        "lon": 13.2894
      }
    },
    {
      "centre": "Centro de Formação Profissional Dom Bosco Cabinda",
      "location": "Cabinda",
      "coordinates": {
        "lat": -5.55,
        "lon": 12.2
      }
    },
    {
      "centre": "Centro de Formação Profissional Dom Bosco Huambo",
      "location": "Huambo",
      "coordinates": {
        "lat": -12.7761,
        "lon": 15.7392
      }
    },
    {
      "centre": "Centro de Formação Profissional Dom Bosco de Lwena",
      "location": "Lwena",
      "coordinates": {
        "lat": -11.7833,
        "lon": 19.9167
      }
    },
    {
      "centre": "Don Bosco Youth Centre",
      "location": "Kwanza Sul",
      "coordinates": {
        "lat": -11.0,
        "lon": 14.5
      }
    }
  ],
  "Namibia": [
    {
      "centre": "Don Bosco Youth Centre",
      "location": "Rundu, Kavango East Region",
      "coordinates": {
        "lat": -17.9167,
        "lon": 19.7667
      }
    }
  ]
};

// Map each country name to an active sub-region
export const COUNTRY_REGIONS: { [key: string]: string } = {
  "Ghana": "West Africa",
  "Liberia": "West Africa",
  "Ivory Coast": "West Africa",
  "Togo": "West Africa",
  "Nigeria": "West Africa",
  "Benin": "West Africa",
  "Mali": "West Africa",
  "Senegal": "West Africa",
  "Guinea Conackry": "West Africa",
  "Burkina Faso": "West Africa",
  "Ethiopia": "East Africa",
  "Sudan": "East Africa",
  "South Sudan": "East Africa",
  "Kenya": "East Africa",
  "Tanzania": "East Africa",
  "Rwanda": "East Africa",
  "Uganda": "East Africa",
  "Burundi": "East Africa",
  "Congo-Brazzaville": "Central Africa",
  "Democratic R. Congo": "Central Africa",
  "Cameroon": "Central Africa",
  "Chad": "Central Africa",
  "Central Africa": "Central Africa",
  "Equatorial Guinea": "Central Africa",
  "South Africa": "Southern Africa",
  "Eswatini": "Southern Africa",
  "Zimbabwe": "Southern Africa",
  "Malawi": "Southern Africa",
  "Zambia": "Southern Africa",
  "Madagascar": "Southern Africa",
  "Mauritius": "Southern Africa",
  "Mozambique": "Southern Africa",
  "Angola": "Southern Africa",
  "Namibia": "Southern Africa"
};

// Create list of all centres with country and region attached
export const ALL_CENTRES: TVETCentre[] = Object.keys(RAW_DATA).reduce((acc: TVETCentre[], country: string) => {
  const centres = RAW_DATA[country].map(centre => ({
    ...centre,
    country
  }));
  return [...acc, ...centres];
}, []);

// Colors mapped to regions for consistent aesthetic differentiation
export const REGION_COLORS: { [key: string]: { border: string; bg: string; text: string; dot: string } } = {
  "West Africa": {
    border: "border-teal-500/20",
    bg: "bg-teal-950/20",
    text: "text-teal-400",
    dot: "bg-teal-400"
  },
  "East Africa": {
    border: "border-sky-500/20",
    bg: "bg-sky-950/20",
    text: "text-sky-400",
    dot: "bg-sky-400"
  },
  "Central Africa": {
    border: "border-indigo-500/20",
    bg: "bg-indigo-950/20",
    text: "text-indigo-400",
    dot: "bg-indigo-400"
  },
  "Southern Africa": {
    border: "border-amber-500/20",
    bg: "bg-amber-950/20",
    text: "text-amber-400",
    dot: "bg-amber-400"
  }
};
