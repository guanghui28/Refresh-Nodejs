const express = require("express");
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
const asyncHandler = require("../../helpers/asyncHandler");

router.use(verifyJWT);

router
	.route("/")
	.get(asyncHandler(getAllEmployees))
	.post(verifyRoles(ROLES.ADMIN, ROLES.EDITOR), asyncHandler(createEmployee))
	.put(verifyRoles(ROLES.ADMIN, ROLES.EDITOR), asyncHandler(updateEmployee))
	.delete(verifyRoles(ROLES.ADMIN), asyncHandler(deleteEmployee));

router.route("/:id").get(asyncHandler(getEmployee));

module.exports = router;
