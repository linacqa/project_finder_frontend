import { ITag } from "@/types/domain/ITag";
import { BaseEntityService } from "./BaseEntityService";
import { ITagAdd } from "@/types/domain/ITagAdd";

export class TagService extends BaseEntityService<ITag, ITagAdd> {
	constructor() {
		super('tags');
	}
}
