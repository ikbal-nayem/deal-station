
import { IFile } from './common.interface';

export interface ICommonMasterData {
	id: string;
	nameEn: string;
	nameBn: string;
	active: boolean;
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
	organizationNameEn: string;
	organizationNameBn: string;
	fullName: string;
	firstName: string;
	lastName: string;
	roles: IRole[];
	profileImage?: IFile;
	enabled: boolean;
}
