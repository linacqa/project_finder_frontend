import { ISupervisorInfo } from "@/types/ISupervisorInfo";
import { BaseService } from "./BaseService";
import { IResultObject } from "@/types/IResultObject";
import { AxiosError } from "axios";

export class SupervisorService extends BaseService {
	async getAllAsync(): Promise<IResultObject<ISupervisorInfo[]>> {
		const url = "supervisors";
		try {
			const response =
				await this.axiosInstance.get<ISupervisorInfo[]>(url);

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
