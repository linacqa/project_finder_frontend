"use client";
import {
	ButtonGroup,
	Heading,
	Input,
	TTNewButton,
	TTNewCard,
	TTNewCardContent,
} from "taltech-styleguide";
import ConfirmationModal from "../modal/ConfirmationModal";
import { useContext, useState } from "react";
import { IUserInfo } from "@/types/IUserInfo";
import { IUserGroup } from "@/types/domain/IUserGroup";
import Link from "next/link";
import { AccountContext } from "@/context/AccountContext";

export default function GroupCard({
	id,
	name,
	creator,
	users,
}: {
	id: string;
	name: string;
	creator: IUserInfo;
	users: IUserGroup[];
}) {
	// const [showDeleteModal, setShowDeleteModal] = useState(false);
	// const [newName, setNewName] = useState(name);

	// const handleDeleteTag = (tagId: string) => {
	// 	setShowDeleteModal(false);
	// 	onDelete(tagId);
	// }

	const { accountInfo, setAccountInfo } = useContext(AccountContext);

	return (
		<TTNewCard className="mb-4 w-auto" key={id}>
			<TTNewCardContent>
				{accountInfo?.jwt && accountInfo.userId === creator.id ? (
					<Link href={`/groups/${id}`} passHref>
						<Heading as="h3" visual="h4" className="mb-3">
							{name}
						</Heading>
					</Link>
				) : (
					<Heading as="h3" visual="h4" className="mb-3">
						{name}
					</Heading>
				)}
				<div className="mb-3">
					Creator: {creator.firstName} {creator.lastName} (
					<Link
						href="#"
						onClick={() =>
							(window.location.href = `mailto:${creator.email}`)
						}
					>
						{creator.email}
					</Link>
					)
				</div>
				{users.length > 0 && (
					<Heading as="h4" visual="h5">
						Liikmed:
					</Heading>
				)}
				{users.map((user, index) => (
					<div key={user.id}>
						{index + 1}) {user.user.firstName} {user.user.lastName}{" "}
						({user.user.email}) - {user.role}
					</div>
				))}
				{/* <ButtonGroup>
					<TTNewButton variant="primary" size="sm" onClick={() => onUpdate(id, newName)}>
						Save
					</TTNewButton>
					<TTNewButton
						variant="danger"
						size="sm"
						onClick={() => setShowDeleteModal(true)}
					>
						Delete
					</TTNewButton>
				</ButtonGroup> */}
				{/* <ConfirmationModal
					show={showDeleteModal}
					hideAction={() => setShowDeleteModal(false)}
					title="Kas olete kindel?"
					text="Kas soovite selle sildi jäädavalt kustutada? Seda toimingut ei saa tagasi võtta."
					confirmText="Jah, kustuta"
					confirmAction={() => handleDeleteTag(id)}
				/> */}
			</TTNewCardContent>
		</TTNewCard>
	);
}
