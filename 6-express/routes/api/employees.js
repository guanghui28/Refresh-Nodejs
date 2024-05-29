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
const ROLES = require("../../configs/rolesList");
const { verifyRoles } = require("../../middleware/verifyRoles");

router.use(verifyJWT);

router
	.route("/")
	.get(getAllEmployees)
	.post(verifyRoles(ROLES.ADMIN, ROLES.EDITOR), createEmployee)
	.put(verifyRoles(ROLES.ADMIN, ROLES.EDITOR), updateEmployee)
	.delete(verifyRoles(ROLES.ADMIN), deleteEmployee);

router.route("/:id").get(getEmployee);

module.exports = router;
