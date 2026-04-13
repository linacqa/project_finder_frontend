"use client";

import { AccountContext } from "@/context/AccountContext";
import { GroupService } from "@/services/GroupService";
import { InvitationService } from "@/services/InvitationService";
import { UserService } from "@/services/UserService";
import { IGroup } from "@/types/domain/IGroup";
import { use, useContext, useEffect, useState } from "react";
import {
	ALERT_POSITION_TYPES,
	ALERT_SIZE,
	ALERT_STATUS_TYPE,
	Heading,
	Input,
	STATUS_TYPE,
	StatusTag,
	TTNewAlert,
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

	const [selectedStudent, setSelectedStudent] = useState<{
		label: string;
		value: string;
	} | null>(null);
	const [inviteRole, setInviteRole] = useState("");

	const { accountInfo } = useContext(AccountContext);

	const [message, setMessage] = useState<{
		type: string;
		text: string;
	} | null>(null);

	const groupService = new GroupService();
	const userService = new UserService();
	const invitationService = new InvitationService();

	const handleInvite = async () => {
		if (!selectedStudent || inviteRole.trim() === "") return;
		setMessage({ type: "loading", text: "Saadan kutset..." });
		const res = await invitationService.addAsync({
			groupId: groupId,
			toUserId: selectedStudent.value,
			role: inviteRole,
		});

		if (res && res.statusCode && res.statusCode <= 300 && res.data) {
			setInviteRole("");
			setSelectedStudent(null);
			setMessage({ type: "success", text: "Kutse saadetud." });
			return;
		}

		setMessage({
			type: "error",
			text: `${res.statusCode ?? "Error"} - ${res.errors}`,
		});
	};

	useEffect(() => {
		let mounted = true;
		setMessage({ type: "loading", text: "Laadin grupi andmeid..." });

		Promise.all([
			groupService.getByIdAsync(groupId),
			userService.getAllStudentsAsync(),
		]).then(([groupRes, studentsRes]) => {
			if (!mounted) return;

			if (groupRes.data) {
				setGroup(groupRes.data);
			}

			if (studentsRes.data) {
				setStudentOptions(
					studentsRes.data.map((s) => ({
						label: `${s.firstName} ${s.lastName} (${s.email})`,
						value: s.id,
					})),
				);
			}

			if (groupRes.data && studentsRes.data) {
				setMessage(null);
				return;
			}

			const errors: string[] = [];
			if (!groupRes.data) {
				errors.push(
					`Grupi laadimine: ${groupRes.statusCode ?? "Error"} - ${groupRes.errors}`,
				);
			}
			if (!studentsRes.data) {
				errors.push(
					`Üliõpilaste laadimine: ${studentsRes.statusCode ?? "Error"} - ${studentsRes.errors}`,
				);
			}

			setMessage({
				type: "error",
				text: errors.join(" | "),
			});
		});

		return () => {
			mounted = false;
		};
	}, [groupId]);

	return (
		<TTNewContainer className="py-3">
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
