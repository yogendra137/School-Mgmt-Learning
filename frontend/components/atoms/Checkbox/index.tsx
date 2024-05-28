import { ChangeEvent, FC, PropsWithChildren, ReactEventHandler } from 'react';
import styles from './styles.module.scss';
import classNames from 'classnames';
import { Check } from '@/components/Icons';

/**
 * Checkbox component
 */
export interface CheckboxProps {
  /** Custom class for Checkbox componenet */
  className?: string;

  /** onChange event */
  onChange: (checked: boolean) => void;

  /** onClick event */
  onClick?: ReactEventHandler;

  /** checkbox checked or not */
  checked?: boolean;

  /** label for checkbox */
  label?: string;

  /** value for checkbox */
  value?: string;

  /** name for checkbox */
  name?: string;

  /** read only for checkbox */
  readOnly?: boolean;
}


const Checkbox: FC<PropsWithChildren<CheckboxProps>> = ({
  className,
  children,
  onChange,
  onClick,
  checked,
  label,
  name,
  value,
  readOnly,
}) => {
    const handleChange = () => {
        onChange(!checked);
      };

      
  return (
    <div
      className={classNames(
        className,
        styles.checkbox,
        checked && styles.checked
      )}
    >
      <label>
        <span>
          <Check />
        </span>
        <input
          type='checkbox'
          value={value}
          name={name}
          onChange={handleChange}
          checked={checked}
          onClick={onClick}
          readOnly={readOnly}
        />
        <p>{label}</p>
      </label>
      {children}
    </div>
  );
};

/** Checkbox component exported */
export default Checkbox;
