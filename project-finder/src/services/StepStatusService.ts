import { IStepStatus } from "../types/domain/IStepStatus";
import { IStepStatusAdd } from "../types/domain/IStepStatusAdd";
import { BaseEntityService } from "./BaseEntityService";

export class StepStatusService extends BaseEntityService<IStepStatus, IStepStatusAdd> {
	constructor() {
		super('stepStatuses');
	}
}
