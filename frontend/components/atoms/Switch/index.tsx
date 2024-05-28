import styles from './styles.module.scss';
import Form from 'react-bootstrap/Form';
import classNames from 'classnames';
interface ButtonComponentProps {
	label?: string;
	className?: string;
	value: string | number | readonly string[] | undefined;
}

const Switch: React.FC<ButtonComponentProps> = ({
	label,
	className,
	value = 0,
}) => {
	return (
		<div className={styles.Switch}>
			<Form.Check // prettier-ignore
				type='switch'
				id='custom-switch'
				label={label}
				value={value}
			/>
		</div>
	);
};

export default Switch;
