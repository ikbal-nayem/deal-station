import { ROLES } from '@/constants/auth.constant';
import { EnumDTO, IFile, IObject } from './common.interface';

export interface IAuthInfo {
	access_token: string;
	refresh_token: string;
	token_type: string;
	expires_in: number;
}

export interface IUser {
	id?: string;
	username: string;
	email: string;
	roles: ROLES[];
	openInterestModal?: boolean;
	firstName: string;
	lastName: string;
	fullName?: string;
	phone?: string;
	profileImage?: IFile;
	dateOfBirth?: string;
	gender?: string;
	genderDTO?: EnumDTO;
	organizationId?: string;
	organization?: IObject;
}
