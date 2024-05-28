export interface ILoginParams {
	email: string;
	password: string;
}

export interface IPermissionMatrix {
	SA: {
		[key: string]: string[];
	};
	PC: {
		[key: string]: string[];
	};
	MC: {
		[key: string]: string[];
	};
	MP: {
		[key: string]: string[];
	};
	VO: {
		[key: string]: string[];
	};
	SC: {
		[key: string]: string[];
	};
}

export type IRole = 'SA' | 'PC' | 'MC' | 'MP' | 'VO' | 'SC';

export interface ISchool {
	contactEmail: string;
	contactNumber: string;
	contactPerson: string;
	location: object;
	schoolName: string;
	_id: string;
	isActive: boolean;
}

export interface IUser {
	_id: string;
	isActive: boolean;
	mobileNo: number;
	location: object;
	name: string;
	email: string;
}
