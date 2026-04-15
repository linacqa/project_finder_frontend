import { BaseEntityService } from "./BaseEntityService";
import { IProject } from "@/types/domain/IProject";
import { IProjectAdd } from "@/types/domain/IProjectAdd";
import { IProjectsSearchResult } from "@/types/IProjectsSearchResult";
import { IResultObject } from "@/types/IResultObject";
import { AxiosError } from "axios";

export interface IProjectSearchParams {
	title?: string;
	minStudents?: number;
	maxStudents?: number;
	tagIds?: string[];
	statusIds?: string[];
	projectTypeIds?: string[];
	page?: number;
	pageSize?: number;
}

export class ProjectService extends BaseEntityService<IProject, IProjectAdd> {
	constructor() {
		super('projects');
	}

	async searchAsync(search: IProjectSearchParams = {}): Promise<IResultObject<IProjectsSearchResult>> {
		try {
			const params = new URLSearchParams();

			if (search.title) params.append("title", search.title);
			if (search.minStudents !== undefined) params.append("minStudents", search.minStudents.toString());
			if (search.maxStudents !== undefined) params.append("maxStudents", search.maxStudents.toString());
			search.tagIds?.forEach((id) => params.append("tagIds", id));
			search.statusIds?.forEach((id) => params.append("StatusIds", id));
			search.projectTypeIds?.forEach((id) => params.append("ProjectTypeIds", id));
			if (search.page !== undefined) params.append("page", search.page.toString());
			if (search.pageSize !== undefined) params.append("pageSize", search.pageSize.toString());

			const response = await this.axiosInstance.get<IProjectsSearchResult>(`${this.basePath}/search`, {
				params,
			});

			if (response.status < 300) {
				return {
					statusCode: response.status,
					data: response.data,
				};
			}

			return {
				statusCode: response.status,
				errors: [`${response.status} ${response.statusText}`.trim()],
			};
		} catch (error) {
			const axiosError = error as AxiosError;
			return {
				statusCode: axiosError.response?.status ?? 0,
				errors: [axiosError.message ?? axiosError.code ?? "Unknown error"],
			};
		}
	}
}
