// import { useAppSelector } from '@/store';
// import { useRouter } from 'next/router';
// import { useEffect } from 'react';

// export default function Login() {
// 	const authState = useAppSelector((state) => state.auth.authState);
// 	const router = useRouter();
// 	useEffect(() => {
// 		if (authState) router.push('/dashboard');
// 		else router.push('/login');
// 	}, [authState, router]);
// }

import Link from 'next/link';

export default function Home() {
	return (
		<div>
			<h1>Home</h1>
			<Link href='/about'>About</Link>
		</div>
	);
}
