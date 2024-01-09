import React, { useState, useEffect } from "react";
import "./CreateDialog.css";
import { Dialog, DialogContent, DialogTitle, Typography, Grid, Button } from '@mui/material';
import CourseNameView from "./CourseNameView";
import SubjectDropdown from "./SubjectDropdown";
import CourseInput from "./CourseInput";
import UploadSyllabus from "./UploadSyllabus";

function CreateDialog({ open, handleDialog }: {open: boolean, handleDialog: (open: boolean) => void}) {
    const [subjectNameToCode, setSubjectNameToCode] = useState<Record<string, string>>(({'Accounting': 'ACCOUNTG', 'Aerospace Studies': 'AEROSPAC', 'Afro-American Studies': 'AFROAM', 'Animal Science': 'ANIMLSCI', 'Anthropology': 'ANTHRO', 'Arabic': 'ARABIC', 'Architecture': 'ARCH', 'Art': 'ART', 'Art - Student Teaching': 'ART-ED', 'Art History': 'ART-HIST', 'Arts Extension': 'ARTS-EXT', 'Asian Studies': 'ASIAN-ST', 'Astronomy': 'ASTRON', "Bachelor's Deg. W/Indiv Conc.": 'BDIC', 'Biochemistry & Molecular Bio.': 'BIOCHEM', 'Biology': 'BIOLOGY', 'Biology @ MIC': 'BI@MIC', 'Biomedical Engineering': 'BMED-ENG', 'Biostatistics': 'BIOSTATS', 'Biostats & Epidemiology': 'BIOST&EP', 'Biotechnology': 'BIOTECH', 'Building & Construction Tech': 'BCT', 'Catalan': 'CATALAN', 'Chemical Engineering': 'CHEM-ENG', 'Chemistry': 'CHEM', 'Chinese': 'CHINESE', 'Civil & Environmental Engrg': 'CE-ENGIN', 'Classics': 'CLASSICS', 'College Curriculum @ MIC': 'CC@MIC', 'College of Inform & Comp Sci': 'CICS', 'Communication': 'COMM', 'Communication Disorders': 'COMM-DIS', 'Community Health (see PUBHLTH)': 'COM-HLTH', 'Comparative Literature': 'COMP-LIT', 'Computer Science': 'COMPSCI', 'Dance': 'DANCE', 'Danish': 'DANISH', 'Data Analytics and Computation': 'DACSS', 'Dutch': 'DUTCH', 'Economics': 'ECON', 'Education': 'EDUC', 'Education @ MIC': 'ED@MIC', 'Electrical & Computer Engin': 'E&C-ENG', 'Engineering': 'ENGIN', 'English': 'ENGLISH', 'English Writing Program': 'ENGLWRIT', 'English as a Second Language': 'ESL', 'Entomology': 'ENTOMOL', 'Environmental Conservation': 'ECO', 'Environmental Design': 'ENVIRDES', 'Environmental Health Sciences': 'EHS', 'Environmental Science': 'ENVIRSCI', 'Epidemiology': 'EPI', 'Exchange': 'EXCHANGE', 'Faculty First Year Seminars': 'FFYS', 'Film Studies': 'FILM-ST', 'Finance': 'FINANCE', 'Finance and Operations Mgt': 'FINOPMGT', 'Finnish': 'FINNISH', 'First Year Seminar': 'FYS', 'Five Coll Ctr: World Languages': 'FORLANGC', 'Food Science': 'FOOD-SCI', 'French Studies': 'FRENCHST', 'French-Student Teaching': 'FRENCHED', 'Geography': 'GEOGRAPH', 'Geology': 'GEOLOGY', 'Geosciences': 'GEO-SCI', 'German': 'GERMAN', 'Graduate School': 'GRADSCH', 'Greek': 'GREEK', 'Haitian Creole': 'HAITCREO', 'Health Promotion & Policy': 'HPP', 'Hebrew': 'HEBREW', 'Heritage Studies': 'HERIT', 'Hispanic Lit. & Linguistics': 'HISPAN', 'History': 'HISTORY', 'History @ MIC': 'HI@MIC', 'Honors College': 'HONORS', 'Hospitality & Tourism Managmnt': 'HT-MGT', 'Human Development': 'HUMANDEV', 'Humanities @ MIC': 'HU@MIC', 'Humanities and Fine Arts': 'HM&FNART', 'ICons': 'ICONS', 'Informatics': 'INFO', 'Information Security': 'INFOSEC', 'Inst for Applied Life Sciences': 'IALS', 'Isenberg School of Management': 'SCH-MGMT', 'Italian Studies': 'ITALIAN', 'Italian-Student Teaching': 'ITALIAED', 'Japanese': 'JAPANESE', 'Journalism': 'JOURNAL', 'Judaic Studies': 'JUDAIC', 'Kinesiology': 'KIN', 'Korean': 'KOREAN', 'LL: Acting': 'LLACTING', 'LL: Art & Photography': 'LLART', 'LL: Arts Management': 'LLAMS', 'LL: Business & Financial Plan': 'LLBUS', 'LL: Career & Personal Develpmt': 'LLCAR', 'LL: Computers': 'LLCOM', 'LL: Donahue Leadership Prog': 'LLLEAD', 'LL: English as a 2nd Language': 'LLESL', 'LL: Food and Drink': 'LLFOOD', 'LL: Global Asset & Risk Mgmt': 'LLINGARM', 'LL: Health & Fitness': 'LLHEA', 'LL: Intensive English Program': 'LLEIP', 'LL: Languages': 'LLLAN', 'LL: License Renewal': 'LLLCR', 'LL: Music': 'LLMUS', 'LL: Parks & Conservation Law': 'LLPARKS', 'LL: Personal Awareness': 'LLPER', 'LL: Real Estate': 'LLREA', 'LL: Soils/Plants/Insects': 'LLPLSOIL', 'LL: Special Interest': 'LLSPEC', 'LL: Sports,Recrtn & Outdoors': 'LLSR&O', 'LL: Study Skills & Test Taking': 'LLSTU', 'LL: Summer College': 'LLSC', 'LL: Sustainability/Green': 'LLGREEN', 'LL: Training': 'LLTRAIN', 'LL: Wind Energy': 'LLWIND', 'LL: Wood Identification': 'LLWOOD', 'LL: Writing, Literature &Drama': 'LLWRI', 'LL: Yestermorrow Program': 'LLARCH', 'Labor Studies': 'LABOR', 'Landscape Architecture': 'LANDARCH', 'Landscape Contracting': 'LANDCONT', 'Languages, Literature&Culture': 'LLC', 'Latin': 'LATIN', 'Latin American Studies': 'LATIN-AM', 'Latin-Student Teaching': 'LATIN-ED', 'Legal Studies': 'LEGAL', 'Linguistics': 'LINGUIST', 'Literature Elective @ MIC': 'LI@MIC', 'Management': 'MANAGMNT', 'Marketing': 'MARKETNG', 'Materials Science and Engineer': 'MS-ENG', 'Mathematics': 'MATH', 'Mathematics @ MIC': 'MA@MIC', 'Mechanical & Industrial Engrg': 'M&I-ENG', 'Microbiology': 'MICROBIO', 'Middle Eastern Studies': 'MIDEAST', 'Military Leadership': 'MILITARY', 'Modern European Studies': 'EURO', 'Molecular & Cellular Biology': 'MOLCLBIO', 'Music': 'MUSIC', 'Music Education': 'MUSIC-ED', 'Music, Applied': 'MUSICAPP', 'National Student Exchange': 'NEXCHNG', 'Natural Resources Conservation': 'NRC', 'Natural Sciences': 'NATSCI', 'Neuroscience & Behavior': 'NEUROS&B', 'Nursing': 'NURSING', 'Nutrition': 'NUTRITN', 'Operations & Info Management': 'OIM', 'Organismic & Evolutionary Biol': 'ORG&EVBI', 'Philosophy': 'PHIL', 'Physics': 'PHYSICS', 'Plant Biology': 'PLANTBIO', 'Polish': 'POLISH', 'Political Science': 'POLISCI', 'Political Science @ MIC': 'PO@MIC', 'Polymer Science & Engineering': 'POLYMER', 'Portuguese': 'PORTUG', 'Portuguese-Student Teaching': 'PORTUGED', 'Psychological & Brain Sciences': 'PSYCH', 'Public Health': 'PUBHLTH', 'Regional Planning': 'REGIONPL', 'Resource Economics': 'RES-ECON', 'Romanian': 'ROMANIA', 'Russian': 'RUSSIAN', 'Scandinavian': 'SCANDIN', 'School Psychology': 'SCHPSYCH', 'School of Pub Hlth & Hlth Sci': 'SPHHS', 'School of Public Policy': 'SPP', 'Science @ MIC': 'SC@MIC', 'Service Learning': 'SRVCLRNG', 'Slavic': 'SLAVIC', 'Slavic & E European Studies': 'SEESTU', 'Social & Behavioral Science': 'SOCBEHAV', 'Social Thought & Polic. Econ': 'STPEC', 'Sociology': 'SOCIOL', 'Spanish': 'SPANISH', 'Spanish - Student Teaching': 'SPANI-ED', 'Speech, Language,& Hearing Sci': 'SLHS', 'Sport Management': 'SPORTMGT', 'Statistics': 'STATISTC', 'Stockbridge Sch of Agriculture': 'STOCKSCH', 'Sustainable Community': 'SUSTCOMM', 'Swedish': 'SWEDISH', 'Theater': 'THEATER', 'Transfer Practicum': 'PRACT', 'UMass Graduate Course Exchange': 'UMA-XCHG', 'UMass Practicum': 'UMASS', 'Univ Interdepartmental Course': 'UNIVRSTY', 'University Without Walls': 'UWW', 'Vet Tech @ Mt. Ida College': 'VT@MIC', 'Wellness': 'WELLNESS', 'Women,Gender,Sexuality Studies': 'WGSS', 'Worcester Nursing Program': 'WSTNURSE', 'Yiddish': 'YIDDISH', 'Zero Credit Test Equiv': 'TSTOCRED'}));
    const [subject, setSubject] = useState("");
    const [number, setNumber] = useState("");
    const [title, setTitle] = useState("");
    const [syllabus, setSyllabus] = useState("");

    const handleSubjectNameToCode = (names: string[], codes: string[]) => {
        const obj: Record<string, string> = {};
        for (let i = 0; i < names.length; i++) {
            obj[names[i]] = codes[i];
        }
        return setSubjectNameToCode(obj);
    };
    const handleSubject = (value: string | null) => {
        if (value !== null) {
            setSubject(value);
        } else {
            setSubject("");
        }
    };
    const handleNumber = (value: string | null) => {
        if (value !== null) {
            setNumber(value);
        } else {
            setNumber("");
        }
    };
    const handleTitle = (value: string | null) => {
        if (value !== null) {
            setTitle(value);
        } else {
            setTitle("");
        }
    };
	const handleSyllabus = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files !== null) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setSyllabus(base64String);
            };
            reader.readAsDataURL(file);
        } else {
            setSyllabus("");
        }
    };
    const escape = () => {
        handleSubject("");
        handleNumber("");
        handleTitle("");
        setSyllabus("")
        handleDialog(false);
    };
    const createCourse = () => {/* Add create course functionality */};

    return (
        <Dialog open={open} onClose={() => escape()}>
            <DialogTitle>Create Course</DialogTitle>
            <DialogContent style={{width:"380px"}}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <CourseNameView code={subject ? subjectNameToCode[subject] : "____"} number={number ? number : "___"} title={title ? title : "_______"}/>
                    </Grid>
                    <Grid item xs={6}>
                        <SubjectDropdown handleSubject={handleSubject} size="medium"/>
                    </Grid>
                    <Grid item xs={6}>
                        <CourseInput handleInput={handleNumber} size="medium" label="Number"/>
                    </Grid>
                    <Grid item xs={12}>
                        <CourseInput handleInput={handleTitle} size="medium" label="Name"/>
                    </Grid>
                    <Grid item xs={12}>
                        <UploadSyllabus syllabus={syllabus} handleSyllabus={handleSyllabus} size="medium"/>
                    </Grid>
                    <Grid item xs={12}><div style={{height:"35px"}}></div></Grid>
                    <Grid item xs={6}></Grid>
                    <Grid item xs={3}>
                        <Button onClick={() => escape()} size="medium" variant="outlined" color="inherit">
                            Cancel
                        </Button>
                    </Grid>
                    <Grid item xs={3}>
                        <Button size="medium" variant="contained" color="primary" onClick={() => createCourse()}>
                            Create
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}

export default CreateDialog;
