import { IGroup } from "@/types/domain/IGroup";
import { BaseEntityService } from "./BaseEntityService";
import { IGroupAdd } from "@/types/domain/IGroupAdd";
import { IResultObject } from "@/types/IResultObject";
import { AxiosError } from "axios";

export class GroupService extends BaseEntityService<IGroup, IGroupAdd> {
	constructor() {
		super('groups');
	}

	async getAllMatchingProjectTeamSizeAsync(projectId: string): Promise<IResultObject<IGroup[]>> {
			try {
				const response = await this.axiosInstance.get<IGroup[]>(this.basePath + '/matchingProjectTeamSize/' + projectId)

				console.log('getAllMatchingProjectTeamSize response', response)

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
