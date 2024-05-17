import styles from './styles.module.scss';

interface ButtonComponentProps {
  type: 'submit' | 'reset' | 'button';
  onClick: () => void;
  label: string;
  value: string;
  className: string;
  variant: string;
}

const Button: React.FC<ButtonComponentProps> = ({
  type,
  onClick,
  label,
  value,
  className,
  variant = 'primary',
}) => {
  return (
    <button
      className={`${variant} ${styles.button}`}
      type={type}
      onClick={onClick}
    >
      {value}
    </button>
  );
};

export default Button;
