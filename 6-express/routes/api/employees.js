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
const { verifyJWT } = require("../../middleware/verifyJWT");

router.use(verifyJWT);

router
	.route("/")
	.get(getAllEmployees)
	.post(createEmployee)
	.put(updateEmployee)
	.delete(deleteEmployee);

router.route("/:id").get(getEmployee);

module.exports = router;
