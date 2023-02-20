const db = require("./db/connection")
const express = require("express")
const app = express()

const {errorHandler500} = require("./controllers/error-handling-controllers")
const {getCategories} = require("./controllers/categories-controllers")


app.use(express.json())

app.get("/api/categories", getCategories)

app.use(errorHandler500)

module.exports = app