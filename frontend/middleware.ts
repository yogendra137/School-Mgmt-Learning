// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { protectedRoutes, publicRoutes } from './routeConfig';
import { checkAuthentication } from './auth';
import { checkPermissions } from './permission';

export default async function middleware(req: NextRequest) {
	// Check if the current route is protected or public
	const authResponse = checkAuthentication(req, protectedRoutes, publicRoutes);
	if (authResponse) {
		return authResponse;
	}

	// Check permissions
	const permissionResponse = checkPermissions(req);
	if (permissionResponse) {
		return permissionResponse;
	}

	// Continue to the next middleware or route handler
	const response = NextResponse.next();

	return response;
}

// Routes Middleware should not run on
export const config = {
	matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
