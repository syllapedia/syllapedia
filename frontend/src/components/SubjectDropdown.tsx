import { useState} from "react";
import "./CourseSearch.css"
import { TextField, Autocomplete } from '@mui/material';

function SubjectDropdown({handleSubject, size}: {handleSubject: (value: string | null) => void, size: "small" | "medium"}) {
    const [subjectNameToCode, setSubjectNameToCode] = useState<Record<string, string>>(({'Accounting': 'ACCOUNTG', 'Aerospace Studies': 'AEROSPAC', 'Afro-American Studies': 'AFROAM', 'Animal Science': 'ANIMLSCI', 'Anthropology': 'ANTHRO', 'Arabic': 'ARABIC', 'Architecture': 'ARCH', 'Art': 'ART', 'Art - Student Teaching': 'ART-ED', 'Art History': 'ART-HIST', 'Arts Extension': 'ARTS-EXT', 'Asian Studies': 'ASIAN-ST', 'Astronomy': 'ASTRON', "Bachelor's Deg. W/Indiv Conc.": 'BDIC', 'Biochemistry & Molecular Bio.': 'BIOCHEM', 'Biology': 'BIOLOGY', 'Biology @ MIC': 'BI@MIC', 'Biomedical Engineering': 'BMED-ENG', 'Biostatistics': 'BIOSTATS', 'Biostats & Epidemiology': 'BIOST&EP', 'Biotechnology': 'BIOTECH', 'Building & Construction Tech': 'BCT', 'Catalan': 'CATALAN', 'Chemical Engineering': 'CHEM-ENG', 'Chemistry': 'CHEM', 'Chinese': 'CHINESE', 'Civil & Environmental Engrg': 'CE-ENGIN', 'Classics': 'CLASSICS', 'College Curriculum @ MIC': 'CC@MIC', 'College of Inform & Comp Sci': 'CICS', 'Communication': 'COMM', 'Communication Disorders': 'COMM-DIS', 'Community Health (see PUBHLTH)': 'COM-HLTH', 'Comparative Literature': 'COMP-LIT', 'Computer Science': 'COMPSCI', 'Dance': 'DANCE', 'Danish': 'DANISH', 'Data Analytics and Computation': 'DACSS', 'Dutch': 'DUTCH', 'Economics': 'ECON', 'Education': 'EDUC', 'Education @ MIC': 'ED@MIC', 'Electrical & Computer Engin': 'E&C-ENG', 'Engineering': 'ENGIN', 'English': 'ENGLISH', 'English Writing Program': 'ENGLWRIT', 'English as a Second Language': 'ESL', 'Entomology': 'ENTOMOL', 'Environmental Conservation': 'ECO', 'Environmental Design': 'ENVIRDES', 'Environmental Health Sciences': 'EHS', 'Environmental Science': 'ENVIRSCI', 'Epidemiology': 'EPI', 'Exchange': 'EXCHANGE', 'Faculty First Year Seminars': 'FFYS', 'Film Studies': 'FILM-ST', 'Finance': 'FINANCE', 'Finance and Operations Mgt': 'FINOPMGT', 'Finnish': 'FINNISH', 'First Year Seminar': 'FYS', 'Five Coll Ctr: World Languages': 'FORLANGC', 'Food Science': 'FOOD-SCI', 'French Studies': 'FRENCHST', 'French-Student Teaching': 'FRENCHED', 'Geography': 'GEOGRAPH', 'Geology': 'GEOLOGY', 'Geosciences': 'GEO-SCI', 'German': 'GERMAN', 'Graduate School': 'GRADSCH', 'Greek': 'GREEK', 'Haitian Creole': 'HAITCREO', 'Health Promotion & Policy': 'HPP', 'Hebrew': 'HEBREW', 'Heritage Studies': 'HERIT', 'Hispanic Lit. & Linguistics': 'HISPAN', 'History': 'HISTORY', 'History @ MIC': 'HI@MIC', 'Honors College': 'HONORS', 'Hospitality & Tourism Managmnt': 'HT-MGT', 'Human Development': 'HUMANDEV', 'Humanities @ MIC': 'HU@MIC', 'Humanities and Fine Arts': 'HM&FNART', 'ICons': 'ICONS', 'Informatics': 'INFO', 'Information Security': 'INFOSEC', 'Inst for Applied Life Sciences': 'IALS', 'Isenberg School of Management': 'SCH-MGMT', 'Italian Studies': 'ITALIAN', 'Italian-Student Teaching': 'ITALIAED', 'Japanese': 'JAPANESE', 'Journalism': 'JOURNAL', 'Judaic Studies': 'JUDAIC', 'Kinesiology': 'KIN', 'Korean': 'KOREAN', 'LL: Acting': 'LLACTING', 'LL: Art & Photography': 'LLART', 'LL: Arts Management': 'LLAMS', 'LL: Business & Financial Plan': 'LLBUS', 'LL: Career & Personal Develpmt': 'LLCAR', 'LL: Computers': 'LLCOM', 'LL: Donahue Leadership Prog': 'LLLEAD', 'LL: English as a 2nd Language': 'LLESL', 'LL: Food and Drink': 'LLFOOD', 'LL: Global Asset & Risk Mgmt': 'LLINGARM', 'LL: Health & Fitness': 'LLHEA', 'LL: Intensive English Program': 'LLEIP', 'LL: Languages': 'LLLAN', 'LL: License Renewal': 'LLLCR', 'LL: Music': 'LLMUS', 'LL: Parks & Conservation Law': 'LLPARKS', 'LL: Personal Awareness': 'LLPER', 'LL: Real Estate': 'LLREA', 'LL: Soils/Plants/Insects': 'LLPLSOIL', 'LL: Special Interest': 'LLSPEC', 'LL: Sports,Recrtn & Outdoors': 'LLSR&O', 'LL: Study Skills & Test Taking': 'LLSTU', 'LL: Summer College': 'LLSC', 'LL: Sustainability/Green': 'LLGREEN', 'LL: Training': 'LLTRAIN', 'LL: Wind Energy': 'LLWIND', 'LL: Wood Identification': 'LLWOOD', 'LL: Writing, Literature &Drama': 'LLWRI', 'LL: Yestermorrow Program': 'LLARCH', 'Labor Studies': 'LABOR', 'Landscape Architecture': 'LANDARCH', 'Landscape Contracting': 'LANDCONT', 'Languages, Literature&Culture': 'LLC', 'Latin': 'LATIN', 'Latin American Studies': 'LATIN-AM', 'Latin-Student Teaching': 'LATIN-ED', 'Legal Studies': 'LEGAL', 'Linguistics': 'LINGUIST', 'Literature Elective @ MIC': 'LI@MIC', 'Management': 'MANAGMNT', 'Marketing': 'MARKETNG', 'Materials Science and Engineer': 'MS-ENG', 'Mathematics': 'MATH', 'Mathematics @ MIC': 'MA@MIC', 'Mechanical & Industrial Engrg': 'M&I-ENG', 'Microbiology': 'MICROBIO', 'Middle Eastern Studies': 'MIDEAST', 'Military Leadership': 'MILITARY', 'Modern European Studies': 'EURO', 'Molecular & Cellular Biology': 'MOLCLBIO', 'Music': 'MUSIC', 'Music Education': 'MUSIC-ED', 'Music, Applied': 'MUSICAPP', 'National Student Exchange': 'NEXCHNG', 'Natural Resources Conservation': 'NRC', 'Natural Sciences': 'NATSCI', 'Neuroscience & Behavior': 'NEUROS&B', 'Nursing': 'NURSING', 'Nutrition': 'NUTRITN', 'Operations & Info Management': 'OIM', 'Organismic & Evolutionary Biol': 'ORG&EVBI', 'Philosophy': 'PHIL', 'Physics': 'PHYSICS', 'Plant Biology': 'PLANTBIO', 'Polish': 'POLISH', 'Political Science': 'POLISCI', 'Political Science @ MIC': 'PO@MIC', 'Polymer Science & Engineering': 'POLYMER', 'Portuguese': 'PORTUG', 'Portuguese-Student Teaching': 'PORTUGED', 'Psychological & Brain Sciences': 'PSYCH', 'Public Health': 'PUBHLTH', 'Regional Planning': 'REGIONPL', 'Resource Economics': 'RES-ECON', 'Romanian': 'ROMANIA', 'Russian': 'RUSSIAN', 'Scandinavian': 'SCANDIN', 'School Psychology': 'SCHPSYCH', 'School of Pub Hlth & Hlth Sci': 'SPHHS', 'School of Public Policy': 'SPP', 'Science @ MIC': 'SC@MIC', 'Service Learning': 'SRVCLRNG', 'Slavic': 'SLAVIC', 'Slavic & E European Studies': 'SEESTU', 'Social & Behavioral Science': 'SOCBEHAV', 'Social Thought & Polic. Econ': 'STPEC', 'Sociology': 'SOCIOL', 'Spanish': 'SPANISH', 'Spanish - Student Teaching': 'SPANI-ED', 'Speech, Language,& Hearing Sci': 'SLHS', 'Sport Management': 'SPORTMGT', 'Statistics': 'STATISTC', 'Stockbridge Sch of Agriculture': 'STOCKSCH', 'Sustainable Community': 'SUSTCOMM', 'Swedish': 'SWEDISH', 'Theater': 'THEATER', 'Transfer Practicum': 'PRACT', 'UMass Graduate Course Exchange': 'UMA-XCHG', 'UMass Practicum': 'UMASS', 'Univ Interdepartmental Course': 'UNIVRSTY', 'University Without Walls': 'UWW', 'Vet Tech @ Mt. Ida College': 'VT@MIC', 'Wellness': 'WELLNESS', 'Women,Gender,Sexuality Studies': 'WGSS', 'Worcester Nursing Program': 'WSTNURSE', 'Yiddish': 'YIDDISH', 'Zero Credit Test Equiv': 'TSTOCRED'}));
    const handleSubjectNameToCode = (names: string[], codes: string[]) => {
        const obj: Record<string, string> = {};
        for (let i = 0; i < names.length; i++) {
            obj[names[i]] = codes[i];
        }
        return setSubjectNameToCode(obj);
    };
    return (
        <Autocomplete
            options={Object.keys(subjectNameToCode)}
            renderInput={(params) => (
                <TextField {...params} label="Subject" size={size} />
            )}
            onChange={(event, value) => handleSubject(value)}
        />
    )
}

export default SubjectDropdown;