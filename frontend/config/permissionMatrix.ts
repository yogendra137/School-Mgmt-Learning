const protectedRoutes = ['/dashboard', '/school/add', '/school/view/[id]'];

const permissionMatrix = {
	SA: {
		dashboard: ['view'],
		'add-school': ['add'],
		schools: ['add', 'view', 'edit', 'delete'],
		'project-coordinators': ['add', 'view', 'edit', 'delete'],
		'medical-coordinators': ['add', 'view', 'edit', 'delete'],
		'medical-practitioners': ['add', 'view', 'edit', 'delete'],
		volunteers: ['add', 'view', 'edit', 'delete'],
		bootcamps: ['add', 'view', 'edit', 'delete'],
		resources: ['add', 'view', 'edit', 'delete'],
		participant: ['add', 'view', 'edit', 'delete'],
	},
	PC: {},
	MC: {
		participant: ['view', 'edit', 'assign-glasses'],
	},
	MP: {
		participant: ['view', 'edit'],
	},
	VO: {
		participant: ['view', 'add'],
	},
	SC: {},
};

export default permissionMatrix;
