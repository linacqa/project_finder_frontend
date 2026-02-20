"use client";
import ConfirmationModal from "@/components/modal/ConfirmationModal";
import StepCard from "@/components/steps/StepCard";
import { StepService } from "@/services/StepService";
import { IStep } from "@/types/domain/IStep";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";
import {
	ButtonGroup,
	Heading,
	Input,
	TTNewButton,
	TTNewCard,
	TTNewCardContent,
	TTNewContainer,
} from "taltech-styleguide";

export default function Steps() {
	const [steps, setSteps] = useState<IStep[]>([]);
	const stepService = new StepService();
	const [newStepName, setNewStepName] = useState("");

	useEffect(() => {
		stepService.getAllAsync().then((res) => {
			setSteps(res.data as IStep[]);
		});
	}, []);

	const handleAddStep = (name: string) => {
		stepService.addAsync({ name }).then((res) => {
			if (res && res.data) {
				setSteps((prevSteps) => [...prevSteps, res.data as IStep]);
				setNewStepName("");
				console.log("Step added successfully:", res.data);
			}
		});
	};

	const handleSaveStep = (id: string, newName: string) => {
		stepService.updateAsync({ id: id, name: newName }).then((res) => {
			if (res && res.statusCode === 204) {
				setSteps((prevSteps) => prevSteps.map(step => step.id === id ? { ...step, name: newName } : step));
				console.log("Step updated successfully:", newName);
			}
		});
	};

	const handleDeleteStep = (stepId: string) => {
		stepService.deleteByIdAsync(stepId).then((res) => {
			console.log(res);
			if (res && res.statusCode === 204) {
			setSteps((prevSteps) => prevSteps.filter((step) => step.id !== stepId));
			console.log("Step deleted successfully:", stepId);
		}});
	};

	return (
		<TTNewContainer className="mb-4 w-auto">
			<h1>Steps</h1>

			<div className="tag-list-container">
				<TTNewCard className="mb-4 w-auto">
					<TTNewCardContent>
						<Heading as="h3" visual="h4" className="mb-3">
							<div className="mb-2">Add New Step</div>
							<Input placeholder="New Step name" onChange={(e) => setNewStepName(e.target.value)} value={newStepName} />
						</Heading>
						<ButtonGroup>
							<TTNewButton variant="primary" size="sm" onClick={() => handleAddStep(newStepName)}>
								Add Step
							</TTNewButton>
						</ButtonGroup>
					</TTNewCardContent>
				</TTNewCard>

				{steps.map((step) => (
					<StepCard key={step.id} id={step.id} name={step.name} onDelete={handleDeleteStep} onUpdate={handleSaveStep} />
				))}
			</div>
		</TTNewContainer>
	);
}
