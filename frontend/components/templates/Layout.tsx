import { useRouter } from 'next/router';
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const routesWithoutHeaderAndSidebar = ['/login', '/_error'];
function Layout({
	children,
}: {
	children: React.ReactNode;
}): React.ReactElement | null {
	const router = useRouter();
	return !routesWithoutHeaderAndSidebar.includes(router.route) ? (
		<>
			<Header />
			<Sidebar />
			<section className='MainWrapper'>{children}</section>
		</>
	) : (
		<>{children}</>
	);
}

export default Layout;
