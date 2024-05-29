const EmployeeModel = require("../model/Employee");

const getAllEmployees = async (req, res) => {
	const employees = await EmployeeModel.find();
	res.status(200).json({ employees });
};

const getEmployee = async (req, res) => {
	const { id } = req.params;
	const employee = await EmployeeModel.findById(id);
	res.status(200).json({
		employee,
	});
};

const createEmployee = async (req, res) => {
	const { name, age } = req.body;
	if (!name || !age) {
		return res.status(400).json({
			message: "All field are required!",
		});
	}
	const newEmployee = await EmployeeModel.create({
		name,
		age: Number(age),
	});

	res.status(201).json({ employee: newEmployee });
};

const updateEmployee = async (req, res) => {
	const { name, age, id } = req.body;
	if (!id) {
		return res.status(400).json({
			message: "You need to provide ID",
		});
	}

	if (!name && !age) {
		return res.status(400).json({
			message: "Must be filled",
		});
	}
	const employee = await EmployeeModel.findById(id);
	if (!employee) {
		return res.status(404).json({
			message: "Not found employee",
		});
	}

	employee.name = name || employee.name;
	employee.age = Number(age) || employee.age;

	await employee.save();

	res.status(200).json({ employee });
};

const deleteEmployee = async (req, res) => {
	const { id } = req.body;
	if (!id) {
		return res.status(400).json({
			message: "You must provide Employee ID",
		});
	}
	const employee = await EmployeeModel.findById(id);
	if (!employee) {
		return res.status(404).json({
			message: "Not found to deleted",
		});
	}
	await EmployeeModel.findByIdAndDelete(id);
	res.status(200).json({ message: "Delete employee success" });
};

module.exports = {
	getAllEmployees,
	createEmployee,
	updateEmployee,
	deleteEmployee,
	getEmployee,
};
