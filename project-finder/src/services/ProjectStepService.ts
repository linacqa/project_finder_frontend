import { BaseEntityService } from "./BaseEntityService";
import { IResultObject } from "@/types/IResultObject";
import { AxiosError } from "axios";
import { IProjectStep } from "@/types/domain/IProjectStep";
import { IProjectStepAdd } from "@/types/domain/IProjectStepAdd";

export class ProjectStepService extends BaseEntityService<IProjectStep, IProjectStepAdd> {
	constructor() {
		super('projectSteps');
	}

	async getAllByProjectIdAsync(projectId: string): Promise<IResultObject<IProjectStep[]>> {
			try {
				const response = await this.axiosInstance.get<IProjectStep[]>(`${this.basePath}/project/${projectId}`)

				console.log('getAllByProjectId response', response)

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

	async updateStepStatusAsync(projectStepId: string, newStatusId: string): Promise<IResultObject<IProjectStep>> {
		try {
			const response = await this.axiosInstance.put<IProjectStep>(`${this.basePath}/${projectStepId}/status`, { stepStatusId: newStatusId })

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
