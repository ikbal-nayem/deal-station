
import { axiosIns } from '@/config/api.config';
import { IUser } from '@/interfaces/auth.interface';
import { IApiResponse, IObject } from '@/interfaces/common.interface';

export const UserService = {
	saveProfileImage: async (formData: FormData): Promise<IApiResponse<any>> => {
		return axiosIns.post('/user/profile-image/save', formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		});
	},

	getUserDetails: async (): Promise<IApiResponse<IUser>> => {
		return axiosIns.get('/user/get-details');
	},

	createUser: async (payload: IObject): Promise<IApiResponse<IUser>> => {
		return axiosIns.post('/user/create', payload);
	},

	createOwnUser: async (payload: IObject): Promise<IApiResponse<IUser>> => {
		return axiosIns.post('/user/create-own', payload);
	},

	updateUser: async (payload: IObject): Promise<IApiResponse<IUser>> => {
		return axiosIns.put('/user/update', payload);
	},

	deleteUser: async (id: string): Promise<IApiResponse<void>> => {
		return axiosIns.delete(`/user/delete/${id}`);
	},

	toggleActiveStatus: async (id: string): Promise<IApiResponse<boolean>> => {
		return axiosIns.post(`/user/toggle-active-status/${id}`);
	},
};
