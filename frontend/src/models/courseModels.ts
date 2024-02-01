export interface CourseInfo {
    _id: string;

    name: string,
    subject: string,
    number: string,
    title: string,
    
    instructor: Instructor;
    syllabus: Syllabus;
}

export interface createCourseInfo {
    user_id: string,
    subject: string,
    number: string,
    title: string,
    syllabus: string
}

export interface setCourseInfo {
    subject?: string,
    number?: string,
    title?: string,
    syllabus?: string
}


export interface courseQuery {
    name?: string,
    subject?: string,
    number?: string,
    title?: string,
}

export enum subjectToCode {
    "Computer Science" = "COMPSCI",
    "College of Inform and Comp Sci" = "CICS",
    "Informatics" = "INFO"
}

export enum codeToSubject {
    "COMPSCI" = "Computer Science",
    "CICS" = "College of Inform and Comp Sci",
    "INFO" = "Informatics"
}

/*export enum subjectToCode {
    "Accounting" = "ACCOUNTG",
    "Aerospace Studies" = "AEROSPAC",
    "Afro-American Studies" = "AFROAM",
    "Animal Science" = "ANIMLSCI",
    "Anthropology" = "ANTHRO",
    "Arabic" = "ARABIC",
    "Architecture" = "ARCH",
    "Art" = "ART",
    "Art - Student Teaching" = "ART-ED",
    "Art History" = "ART-HIST",
    "Arts Extension" = "ARTS-EXT",
    "Asian Studies" = "ASIAN-ST",
    "Astronomy" = "ASTRON",
    "Bachelors Deg. W/Indiv Conc." = "BDIC",
    "Biochemistry and Molecular Bio." = "BIOCHEM",
    "Biology" = "BIOLOGY",
    "Biomedical Engineering" = "BMED-ENG",
    "Biostatistics" = "BIOSTATS",
    "Biostats and Epidemiology" = "BIOST&EP",
    "Biotechnology" = "BIOTECH",
    "Building and Construction Tech" = "BCT",
    "Catalan" = "CATALAN",
    "Chemical Engineering" = "CHEM-ENG",
    "Chemistry" = "CHEM",
    "Chinese" = "CHINESE",
    "Civil and Environmental Engrg" = "CE-ENGIN",
    "Classics" = "CLASSICS",
    "College of Inform and Comp Sci" = "CICS",
    "Communication" = "COMM",
    "Communication Disorders" = "COMM-DIS",
    "Community Health" = "COM-HLTH",
    "Comparative Literature" = "COMP-LIT",
    "Computer Science" = "COMPSCI",
    "Dance" = "DANCE",
    "Danish" = "DANISH",
    "Data Analytics and Computation" = "DACSS",
    "Dutch" = "DUTCH",
    "Economics" = "ECON",
    "Education" = "EDUC",
    "Electrical and Computer Engin" = "E&C-ENG",
    "Engineering" = "ENGIN",
    "English" = "ENGLISH",
    "English Writing Program" = "ENGLWRIT",
    "English as a Second Language" = "ESL",
    "Entomology" = "ENTOMOL",
    "Environmental Conservation" = "ECO",
    "Environmental Design" = "ENVIRDES",
    "Environmental Health Sciences" = "EHS",
    "Environmental Science" = "ENVIRSCI",
    "Epidemiology" = "EPI",
    "Exchange" = "EXCHANGE",
    "Faculty First Year Seminars" = "FFYS",
    "Film Studies" = "FILM-ST",
    "Finance" = "FINANCE",
    "Finance and Operations Mgt" = "FINOPMGT",
    "Finnish" = "FINNISH",
    "First Year Seminar" = "FYS",
    "Five Coll Ctr: World Languages" = "FORLANGC",
    "Food Science" = "FOOD-SCI",
    "French Studies" = "FRENCHST",
    "French-Student Teaching" = "FRENCHED",
    "Geography" = "GEOGRAPH",
    "Geology" = "GEOLOGY",
    "Geosciences" = "GEO-SCI",
    "German" = "GERMAN",
    "Graduate School" = "GRADSCH",
    "Greek" = "GREEK",
    "Haitian Creole" = "HAITCREO",
    "Health Promotion and Policy" = "HPP",
    "Hebrew" = "HEBREW",
    "Heritage Studies" = "HERIT",
    "Hispanic Lit. and Linguistics" = "HISPAN",
    "History" = "HISTORY",
    "Honors College" = "HONORS",
    "Hospitality and Tourism Managmnt" = "HT-MGT",
    "Human Development" = "HUMANDEV",
    "Humanities and Fine Arts" = "HM&FNART",
    "ICons" = "ICONS",
    "Informatics" = "INFO",
    "Information Security" = "INFOSEC",
    "Isenberg School of Management" = "SCH-MGMT",
    "Italian Studies" = "ITALIAN",
    "Italian-Student Teaching" = "ITALIAED",
    "Japanese" = "JAPANESE",
    "Journalism" = "JOURNAL",
    "Judaic Studies" = "JUDAIC",
    "Kinesiology" = "KIN",
    "Korean" = "KOREAN",
    "LL: Acting" = "LLACTING",
    "LL: Art and Photography" = "LLART",
    "LL: Arts Management" = "LLAMS",
    "LL: Business and Financial Plan" = "LLBUS",
    "LL: Career and Personal Develpmt" = "LLCAR",
    "LL: Computers" = "LLCOM",
    "LL: Donahue Leadership Prog" = "LLLEAD",
    "LL: English as a 2nd Language" = "LLESL",
    "LL: Food and Drink" = "LLFOOD",
    "LL: Global Asset and Risk Mgmt" = "LLINGARM",
    "LL: Health and Fitness" = "LLHEA",
    "LL: Intensive English Program" = "LLIEP",
    "LL: Languages" = "LLLAN",
    "LL: License Renewal" = "LLLCR",
    "LL: Music" = "LLMUS",
    "LL: Parks and Conservation Law" = "LLPARKS",
    "LL: Personal Awareness" = "LLPER",
    "LL: Real Estate" = "LLREA",
    "LL: Soils/Plants/Insects" = "LLPLSOIL",
    "LL: Special Interest" = "LLSPEC",
    "LL: Sports, Recrtn and Outdoors" = "LLSR&O",
    "LL: Study Skills and Test Taking" = "LLSTU",
    "LL: Summer College" = "LLSC",
    "LL: Sustainability/Green" = "LLGREEN",
    "LL: Training" = "LLTRAIN",
    "LL: Wind Energy" = "LLWIND",
    "LL: Wood Identification" = "LLWOOD",
    "LL: Writing, Literature andDrama" = "LLWRI",
    "LL: Yestermorrow Program" = "LLARCH",
    "Labor Studies" = "LABOR",
    "Landscape Architecture" = "LANDARCH",
    "Landscape Contracting" = "LANDCONT",
    "Languages, Literature and Culture" = "LLC",
    "Latin" = "LATIN",
    "Latin American Studies" = "LATIN-AM",
    "Latin-Student Teaching" = "LATIN-ED",
    "Legal Studies" = "LEGAL",
    "Linguistics" = "LINGUIST",
    "Management" = "MANAGMNT",
    "Marketing" = "MARKETNG",
    "Materials Science and Engineer" = "MS-ENG",
    "Mathematics" = "MATH",
    "Mechanical and Industrial Engrg" = "M&I-ENG",
    "Microbiology" = "MICROBIO",
    "Middle Eastern Studies" = "MIDEAST",
    "Military Leadership" = "MILITARY",
    "Modern European Studies" = "EURO",
    "Molecular and Cellular Biology" = "MOLCLBIO",
    "Music" = "MUSIC",
    "Music Education" = "MUSIC-ED",
    "Music, Applied" = "MUSICAPP",
    "National Student Exchange" = "NEXCHNG",
    "Natural Resources Conservation" = "NRC",
    "Natural Sciences" = "NATSCI",
    "Neuroscience and Behavior" = "NEUROS&B",
    "Nursing" = "NURSING",
    "Nutrition" = "NUTRITN",
    "Operations and Info Management" = "OIM",
    "Organismic and Evolutionary Biol" = "ORG&EVBI",
    "Philosophy" = "PHIL",
    "Physics" = "PHYSICS",
    "Plant Biology" = "PLANTBIO",
    "Polish" = "POLISH",
    "Political Science" = "POLISCI",
    "Polymer Science and Engineering" = "POLYMER",
    "Portuguese" = "PORTUG",
    "Portuguese-Student Teaching" = "PORTUGED",
    "Psychological and Brain Sciences" = "PSYCH",
    "Public Health" = "PUBHLTH",
    "Public Policy and Administration" = "PUBP&ADM",
    "Regional Planning" = "REGIONPL",
    "Resource Economics" = "RES-ECON",
    "Romanian" = "ROMANIA",
    "Russian" = "RUSSIAN",
    "Scandinavian" = "SCANDIN",
    "School Psychology" = "SCHPSYCH",
    "School of Pub Hlth and Hlth Sci" = "SPHHS",
    "School of Public Policy" = "SPP",
    "Service Learning" = "SRVCLRNG",
    "Slavic" = "SLAVIC",
    "Slavic and E European Studies" = "SEESTU",
    "Social and Behavioral Science" = "SOCBEHAV",
    "Social Thought and Polic. Econ" = "STPEC",
    "Sociology" = "SOCIOL",
    "Spanish" = "SPANISH",
    "Spanish - Student Teaching" = "SPANI-ED",
    "Speech, Language,and Hearing Sci" = "SLHS",
    "Sport Management" = "SPORTMGT",
    "Statistics" = "STATISTC",
    "Stockbridge Sch of Agriculture" = "STOCKSCH",
    "Sustainable Community" = "SUSTCOMM",
    "Swedish" = "SWEDISH",
    "Theater" = "THEATER",
    "Transfer Practicum" = "PRACT",
    "UMass Graduate Course Exchange" = "UMA-XCHG",
    "UMass Practicum" = "UMASS",
    "Univ Interdepartmental Course" = "UNIVRSTY",
    "University Without Walls" = "UWW",
    "Wellness" = "WELLNESS",
    "Women, Gender, Sexuality Studies" = "WGSS",
    "Worcester Nursing Program" = "WSTNURSE",
    "Yiddish" = "YIDDISH",
    "Zero Credit Test Equiv" = "ZEROCRED",
  } */
  
