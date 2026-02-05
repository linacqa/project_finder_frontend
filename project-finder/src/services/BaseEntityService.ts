import { IDomainId } from "@/types/IDomainId"
import { BaseService } from "./BaseService"
import { IResultObject } from "@/types/IResultObject"
import { AxiosError } from "axios"

export abstract class BaseEntityService<TEntity extends IDomainId, TAddEntity> extends BaseService {
	constructor(protected basePath: string) {
		super()
	}

	async getAllAsync(): Promise<IResultObject<TEntity[]>> {
		try {
			const response = await this.axiosInstance.get<TEntity[]>(this.basePath)

			console.log('getAll response', response)

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

	async addAsync(entity: TAddEntity): Promise<IResultObject<TEntity>> {
		try {
			const response = await this.axiosInstance.post<TEntity>(this.basePath, entity)

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

	async getByIdAsync(id: string): Promise<IResultObject<TEntity>> {
		try {
			const response = await this.axiosInstance.get<TEntity>(
				`${this.basePath}/${id}`,
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

	async deleteByIdAsync(id: string): Promise<IResultObject<TEntity>> {
		try {
			const response = await this.axiosInstance.delete<null>(
				`${this.basePath}/${id}`,
			)

			if (response.status <= 300) {
				return {
					statusCode: response.status,
					data: undefined
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

	async updateAsync(entity: TEntity): Promise<IResultObject<TEntity>> {
		try {
			const response = await this.axiosInstance.put<TEntity>(`${this.basePath}/${entity.id}`, entity)

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
