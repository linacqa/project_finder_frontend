"use client";

import { AccountContext } from "@/context/AccountContext";
import { GroupService } from "@/services/GroupService";
import { InvitationService } from "@/services/InvitationService";
import { UserService } from "@/services/UserService";
import { IGroup } from "@/types/domain/IGroup";
import { use, useContext, useEffect, useState } from "react";
import {
	Heading,
	Input,
	STATUS_TYPE,
	StatusTag,
	TTNewButton,
	TTNewCard,
	TTNewCardContent,
	TTNewContainer,
	Typeahead,
} from "taltech-styleguide";

export default function GroupDetails({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const groupId = use(params).id;
	const [group, setGroup] = useState<IGroup | null>(null);
	const [studentOptions, setStudentOptions] = useState<
		{ label: string; value: string }[]
	>([]);
	const [loadingStudents, setLoadingStudents] = useState(false);
	const [selectedStudent, setSelectedStudent] = useState<{
		label: string;
		value: string;
	} | null>(null);
	const [inviteRole, setInviteRole] = useState("");

	const { accountInfo } = useContext(AccountContext);

	const groupService = new GroupService();
	const userService = new UserService();
	const invitationService = new InvitationService();

	const handleInvite = async () => {
		if (!selectedStudent || inviteRole.trim() === "") return;
		const res = await invitationService.addAsync({
			groupId: groupId,
			toUserId: selectedStudent.value,
			role: inviteRole,
		});

		if (res && res.data) {
			setInviteRole("");
			setSelectedStudent(null);
			console.log("Invitation sent successfully", res.data);
			// TODO: reload group or show success message
		}
	};

	useEffect(() => {
		let mounted = true;
		groupService.getByIdAsync(groupId).then((res) => {
			if (res && res.data) {
				setGroup(res.data);
				console.log(res.data);
			}
		});
		setLoadingStudents(true);
		userService
			.getAllStudentsAsync()
			.then((res) => {
				if (!mounted) return;
				if (res && res.data) {
					setStudentOptions(
						res.data.map((s) => ({
							label:
								s.firstName +
								" " +
								s.lastName +
								" (" +
								s.email +
								")",
							value: s.id,
						})),
					);
				}
			})
			.catch((err) => console.error(err))
			.finally(() => {
				if (mounted) setLoadingStudents(false);
			});

		return () => {
			mounted = false;
		};
	}, [groupId]);

	return (
		<TTNewContainer className="py-3">
			<Heading as="h1" visual="h2">
				{group?.name}
			</Heading>
			<Heading as="h2" visual="h6" className="mb-3">
				Creator: {group?.creator?.firstName} {group?.creator.lastName} (
				{group?.creator.email})
			</Heading>
			{group?.users && group.users.length > 0 && (
				<Heading as="h4" visual="h5">
					Members:
				</Heading>
			)}
			{group?.users.map((user, index) => (
				<StatusTag key={user.id} type={STATUS_TYPE.INFO}>
					{user.user.firstName} {user.user.lastName} (
					{user.user.email}) - {user.role}
				</StatusTag>
			))}
			{accountInfo?.jwt && accountInfo.userId == group?.creatorId && (
				<TTNewCard className="mt-5">
					<TTNewCardContent>
						<Heading as="h3" visual="h4" className="mb-3">
							Invite new members
						</Heading>
						<Typeahead
							clearButton
							id="students"
							options={studentOptions}
							placeholder="Choose student"
							positionFixed
							selected={selectedStudent ? [selectedStudent] : []}
							onChange={(selected) => {
								setSelectedStudent(
									selected[0] as {
										label: string;
										value: string;
									} | null,
								);
							}}
						/>
						<Input
							className="mt-3"
							placeholder="Role"
							value={inviteRole}
							onChange={(e) => setInviteRole(e.target.value)}
						/>
						<TTNewButton className="mt-3" onClick={handleInvite}>
							Send invite
						</TTNewButton>
					</TTNewCardContent>
				</TTNewCard>
			)}
			{/* TODO: show sent invitations with statuses and option to cancel
			TODO: show applications for projects */}
		</TTNewContainer>
	);
}
