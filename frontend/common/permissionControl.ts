import permissionMatrix from '@/config/permissionMatrix';
import { IPermissionMatrix, IRole } from '@/interfaces';

const permissionControl = (userType: IRole, section: string) => {
	const permissionMatrixList: IPermissionMatrix = permissionMatrix;
	const permissions = permissionMatrixList[userType][section];
	return {
		permissions,
		hasPermission: Boolean(permissionMatrixList[userType][section]),
	};
};

export default permissionControl;
