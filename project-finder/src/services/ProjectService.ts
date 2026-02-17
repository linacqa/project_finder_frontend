import { BaseEntityService } from "./BaseEntityService";
import { IProject } from "@/types/domain/IProject";
import { IProjectAdd } from "@/types/domain/IProjectAdd";

export class ProjectService extends BaseEntityService<IProject, IProjectAdd> {
	constructor() {
		super('projects');
	}
}
