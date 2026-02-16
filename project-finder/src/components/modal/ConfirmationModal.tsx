"use client";

import { Modal } from "react-bootstrap";
import { TTNewButton } from "taltech-styleguide";

interface ConfirmationModalProps {
	show: boolean;
	hideAction: () => void;
	title: string;
	text: string;
	confirmText: string;
	confirmAction: () => void;
}

export default function ConfirmationModal({
	show,
	hideAction,
	title,
	text,
	confirmText,
	confirmAction,
}: ConfirmationModalProps) {
	return (
		<Modal show={show} onHide={hideAction} centered className="modal">
			<Modal.Header className="modalHeader">
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body className="modalBody">{text}</Modal.Body>
			<Modal.Footer className="modalFooter">
				<TTNewButton variant="success" onClick={confirmAction}>
					{confirmText}
				</TTNewButton>
				<TTNewButton variant="outline" onClick={hideAction}>
					Tühista
				</TTNewButton>
			</Modal.Footer>
		</Modal>
	);
}
