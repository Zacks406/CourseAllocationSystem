const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const Student = require('../model/student');
const { authenticate, authorizeStudent } = require('../middleware/auth');
const Course = require('../model/course');

//List all students
router.get('/', authenticate, async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});
//list courses taken by one student
//@Private
router.get('/courses', authenticate, authorizeStudent, async (req, res) => {
  const studentId = req.user.studentId;
  try {
    const student = await Student.findById(studentId);
    if (student.courses == null || student.courses.length == 0) {
      return res.json([]);
    }
    var courses = [];
    for (const courseInfo of student.courses) {
      console.log(courseInfo);
      const course = await Course.findById(courseInfo.course);
      if (course != null) {
        courses.push(course);
      }
    }

    return res.json(courses);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
});

//Get one student by id
router.get('/:studentId', authenticate, async (req, res) => {
  const studentId = req.params.studentId;
  try {
    const student = await Course.findById(studentId);
    return res.json(student);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//Pick a course
router.put(
  '/courses/pick/:courseId',
  authenticate,
  authorizeStudent,
  async (req, res) => {
    const studentId = req.user.studentId;
    const courseId = req.params.courseId;
    try {
      const student = await Student.findById(studentId);
      student.courses.push({ course: courseId });
      result = await student.save();

      return res.json(result);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }
);

//Drop a course
router.put(
  '/courses/drop/:courseId',
  authenticate,
  authorizeStudent,
  async (req, res) => {
    const studentId = req.user.studentId;
    const courseId = req.params.courseId;
    try {
      const result = await Student.updateOne(
        { _id: studentId },
        {
          $pull: {
            courses: { course: courseId },
          },
        }
      );
      return res.json(result);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: err.message });
    }
  }
);

module.exports = router;
