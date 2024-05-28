import React from 'react';
import { Form } from 'react-bootstrap';
import styles from './styles.module.scss';
import classNames from 'classnames';
import { UseFormRegisterReturn } from 'react-hook-form';

interface Option {
	value: string;
	label: string;
}

interface SelectProps {
	label: string;
	options: Option[];
	value: string;
	onChange: (value: string) => void;
	error?: string; // Optional error message
	register: UseFormRegisterReturn; // React Hook Form register function
	className?: string;
}

const Select: React.FC<SelectProps> = ({
	label,
	options,
	value,
	onChange,
	error,
	register,
	className,
}) => {
	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		onChange(e.target.value);
	};

	return (
		<Form.Group
			className={classNames(styles.input, className)}
			controlId='formBasicEmail'
		>
			<Form.Label>{label}</Form.Label>
			<Form.Select value={value} onChange={handleChange} {...register}>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</Form.Select>
			{error && <Form.Text className='text-danger'>{error}</Form.Text>}{' '}
			{/* Display error message if exists */}
		</Form.Group>
	);
};

export default Select;
