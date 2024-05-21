import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import LoginPage from '@/pages/login';

describe('Page', () => {
	it('renders a heading', () => {
		render(<LoginPage />);

		const heading = screen.getByRole('heading', { level: 1 });

		expect(heading).toBeInTheDocument();
	});

	// it('link in the page', () => {
	// 	render(<Page />);

	// 	const link = screen.getByRole('link');

	// 	expect(link).toBeInTheDocument();
	// });

	// it('about inside the page', () => {
	// 	render(<Page />);

	// 	const link = screen.getByRole('link');

	// 	expect(link).toHaveTextContent('About');
	// });
});
