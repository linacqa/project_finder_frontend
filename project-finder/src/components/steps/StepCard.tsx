import { ButtonGroup, Heading, Input, TTNewButton, TTNewCard, TTNewCardContent } from "taltech-styleguide";
import ConfirmationModal from "../modal/ConfirmationModal";
import { useState } from "react";

export default function StepCard({ id, name, onDelete, onUpdate }: { id: string; name: string; onDelete: (id: string) => void; onUpdate: (id: string, newName: string) => void }) {
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [newName, setNewName] = useState(name);

	const handleDeleteStep = (stepId: string) => {
		setShowDeleteModal(false);
		onDelete(stepId);
	}

	return (
		<TTNewCard className="mb-4 w-auto" key={id}>
			<TTNewCardContent>
				<Heading as="h3" visual="h4" className="mb-3">
					<Input value={newName} onChange={(e) => setNewName(e.target.value)} />
				</Heading>
				<ButtonGroup>
					<TTNewButton variant="primary" size="sm" onClick={() => onUpdate(id, newName)}>
						Salvesta
					</TTNewButton>
					<TTNewButton
						variant="danger"
						size="sm"
						onClick={() => setShowDeleteModal(true)}
					>
						Kustuta
					</TTNewButton>
				</ButtonGroup>
				<ConfirmationModal
					show={showDeleteModal}
					hideAction={() => setShowDeleteModal(false)}
					title="Kas olete kindel?"
					text="Kas soovite selle sammu jäädavalt kustutada? Seda toimingut ei saa tagasi võtta."
					confirmText="Jah, kustuta"
					confirmAction={() => handleDeleteStep(id)}
				/>
			</TTNewCardContent>
		</TTNewCard>
	);
}
