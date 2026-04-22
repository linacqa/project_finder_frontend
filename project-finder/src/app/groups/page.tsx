"use client";

import GroupCard from "@/components/groups/GroupCard";
import { GroupService } from "@/services/GroupService";
import { IGroup } from "@/types/domain/IGroup";
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

export default function Groups() {
	const [groups, setGroups] = useState<IGroup[]>([]);

	const [newGroupName, setNewGroupName] = useState("");
	const [roleInGroup, setRoleInGroup] = useState("");

	const [message, setMessage] = useState<{
		type: string;
		text: string;
	} | null>(null);

	const groupService = new GroupService();

	useEffect(() => {
		setMessage({ type: "loading", text: "Laadin gruppe..." });
		groupService.getAllAsync().then((res) => {
			if (res.data) {
				setGroups(res.data);
				setMessage(null);
				return;
			}

			setMessage({
				type: "error",
				text: `${res.statusCode ?? "Error"} - ${res.errors}`,
			});
		});
	}, []);

	const handleCreateGroup = (name: string, role: string) => {
		setMessage({ type: "loading", text: "Loome gruppi..." });
		groupService
			.addAsync({ name, creatorRoleInGroup: role })
			.then((res) => {
				if (res && res.data) {
					groupService.getAllAsync().then((res) => {
						if (res.data) {
							setGroups(res.data);
							setMessage(null);
							return;
						}

						setMessage({
							type: "error",
							text: `${res.statusCode ?? "Error"} - ${res.errors}`,
						});
					});
					setNewGroupName("");
					setRoleInGroup("");
					setMessage({ type: "success", text: "Grupp loodud." });
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
			<h1>Groups</h1>

			<div className="group-list-container">
				<TTNewCard className="mb-4 w-auto">
					<TTNewCardContent>
						<Heading as="h3" visual="h4" className="mb-3">
							<div className="mb-2">Loo uus grupp</div>
							<Input
								className="mb-2"
								placeholder="Uue grupi nimi"
								onChange={(e) =>
									setNewGroupName(e.target.value)
								}
								value={newGroupName}
							/>
							<Input
								placeholder="Teie roll grupis (nt. frontend arendaja)"
								onChange={(e) => setRoleInGroup(e.target.value)}
								value={roleInGroup}
							/>
						</Heading>
						<ButtonGroup>
							<TTNewButton
								variant="primary"
								size="sm"
								onClick={() =>
									handleCreateGroup(newGroupName, roleInGroup)
								}
							>
								Loo grupp
							</TTNewButton>
						</ButtonGroup>
					</TTNewCardContent>
				</TTNewCard>

				{groups.map((group) => (
					<GroupCard
						key={group.id}
						id={group.id}
						name={group.name}
						creator={group.creator}
						users={group.users}
					/>
				))}
			</div>
		</TTNewContainer>
	);
}
