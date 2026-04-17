"use client";
import ConfirmationModal from "@/components/modal/ConfirmationModal";
import StepCard from "@/components/steps/StepCard";
import { StepService } from "@/services/StepService";
import { IStep } from "@/types/domain/IStep";
import { useEffect, useState } from "react";
import {
	ALERT_POSITION_TYPES,
	ALERT_SIZE,
	ALERT_STATUS_TYPE,
	ButtonGroup,
	Heading,
	Input,
	TTNewAlert,
	TTNewButton,
	TTNewCard,
	TTNewCardContent,
	TTNewContainer,
} from "taltech-styleguide";

export default function Steps() {
	const [steps, setSteps] = useState<IStep[]>([]);
	const stepService = new StepService();
	const [newStepName, setNewStepName] = useState("");

	const [message, setMessage] = useState<{
		type: string;
		text: string;
	} | null>(null);

	useEffect(() => {
		setMessage({ type: "loading", text: "Laadin etappe..." });
		stepService.getAllAsync().then((res) => {
			if (res.data) {
				setSteps(res.data);
				setMessage(null);
				return;
			}

			setMessage({
				type: "error",
				text: `${res.statusCode ?? "Error"} - ${res.errors}`,
			});
		});
	}, []);

	const handleAddStep = (name: string) => {
		if (!name || name.trim() === "") {
			setMessage({ type: "error", text: "Etapi nimi ei saa olla tühi." });
			return;
		}
		setMessage({ type: "loading", text: "Lisan etappi..." });
		stepService.addAsync({ name }).then((res) => {
			if (res && res.data) {
				setSteps((prevSteps) => [...prevSteps, res.data as IStep]);
				setNewStepName("");
				setMessage({ type: "success", text: "Etapp lisatud." });
				return;
			}

			setMessage({
				type: "error",
				text: `${res.statusCode ?? "Error"} - ${res.errors}`,
			});
		});
	};

	const handleSaveStep = (id: string, newName: string) => {
		setMessage({ type: "loading", text: "Salvestan etapi muudatusi..." });
		stepService.updateAsync({ id: id, name: newName }).then((res) => {
			if (res && res.statusCode && res.statusCode <= 300) {
				setSteps((prevSteps) =>
					prevSteps.map((step) =>
						step.id === id ? { ...step, name: newName } : step,
					),
				);
				setMessage({ type: "success", text: "Etapp uuendatud." });
				return;
			}

			setMessage({
				type: "error",
				text: `${res.statusCode ?? "Error"} - ${res.errors}`,
			});
		});
	};

	const handleDeleteStep = (stepId: string) => {
		setMessage({ type: "loading", text: "Kustutan etappi..." });
		stepService.deleteByIdAsync(stepId).then((res) => {
			if (res && res.statusCode && res.statusCode <= 300) {
				setSteps((prevSteps) =>
					prevSteps.filter((step) => step.id !== stepId),
				);
				setMessage({ type: "success", text: "Etapp kustutatud." });
				return;
			}

			setMessage({
				type: "error",
				text: `${res.statusCode ?? "Error"} - ${res.errors}`,
			});
		});
	};

	return (
		<TTNewContainer className="mb-4 w-auto">
			{message && (
				<div>
					<TTNewAlert
						position={ALERT_POSITION_TYPES.INLINE}
						variant={
							message.type === "error"
								? ALERT_STATUS_TYPE.ERROR
								: message.type === "success"
									? ALERT_STATUS_TYPE.SUCCESS
									: ALERT_STATUS_TYPE.INFO
						}
						dismissible
						size={ALERT_SIZE.SMALL}
						title={message.text}
						onClose={() => setMessage(null)}
					></TTNewAlert>
				</div>
			)}

			<h1>Etapid</h1>

			<div className="tag-list-container">
				<TTNewCard className="mb-4 w-auto">
					<TTNewCardContent>
						<Heading as="h3" visual="h4" className="mb-3">
							<div className="mb-2">Lisa uus etapp</div>
							<Input
								placeholder="Uue etapi nimi"
								onChange={(e) => setNewStepName(e.target.value)}
								value={newStepName}
							/>
						</Heading>
						<ButtonGroup>
							<TTNewButton
								variant="primary"
								size="sm"
								onClick={() => handleAddStep(newStepName)}
							>
								Lisa etapp
							</TTNewButton>
						</ButtonGroup>
					</TTNewCardContent>
				</TTNewCard>

				{steps.map((step) => (
					<StepCard
						key={step.id}
						id={step.id}
						name={step.name}
						onDelete={handleDeleteStep}
						onUpdate={handleSaveStep}
					/>
				))}
			</div>
		</TTNewContainer>
	);
}
