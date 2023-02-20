const db = require("./db/connection")
const express = require("express")
const app = express()

const {errorHandler500} = require("./controllers/error-handling-controllers")


app.use(express.json())

app.use(errorHandler500)

module.exports = app