import React, { Component, useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Col, Row, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLocalUserLogin } from '../../features/authSlice';

function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const dispatch = useDispatch();
  useEffect(() => {
    if (token != null) {
      dispatch(setLocalUserLogin());
    }
    setLoading(false);
  }, []);
  useEffect(() => {
    //call api
    const fetchData = async () => {
      //Set request header
      const config = {
        headers: {
          'Content-Type': 'Application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.get(
        `http://localhost:5000/api/students/courses`,
        config
      );
      setCourses(res.data);
      setLoading(false);

      console.log(res.data);
    };

    fetchData();
  }, []);
  let navigate = useNavigate();

  const handleDeleteCourse = async (e) => {
    const courseId = e.target.value;
    try {
      //Set request header
      const config = {
        headers: {
          'Content-Type': 'Application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      console.log(token);

      //Make request
      const res = await axios.put(
        `http://localhost:5000/api/students/courses/drop/${courseId}`,
        {},
        config
      );
      console.log();
      var newCourses;
      newCourses = courses.filter(function (item) {
        return item._id !== courseId;
      });
      setCourses(newCourses);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h2> Courses</h2>
      {!loading && courses.length !== 0 && courses != null && (
        <Row xs={1} md={3} className="g-4">
          {courses.map((course) => (
            <Col>
              <Card>
                <Card.Header as="h5">
                  Course Code: {course.courseCode}
                </Card.Header>
                <Card.Body>
                  <Card.Title>Course Name: {course.courseName}</Card.Title>
                  <Card.Text>Section: {course.section}</Card.Text>
                  <Card.Text>Semester: {course.semester}</Card.Text>

                  <Button
                    variant="primary"
                    value={course._id}
                    onClick={(e) => handleDeleteCourse(e)}
                  >
                    Drop Course
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default StudentCourses;