/* export enum codeToSubject {
    "ACCOUNTG" = "Accounting",
    "AEROSPAC" = "Aerospace Studies",
    "AFROAM" = "Afro-American Studies",
    "ANIMLSCI" = "Animal Science",
    "ANTHRO" = "Anthropology",
    "ARABIC" = "Arabic",
    "ARCH" = "Architecture",
    "ART" = "Art",
    "ART-ED" = "Art - Student Teaching",
    "ART-HIST" = "Art History",
    "ARTS-EXT" = "Arts Extension",
    "ASIAN-ST" = "Asian Studies",
    "ASTRON" = "Astronomy",
    "BDIC" = "Bachelors Deg. W/Indiv Conc.",
    "BIOCHEM" = "Biochemistry and Molecular Bio.",
    "BIOLOGY" = "Biology",
    "BMED-ENG" = "Biomedical Engineering",
    "BIOSTATS" = "Biostatistics",
    "BIOST&EP" = "Biostats and Epidemiology",
    "BIOTECH" = "Biotechnology",
    "BCT" = "Building and Construction Tech",
    "CATALAN" = "Catalan",
    "CHEM-ENG" = "Chemical Engineering",
    "CHEM" = "Chemistry",
    "CHINESE" = "Chinese",
    "CE-ENGIN" = "Civil and Environmental Engrg",
    "CLASSICS" = "Classics",
    "CICS" = "College of Inform and Comp Sci",
    "COMM" = "Communication",
    "COMM-DIS" = "Communication Disorders",
    "COM-HLTH" = "Community Health",
    "COMP-LIT" = "Comparative Literature",
    "COMPSCI" = "Computer Science",
    "DANCE" = "Dance",
    "DANISH" = "Danish",
    "DACSS" = "Data Analytics and Computation",
    "DUTCH" = "Dutch",
    "ECON" = "Economics",
    "EDUC" = "Education",
    "E&C-ENG" = "Electrical and Computer Engin",
    "ENGIN" = "Engineering",
    "ENGLISH" = "English",
    "ENGLWRIT" = "English Writing Program",
    "ESL" = "English as a Second Language",
    "ENTOMOL" = "Entomology",
    "ECO" = "Environmental Conservation",
    "ENVIRDES" = "Environmental Design",
    "EHS" = "Environmental Health Sciences",
    "ENVIRSCI" = "Environmental Science",
    "EPI" = "Epidemiology",
    "EXCHANGE" = "Exchange",
    "FFYS" = "Faculty First Year Seminars",
    "FILM-ST" = "Film Studies",
    "FINANCE" = "Finance",
    "FINOPMGT" = "Finance and Operations Mgt",
    "FINNISH" = "Finnish",
    "FYS" = "First Year Seminar",
    "FORLANGC" = "Five Coll Ctr: World Languages",
    "FOOD-SCI" = "Food Science",
    "FRENCHST" = "French Studies",
    "FRENCHED" = "French-Student Teaching",
    "GEOGRAPH" = "Geography",
    "GEOLOGY" = "Geology",
    "GEO-SCI" = "Geosciences",
    "GERMAN" = "German",
    "GRADSCH" = "Graduate School",
    "GREEK" = "Greek",
    "HAITCREO" = "Haitian Creole",
    "HPP" = "Health Promotion and Policy",
    "HEBREW" = "Hebrew",
    "HERIT" = "Heritage Studies",
    "HISPAN" = "Hispanic Lit. and Linguistics",
    "HISTORY" = "History",
    "HONORS" = "Honors College",
    "HT-MGT" = "Hospitality and Tourism Managmnt",
    "HUMANDEV" = "Human Development",
    "HM&FNART" = "Humanities and Fine Arts",
    "ICONS" = "ICons",
    "INFO" = "Informatics",
    "INFOSEC" = "Information Security",
    "SCH-MGMT" = "Isenberg School of Management",
    "ITALIAN" = "Italian Studies",
    "ITALIAED" = "Italian-Student Teaching",
    "JAPANESE" = "Japanese",
    "JOURNAL" = "Journalism",
    "JUDAIC" = "Judaic Studies",
    "KIN" = "Kinesiology",
    "KOREAN" = "Korean",
    "LLACTING" = "LL: Acting",
    "LLART" = "LL: Art and Photography",
    "LLAMS" = "LL: Arts Management",
    "LLBUS" = "LL: Business and Financial Plan",
    "LLCAR" = "LL: Career and Personal Develpmt",
    "LLCOM" = "LL: Computers",
    "LLLEAD" = "LL: Donahue Leadership Prog",
    "LLESL" = "LL: English as a 2nd Language",
    "LLFOOD" = "LL: Food and Drink",
    "LLINGARM" = "LL: Global Asset and Risk Mgmt",
    "LLHEA" = "LL: Health and Fitness",
    "LLIEP" = "LL: Intensive English Program",
    "LLLAN" = "LL: Languages",
    "LLLCR" = "LL: License Renewal",
    "LLMUS" = "LL: Music",
    "LLPARKS" = "LL: Parks and Conservation Law",
    "LLPER" = "LL: Personal Awareness",
    "LLREA" = "LL: Real Estate",
    "LLPLSOIL" = "LL: Soils/Plants/Insects",
    "LLSPEC" = "LL: Special Interest",
    "LLSR&O" = "LL: Sports, Recrtn and Outdoors",
    "LLSTU" = "LL: Study Skills and Test Taking",
    "LLSC" = "LL: Summer College",
    "LLGREEN" = "LL: Sustainability/Green",
    "LLTRAIN" = "LL: Training",
    "LLWIND" = "LL: Wind Energy",
    "LLWOOD" = "LL: Wood Identification",
    "LLWRI" = "LL: Writing, Literature andDrama",
    "LLARCH" = "LL: Yestermorrow Program",
    "LABOR" = "Labor Studies",
    "LANDARCH" = "Landscape Architecture",
    "LANDCONT" = "Landscape Contracting",
    "LLC" = "Languages, Literature and Culture",
    "LATIN" = "Latin",
    "LATIN-AM" = "Latin American Studies",
    "LATIN-ED" = "Latin-Student Teaching",
    "LEGAL" = "Legal Studies",
    "LINGUIST" = "Linguistics",
    "MANAGMNT" = "Management",
    "MARKETNG" = "Marketing",
    "MS-ENG" = "Materials Science and Engineer",
    "MATH" = "Mathematics",
    "M&I-ENG" = "Mechanical and Industrial Engrg",
    "MICROBIO" = "Microbiology",
    "MIDEAST" = "Middle Eastern Studies",
    "MILITARY" = "Military Leadership",
    "EURO" = "Modern European Studies",
    "MOLCLBIO" = "Molecular and Cellular Biology",
    "MUSIC" = "Music",
    "MUSIC-ED" = "Music Education",
    "MUSICAPP" = "Music, Applied",
    "NEXCHNG" = "National Student Exchange",
    "NRC" = "Natural Resources Conservation",
    "NATSCI" = "Natural Sciences",
    "NEUROS&B" = "Neuroscience and Behavior",
    "NURSING" = "Nursing",
    "NUTRITN" = "Nutrition",
    "OIM" = "Operations and Info Management",
    "ORG&EVBI" = "Organismic and Evolutionary Biol",
    "PHIL" = "Philosophy",
    "PHYSICS" = "Physics",
    "PLANTBIO" = "Plant Biology",
    "POLISH" = "Polish",
    "POLISCI" = "Political Science",
    "POLYMER" = "Polymer Science and Engineering",
    "PORTUG" = "Portuguese",
    "PORTUGED" = "Portuguese-Student Teaching",
    "PSYCH" = "Psychological and Brain Sciences",
    "PUBHLTH" = "Public Health",
    "PUBP&ADM" = "Public Policy and Administration",
    "REGIONPL" = "Regional Planning",
    "RES-ECON" = "Resource Economics",
    "ROMANIA" = "Romanian",
    "RUSSIAN" = "Russian",
    "SCANDIN" = "Scandinavian",
    "SCHPSYCH" = "School Psychology",
    "SPHHS" = "School of Pub Hlth and Hlth Sci",
    "SPP" = "School of Public Policy",
    "SRVCLRNG" = "Service Learning",
    "SLAVIC" = "Slavic",
    "SEESTU" = "Slavic and E European Studies",
    "SOCBEHAV" = "Social and Behavioral Science",
    "STPEC" = "Social Thought and Polic. Econ",
    "SOCIOL" = "Sociology",
    "SPANISH" = "Spanish",
    "SPANI-ED" = "Spanish - Student Teaching",
    "SLHS" = "Speech, Language,and Hearing Sci",
    "SPORTMGT" = "Sport Management",
    "STATISTC" = "Statistics",
    "STOCKSCH" = "Stockbridge Sch of Agriculture",
    "SUSTCOMM" = "Sustainable Community",
    "SWEDISH" = "Swedish",
    "THEATER" = "Theater",
    "PRACT" = "Transfer Practicum",
    "UMA-XCHG" = "UMass Graduate Course Exchange",
    "UMASS" = "UMass Practicum",
    "UNIVRSTY" = "Univ Interdepartmental Course",
    "UWW" = "University Without Walls",
    "WELLNESS" = "Wellness",
    "WGSS" = "Women, Gender, Sexuality Studies",
    "WSTNURSE" = "Worcester Nursing Program",
    "YIDDISH" = "Yiddish",
    "ZEROCRED" = "Zero Credit Test Equiv",
} */

export interface Instructor {
    _id: string;
    name: string;
    email: string;
}

export interface Syllabus {
    original: string; 
    pdf: string;
    txt: string;
}
