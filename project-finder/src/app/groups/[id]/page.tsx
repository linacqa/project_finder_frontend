"use client";

import ConfirmationModal from "@/components/modal/ConfirmationModal";
import { AccountContext } from "@/context/AccountContext";
import { GroupService } from "@/services/GroupService";
import { InvitationService } from "@/services/InvitationService";
import { UserService } from "@/services/UserService";
import { IGroup } from "@/types/domain/IGroup";
import { IInvitation } from "@/types/domain/IInvitation";
import { useRouter } from "next/dist/client/components/navigation";
import Link from "next/link";
import { use, useContext, useEffect, useState } from "react";
import {
	ALERT_POSITION_TYPES,
	ALERT_SIZE,
	ALERT_STATUS_TYPE,
	Heading,
	Input,
	STATUS_TYPE,
	StatusTag,
	Tag,
	TagVariants,
	TTNewAlert,
	TTNewButton,
	TTNewCard,
	TTNewCardContent,
	TTNewContainer,
	Typeahead,
} from "taltech-styleguide";

function formatDate(value: string) {
	return new Date(value).toLocaleDateString("et-EE", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
}

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

	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [memberIdToDelete, setMemberIdToDelete] = useState<string | null>(
		null,
	);

	const [invitationIdToDelete, setInvitationIdToDelete] = useState<
		string | null
	>(null);

	const [invitations, setInvitations] = useState<IInvitation[]>([]);

	const router = useRouter();

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
			invitationService.allAsyncByGroupId(groupId).then((invitationsRes) => {
				if (invitationsRes.data) {
					setInvitations(invitationsRes.data);
				}
			});
			return;
		}

		setMessage({
			type: "error",
			text: `${res.statusCode ?? "Error"} - ${res.errors}`,
		});
	};

	const handleDeleteGroup = async () => {
		setShowDeleteModal(false);
		setMessage({ type: "loading", text: "Kustutan gruppi..." });
		const res = await groupService.deleteByIdAsync(groupId);

		if (res && res.statusCode && res.statusCode <= 300) {
			setMessage({ type: "success", text: "Grupp kustutatud." });
			router.push("/groups");
			return;
		} else {
			setMessage({
				type: "error",
				text: `${res.statusCode ?? "Error"} - ${res.errors}`,
			});
		}
	};

	const handleDeleteMember = async (memberId: string) => {
		setMemberIdToDelete(null);
		setMessage({ type: "loading", text: "Eemaldan liiget..." });
		const res = await groupService.deleteMemberByIdAsync(memberId);

		if (res && res.statusCode && res.statusCode <= 300) {
			setGroup((currentGroup) =>
				currentGroup
					? {
							...currentGroup,
							users: currentGroup.users.filter(
								(member) => member.id !== memberId,
							),
						}
					: currentGroup,
			);
			setMessage({ type: "success", text: "Liige eemaldatud." });
			return;
		}

		setMessage({
			type: "error",
			text: `${res.statusCode ?? "Error"} - ${res.errors}`,
		});
	};

	const handleDeleteInvitation = async (invitationId: string) => {
		setMessage({ type: "loading", text: "Kustutan kutset..." });
		const res = await invitationService.deleteByIdAsync(invitationId);

		if (res && res.statusCode && res.statusCode <= 300) {
			setInvitations((currentInvitations) =>
				currentInvitations.filter((i) => i.id !== invitationId),
			);
			setMessage({ type: "success", text: "Kutse kustutatud." });
			return;
		}

		setMessage({
			type: "error",
			text: `${res.statusCode ?? "Error"} - ${res.errors}`,
		});
	};

	useEffect(() => {
		// Wait for AppState hydration before deciding auth redirect.
		if (accountInfo === undefined) {
			return;
		}

		if (!accountInfo.isAuthenticated) {
			router.push("/login");
			return;
		}
		if (accountInfo.role !== "student" && accountInfo.role !== "admin") {
			router.push("/");
			return;
		}
	}, [accountInfo]);

	useEffect(() => {
		let mounted = true;
		setMessage({ type: "loading", text: "Laadin grupi andmeid..." });

		Promise.all([
			groupService.getByIdAsync(groupId),
			userService.getAllStudentsAsync(),
			invitationService.allAsyncByGroupId(groupId),
		]).then(([groupRes, studentsRes, invitationsRes]) => {
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

			if (invitationsRes.data) {
				setInvitations(invitationsRes.data);
			}

			if (
				groupRes.data &&
				studentsRes.data &&
				(invitationsRes.data || invitationsRes.statusCode === 401)
			) {
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
			if (!invitationsRes.data && invitationsRes.statusCode !== 401) {
				errors.push(
					`Kutsete laadimine: ${invitationsRes.statusCode ?? "Error"} - ${invitationsRes.errors}`,
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
			{group?.creatorId === accountInfo?.userId && (
				<>
					<TTNewButton
						className="float-end"
						variant="danger"
						size="sm"
						onClick={() => setShowDeleteModal(true)}
					>
						Kustuta
					</TTNewButton>
					<ConfirmationModal
						show={showDeleteModal}
						hideAction={() => setShowDeleteModal(false)}
						title="Kas olete kindel?"
						text="Kas soovite selle grupi jäädavalt kustutada? Seda toimingut ei saa tagasi võtta."
						confirmText="Jah, kustuta"
						confirmAction={handleDeleteGroup}
					/>
				</>
			)}
			<Heading as="h2" visual="h6" className="mb-3">
				Looja:{" "}
				<Link href={`/profile/${group?.creator?.id}`}>
					{group?.creator?.firstName} {group?.creator.lastName}
				</Link>{" "}
				({group?.creator.email})
			</Heading>
			{group?.users && group.users.length > 0 && (
				<Heading as="h4" visual="h5">
					Liikmed:
				</Heading>
			)}
			{group?.users.map((user) => (
				<div
					key={user.id}
					className="d-flex align-items-center gap-2 mb-2"
				>
					<StatusTag type={STATUS_TYPE.INFO}>
						<Link href={`/profile/${user.user.id}`}>
							{user.user.firstName} {user.user.lastName}
						</Link>{" "}
						({user.user.email}) - {user.role}
					</StatusTag>
					{group?.creatorId === accountInfo?.userId &&
						user.userId !== accountInfo?.userId && (
							<TTNewButton
								variant="danger"
								size="xs"
								onClick={() => setMemberIdToDelete(user.id)}
							>
								X
							</TTNewButton>
						)}
				</div>
			))}
			<ConfirmationModal
				show={memberIdToDelete !== null}
				hideAction={() => setMemberIdToDelete(null)}
				title="Kas olete kindel?"
				text="Kas soovite selle liikme grupist eemaldada? Seda toimingut ei saa tagasi võtta."
				confirmText="Jah, eemalda"
				confirmAction={() => {
					if (memberIdToDelete) {
						handleDeleteMember(memberIdToDelete);
					}
				}}
			/>
			{accountInfo?.isAuthenticated && accountInfo.userId == group?.creatorId && (
				<TTNewCard className="mt-5">
					<TTNewCardContent>
						<Heading as="h3" visual="h4" className="mb-3">
							Kutsu uusi liikmeid
						</Heading>
						<Typeahead
							clearButton
							id="students"
							options={studentOptions.filter(
								(option) =>
									!group?.users.some(
										(user) => user.userId === option.value,
									),
							)}
							placeholder="Vali üliõpilane"
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
							placeholder="Roll grupis"
							value={inviteRole}
							onChange={(e) => setInviteRole(e.target.value)}
						/>
						<TTNewButton className="mt-3" onClick={handleInvite}>
							Saada kutse
						</TTNewButton>
					</TTNewCardContent>
				</TTNewCard>
			)}
			{invitations.length > 0 && (
				<div className="mt-5">
					<Heading as="h3" visual="h4" className="mb-3">
						Saadetud kutsed:
					</Heading>
					{invitations.map((invitation) => (
						<TTNewCard key={invitation.id} className="mb-3 w-auto">
							<TTNewCardContent>
								<h5>
									{invitation.toUser.firstName}{" "}
									{invitation.toUser.lastName} (
									{invitation.toUser.email})
								</h5>
								<p>Roll: {invitation.role}</p>
								{!invitation.acceptedAt &&
									!invitation.declinedAt && (
										<Tag
											text="Ootel"
											variant={TagVariants.WARNING}
										/>
									)}
								{invitation.acceptedAt && (
									<Tag
										text={`Aktsepteeritud ${formatDate(invitation.acceptedAt)}`}
										variant={TagVariants.SUCCESS_FILLED}
									/>
								)}
								{invitation.declinedAt && (
									<Tag
										text={`Tagasi lükatud ${formatDate(invitation.declinedAt)}`}
										variant={TagVariants.DANGER_FILLED}
									/>
								)}
								{!invitation.acceptedAt &&
									accountInfo?.userId ===
										group?.creatorId && (
										<TTNewButton
											variant="danger"
											size="xs"
											className="float-end"
											onClick={() =>
												setInvitationIdToDelete(
													invitation.id,
												)
											}
										>
											Kustuta
										</TTNewButton>
									)}
							</TTNewCardContent>
						</TTNewCard>
					))}
					<ConfirmationModal
						show={invitationIdToDelete !== null}
						hideAction={() => setInvitationIdToDelete(null)}
						title="Kas olete kindel?"
						text="Kas soovite selle kutse kustutada? Seda toimingut ei saa tagasi võtta."
						confirmText="Jah, kustuta"
						confirmAction={() => {
							handleDeleteInvitation(invitationIdToDelete!);
						}}
					/>
				</div>
			)}
		</TTNewContainer>
	);
}
