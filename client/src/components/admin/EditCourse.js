import React, { Component, useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Col, Row, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useParams, Navigate } from 'react-router-dom';

function EditCourse(props) {
  const [course, setCourse] = useState({
    courseCode: '',
    courseName: '',
    section: '',
    semester: '',
    courseLecturer: '',
    email: '',
    subject: '',
    description: '',
    phoneNumber: '',
    status: '',
  });
  const token = useSelector((state) => state.auth.value.token);

  const { courseId } = useParams();

  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //Set request header
        const config = {
          headers: {
            'Content-Type': 'Application/json',
            Authorization: `Bearer ${token}`,
          },
        };

        //Make request
        const res = await axios.get(
          `http://localhost:5000/api/courses/${courseId}`,
          config
        );

        console.log(res.data);
        setCourse({
          courseCode: res.data.courseCode,
          courseName: res.data.courseName,
          section: res.data.section,
          semester: res.data.semester,
          courseLecturer: res.data.courseLecturer,
          status: res.data.status,
        });
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchData();
  }, []);

  const onInputChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };
  const handleCreateCourse = async (e) => {
    e.preventDefault();

    const body = course;
    try {
      //Set request header
      const config = {
        headers: {
          'Content-Type': 'Application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      //Make request
      const res = await axios.put(
        `http://localhost:5000/api/courses/${courseId}`,
        body,
        config
      );
      setIsUpdate(true);
    } catch (err) {
      console.log(err.message);
    }
  };

  if (isUpdate) {
    return <Navigate to="/admin/courses/all" />;
  }

  return (
    <>
      <Form onSubmit={(e) => handleCreateCourse(e)}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>courseCode</Form.Label>
          <Form.Control
            type="txt"
            placeholder="courseCode"
            name="courseCode"
            value={course.courseCode}
            onChange={(e) => onInputChange(e)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>courseName</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter course Name"
            name="courseName"
            value={course.courseName}
            onChange={(e) => onInputChange(e)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Section</Form.Label>
          <Form.Control
            type="text"
            placeholder="section"
            name="section"
            value={course.section}
            onChange={(e) => onInputChange(e)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>semester</Form.Label>
          <Form.Control
            type="semester"
            placeholder="Enter semester"
            name="semester"
            value={course.semester}
            onChange={(e) => onInputChange(e)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>semester</Form.Label>
          <Form.Control
            type="semester"
            placeholder="Enter couresLecturer"
            name="courseLecturer"
            value={course.courseLecturer}
            onChange={(e) => onInputChange(e)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Status</Form.Label>
          <Form.Control
            as="select"
            custom
            name="status"
            onChange={(e) => onInputChange(e)}
          >
            <option value="default">default</option>
            <option value="Not assigned">Not assigned</option>
            <option value="Assigned">Assigned</option>
          </Form.Control>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>email</Form.Label>
          <Form.Control
            type="semester"
            placeholder="Enter email"
            name="email"
            value={course.email}
            onChange={(e) => onInputChange(e)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>subject</Form.Label>
          <Form.Control
            type="semester"
            placeholder="Enter subject"
            name="subject"
            value={course.subject}
            onChange={(e) => onInputChange(e)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>description</Form.Label>
          <Form.Control
            type="semester"
            placeholder="Enter description"
            name="description"
            value={course.description}
            onChange={(e) => onInputChange(e)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>phoneNumber</Form.Label>
          <Form.Control
            type="semester"
            placeholder="Enter phoneNumber"
            name="phoneNumber"
            value={course.phoneNumber}
            onChange={(e) => onInputChange(e)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Update
        </Button>
      </Form>
    </>
  );
}

export default EditCourse;
