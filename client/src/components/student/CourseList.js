import React, { Component, useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Col, Row, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setLocalUserLogin } from '../../features/authSlice';

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState();

  const [show, setShow] = useState(false);

  const token = useSelector((state) => state.auth.value.token);
  const handleClose = () => setShow(false);
  const handleShow = async (e) => {
    const selectedCourseId = e.target.value;
    console.log(token);
    console.log(localStorage.getItem('token'));
    console.log(selectedCourseId);
    try {
      const config = {
        headers: {
          'Content-Type': 'Application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(
        `http://localhost:5000/api/courses/${selectedCourseId}`,
        config
      );
      setSelectedCourse(res.data);
    } catch (err) {
      console.log(err);
    }

    setShow(true);
  };

  useEffect(() => {
    //call api
    const fetchData = async () => {
      //Set request header
      const config = {
        headers: {
          'Content-Type': 'Application/json',
        },
      };

      const res = await axios.get(`http://localhost:5000/api/courses`, config);
      setCourses(res.data);
      setLoading(false);
      console.log(res.data);
    };

    fetchData();
  }, []);

  const handlePickCourse = async (e) => {
    const courseId = e.target.value;

    try {
      //Set request header
      const config = {
        headers: {
          'Content-Type': 'Application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      console.log(config);
      //Make request
      const res = await axios.put(
        `http://localhost:5000/api/students/courses/pick/${courseId}`,
        {},
        config
      );
    } catch (err) {
      console.log(err);
    }
    handleClose();
  };

  return (
    <div>
      <h2> Courses</h2>
      {!loading && courses.length !== 0 && (
        <Row xs={1} md={3} className="g-4">
          {courses.map((course) => (
            <Col>
              <Card>
                <Card.Header as="h5">
                  Course Code: {course.courseCode}
                </Card.Header>

                {course.status === 'Not assigned' ? (
                  <Card.Body>
                    <Card.Title>Course Name: {course.courseName}</Card.Title>
                    <Card.Text>Section: {course.section}</Card.Text>
                    <Card.Text>Semester: {course.semester}</Card.Text>
                    <Card.Text>Status: {course.status}</Card.Text>
                    <Button
                      variant="primary"
                      value={course._id}
                      onClick={(e) => handleShow(e)}
                    >
                      Pick Course
                    </Button>
                  </Card.Body>
                ) : (
                  <Card.Body>
                    <Card.Title>Course Name: {course.courseName}</Card.Title>
                    <Card.Text>Section: {course.section}</Card.Text>
                    <Card.Text>Semester: {course.semester}</Card.Text>
                    <Card.Text>Status: {course.status}</Card.Text>
                    <Card.Text>Lecturer: {course.courseLecturer}</Card.Text>
                    <Button
                      variant="primary"
                      value={course._id}
                      onClick={(e) => handleShow(e)}
                    >
                      Confirm
                    </Button>
                  </Card.Body>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {selectedCourse != null && (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Course Code: {selectedCourse.courseCode}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Course Name: {selectedCourse.courseName}</p>
            <p>Course Section: {selectedCourse.section}</p>
            <p>Course Semester: {selectedCourse.semester}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button
              value={selectedCourse._id}
              variant="primary"
              onClick={(e) => handlePickCourse(e)}
            >
              Pick Course
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default CourseList;
