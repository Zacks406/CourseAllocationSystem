//course code, course name, section, semester

const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
  },
  courseName: {
    type: String,
  },
  section: {
    type: String,
  },
  semester: {
    type: String,
  },
  courseLecturer: {
    type: String,
  },
  status: {
    type: String,
  },
});

const Course = mongoose.model('course', CourseSchema);

module.exports = Course;
