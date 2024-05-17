import { Form } from 'react-bootstrap';
import styles from './styles.module.scss';

import React, { ChangeEvent } from 'react';

interface InputProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  label,
  type,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <Form.Group className={styles.input} controlId='formBasicEmail'>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        
      />
    </Form.Group>
  );
};

export default Input;
