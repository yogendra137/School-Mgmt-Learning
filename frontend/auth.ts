// auth.ts: Handle Authentication Logic
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export function checkAuthentication(
	req: NextRequest,
	protectedRoutes: string[],
	publicRoutes: string[]
) {
	const path = req.nextUrl.pathname;
	const isProtectedRoute = protectedRoutes.includes(path);
	const isPublicRoute = publicRoutes.includes(path);
	const cookie = cookies().get('token')?.value;

	if (isProtectedRoute && !cookie) {
		return NextResponse.redirect(new URL('/login', req.nextUrl));
	}

	if (
		isProtectedRoute &&
		cookie &&
		!req.nextUrl.pathname.startsWith('/dashboard')
	) {
		return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
	}

	if (
		isPublicRoute &&
		cookie &&
		!req.nextUrl.pathname.startsWith('/dashboard')
	) {
		return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
	}

	return null;
}
