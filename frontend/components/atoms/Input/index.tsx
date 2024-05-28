import React, { forwardRef, ChangeEvent } from 'react';
import { Form } from 'react-bootstrap';
import classNames from 'classnames';
import styles from './styles.module.scss';

interface InputProps {
	label?: string;
	type?: string;
	placeholder?: string;
	value?: string;
	defaultValue?: string;
	className?: string;
	controlId?: string;
	onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
	error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
	({ label, type, placeholder, className, controlId, error, ...rest }, ref) => {
		return (
			<Form.Group
				className={classNames(styles.input, className)}
				controlId={controlId}
			>
				{label && <Form.Label>{label}</Form.Label>}
				<Form.Control
					type={type}
					placeholder={placeholder}
					ref={ref}
					className={classNames(className, { 'is-invalid': error })}
					{...rest}
				/>
				{error && <div className='invalid-feedback'>{error}</div>}
			</Form.Group>
		);
	}
);

Input.displayName = 'Input';

export default Input;
