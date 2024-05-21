import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/globals.scss';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from '../store';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';

const queryClient = new QueryClient();
persistStore(store);

export default function App({ Component, pageProps }: AppProps) {
	return (
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>
				<Component {...pageProps} />;
			</QueryClientProvider>
		</Provider>
	);
}
