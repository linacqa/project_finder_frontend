import { ISupervisorInfo } from "@/types/ISupervisorInfo";
import { BaseService } from "./BaseService";
import { IResultObject } from "@/types/IResultObject";
import { AxiosError } from "axios";
import { IUserInfo } from "@/types/IUserInfo";
import { IStudentInfo } from "@/types/IStudentInfo";

export class UserService extends BaseService {
	async getAllAsync(): Promise<IResultObject<IUserInfo[]>> {
		const url = "users";
		try {
			const response =
				await this.axiosInstance.get<IUserInfo[]>(url);

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

	async getAllSupervisorsAsync(): Promise<IResultObject<ISupervisorInfo[]>> {
		const url = "users/supervisors";
		try {
			const response =
				await this.axiosInstance.get<ISupervisorInfo[]>(url);

			console.log("getAllSupervisors response", response);

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

	async getAllStudentsAsync(): Promise<IResultObject<IStudentInfo[]>> {
		const url = "users/students";
		try {
			const response =
				await this.axiosInstance.get<IStudentInfo[]>(url);

			console.log("getAllStudents response", response);

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
