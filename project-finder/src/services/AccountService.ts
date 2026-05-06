import { AxiosError } from "axios";
import { BaseService } from "./BaseService";
import { IResultObject } from "@/types/IResultObject";
import { ILoginDto } from "@/types/ILoginDto";
import { ICurrentUserInfo } from "@/types/ICurrentUserInfo";

export class AccountService extends BaseService {
	async loginAsync(
		email: string,
		password: string,
	): Promise<IResultObject<ILoginDto>> {
		const url = "account/login";
		try {
			const loginData = {
				email,
				password,
			};

			const response = await this.axiosInstance.post(
				// url + "?jwtExpiresInSeconds=5",
				url,
				loginData,
			);

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
			const axiosError = error as AxiosError<{ errors?: string[] }>;
			const errors = (
				axiosError.response?.data as { errors?: Map<string, string[]> }
			)?.errors;
			const errorMessages = errors
				? Object.values(errors).flat().filter(Boolean)
				: null;
			return {
				statusCode: axiosError.response?.status,
				errors: errorMessages ?? [
					axiosError.response?.statusText ??
						axiosError.code ??
						axiosError.message,
				],
			};
		}
	}

	async registerAsync(
		firstName: string,
		lastName: string,
		email: string,
		password: string,
		role: string,
		uniId?: string,
		matriculationNumber?: string,
		program?: string,
		phoneNumber?: string,
	): Promise<IResultObject<ILoginDto>> {
		const url = "account/register";
		try {
			const registerData = {
				firstName,
				lastName,
				email,
				password,
				role,
				uniId,
				matriculationNumber,
				program,
				phoneNumber,
			};

			const response = await this.axiosInstance.post(
				url,
				registerData,
			);

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
			const axiosError = error as AxiosError<{
				error?: string;
				errors?: string[];
			}>;
			if (axiosError.response?.data.error) {
				return {
					statusCode: axiosError.response.status,
					errors: [axiosError.response.data.error],
				};
			}
			const errors = (
				axiosError.response?.data as { errors?: Map<string, string[]> }
			)?.errors;
			const errorMessages = errors
				? Object.values(errors).flat().filter(Boolean)
				: null;
			return {
				statusCode: axiosError.response?.status,
				errors: errorMessages ?? [
					axiosError.response?.statusText ??
						axiosError.code ??
						axiosError.message,
				],
			};
		}
	}

	async getCurrentUserInfoAsync(): Promise<IResultObject<ICurrentUserInfo>> {
		const url = "account/currentuserinfo";
		try {
			const response =
				await this.axiosInstance.get<ICurrentUserInfo>(url);

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
			const axiosError = error as AxiosError<{ errors?: string[] }>;
			return {
				statusCode: axiosError.response?.status,
				errors: axiosError.response?.data?.errors ?? [
					axiosError.response?.statusText ??
						axiosError.code ??
						axiosError.message,
				],
			};
		}
	}

	async logoutAsync(): Promise<IResultObject<void>> {
		const url = "Account/Logout";
		try {
			const response = await this.axiosInstance.post(url);

			if (response.status <= 300) {
				return {
					statusCode: response.status,
					data: undefined,
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
			const axiosError = error as AxiosError<{ errors?: string[] }>;
			return {
				statusCode: axiosError.response?.status,
				errors: axiosError.response?.data?.errors ?? [
					axiosError.response?.statusText ??
						axiosError.code ??
						axiosError.message,
				],
			};
		}
	}

	async updateAccountInfoAsync(
		firstName: string,
		lastName: string,
		email: string,
		phoneNumber?: string,
		uniId?: string,
		matriculationNumber?: string,
		program?: string,
	): Promise<IResultObject<ICurrentUserInfo>> {
		const url = "Account/UpdateCurrentUserInfo";
		try {
			const updateData = {
				firstName,
				lastName,
				email,
				phoneNumber,
				uniId,
				matriculationNumber,
				program,
			};

			const response = await this.axiosInstance.put(
				url,
				updateData,
			);

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
			const axiosError = error as AxiosError<{
				error?: string;
				errors?: string[];
			}>;
			if (axiosError.response?.data.error) {
				return {
					statusCode: axiosError.response.status,
					errors: [axiosError.response.data.error],
				};
			}
			const errors = (
				axiosError.response?.data as { errors?: Map<string, string[]> }
			)?.errors;
			const errorMessages = errors
				? Object.values(errors).flat().filter(Boolean)
				: null;
			return {
				statusCode: axiosError.response?.status,
				errors: errorMessages ?? [
					axiosError.response?.statusText ??
						axiosError.code ??
						axiosError.message,
				],
			};
		}
	}

	async deleteAccountAsync(): Promise<IResultObject<void>> {
		const url = "Account/Delete";
		try {
			const response = await this.axiosInstance.delete(url);

			if (response.status <= 300) {
				return {
					statusCode: response.status,
					data: undefined,
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
			const axiosError = error as AxiosError<{
				error?: string;
				errors?: string[];
			}>;
			if (axiosError.response?.data.error) {
				return {
					statusCode: axiosError.response.status,
					errors: [axiosError.response.data.error],
				};
			}
			const errors = (
				axiosError.response?.data as { errors?: Map<string, string[]> }
			)?.errors;
			const errorMessages = errors
				? Object.values(errors).flat().filter(Boolean)
				: null;
			return {
				statusCode: axiosError.response?.status,
				errors: errorMessages ?? [
					axiosError.response?.statusText ??
						axiosError.code ??
						axiosError.message,
				],
			};
		}
	}
}
