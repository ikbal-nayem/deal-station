import { axiosIns } from '@/config/api.config';
import { EnumDTO, IApiRequest, IApiResponse } from '@/interfaces/common.interface';
import { ICommonMasterData } from '@/interfaces/master-data.interface';

const createMasterDataCrud = <T>(entity: string) => ({
	get: async (): Promise<IApiResponse<T[]>> => {
		return axiosIns.get(`/master-data/${entity}/get?deleted=false`);
	},
	getList: async (payload: IApiRequest): Promise<IApiResponse<T[]>> => {
		return axiosIns.post(`/master-data/${entity}/get-list`, payload);
	},
	getDetails: async (id: string): Promise<IApiResponse<T>> => {
		return axiosIns.get(`/master-data/${entity}/get-by-id/${id}`);
	},
	add: async (payload: Omit<T, 'id'>): Promise<IApiResponse<T>> => {
		return axiosIns.post(`/master-data/${entity}/create`, payload);
	},
	update: async (payload: T): Promise<IApiResponse<T>> => {
		return axiosIns.put(`/master-data/${entity}/update`, payload);
	},
	delete: async (id: string): Promise<void> => {
		return axiosIns.delete(`/master-data/${entity}/delete/${id}`);
	},
});

export const MasterDataService = {
	getEnum: async (enumType: 'gender'): Promise<IApiResponse<EnumDTO[]>> => {
		return axiosIns.get(`/master-data/enum/${enumType}`);
	},

	category: createMasterDataCrud<ICommonMasterData>('category'),
	tag: createMasterDataCrud<ICommonMasterData>('tag'),
	country: {
		get: async (): Promise<IApiResponse<ICommonMasterData[]>> => {
			return axiosIns.get(`/master-data/country/get?deleted=false`);
		},
		getList: async (payload: IApiRequest): Promise<IApiResponse<ICommonMasterData[]>> => {
			return axiosIns.post(`/master-data/country/get-list`, payload);
		},
		getDetails: async (id: string): Promise<IApiResponse<ICommonMasterData>> => {
			return axiosIns.get(`/master-data/country/get-by-id/${id}`);
		},
		getDivisions: async (): Promise<IApiResponse<ICommonMasterData[]>> => {
			return axiosIns.get('/master-data/country/divisions');
		},
		getDistricts: async (divisionId?: string): Promise<IApiResponse<ICommonMasterData[]>> => {
			const url = divisionId
				? `/master-data/country/districts?divisionId=${divisionId}`
				: '/master-data/country/districts';
			return await axiosIns.get(url);
		},
		getUpazilas: async (districtId: string): Promise<IApiResponse<ICommonMasterData[]>> => {
			return axiosIns.get(`/master-data/country/upazilas?districtId=${districtId}`);
		},
	},
};
