export interface CourseInfo {
    _id: string,

    name: string,
    subject: string,
    course_number: string,
    course_title: string,
    instructor: {
        _id: string,
        name: string,
        email: string
    }
    
    syllabus: {
        original: string, 
        pdf: string, 
        txt: string
    }
}