import { IGroup } from "@/types/domain/IGroup";
import { BaseEntityService } from "./BaseEntityService";
import { IGroupAdd } from "@/types/domain/IGroupAdd";

export class GroupService extends BaseEntityService<IGroup, IGroupAdd> {
	constructor() {
		super('groups');
	}
}
