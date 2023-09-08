import React, { Component, useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function AdminAllCourses({ navigation }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [goEdit, setGoEdit] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');

  const token = useSelector((state) => state.auth.value.token);

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
    };

    fetchData();
  }, []);

  const handleEdit = (e) => {
    e.preventDefault();
    const courseId = e.target.value;
    console.log(courseId);
    setSelectedCourse(courseId);
    setGoEdit(true);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    const courseId = e.target.value;
    try {
      //Set request header
      const config = {
        headers: {
          'Content-Type': 'Application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      //Make request
      const res = await axios.delete(
        `http://localhost:5000/api/courses/${courseId}`,
        config
      );

      var newCourses;
      newCourses = courses.filter(function (item) {
        return item._id !== courseId;
      });
      setCourses(newCourses);
    } catch (err) {
      console.log(err.message);
    }
  };

  if (goEdit) {
    return <Navigate to={`/admin/courses/edit/${selectedCourse}`} />;
    // return (
    // 	<Navigate
    // 		to={{
    // 			pathname: "/admin/courses/edit",
    // 			data: { courseId: selectedCourse }
    // 		}}
    // 	/>
    // )
  }

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
                  <Button
                    value={course._id}
                    variant="primary"
                    onClick={(e) => handleEdit(e)}
                  >
                    Edit
                  </Button>
                  <Button
                    value={course._id}
                    variant="primary"
                    onClick={(e) => handleDelete(e)}
                  >
                    Delete
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

export default AdminAllCourses;
