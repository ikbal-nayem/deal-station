
import { IFile } from './common.interface';

export interface ICommonMasterData {
	id: string;
	name: string;
	active?: boolean;
	code?: string;
}

export interface IRole extends ICommonMasterData {
	roleCode: string;
	parentId?: string;
	parent?: IRole;
}

export interface IOrganizationUser {
	id: string;
	username: string;
	email: string;
	phone: string;
	organizationId: string;
	organizationName: string;
	fullName: string;
	firstName: string;
	lastName: string;
	roles: IRole[];
	profileImage?: IFile;
	enabled: boolean;
}
