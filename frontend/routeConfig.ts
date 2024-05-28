//  Define Protected and Public Routes
export const protectedRoutes = [
	'/',
	'/dashboard',
	'/school/add',
	'/school/view/[id]',
	'/schools',
];
export const publicRoutes = ['/login', '/signup'];
export const authRedirection = ['/login', '/signup', '/'];
