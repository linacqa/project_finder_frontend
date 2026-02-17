import { IProjectType } from "@/types/domain/IProjectType";
import { BaseService } from "./BaseService";
import { IResultObject } from "@/types/IResultObject";
import { AxiosError } from "axios";

export class ProjectTypeService extends BaseService {
	async getAllAsync(): Promise<IResultObject<IProjectType[]>> {
		const url = "projectTypes";
		try {
			const response =
				await this.axiosInstance.get<IProjectType[]>(url);

			console.log("getAll response", response);

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
			console.log("error: ", (error as AxiosError).message);
			return {
				statusCode: (error as AxiosError).status ?? 0,
				errors: [(error as AxiosError).code ?? "???"],
			};
		}
	}
}
