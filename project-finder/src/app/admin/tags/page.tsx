"use client";
import ConfirmationModal from "@/components/modal/ConfirmationModal";
import TagCard from "@/components/tags/TagCard";
import { TagService } from "@/services/TagService";
import { ITag } from "@/types/domain/ITag";
import { useEffect, useState } from "react";
import {
	ButtonGroup,
	Heading,
	Input,
	TTNewButton,
	TTNewCard,
	TTNewCardContent,
	TTNewContainer,
} from "taltech-styleguide";

export default function Tags() {
	const [tags, setTags] = useState<ITag[]>([]);
	const tagService = new TagService();
	const [newTagName, setNewTagName] = useState("");

	useEffect(() => {
		tagService.getAllAsync().then((res) => {
			setTags(res.data as ITag[]);
		});
	}, []);

	const handleAddTag = (name: string) => {
		tagService.addAsync({ name }).then((res) => {
			if (res && res.data) {
				setTags((prevTags) => [...prevTags, res.data as ITag]);
				setNewTagName("");
				console.log("Tag added successfully:", res.data);
			}
		});
	};

	const handleSaveTag = (id: string, newName: string) => {
		tagService.updateAsync({ id: id, name: newName }).then((res) => {
			if (res && res.statusCode === 204) {
				setTags((prevTags) => prevTags.map(tag => tag.id === id ? { ...tag, name: newName } : tag));
				console.log("Tag updated successfully:", newName);
			}
		});
	};

	const handleDeleteTag = (tagId: string) => {
		tagService.deleteByIdAsync(tagId).then((res) => {
			console.log(res);
			if (res && res.statusCode === 204) {
			setTags((prevTags) => prevTags.filter((tag) => tag.id !== tagId));
			console.log("Tag deleted successfully:", tagId);
		}});
	};

	return (
		<TTNewContainer className="mb-4 w-auto">
			<h1>Tags</h1>

			<div className="tag-list-container">
				<TTNewCard className="mb-4 w-auto">
					<TTNewCardContent>
						<Heading as="h3" visual="h4" className="mb-3">
							<div className="mb-2">Add New Tag</div>
							<Input placeholder="New tag name" onChange={(e) => setNewTagName(e.target.value)} value={newTagName} />
						</Heading>
						<ButtonGroup>
							<TTNewButton variant="primary" size="sm" onClick={() => handleAddTag(newTagName)}>
								Add Tag
							</TTNewButton>
						</ButtonGroup>
					</TTNewCardContent>
				</TTNewCard>

				{tags.map((tag) => (
					<TagCard key={tag.id} id={tag.id} name={tag.name} onDelete={handleDeleteTag} onUpdate={handleSaveTag} />
				))}
			</div>
		</TTNewContainer>
	);
}
