import { IFolder } from "../types/domain/IFolder";
import { IFolderAdd } from "../types/domain/IFolderAdd";
import { BaseEntityService } from "./BaseEntityService";

export class FolderService extends BaseEntityService<IFolder, IFolderAdd> {
	constructor() {
		super('folders');
	}
}
