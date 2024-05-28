import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import PermissionControl from './common/permissionControl';
import { IRole } from './interfaces';

// 1. Specify protected and public routes
const protectedRoutes = ['/dashboard', '/school/add', '/school/view/[id]', '/'];

const publicRoutes = ['/login', '/signup'];

export default async function middleware(req: NextRequest) {
	// 2. Check if the current route is protected or public
	const path = req.nextUrl.pathname;
	const isProtectedRoute = protectedRoutes.includes(path);
	const isPublicRoute = publicRoutes.includes(path);

	// 3. Decrypt the session from the cookie
	const cookie = cookies().get('token')?.value;
	const userTypeCookie: IRole =
		(cookies().get('userType')?.value as IRole) ?? '';

	// 5. Redirect to /login if the user is not authenticated
	if (isProtectedRoute && !cookie) {
		return NextResponse.redirect(new URL('/login', req.nextUrl));
	}

	//  Redirect to /login if the user is not authenticated
	if (
		isProtectedRoute &&
		cookie &&
		!req.nextUrl.pathname.startsWith('/dashboard')
	) {
		return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
	}

	// 6. Redirect to /dashboard if the user is authenticated
	if (
		isPublicRoute &&
		cookie &&
		!req.nextUrl.pathname.startsWith('/dashboard')
	) {
		return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
	}

	if (userTypeCookie)
		if (
			!PermissionControl(userTypeCookie, path?.split('/')[1]).hasPermission &&
			!req.nextUrl.pathname.startsWith('/page403')
		)
			return NextResponse.redirect(new URL('/page403', req.nextUrl));

	// return NextResponse.next({
	// });
	// Set custom header with permissions
	// const permissions = permissionMatrix[userTypeCookie][path?.split('/')[1]];
	const permissions = '';
	const response = NextResponse.next();
	if (permissions) {
		response.headers.set('x-user-permissions', JSON.stringify(permissions));
	}

	return response;
}

// Routes Middleware should not run on
export const config = {
	matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
