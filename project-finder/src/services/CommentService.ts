import { IComment } from "@/types/domain/IComment";
import { BaseEntityService } from "./BaseEntityService";
import { ICommentAdd } from "@/types/domain/ICommentAdd";
import { IResultObject } from "@/types/IResultObject";
import { AxiosError } from "axios";

export class CommentService extends BaseEntityService<IComment, ICommentAdd> {
	constructor() {
		super('comments');
	}

	async getAllByProjectIdAsync(projectId: string): Promise<IResultObject<IComment[]>> {
			try {
				const response = await this.axiosInstance.get<IComment[]>(`${this.basePath}/project/${projectId}`)

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
				return {
					statusCode: (error as AxiosError).status ?? 0,
					errors: [(error as AxiosError).code ?? "???"],
				}
			}
		}
}
