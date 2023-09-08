import React, { Component, useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Col, Row, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function AdminCreateCourse() {
  const [course, setCourse] = useState({
    courseCode: '',
    courseName: '',
    section: '',
    semester: '',
    courseLecturer: '',
    status: '',
  });
  const token = useSelector((state) => state.auth.value.token);

  const navigate = useNavigate();

  const [isAuthorized, setIsAuthorized] = useState(true);

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
      const res = await axios.post(
        `http://localhost:5000/api/courses/`,
        body,
        config
      );
      navigate('../admin/courses/all');
    } catch (err) {
      console.log(err.message);
    }
  };

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
          <Form.Label>courseLecturer</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter course Name"
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

        <Button variant="primary" type="submit">
          Create
        </Button>
      </Form>
    </>
  );
}

export default AdminCreateCourse;
