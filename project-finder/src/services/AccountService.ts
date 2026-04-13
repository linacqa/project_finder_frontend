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

			const response = await this.axiosInstance.post<ILoginDto>(
				// url + "?jwtExpiresInSeconds=5",
				url,
				loginData,
			);

			console.log("login response", response);

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
			const errors = (axiosError.response?.data as { errors?: Map<string, string[]> })
				?.errors;
			const errorMessages = errors
				? Object.values(errors).flat().filter(Boolean)
				: null;
			return {
				statusCode: axiosError.response?.status,
				errors: errorMessages ?? [
					axiosError.response?.statusText ?? axiosError.code ?? axiosError.message,
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

			const response = await this.axiosInstance.post<ILoginDto>(
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
			const axiosError = error as AxiosError<{ errors?: string[] }>;
			const errors = (axiosError.response?.data as { errors?: Map<string, string[]> })
				?.errors;
			const errorMessages = errors
				? Object.values(errors).flat().filter(Boolean)
				: null;
			return {
				statusCode: axiosError.response?.status,
				errors: errorMessages ?? [
					axiosError.response?.statusText ?? axiosError.code ?? axiosError.message,
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
					axiosError.response?.statusText ?? axiosError.code ?? axiosError.message,
				],
			};
		}
	}
}
