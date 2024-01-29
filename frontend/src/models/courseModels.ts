export interface CourseInfo {
    _id: string;

    name: string;
    subject: string;
    
    course_number: string;
    course_title: string;
    
    instructor: Instructor;
    syllabus: Syllabus;
}

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