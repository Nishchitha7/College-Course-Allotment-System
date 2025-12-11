const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Course = require('../models/Course');

// GET all students with course details
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().populate('courseId', 'name code');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a specific student
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('courseId', 'name code');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE a new student
router.post('/', async (req, res) => {
  try {
    // Check if course exists
    const course = await Course.findById(req.body.courseId);
    if (!course) {
      return res.status(400).json({ message: 'Course not found' });
    }

    const student = new Student({
      name: req.body.name,
      email: req.body.email,
      courseId: req.body.courseId
    });

    const newStudent = await student.save();
    // Populate course details in response
    await newStudent.populate('courseId', 'name code');
    res.status(201).json(newStudent);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Student email already exists' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// UPDATE a student
router.put('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if course exists (if courseId is being updated)
    if (req.body.courseId) {
      const course = await Course.findById(req.body.courseId);
      if (!course) {
        return res.status(400).json({ message: 'Course not found' });
      }
      student.courseId = req.body.courseId;
    }

    student.name = req.body.name || student.name;
    student.email = req.body.email || student.email;

    const updatedStudent = await student.save();
    // Populate course details in response
    await updatedStudent.populate('courseId', 'name code');
    res.json(updatedStudent);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Student email already exists' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// DELETE a student
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await student.remove();
    res.json({ message: 'Student unenrolled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;