const data = {
	employees: require("../model/employees.json"),
	setEmployees: function (data) {
		this.employees = data;
	},
};

const getAllEmployees = (req, res) => {
	res.status(200).json(data.employees);
};

const getEmployee = (req, res) => {
	const { id } = req.params;
	const em = data.employees.find((em) => em.id === +id);
	res.status(200).json({
		employee: em,
	});
};

const createEmployee = (req, res) => {
	const { name, age } = req.body;
	if (!name || !age) {
		return res.status(400).json({
			message: "All field are required!",
		});
	}
	const newEm = {
		id: data.employees.length + 1,
		name,
		age: Number(age),
	};
	data.setEmployees([...data.employees, newEm]);
	res.status(201).json({ employee: newEm });
};

const updateEmployee = (req, res) => {
	const { name, age, id } = req.body;
	if (!name && !age) {
		return res.status(400).json({
			message: "Must be filled",
		});
	}
	const em = data.employees.find((em) => em.id === Number(id));
	if (!em) {
		return res.status(404).json({
			message: "Not found em",
		});
	}
	em.name = name || em.name;
	em.age = Number(age) || em.age;

	res.status(200).json({ employees: data.employees });
};

const deleteEmployee = (req, res) => {
	const { id } = req.body;
	const em = data.employees.find((em) => em.id === Number(id));
	if (!em) {
		return res.status(404).json({
			message: "Not found to deleted",
		});
	}
	data.setEmployees([...data.employees.filter((em) => em.id !== Number(id))]);
	res.status(200).json({ employees: data.employees });
};

module.exports = {
	getAllEmployees,
	createEmployee,
	updateEmployee,
	deleteEmployee,
	getEmployee,
};
