// Simulated API that mimics MongoDB backend behavior
class SimulatedAPI {
    constructor() {
        // Initialize with sample data
        this.courses = [
            {
                _id: '1',
                name: 'Introduction to Computer Science',
                code: 'CS101',
                instructor: 'Dr. Smith',
                credits: 3
            },
            {
                _id: '2',
                name: 'Calculus I',
                code: 'MATH101',
                instructor: 'Prof. Johnson',
                credits: 4
            },
            {
                _id: '3',
                name: 'English Composition',
                code: 'ENG101',
                instructor: 'Dr. Williams',
                credits: 3
            }
        ];
        
        this.students = [
            {
                _id: '101',
                name: 'John Doe',
                email: 'john@example.com',
                courseId: '1'
            },
            {
                _id: '102',
                name: 'Jane Smith',
                email: 'jane@example.com',
                courseId: '2'
            }
        ];
        
        // Load data from localStorage if available
        const savedCourses = localStorage.getItem('simulated_courses');
        const savedStudents = localStorage.getItem('simulated_students');
        
        if (savedCourses) {
            this.courses = JSON.parse(savedCourses);
        }
        
        if (savedStudents) {
            this.students = JSON.parse(savedStudents);
        }
    }
    
    // Save data to localStorage to simulate persistence
    saveData() {
        localStorage.setItem('simulated_courses', JSON.stringify(this.courses));
        localStorage.setItem('simulated_students', JSON.stringify(this.students));
    }
    
    // COURSE ENDPOINTS
    
    // GET /api/courses
    getCourses() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...this.courses]); // Return a copy
            }, 100); // Simulate network delay
        });
    }
    
    // POST /api/courses
    createCourse(courseData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Check if course code already exists
                const existingCourse = this.courses.find(c => c.code === courseData.code);
                if (existingCourse) {
                    reject(new Error('Course code already exists'));
                    return;
                }
                
                const newCourse = {
                    _id: Date.now().toString(),
                    ...courseData
                };
                
                this.courses.push(newCourse);
                this.saveData();
                resolve(newCourse);
            }, 100);
        });
    }
    
    // PUT /api/courses/:id
    updateCourse(id, courseData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = this.courses.findIndex(c => c._id === id);
                if (index === -1) {
                    reject(new Error('Course not found'));
                    return;
                }
                
                // Check if course code already exists (excluding current course)
                const existingCourse = this.courses.find(c => c.code === courseData.code && c._id !== id);
                if (existingCourse) {
                    reject(new Error('Course code already exists'));
                    return;
                }
                
                this.courses[index] = {
                    ...this.courses[index],
                    ...courseData
                };
                
                this.saveData();
                resolve(this.courses[index]);
            }, 100);
        });
    }
    
    // DELETE /api/courses/:id
    deleteCourse(id) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = this.courses.findIndex(c => c._id === id);
                if (index === -1) {
                    reject(new Error('Course not found'));
                    return;
                }
                
                // Remove all students enrolled in this course
                this.students = this.students.filter(student => student.courseId !== id);
                
                // Remove the course
                this.courses.splice(index, 1);
                this.saveData();
                resolve({ message: 'Course deleted successfully' });
            }, 100);
        });
    }
    
    // STUDENT ENDPOINTS
    
    // GET /api/students
    getStudents() {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Populate course information
                const studentsWithCourses = this.students.map(student => {
                    const course = this.courses.find(c => c._id === student.courseId);
                    return {
                        ...student,
                        course: course ? { name: course.name, code: course.code } : null
                    };
                });
                resolve(studentsWithCourses);
            }, 100);
        });
    }
    
    // POST /api/students
    createStudent(studentData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Check if course exists
                const course = this.courses.find(c => c._id === studentData.courseId);
                if (!course) {
                    reject(new Error('Course not found'));
                    return;
                }
                
                // Check if email already exists
                const existingStudent = this.students.find(s => s.email === studentData.email);
                if (existingStudent) {
                    reject(new Error('Student email already exists'));
                    return;
                }
                
                const newStudent = {
                    _id: Date.now().toString(),
                    ...studentData
                };
                
                this.students.push(newStudent);
                this.saveData();
                
                // Populate course information
                const studentWithCourse = {
                    ...newStudent,
                    course: { name: course.name, code: course.code }
                };
                
                resolve(studentWithCourse);
            }, 100);
        });
    }
    
    // PUT /api/students/:id
    updateStudent(id, studentData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = this.students.findIndex(s => s._id === id);
                if (index === -1) {
                    reject(new Error('Student not found'));
                    return;
                }
                
                // Check if course exists (if courseId is being updated)
                if (studentData.courseId) {
                    const course = this.courses.find(c => c._id === studentData.courseId);
                    if (!course) {
                        reject(new Error('Course not found'));
                        return;
                    }
                }
                
                // Check if email already exists (excluding current student)
                const existingStudent = this.students.find(s => s.email === studentData.email && s._id !== id);
                if (existingStudent) {
                    reject(new Error('Student email already exists'));
                    return;
                }
                
                this.students[index] = {
                    ...this.students[index],
                    ...studentData
                };
                
                this.saveData();
                
                // Populate course information
                const course = this.courses.find(c => c._id === this.students[index].courseId);
                const studentWithCourse = {
                    ...this.students[index],
                    course: course ? { name: course.name, code: course.code } : null
                };
                
                resolve(studentWithCourse);
            }, 100);
        });
    }
    
    // DELETE /api/students/:id
    deleteStudent(id) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = this.students.findIndex(s => s._id === id);
                if (index === -1) {
                    reject(new Error('Student not found'));
                    return;
                }
                
                this.students.splice(index, 1);
                this.saveData();
                resolve({ message: 'Student unenrolled successfully' });
            }, 100);
        });
    }
}

// Export a singleton instance
window.SimulatedAPI = new SimulatedAPI();