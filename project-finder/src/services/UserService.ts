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

	async getAllSupervisorsAsync(): Promise<IResultObject<ISupervisorInfo[]>> {
		const url = "users/supervisors";
		try {
			const response =
				await this.axiosInstance.get<ISupervisorInfo[]>(url);

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

	async getAllStudentsAsync(): Promise<IResultObject<IStudentInfo[]>> {
		const url = "users/students";
		try {
			const response =
				await this.axiosInstance.get<IStudentInfo[]>(url);

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

	async changeUsersRoleAsync(
		userId: string,
		newRole: string
	): Promise<IResultObject<null>> {
		const url = `users/${userId}`;
		try {
			const response = await this.axiosInstance.patch(
				url,
				null,
				{
					params: {
						role: newRole,
					},
				}
			);

			if (response.status <= 300) {
				return {
					statusCode: response.status,
					data: null,
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

	async emailAdminsAsync(subject: string, message: string): Promise<IResultObject<{sentTo: number}>> {
		const url = `users/emailAdmins`;
		try {
			const response = await this.axiosInstance.post(
				url,
				{
					subject,
					body: message,
				}
			);

			if (response.status <= 300) {
				return {
					statusCode: response.status,
					data: { sentTo: response.data.sentTo },
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

	async getUserByIdAsync(userId: string): Promise<IResultObject<IUserInfo>> {
		const url = `users/${userId}`;
		try {
			const response =
				await this.axiosInstance.get<IUserInfo>(url);

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
