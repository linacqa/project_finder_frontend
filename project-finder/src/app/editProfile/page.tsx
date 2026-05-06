"use client";
import ConfirmationModal from "@/components/modal/ConfirmationModal";
import { AccountContext } from "@/context/AccountContext";
import { AccountService } from "@/services/AccountService";
import { UserService } from "@/services/UserService";
import { IUserInfo } from "@/types/IUserInfo";
import { useRouter } from "next/dist/client/components/navigation";
import { useContext, useEffect, useState } from "react";
import { set } from "react-hook-form";
import {
	ALERT_POSITION_TYPES,
	ALERT_SIZE,
	ALERT_STATUS_TYPE,
	ButtonGroup,
	Input,
	TTNewAlert,
	TTNewButton,
	TTNewCard,
	TTNewCardContent,
	TTNewContainer,
	TTNewSelect,
} from "taltech-styleguide";

const programOptions = [
	"IT süsteemide arendus (IADB)",
	"IT süsteemide administreerimine (IAAB)",
	"Cyber Security Engineering (IVSB)",
	"Infosüsteemide analüüs ja kavandamine (IAAM)",
	"Digimuutused ettevõttes (IADM)",
];

export default function EditProfilePage() {
	const { accountInfo, setAccountInfo } = useContext(AccountContext);
	const router = useRouter();

	const accountService = new AccountService();
	const userService = new UserService();
	const [message, setMessage] = useState<{
		type: string;
		text: string;
	} | null>(null);

	const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);

	const [program, setProgram] = useState<string>("");

	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const handleSave = async () => {
		if (!userInfo) {
			return;
		}
		if (!userInfo.firstName || userInfo.firstName.trim() === "") {
			setMessage({
				type: "error",
				text: "Palun sisesta eesnimi.",
			});
			return;
		}
		if (!userInfo.lastName || userInfo.lastName.trim() === "") {
			setMessage({
				type: "error",
				text: "Palun sisesta perekonnanimi.",
			});
			return;
		}
		if (!userInfo.email || userInfo.email.trim() === "") {
			setMessage({
				type: "error",
				text: "Palun sisesta email.",
			});
			return;
		}
		if (
			accountInfo?.role === "teacher" ||
			accountInfo?.role === "student"
		) {
			if (!userInfo.uniId || userInfo.uniId.trim() === "") {
				setMessage({
					type: "error",
					text: "Palun sisesta Uni-ID.",
				});
				return;
			}
		}
		if (accountInfo?.role === "student") {
			if (
				!userInfo.matriculationNumber ||
				userInfo.matriculationNumber.trim() === ""
			) {
				setMessage({
					type: "error",
					text: "Palun sisesta matriklinumber.",
				});
				return;
			}
			if (!program || program.trim() === "") {
				setMessage({
					type: "error",
					text: "Palun vali õppekava.",
				});
				return;
			}
		}
		setMessage({ type: "loading", text: "Andmete salvestamine..." });
		const result = await accountService.updateAccountInfoAsync(
			userInfo.firstName,
			userInfo.lastName,
			userInfo.email,
			userInfo.phoneNumber || undefined,
			userInfo.uniId || undefined,
			userInfo.matriculationNumber || undefined,
			program,
		);
		if (result && result.data) {
			setMessage({
				type: "success",
				text: "Andmed edukalt salvestatud!",
			});
			setUserInfo(result.data);
		} else {
			setMessage({
				type: "error",
				text: `Andmete salvestamisel tekkis viga. (${result.errors?.join(", ")})`,
			});
		}
	};

	const handleDeleteAccount = async () => {
		setShowDeleteModal(false);
		setMessage({ type: "loading", text: "Konto kustutamine..." });
		const result = await accountService.deleteAccountAsync();
		if (result && result.statusCode && result.statusCode <= 300) {
			setMessage({
				type: "success",
				text: "Konto edukalt kustutatud. Suunatakse avalehele...",
			});
			setTimeout(() => {
				setAccountInfo?.({});
				router.push("/");
			}, 2000);
			return;
		}

		setMessage({
			type: "error",
			text: `Konto kustutamisel tekkis viga. (${result.errors?.join(", ")})`,
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
	}, [accountInfo]);

	useEffect(() => {
		const fetchUserInfo = async () => {
			if (!accountInfo?.userId) {
				return;
			}
			setMessage({ type: "loading", text: "Kasutaja info laadimine..." });
			const result = await userService.getUserByIdAsync(
				accountInfo.userId,
			);
			if (result && result.data) {
				setUserInfo(result.data);
				setProgram(result.data.program || "");
				setMessage(null);
			} else {
				setMessage({
					type: "error",
					text: `Kasutajat ei leitud. (${result.errors?.join(", ")})`,
				});
			}
		};

		fetchUserInfo();
	}, [accountInfo]);

	return (
		<TTNewContainer>
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
			<TTNewCard>
				<TTNewCardContent>
					<div className="d-flex flex-column gap-3">
						<h3>Muuda andmeid</h3>
						<div>
							<h4>Eesnimi</h4>
							<Input
								className="mb-3"
								value={userInfo?.firstName || ""}
								onChange={(e) =>
									setUserInfo({
										...userInfo!,
										firstName: e.target.value,
									})
								}
								placeholder="Eesnimi"
							/>
							<h4>Perekonnanimi</h4>
							<Input
								className="mb-3"
								value={userInfo?.lastName || ""}
								onChange={(e) =>
									setUserInfo({
										...userInfo!,
										lastName: e.target.value,
									})
								}
								placeholder="Perekonnanimi"
							/>
							<h4>Email</h4>
							<Input
								className="mb-3"
								value={userInfo?.email || ""}
								onChange={(e) =>
									setUserInfo({
										...userInfo!,
										email: e.target.value,
									})
								}
								placeholder="Email"
							/>
							<h4>Telefoninumber</h4>
							<Input
								className="mb-3"
								value={userInfo?.phoneNumber || ""}
								onChange={(e) =>
									setUserInfo({
										...userInfo!,
										phoneNumber: e.target.value,
									})
								}
								placeholder="Telefoninumber"
							/>
							{(accountInfo?.role === "teacher" ||
								accountInfo?.role === "student") && (
								<>
									<h4>Uni-ID</h4>
									<Input
										className="mb-3"
										value={userInfo?.uniId || ""}
										onChange={(e) =>
											setUserInfo({
												...userInfo!,
												uniId: e.target.value,
											})
										}
										placeholder="Uni-ID"
									/>
								</>
							)}
							{accountInfo?.role === "student" && (
								<>
									<h4>Matriklinumber</h4>
									<Input
										className="mb-3"
										value={
											userInfo?.matriculationNumber || ""
										}
										onChange={(e) =>
											setUserInfo({
												...userInfo!,
												matriculationNumber:
													e.target.value,
											})
										}
										placeholder="Matriklinumber"
									/>
									<h4>Õppekava</h4>
									<TTNewSelect
										className="mb-3"
										value={{
											value: program,
											label: program,
										}}
										onChange={(e) =>
											setProgram(e?.value ?? "")
										}
										placeholder="Õppekava"
										options={programOptions.map(
											(program) => ({
												value: program,
												label: program,
											}),
										)}
									/>
								</>
							)}
						</div>
						<ButtonGroup className="justify-content-between">
							<TTNewButton onClick={() => handleSave()}>
								Salvesta
							</TTNewButton>
							<TTNewButton variant="danger" onClick={() => setShowDeleteModal(true)}>
								Kustuta konto
							</TTNewButton>
						</ButtonGroup>
						<ConfirmationModal
							show={showDeleteModal}
							hideAction={() => setShowDeleteModal(false)}
							title="Kas olete kindel?"
							text="Kas soovite konto jäädavalt kustutada? Seda toimingut ei saa tagasi võtta."
							confirmText="Jah, kustuta"
							confirmAction={handleDeleteAccount}
						/>
					</div>
				</TTNewCardContent>
			</TTNewCard>
		</TTNewContainer>
	);
}
