import React, { Component, useEffect, useState } from "react"
import axios from "axios"
import { Button, Card, Col, Row, Form } from "react-bootstrap"
import { useSelector } from "react-redux"
import "./AdminUniqueCourse.css"

function AdminUniqueCourses() {
	const [courseCode, setCouorseCode] = useState()

	const [students, setStudents] = useState([])

	const [courses, setCourses] = useState([])

	const [loading, setLoading] = useState(true)

	const token = useSelector((state) => state.auth.value.token)

	const [isAuthorized, setIsAuthorized] = useState(true)

	useEffect(() => {
		//call api
		const fetchData = async () => {
			try {
				//Set request header
				const config = {
					headers: {
						"Content-Type": "Application/json",
						Authorization: `Bearer ${token}`
					}
				}

				const res = await axios.get(
					`http://localhost:5000/api/courses/course-codes`,
					config
				)
				setCourses(res.data)
				setIsAuthorized(true)
				setLoading(false)
				console.log(res.data)
			} catch (error) {
				console.log(error.response)
				if (error.response.status === 403) {
					setIsAuthorized(false)
				}
			}
		}

		fetchData()
	}, [])

	const onInputChange = (e) => {
		setCouorseCode(e.target.value)
	}

	const handleSearch = async (e) => {
		e.preventDefault()
		var code = ""
		if (e.target.value != null) {
			setCouorseCode(e.target.value)
			code = e.target.value
		} else {
			code = courseCode
		}

		try {
			//Set request header
			const config = {
				headers: {
					"Content-Type": "Application/json",
					Authorization: `Bearer ${token}`
				}
			}

			//Make request
			const res = await axios.get(
				`http://localhost:5000/api/courses/list-students/${code}`,
				config
			)
			setIsAuthorized(true)
			setStudents(res.data.studentNames)
		} catch (error) {
			console.log(error.response)
			if (error.response.status === 403) {
				setIsAuthorized(false)
			}
		}
	}

	return (
		<>
			{/* <Form onSubmit={(e) => handleSearch(e)}>
				<Form.Group className="mb-3" controlId="formBasicEmail">
					<Form.Label>Course Code</Form.Label>
					<Form.Control
						type="txt"
						placeholder="Enter course code"
						name="courseCode"
						value={courseCode}
						onChange={(e) => onInputChange(e)}
					/>
				</Form.Group>
				<Button variant="primary" type="submit">
					Search
				</Button>
			</Form> */}

			{!isAuthorized && <p>You don't have authorization to this page</p>}

			{students != null && students.length !== 0 && (
				<div>
					<h2 className="title">Student list of Course: {courseCode}</h2>
					<Row
						xs={1}
						md={3}
						className="g-4 bg-primary text-white"
						style={{ margin: "1px" }}
					>
						{students.map((student) => (
							<p>{student}</p>
						))}
					</Row>
				</div>
			)}
			{
				students == null || students.length == 0 &&courseCode!=null&& (
					<h2>No students in {courseCode}</h2>
				)
			}

			{!loading && courses != null && courses.length !== 0 && (
				<Row xs={1} md={3} className="g-4">
					{courses.map((course) => (
						<Col>
							<Card>
								<Card.Header as="h5">
									Course Code: {course.courseCode}
								</Card.Header>
								<Card.Body>
									<Card.Title>Course Name: {course.courseName}</Card.Title>
									<Button
										value={course.courseCode}
										variant="primary"
										onClick={(e) => handleSearch(e)}
									>
										Show Students
									</Button>
								</Card.Body>
							</Card>
						</Col>
					))}
				</Row>
			)}
		</>
	)
}

export default AdminUniqueCourses
