"use client";

import GroupCard from "@/components/groups/GroupCard";
import { GroupService } from "@/services/GroupService";
import { IGroup } from "@/types/domain/IGroup";
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

export default function Groups() {
	const [groups, setGroups] = useState<IGroup[]>([]);

	const [newGroupName, setNewGroupName] = useState("");
	const [roleInGroup, setRoleInGroup] = useState("");

	const groupService = new GroupService();

	useEffect(() => {
		groupService.getAllAsync().then((res) => {
			setGroups(res.data as IGroup[]);
		});
	}, []);

	const handleCreateGroup = (name: string, role: string) => {
		groupService
			.addAsync({ name, creatorRoleInGroup: role })
			.then((res) => {
				if (res && res.data) {
					setGroups((prevGroups) => [
						...prevGroups,
						res.data as IGroup,
					]);
					setNewGroupName("");
					setRoleInGroup("");
					console.log("Group created successfully:", res.data);
				}
			});
	};

	return (
		<TTNewContainer className="mb-4 w-auto">
			<h1>Groups</h1>

			<div className="group-list-container">
				<TTNewCard className="mb-4 w-auto">
					<TTNewCardContent>
						<Heading as="h3" visual="h4" className="mb-3">
							<div className="mb-2">Create New Group</div>
							<Input
								className="mb-2"
								placeholder="New group name"
								onChange={(e) =>
									setNewGroupName(e.target.value)
								}
								value={newGroupName}
							/>
							<Input
								placeholder="Your role in group (e.g. frontend developer)"
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
								Create Group
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
