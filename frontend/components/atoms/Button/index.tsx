import styles from './styles.module.scss';

import React, { ChangeEvent } from 'react';

interface ButtonProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Button: React.FC<ButtonProps> = ({ type, value }) => {
  return (
    <div className={styles.input}>
    <button
      type={type}
      value={value}
      
     
    />
    </div>
  );
};

export default Input;