import { IProject } from "./domain/IProject";

export interface IProjectsSearchResult {
	data: IProject[];
	page: number;
	pageSize: number;
	totalCount: number;
}
