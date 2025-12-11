// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Data storage using MongoDB backend
class CourseEnrollmentSystem {
    constructor() {
        this.courses = [];
        this.students = [];
        this.init();
    }

    async init() {
        await this.loadCourses();
        await this.loadStudents();
        this.renderCourses();
        this.renderStudents();
        this.populateCourseSelect();
        this.attachEventListeners();
    }

    // API Helper Methods
    async apiRequest(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                },
                ...options
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'API request failed');
            }
            
            return await response.json();
        } catch (error) {
            console.error(`API request failed: ${error.message}`);
            throw error;
        }
    }

    // Course CRUD Operations
    async loadCourses() {
        try {
            this.courses = await this.apiRequest('/courses');
        } catch (error) {
            console.error('Failed to load courses:', error);
            alert('Failed to load courses. Please check if the server is running.');
        }
    }

    async addCourse(course) {
        try {
            const newCourse = await this.apiRequest('/courses', {
                method: 'POST',
                body: JSON.stringify(course)
            });
            
            this.courses.push(newCourse);
            this.renderCourses();
            this.populateCourseSelect();
            return newCourse;
        } catch (error) {
            alert(`Failed to add course: ${error.message}`);
        }
    }

    async updateCourse(id, updatedCourse) {
        try {
            const course = await this.apiRequest(`/courses/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updatedCourse)
            });
            
            const index = this.courses.findIndex(c => c._id === id);
            if (index !== -1) {
                this.courses[index] = course;
            }
            
            this.renderCourses();
            this.renderStudents(); // Update students table to reflect course changes
            this.populateCourseSelect();
            return course;
        } catch (error) {
            alert(`Failed to update course: ${error.message}`);
        }
    }

    async deleteCourse(id) {
        try {
            await this.apiRequest(`/courses/${id}`, {
                method: 'DELETE'
            });
            
            // Remove course from local array
            this.courses = this.courses.filter(course => course._id !== id);
            
            // Remove students enrolled in this course
            this.students = this.students.filter(student => student.courseId !== id);
            
            this.renderCourses();
            this.renderStudents();
            this.populateCourseSelect();
        } catch (error) {
            alert(`Failed to delete course: ${error.message}`);
        }
    }

    getCourseById(id) {
        return this.courses.find(course => course._id === id);
    }

    // Student CRUD Operations
    async loadStudents() {
        try {
            this.students = await this.apiRequest('/students');
        } catch (error) {
            console.error('Failed to load students:', error);
            alert('Failed to load students. Please check if the server is running.');
        }
    }

    async enrollStudent(student) {
        try {
            const newStudent = await this.apiRequest('/students', {
                method: 'POST',
                body: JSON.stringify(student)
            });
            
            this.students.push(newStudent);
            this.renderStudents();
            return newStudent;
        } catch (error) {
            alert(`Failed to enroll student: ${error.message}`);
        }
    }

    async updateStudent(id, updatedStudent) {
        try {
            const student = await this.apiRequest(`/students/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updatedStudent)
            });
            
            const index = this.students.findIndex(s => s._id === id);
            if (index !== -1) {
                this.students[index] = student;
            }
            
            this.renderStudents();
            return student;
        } catch (error) {
            alert(`Failed to update student: ${error.message}`);
        }
    }

    async unenrollStudent(id) {
        try {
            await this.apiRequest(`/students/${id}`, {
                method: 'DELETE'
            });
            
            this.students = this.students.filter(student => student._id !== id);
            this.renderStudents();
        } catch (error) {
            alert(`Failed to unenroll student: ${error.message}`);
        }
    }

    // UI Rendering
    renderCourses() {
        const tbody = document.getElementById('coursesTableBody');
        const noCoursesMessage = document.getElementById('noCoursesMessage');
        
        if (this.courses.length === 0) {
            tbody.innerHTML = '';
            noCoursesMessage.style.display = 'block';
            return;
        }
        
        noCoursesMessage.style.display = 'none';
        tbody.innerHTML = this.courses.map(course => `
            <tr>
                <td>${course.code}</td>
                <td>${course.name}</td>
                <td>${course.instructor}</td>
                <td>${course.credits}</td>
                <td class="actions">
                    <button class="btn-edit" onclick="app.editCourse('${course._id}')">Edit</button>
                    <button class="btn-delete" onclick="app.deleteCourse('${course._id}')">Delete</button>
                    <button class="btn-enroll" onclick="app.prepareEnrollment('${course._id}')">Enroll Students</button>
                </td>
            </tr>
        `).join('');
    }

    renderStudents() {
        const tbody = document.getElementById('studentsTableBody');
        const noStudentsMessage = document.getElementById('noStudentsMessage');
        
        if (this.students.length === 0) {
            tbody.innerHTML = '';
            noStudentsMessage.style.display = 'block';
            return;
        }
        
        noStudentsMessage.style.display = 'none';
        tbody.innerHTML = this.students.map(student => {
            const course = this.getCourseById(student.courseId);
            return `
                <tr>
                    <td>${student.name}</td>
                    <td>${student.email}</td>
                    <td>${course ? course.name : 'Unknown Course'}</td>
                    <td class="actions">
                        <button class="btn-edit" onclick="app.editStudent('${student._id}')">Edit</button>
                        <button class="btn-delete" onclick="app.unenrollStudent('${student._id}')">Unenroll</button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    populateCourseSelect() {
        const select = document.getElementById('courseSelect');
        select.innerHTML = '<option value="">-- Select a Course --</option>';
        
        this.courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course._id;
            option.textContent = `${course.code} - ${course.name}`;
            select.appendChild(option);
        });
    }

    // Form Handling
    attachEventListeners() {
        // Course form submission
        document.getElementById('courseForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCourseSubmit();
        });
        
        // Student form submission
        document.getElementById('studentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleStudentSubmit();
        });
        
        // Cancel buttons
        document.getElementById('courseCancelBtn').addEventListener('click', () => {
            this.resetCourseForm();
        });
        
        document.getElementById('studentCancelBtn').addEventListener('click', () => {
            this.resetStudentForm();
        });
    }

    async handleCourseSubmit() {
        const courseId = document.getElementById('courseId').value;
        const courseData = {
            name: document.getElementById('courseName').value,
            code: document.getElementById('courseCode').value,
            instructor: document.getElementById('instructor').value,
            credits: parseInt(document.getElementById('credits').value)
        };

        if (courseId) {
            // Update existing course
            await this.updateCourse(courseId, courseData);
        } else {
            // Add new course
            await this.addCourse(courseData);
        }
        
        this.resetCourseForm();
    }

    async handleStudentSubmit() {
        const studentId = document.getElementById('studentId').value;
        const studentData = {
            name: document.getElementById('studentName').value,
            email: document.getElementById('studentEmail').value,
            courseId: document.getElementById('courseSelect').value
        };

        if (!studentData.courseId) {
            alert('Please select a course');
            return;
        }

        if (studentId) {
            // Update existing student
            await this.updateStudent(studentId, studentData);
        } else {
            // Enroll new student
            await this.enrollStudent(studentData);
        }
        
        this.resetStudentForm();
    }

    // Edit operations
    editCourse(id) {
        const course = this.getCourseById(id);
        if (course) {
            document.getElementById('courseId').value = course._id;
            document.getElementById('courseName').value = course.name;
            document.getElementById('courseCode').value = course.code;
            document.getElementById('instructor').value = course.instructor;
            document.getElementById('credits').value = course.credits;
            
            document.getElementById('courseSubmitBtn').textContent = 'Update Course';
            document.getElementById('courseCancelBtn').style.display = 'inline-block';
            
            // Scroll to form
            document.querySelector('.course-management .form-container').scrollIntoView({ behavior: 'smooth' });
        }
    }

    editStudent(id) {
        const student = this.students.find(s => s._id === id);
        if (student) {
            document.getElementById('studentId').value = student._id;
            document.getElementById('studentName').value = student.name;
            document.getElementById('studentEmail').value = student.email;
            document.getElementById('courseSelect').value = student.courseId;
            
            document.getElementById('studentSubmitBtn').textContent = 'Update Student';
            document.getElementById('studentCancelBtn').style.display = 'inline-block';
            
            // Scroll to form
            document.querySelector('.student-enrollment .form-container').scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Prepare enrollment for a specific course
    prepareEnrollment(courseId) {
        document.getElementById('courseSelect').value = courseId;
        document.getElementById('courseSelect').focus();
        
        // Scroll to student form
        document.querySelector('.student-enrollment .form-container').scrollIntoView({ behavior: 'smooth' });
    }

    // Delete operations
    deleteCourse(id) {
        if (confirm('Are you sure you want to delete this course? All enrolled students will also be removed.')) {
            this.deleteCourse(id);
        }
    }

    unenrollStudent(id) {
        if (confirm('Are you sure you want to unenroll this student?')) {
            this.unenrollStudent(id);
        }
    }

    // Reset forms
    resetCourseForm() {
        document.getElementById('courseForm').reset();
        document.getElementById('courseId').value = '';
        document.getElementById('courseSubmitBtn').textContent = 'Add Course';
        document.getElementById('courseCancelBtn').style.display = 'none';
    }

    resetStudentForm() {
        document.getElementById('studentForm').reset();
        document.getElementById('studentId').value = '';
        document.getElementById('studentSubmitBtn').textContent = 'Enroll Student';
        document.getElementById('studentCancelBtn').style.display = 'none';
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CourseEnrollmentSystem();
});