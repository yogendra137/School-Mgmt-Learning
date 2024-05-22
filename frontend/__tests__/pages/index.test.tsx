// import '@testing-library/jest-dom';
// import { render, screen } from '@testing-library/react';
// import LoginPage from '@/pages/login';
// import { Provider } from 'react-redux';
// import { store } from '@/store';
// import mockRouter from 'next-router-mock';

// jest.mock('next/router', () => jest.requireActual('next-router-mock'));

// describe('Page', () => {
// 	it('renders a login page', () => {
// 		// Set the initial url:
// 		mockRouter.push('/login');

// 		render(<LoginPage />);

// 		expect(screen.getByText(/login/i)).toBeInTheDocument();
// 	});
// });

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Page from '@/pages';

describe('Page', () => {
	it('renders a heading', () => {
		render(<Page />);

		const heading = screen.getByRole('heading', { level: 1 });

		expect(heading).toBeInTheDocument();
	});

	it('link in the page', () => {
		render(<Page />);

		const link = screen.getByRole('link');

		expect(link).toBeInTheDocument();
	});

	it('about inside the page', () => {
		render(<Page />);

		const link = screen.getByRole('link');

		expect(link).toHaveTextContent('About');
	});
});
