// permission.ts: Handle Permission Logic
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import PermissionControl from './common/permissionControl';
import { IRole } from './interfaces';

export function checkPermissions(req: NextRequest) {
	const path = req.nextUrl.pathname;
	const userTypeCookie: IRole =
		(cookies().get('userType')?.value as IRole) ?? '';

	if (userTypeCookie) {
		const permissionCheck = PermissionControl(
			userTypeCookie,
			path?.split('/')[1]
		);
		if (
			!permissionCheck.hasPermission &&
			!req.nextUrl.pathname.startsWith('/page403')
		) {
			return NextResponse.redirect(new URL('/page403', req.nextUrl));
		}
	}

	return null;
}
