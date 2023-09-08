const express = require("express")
const { connect } = require("mongoose")
const connectDB = require("./config/db")
var cors = require("cors")
const app = express()

//Connect DB
connectDB()

//Init middleware
app.use(express.json({ extended: false }))

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*")
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	)
	next()
})
app.use(cors())

app.get("/", (req, res) => {
	res.send("API running")
})

app.use("/api/students", require("./routes/student"))
app.use("/api/courses", require("./routes/course"))
app.use("/api/auth", require("./routes/auth"))
// app.use("/api/posts", require("./routes/api/posts"))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
	console.log(`Port listening on ${PORT}`)
})
