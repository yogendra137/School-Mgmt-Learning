import styles from './styles.module.scss';
import classNames from 'classnames';
interface ButtonComponentProps {
	type?: 'submit' | 'reset' | 'button';
	onClick?: () => {};
	label?: string;
	value?: string;
	className?: string;
	children: string;
}

const Button: React.FC<ButtonComponentProps> = ({
	type,
	children,
	onClick,
	label,
	value,
	className,
}) => {
	return (
		<button className={classNames(className)} type={type} onClick={onClick}>
			{children}
		</button>
	);
};

export default Button;
