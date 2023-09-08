import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';

function AdminAllStudents() {
  const [students, setStudents] = useState([]);
  const token = useSelector((state) => state.auth.value.token);
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

      const res = await axios.get(`http://localhost:5000/api/students`, config);
      setStudents(res.data);
      console.log(res.data);
    };

    fetchData();
  }, []);
  return (
    <div>
      <h2>Lecturer list</h2>
      <Row xs={1} md={3} className="g-4">
        {students.map((student) => (
          <Col>
            <Card>
              <Card.Header as="h5">
                Name: {student.firstName + ' ' + student.lastName}
              </Card.Header>
              <Card.Body>
                <Card.Title>Lecturer Id: {student.studentNumber}</Card.Title>
                <Card.Text>Department : {student.department}</Card.Text>
                <Card.Text>Email: {student.email}</Card.Text>
                <Card.Text>
                  Address: {student.address + ' ' + student.city}
                </Card.Text>
                <Card.Text>GitHub: {student.gitHub}</Card.Text>
                <Card.Text>LinkedIn: {student.linkedIn}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default AdminAllStudents;
