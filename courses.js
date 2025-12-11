const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Student = require('../models/Student');

// GET all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a specific course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE a new course
router.post('/', async (req, res) => {
  try {
    const course = new Course({
      name: req.body.name,
      code: req.body.code,
      instructor: req.body.instructor,
      credits: req.body.credits
    });

    const newCourse = await course.save();
    res.status(201).json(newCourse);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Course code already exists' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// UPDATE a course
router.put('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.name = req.body.name || course.name;
    course.code = req.body.code || course.code;
    course.instructor = req.body.instructor || course.instructor;
    course.credits = req.body.credits || course.credits;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Course code already exists' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
});

// DELETE a course
router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Delete all students enrolled in this course
    await Student.deleteMany({ courseId: course._id });

    // Delete the course
    await course.remove();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;