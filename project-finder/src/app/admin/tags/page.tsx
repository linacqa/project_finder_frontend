"use client";
import ConfirmationModal from "@/components/modal/ConfirmationModal";
import TagCard from "@/components/tags/TagCard";
import { TagService } from "@/services/TagService";
import { ITag } from "@/types/domain/ITag";
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

export default function Tags() {
	const [tags, setTags] = useState<ITag[]>([]);
	const tagService = new TagService();
	const [newTagName, setNewTagName] = useState("");

	const [message, setMessage] = useState<{
		type: string;
		text: string;
	} | null>(null);

	useEffect(() => {
		setMessage({ type: "loading", text: "Laadin silte..." });
		tagService.getAllAsync().then((res) => {
			if (res.data) {
				setTags(res.data);
				setMessage(null);
				return;
			}

			setMessage({
				type: "error",
				text: `${res.statusCode ?? "Error"} - ${res.errors}`,
			});
		});
	}, []);

	const handleAddTag = (name: string) => {
		if (!name || name.trim() === "") {
			setMessage({ type: "error", text: "Sildi nimi ei saa olla tühi." });
			return;
		}
		setMessage({ type: "loading", text: "Lisan silti..." });
		tagService.addAsync({ name }).then((res) => {
			if (res && res.data) {
				setTags((prevTags) => [...prevTags, res.data as ITag]);
				setNewTagName("");
				setMessage({ type: "success", text: "Silt lisatud." });
				return;
			}

			setMessage({
				type: "error",
				text: `${res.statusCode ?? "Error"} - ${res.errors}`,
			});
		});
	};

	const handleSaveTag = (id: string, newName: string) => {
		setMessage({ type: "loading", text: "Salvestan sildi muudatusi..." });
		tagService.updateAsync({ id: id, name: newName }).then((res) => {
			if (res && res.statusCode && res.statusCode <= 300) {
				setTags((prevTags) =>
					prevTags.map((tag) =>
						tag.id === id ? { ...tag, name: newName } : tag,
					),
				);
				setMessage({ type: "success", text: "Silt uuendatud." });
				return;
			}

			setMessage({
				type: "error",
				text: `${res.statusCode ?? "Error"} - ${res.errors}`,
			});
		});
	};

	const handleDeleteTag = (tagId: string) => {
		setMessage({ type: "loading", text: "Kustutan silti..." });
		tagService.deleteByIdAsync(tagId).then((res) => {
			if (res && res.statusCode && res.statusCode <= 300) {
				setTags((prevTags) =>
					prevTags.filter((tag) => tag.id !== tagId),
				);
				setMessage({ type: "success", text: "Silt kustutatud." });
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

			<h1>Tags</h1>

			<div className="tag-list-container">
				<TTNewCard className="mb-4 w-auto">
					<TTNewCardContent>
						<Heading as="h3" visual="h4" className="mb-3">
							<div className="mb-2">Add New Tag</div>
							<Input
								placeholder="New tag name"
								onChange={(e) => setNewTagName(e.target.value)}
								value={newTagName}
							/>
						</Heading>
						<ButtonGroup>
							<TTNewButton
								variant="primary"
								size="sm"
								onClick={() => handleAddTag(newTagName)}
							>
								Add Tag
							</TTNewButton>
						</ButtonGroup>
					</TTNewCardContent>
				</TTNewCard>

				{tags.map((tag) => (
					<TagCard
						key={tag.id}
						id={tag.id}
						name={tag.name}
						onDelete={handleDeleteTag}
						onUpdate={handleSaveTag}
					/>
				))}
			</div>
		</TTNewContainer>
	);
}
