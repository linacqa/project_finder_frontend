import { IStep } from "../types/domain/IStep";
import { IStepAdd } from "../types/domain/IStepAdd";
import { BaseEntityService } from "./BaseEntityService";

export class StepService extends BaseEntityService<IStep, IStepAdd> {
	constructor() {
		super('steps');
	}
}
