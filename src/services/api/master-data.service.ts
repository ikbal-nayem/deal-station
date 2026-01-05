import { axiosIns } from '@/config/api.config';
import { EnumDTO, IApiRequest, IApiResponse } from '@/interfaces/common.interface';
import { ICommonMasterData } from '@/interfaces/master-data.interface';

const createMasterDataCrud = <T extends { id: string }>(defaultEntity: string) => ({
	get: async (params?: { entity?: string }): Promise<IApiResponse<T[]>> => {
		const entity = params?.entity || defaultEntity;
		return axiosIns.get(`/master-data/${entity}/get?deleted=false`);
	},
	getList: async (
		params: IApiRequest & {
			entity?: string;
		}
	): Promise<IApiResponse<T[]>> => {
		const entity = params?.entity || defaultEntity;
		return axiosIns.post(`/master-data/${entity}/get-list`, params);
	},
	getDetails: async (params: { entity?: string; id: string }): Promise<IApiResponse<T>> => {
		const entity = params.entity || defaultEntity;
		return axiosIns.get(`/master-data/${entity}/get-by-id/${params.id}`);
	},
	add: async (params: { entity?: string; payload: Omit<T, 'id'> }): Promise<IApiResponse<T>> => {
		const entity = params.entity || defaultEntity;
		return axiosIns.post(`/master-data/${entity}/create`, params.payload);
	},
	update: async (params: { entity?: string; payload: T }): Promise<IApiResponse<T>> => {
		const entity = params.entity || defaultEntity;
		return axiosIns.put(`/master-data/${entity}/update`, params.payload);
	},
	delete: async (params: { entity?: string; id: string }): Promise<void> => {
		const entity = params.entity || defaultEntity;
		return axiosIns.delete(`/master-data/${entity}/delete/${params.id}`);
	},
});

export const MasterDataService = {
	getEnum: async (enumType: 'gender'): Promise<IApiResponse<EnumDTO[]>> => {
		return axiosIns.get(`/master-data/enum/${enumType}`);
	},

	category: {
		...createMasterDataCrud<ICommonMasterData>('category'),
		add: (payload: Omit<ICommonMasterData, 'id'>) =>
			createMasterDataCrud<ICommonMasterData>('category').add({ payload }),
		update: (payload: ICommonMasterData) =>
			createMasterDataCrud<ICommonMasterData>('category').update({ payload }),
		delete: (id: string) => createMasterDataCrud<ICommonMasterData>('category').delete({ id }),
	},
	tag: {
		...createMasterDataCrud<ICommonMasterData>('tag'),
		add: (payload: Omit<ICommonMasterData, 'id'>) =>
			createMasterDataCrud<ICommonMasterData>('tag').add({ payload }),
		update: (payload: ICommonMasterData) => createMasterDataCrud<ICommonMasterData>('tag').update({ payload }),
		delete: (id: string) => createMasterDataCrud<ICommonMasterData>('tag').delete({ id }),
	},
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
