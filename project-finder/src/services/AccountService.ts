import { AxiosError } from "axios";
import { BaseService } from "./BaseService";
import { IResultObject } from "@/types/IResultObject";
import { ILoginDto } from "@/types/ILoginDto";

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
				url + "?jwtExpiresInSeconds=5",
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
			console.log("error: ", (error as Error).message);
			return {
				statusCode: (error as AxiosError)?.status,
				errors: [(error as AxiosError).code ?? ""],
			};
		}
	}

	async registerAsync(
		firstName: string,
		lastName: string,
		email: string,
		password: string,
	): Promise<IResultObject<ILoginDto>> {
		const url = "account/register";
		try {
			const registerData = {
				firstName,
				lastName,
				email,
				password,
			};

			const response = await this.axiosInstance.post<ILoginDto>(
				url,
				registerData,
			);

			console.log("register response", response);

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
			console.log("error: ", (error as Error).message);
			return {
				statusCode: (error as AxiosError)?.status,
				errors: [(error as AxiosError).code ?? ""],
			};
		}
	}
}
