import React, { Component, useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setLocalUserLogin } from '../features/authSlice';

function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const token = localStorage.getItem('token');
  useEffect(() => {
    if (token != null) {
      dispatch(setLocalUserLogin());
    }
  }, []);
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
                <Card.Body>
                  <Card.Title>Course Name: {course.courseName}</Card.Title>
                  <Card.Text>Section: {course.section}</Card.Text>
                  <Card.Text>Semester: {course.semester}</Card.Text>
                  <Card.Text>Lecturer: {course.courseLecturer}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default Home;
