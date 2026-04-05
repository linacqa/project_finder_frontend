import { IInvitation } from "@/types/domain/IInvitation";
import { BaseEntityService } from "./BaseEntityService";
import { IInvitationAdd } from "@/types/domain/IInvitationAdd";
import { AxiosError } from "axios";
import { IResultObject } from "@/types/IResultObject";

export class InvitationService extends BaseEntityService<
	IInvitation,
	IInvitationAdd
> {
	constructor() {
		super("invitations");
	}

	async acceptByIdAsync(id: string): Promise<IResultObject<IInvitation>> {
		try {
			const response = await this.axiosInstance.put<IInvitation>(
				`${this.basePath}/${id}/accept`,
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
			console.log("error: ", (error as AxiosError).message);
			return {
				statusCode: (error as AxiosError).status ?? 0,
				errors: [(error as AxiosError).code ?? "???"],
			};
		}
	}

	async declineByIdAsync(id: string): Promise<IResultObject<IInvitation>> {
		try {
			const response = await this.axiosInstance.put<IInvitation>(
				`${this.basePath}/${id}/decline`,
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
			console.log("error: ", (error as AxiosError).message);
			return {
				statusCode: (error as AxiosError).status ?? 0,
				errors: [(error as AxiosError).code ?? "???"],
			};
		}
	}
}
