import { IResultObject } from "@/types/IResultObject";
import { IApplication } from "../types/domain/IApplication";
import { IApplicationAdd } from "../types/domain/IApplicationAdd";
import { BaseEntityService } from "./BaseEntityService";
import { AxiosError } from "axios";

export class ApplicationService extends BaseEntityService<IApplication, IApplicationAdd> {
	constructor() {
		super('applications');
	}

	async getCurrentUsersApplicationByProjectIdAsync(projectId: string): Promise<IResultObject<IApplication>> {
			try {
				const response = await this.axiosInstance.get<IApplication>(
					`${this.basePath}/my/${projectId}`,
				)

				if (response.status <= 300) {
					return {
						statusCode: response.status,
						data: response.data
					}
				}

				return {
					statusCode: response.status,
					errors: [(response.status.toString() + ' ' + response.statusText).trim()],
				}
			} catch (error) {
				console.log('error: ', (error as AxiosError).message)
				return {
					statusCode: (error as AxiosError).status ?? 0,
					errors: [(error as AxiosError).code ?? "???"],
				}
			}
		}
}
