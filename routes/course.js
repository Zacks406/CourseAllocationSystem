const express = require('express');
const onlyUnique = require('../helper/findUnique');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const Course = require('../model/course');
const Student = require('../model/student');
const router = express.Router();
const nodemailer = require('nodemailer');

//Get all courses
router.get('/', async (req, res) => {
  try {
    const courseCodes = await Course.find();
    console.log(courseCodes);
    if (courseCodes.length === 0) {
      return res.json([]);
    }

    return res.json(courseCodes);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

//Get all students in one course
router.get(
  '/list-students/:courseCode',
  authenticate,
  authorizeAdmin,
  async (req, res) => {
    const courseCode = req.params.courseCode;
    try {
      //Find all course by code
      const courses = await Course.find({ courseCode });
      var courseIds = [];
      console.log(courses);
      courses.forEach((course) => {
        console.log(course._id);
        courseIds.push(course._id);
      });
      // for (var course in courses) {
      // 	console.log(course._id)
      // 	courseIds.push(course._id)
      // }

      const students = await Student.find({
        'courses.course': { $in: courseIds },
      });

      var studentNames = [];
      students.forEach((student) => {
        studentNames.push(student.fullName);
      });

      //Find all student id of the courses
      //const course

      res.json({ studentNames });
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
);

// Code and name of all unique courses
router.get('/course-codes', authenticate, authorizeAdmin, async (req, res) => {
  try {
    console.log('!23');
    const courseCodes = await Course.find().distinct('courseCode');
    var courses = [];
    var codeAndName = [];
    for (const code of courseCodes) {
      const course = await Course.findOne({ courseCode: code });
      const courseInfo = {
        courseCode: course.courseCode,
        courseName: course.courseName,
      };
      courses.push(courseInfo);
    }

    res.json(courses);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//Get one course by id
router.get('/:courseId', authenticate, async (req, res) => {
  const courseId = req.params.courseId;
  try {
    const course = await Course.findById(courseId);
    return res.json(course);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//create course
router.post('/', authenticate, authorizeAdmin, async (req, res) => {
  {
    /*
  var dotenv = require('dotenv');
  dotenv.config();

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require('twilio')(accountSid, authToken);

  const emailTo = 'zacks.haruna@gmail.com';
  const subject = 'attachment';
  const description = 'pdf';
  const filePassword = '1234567';
  */
  }
  try {
    //Add course to course list
    const course = new Course(req.body);

    //Check if course exists
    const courseInDb = await Course.find({
      $and: [
        { courseCode: course.courseCode },
        { section: course.section },
        { semester: course.semester },
      ],
    });

    if (courseInDb != null && courseInDb.length != 0) {
      return res.status(400).json({ msg: 'Course exists' });
    }

    const newCourse = await course.save();
    res.json(newCourse);

    {
      /*

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: '587',
      tls: {
        ciphers: 'SSLv3',
      },
      secure: false,
      auth: {
        user: process.env.OUTLOOK_MAIL, // email user
        pass: process.env.OUTLOOK_PASSWORD, // email password
      },
    });

    //const html = sendMail(description);

    const options = {
      from: process.env.OUTLOOK_MAIL,
      to: emailTo,
      subject,
      html: `<h2>Hello ${emailTo} </h2>
			<p>Kindly find attached  ${description} file from <strong>Zeenet</strong> </p>
	  
			  <p style="margin-bottom:20px;">Click the link below to download your file at your download page</p>
	
			  <p> Your File Password is: <strong> ${filePassword}</strong>.</p>
	  
			  <a href= http://localhost:3000/download/  style="background:#22c55e;color:white;border:1px solid #22c55e; padding: 10px 15px; border-radius: 4px; text-decoration:none;">Reset Password </a>
	
			  <p style="margin-bottom:0px;">Thank you</p>
			  <strong>Zeenet Team</strong>
				   `,
    };
    await transporter.sendMail(options).catch((error) => console.log(error));
    // res.send({
    // user: {
    // message: 'Email Sent Successfully',
    // },
    // });

    client.messages
      .create({
        body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
        from: '+16189823083',
        to: '+2347032185546',
      })
      .then((message) => console.log(message.sid));
       */
    }
  } catch (err) {
    // res.status(500).json(err.message);
  }
});

//Update course
router.put('/:courseId', authenticate, authorizeAdmin, async (req, res) => {
  var dotenv = require('dotenv');
  dotenv.config();

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require('twilio')(accountSid, authToken);

  const emailTo = req.body.email;
  const subject = req.body.subject;
  const description = req.body.description;
  const phoneNumber = req.body.phoneNumber;
  //const filePassword = '1234567';

  try {
    const courseId = req.params.courseId;

    //Check if course exists
    const courseDuplicated = await Course.find({
      $and: [
        { courseCode: req.body.courseCode },
        { section: req.body.section },
        { semester: req.body.semester },
        { courseLecturer: req.body.courseLecturer },
        { status: req.body.status },
      ],
    });

    if (courseDuplicated != null && courseDuplicated.length != 0) {
      return res.status(400).json({ msg: 'Course exists' });
    }

    const courseInDb = await Course.findById(courseId);

    courseInDb.courseCode = req.body.courseCode;
    courseInDb.section = req.body.section;
    courseInDb.semester = req.body.semester;
    courseInDb.courseLecturer = req.body.courseLecturer;
    courseInDb.status = req.body.status;

    const course = await courseInDb.save();
    //res.json(course);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: '587',
      tls: {
        ciphers: 'SSLv3',
      },
      secure: false,
      auth: {
        user: process.env.OUTLOOK_MAIL, // email user
        pass: process.env.OUTLOOK_PASSWORD, // email password
      },
    });

    //const html = sendMail(description);

    const options = {
      from: process.env.OUTLOOK_MAIL,
      to: emailTo,
      subject,
      html: `<h2>Hello ${emailTo} </h2>
			<p>${description}</p>
			  <p style="margin-bottom:0px;">Thank you</p>
			  <strong>Zeenet Team</strong>
				   `,
    };
    await transporter.sendMail(options).catch((error) => console.log(error));
    // res.send({
    // user: {
    // message: 'Email Sent Successfully',
    // },
    // });

    client.messages
      .create({
        body: 'Congratulations! Your course has been approved by the H.O.D, proceed to your dashboard to comfirm approval, Thank You.',
        from: '+16189823083',
        to: phoneNumber,
      })
      .then((message) => console.log(message.sid));
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//Delete course
router.delete('/:courseId', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findByIdAndDelete(courseId);
    const students = await Student.find({
      'courses.course': courseId,
    });

    for (const student of students) {
      async (student) => {
        const result = await Student.updateOne(
          { _id: student._id },
          {
            $pull: {
              courses: { course: courseId },
            },
          }
        );
      };
    }

    res.json(course);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
