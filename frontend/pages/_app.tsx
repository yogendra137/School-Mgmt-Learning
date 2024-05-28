import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/globals.scss';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from '../store';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import permissionControl from '@/common/permissionControl';
import { IRole } from '@/interfaces';

const queryClient = new QueryClient();
persistStore(store);

export default function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter();
	const userType = Cookies.get('userType');
	const currentSection = router.pathname?.split('/')[1];
	let permissionList: string[] = [];
	if (userType) {
		permissionList = permissionControl(
			userType as IRole,
			currentSection
		).permissions;
	}
	return (
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				<Component {...pageProps} permission={permissionList} />
			</QueryClientProvider>
		</Provider>
	);
}
