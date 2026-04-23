
import { IProjectStatus } from "@/types/domain/IProjectStatus";
import { BaseService } from "./BaseService";
import { IResultObject } from "@/types/IResultObject";
import { AxiosError } from "axios";

export class ProjectStatusService extends BaseService {
	async getAllAsync(): Promise<IResultObject<IProjectStatus[]>> {
		const url = "projectStatuses";
		try {
			const response =
				await this.axiosInstance.get<IProjectStatus[]>(url);

			if (response.status <= 300) {
				return {
					statusCode: response.status,
					data: response.data,
				};
			}

			return {
				statusCode: response.status,
				errors: [
					(
						response.status.toString() +
						" " +
						response.statusText
					).trim(),
				],
			};
		} catch (error) {
			return {
				statusCode: (error as AxiosError).status ?? 0,
				errors: [(error as AxiosError).code ?? "???"],
			};
		}
	}
}
