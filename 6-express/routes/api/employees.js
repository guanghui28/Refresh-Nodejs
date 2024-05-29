const express = require("express");
const path = require("path");
const router = express.Router();
const {
	getAllEmployees,
	createEmployee,
	updateEmployee,
	deleteEmployee,
	getEmployee,
} = require("../../controllers/employeeController");

router
	.route("/")
	.get(getAllEmployees)
	.post(createEmployee)
	.put(updateEmployee)
	.delete(deleteEmployee);

router.route("/:id").get(getEmployee);

module.exports = router;
