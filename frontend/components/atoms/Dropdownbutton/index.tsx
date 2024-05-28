// components/VariantsExample.tsx
import React from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import styles from './styles.module.scss';
import {
	ActionToggleIcon,
	DeleteIcon,
	EditIcon,
	ViewIcon,
} from '@/components/Icons';

const DropdownBtn: React.FC = ({
	onViewClick = () => {},
	onEditClick = () => {},
	onDeleteClick = () => {},
}) => {
	return (
		<>
			<div className={styles.actionDropdown}>
				<DropdownButton id='dropdown-item-button' title={<ActionToggleIcon />}>
					<Dropdown.Item as='button' onClick={onViewClick}>
						<ViewIcon /> View
					</Dropdown.Item>
					<Dropdown.Item as='button' onClick={onEditClick}>
						<EditIcon /> Edit
					</Dropdown.Item>
					<Dropdown.Item as='button' onClick={onDeleteClick}>
						<DeleteIcon /> Delete
					</Dropdown.Item>
				</DropdownButton>
			</div>
		</>
	);
};

export default DropdownBtn;
