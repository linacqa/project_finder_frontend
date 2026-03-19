"use client"

import { AccountContext } from "@/context/AccountContext";
import { GroupService } from "@/services/GroupService";
import { IGroup } from "@/types/domain/IGroup";
import { use, useContext, useEffect, useState } from "react";
import { Heading, STATUS_TYPE, StatusTag, TTNewButton, TTNewContainer } from "taltech-styleguide";

export default function GroupDetails({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const groupId = use(params).id;
	const [group, setGroup] = useState<IGroup | null>(null);

	const { accountInfo, setAccountInfo } = useContext(AccountContext);

	useEffect(() => {
			const groupService = new GroupService();
			groupService.getByIdAsync(groupId).then((res) => {
				if (res && res.data) {
					setGroup(res.data);
					console.log(res.data);
				}
			});
		}, [groupId]);

	return (
		<TTNewContainer className="py-3">
			<Heading as="h1" visual="h2">
				{group?.name}
			</Heading>
			<Heading as="h2" visual="h6" className="mb-3">
				Creator: {group?.creator?.firstName} {group?.creator.lastName} ({group?.creator.email})
			</Heading>
			{group?.users && group.users.length > 0 && (
					<Heading as="h4" visual="h5">
						Members:
					</Heading>
				)}
				{group?.users.map((user, index) => (
					<StatusTag key={user.id} type={STATUS_TYPE.INFO}>
						{user.user.firstName} {user.user.lastName}{" "}
						({user.user.email}) - {user.role}
					</StatusTag>
				))}
			{accountInfo?.jwt && accountInfo.userId == group?.creatorId && (
				<TTNewButton className="mt-5">
					Invite someone
				</TTNewButton>
			)}
		</TTNewContainer>
	)
}
