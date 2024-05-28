// auth.ts: Handle Authentication Logic
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { authRedirection } from './routeConfig';

export function checkAuthentication(
	req: NextRequest,
	protectedRoutes: string[],
	publicRoutes: string[]
) {
	const path = req.nextUrl.pathname;
	const isProtectedRoute = protectedRoutes.includes(path);
	const isPublicRoute = publicRoutes.includes(path);
	const cookie = cookies().get('token')?.value;

	if (!isPublicRoute && !isProtectedRoute) {
		return NextResponse.redirect(new URL('/page403', req.nextUrl));
	}

	if (isProtectedRoute && !cookie) {
		return NextResponse.redirect(new URL('/login', req.nextUrl));
	}

	if (isPublicRoute && cookie && authRedirection.includes(path)) {
		return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
	}

	return null;
}
