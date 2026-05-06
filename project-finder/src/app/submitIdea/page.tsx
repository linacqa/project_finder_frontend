"use client";
import { useContext, useEffect, useState } from "react";
import {
	ALERT_POSITION_TYPES,
	ALERT_SIZE,
	ALERT_STATUS_TYPE,
	CustomInput,
	Heading,
	Input,
	TTNewAlert,
	TTNewButton,
	TTNewCard,
	TTNewCardContent,
	TTNewContainer,
	Typeahead,
} from "taltech-styleguide";
import { FormGroup, FormLabel } from "react-bootstrap";
import { TagService } from "@/services/TagService";
import { UserService } from "@/services/UserService";
import { AccountContext } from "@/context/AccountContext";
import { useRouter } from "next/dist/client/components/navigation";

export default function SubmitIdea() {
	const [tagOptions, setTagOptions] = useState<{ label: string }[]>([]);
	const [supervisorOptions, setSupervisorOptions] = useState<
		{ label: string }[]
	>([]);

	const { accountInfo } = useContext(AccountContext);
	const router = useRouter();

	const [message, setMessage] = useState<{
		type: string;
		text: string;
	} | null>(null);

	const tagService = new TagService();
	const userService = new UserService();

	const [formData, setFormData] = useState({
		titleInEstonian: "",
		titleInEnglish: "",
		type: "project",
		tags: [] as string[],
		description: "",
		objective: "",
		problem: "",
		background: "",
		teamSizeMin: 1,
		teamSizeMax: 1,
		comment: "",
		supervisors: [] as string[],
		wantsToSuperviseOrWrite: "no",
	});

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
		let mounted = true;
		setMessage({ type: "loading", text: "Laadin andmeid..." });
		Promise.all([
			tagService
				.getAllAsync()
				.then((res) => {
					if (!mounted) return;
					if (res && res.data) {
						setTagOptions(res.data.map((t) => ({ label: t.name })));
					}
				})
				.catch((err) => {
					if (!mounted) return;
					console.error(err);
				}),
			userService
				.getAllSupervisorsAsync()
				.then((res) => {
					if (!mounted) return;
					if (res && res.data) {
						setSupervisorOptions(
							res.data.map((s) => ({
								label:
									s.firstName +
									" " +
									s.lastName +
									" (" +
									s.email +
									")",
							})),
						);
					}
				})
				.catch((err) => {
					if (!mounted) return;
					console.error(err);
				}),
		])
			.then(() => {
				if (mounted) setMessage(null);
			})
			.catch(() => {
				if (mounted)
					setMessage({
						type: "error",
						text: "Andmete laadimine ebaõnnestus.",
					});
			});

		return () => {
			mounted = false;
		};
	}, []);

	const getTypeForEmail = (type: string) => {
		switch (type) {
			case "project":
				return "Praktika projekt";
			case "projectFinalThesis":
				return "Praktika projekt + Lõputöö";
			case "finalThesis":
				return "Lõputöö";
			default:
				return type;
		}
	};

	const getWantsToSuperviseOrWriteForEmail = (value: string) => {
		switch (value) {
			case "supervise":
				return "Soovin juhendada seda projekti";
			case "write":
				return "Soovin ise tegeleda selle projektiga";
			case "no":
				return "Ei soovi juhendada ega ise tegeleda selle projektiga";
			default:
				return value;
		}
	};

	const handleSendEmail = async () => {
		if (formData.titleInEstonian.trim() === "" && formData.titleInEnglish.trim() === "") {
			setMessage({
				type: "error",
				text: "Pealkiri vähemalt ühes keeles on kohustuslik.",
			});
			return;
		}
		if (formData.description.trim() === "") {
			setMessage({
				type: "error",
				text: "Kirjeldus on kohustuslik.",
			});
			return;
		}
		if (formData.objective.trim() === "") {
			setMessage({
				type: "error",
				text: "Eesmärk on kohustuslik.",
			});
			return;
		}
		if (formData.problem.trim() === "") {
			setMessage({
				type: "error",
				text: "Probleem on kohustuslik.",
			});
			return;
		}
		if (formData.background.trim() === "") {
			setMessage({
				type: "error",
				text: "Taust on kohustuslik.",
			});
			return;
		}
		if (formData.teamSizeMin < 1 || formData.teamSizeMax < 1) {
			setMessage({
				type: "error",
				text: "Meeskonna suurus peab olema positiivne arv.",
			});
			return;
		}
		if (formData.type.trim() === "") {
			setMessage({
				type: "error",
				text: "Projekti tüüp on kohustuslik.",
			});
			return;
		}

		const emailContent = `
<!DOCTYPE html>
<html>
<head>
	<style>
		body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
		.container { max-width: 600px; margin: 0 auto; padding: 20px; }
		h2 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
		.field { margin-bottom: 15px; }
		.label { font-weight: bold; color: #2c3e50; }
		.value { color: #555; margin-top: 5px; }
	</style>
</head>
<body>
	<div class="container">
		<h2>Uus projekti idee esitatud</h2>
		<div class="field">
			<div class="label">Autor:</div>
			<div class="value">${accountInfo?.firstName} ${accountInfo?.lastName} (${accountInfo?.email})</div>
		</div>
		<div class="field">
			<div class="label">Pealkiri eesti keeles:</div>
			<div class="value">${formData.titleInEstonian}</div>
		</div>
		<div class="field">
			<div class="label">Pealkiri inglise keeles:</div>
			<div class="value">${formData.titleInEnglish}</div>
		</div>
		<div class="field">
			<div class="label">Projekti tüüp:</div>
			<div class="value">${getTypeForEmail(formData.type)}</div>
		</div>
		<div class="field">
			<div class="label">Märksõnad:</div>
			<div class="value">${formData.tags.join(", ")}</div>
		</div>
		<div class="field">
			<div class="label">Kirjeldus:</div>
			<div class="value">${formData.description
				.split("\n")
				.map((line) => `<div>${line}</div>`)
				.join("")}</div>
		</div>
		<div class="field">
			<div class="label">Eesmärk:</div>
			<div class="value">${formData.objective
				.split("\n")
				.map((line) => `<div>${line}</div>`)
				.join("")}</div>
		</div>
		<div class="field">
			<div class="label">Probleem:</div>
			<div class="value">${formData.problem
				.split("\n")
				.map((line) => `<div>${line}</div>`)
				.join("")}</div>
		</div>
		<div class="field">
			<div class="label">Taust:</div>
			<div class="value">${formData.background
				.split("\n")
				.map((line) => `<div>${line}</div>`)
				.join("")}</div>
		</div>
		<div class="field">
			<div class="label">Meeskonna minimaalne suurus:</div>
			<div class="value">${formData.teamSizeMin}</div>
		</div>
		<div class="field">
			<div class="label">Meeskonna maksimaalne suurus:</div>
			<div class="value">${formData.teamSizeMax}</div>
		</div>
		<div class="field">
			<div class="label">Kommentaar:</div>
			<div class="value">${formData.comment
				.split("\n")
				.map((line) => `<div>${line}</div>`)
				.join("")}</div>
		</div>
		<div class="field">
			<div class="label">Soovituslikud juhendajad:</div>
			<div class="value">${formData.supervisors.join(", ")}</div>
		</div>
		<div class="field">
			<div class="label">Soov juhendada või ise tegeleda projektiga:</div>
			<div class="value">${getWantsToSuperviseOrWriteForEmail(formData.wantsToSuperviseOrWrite)}</div>
		</div>
	</div>
</body>
</html>
`;

		setMessage({ type: "loading", text: "Saadan e-kirja..." });

		try {
			var res = await userService.emailAdminsAsync(
				"Uus projekti idee",
				emailContent,
			);
			if (res.statusCode && res.statusCode < 300) {
				setMessage({
					type: "success",
					text: `E-kiri saadetud edukalt ${res.data?.sentTo} administraatori(-te)le.`,
				});
				return;
			} else {
				setMessage({
					type: "error",
					text: `E-kirja saatmine ebaõnnestus. Server vastas koodiga ${res.statusCode}.`,
				});
			}
		} catch (error) {
			setMessage({
				type: "error",
				text: `E-kirja saatmine ebaõnnestus - ${(error as Error).message}`,
			});
			return;
		}
	};

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
			<TTNewCard className="mb-4 w-auto">
				<TTNewCardContent>
					<Heading as="h3" visual="h5" className="mb-4 font-bold">
						Esita uus projekti idee
					</Heading>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							handleSendEmail();
						}}
					>
						<FormGroup controlId="titleInEstonian">
							<FormLabel>Pealkiri eesti keeles</FormLabel>
							<Input
								name="titleInEstonian"
								placeholder="Sisesta eestikeelne pealkiri"
								value={formData.titleInEstonian}
								onChange={(e) =>
									setFormData((prev) => {
										return {
											...prev,
											titleInEstonian: e.target.value,
										};
									})
								}
							/>
						</FormGroup>
						<FormGroup controlId="titleInEnglish">
							<FormLabel>Pealkiri inglise keeles</FormLabel>
							<Input
								name="titleInEnglish"
								placeholder="Sisesta ingliskeelne pealkiri"
								value={formData.titleInEnglish}
								onChange={(e) =>
									setFormData((prev) => {
										return {
											...prev,
											titleInEnglish: e.target.value,
										};
									})
								}
							/>
						</FormGroup>

						<FormGroup>
							<FormLabel>Projekti tüüp</FormLabel>
							<div className="d-flex gap-3">
								<CustomInput
									id="project-type-project"
									name="type"
									label="Praktika projekt"
									type="radio"
									inline
									checked={formData.type == "project"}
									onChange={(e) =>
										setFormData((prev) => {
											return {
												...prev,
												type: "project",
											};
										})
									}
								/>
								<CustomInput
									id="project-type-project-final-thesis"
									name="type"
									label="Praktika projekt + Lõputöö"
									type="radio"
									inline
									onChange={(e) =>
										setFormData((prev) => {
											return {
												...prev,
												type: "projectFinalThesis",
											};
										})
									}
								/>
								<CustomInput
									id="project-type-final-thesis"
									name="type"
									label="Lõputöö"
									type="radio"
									inline
									onChange={(e) =>
										setFormData((prev) => {
											return {
												...prev,
												type: "finalThesis",
											};
										})
									}
								/>
							</div>
						</FormGroup>

						<FormGroup controlId="tags">
							<FormLabel>Projekti märksõnad</FormLabel>
							<Typeahead
								clearButton
								id="tags"
								multiple
								allowNew
								newSelectionPrefix="Uus märksõna: "
								options={tagOptions}
								placeholder="Vali"
								positionFixed
								selected={formData.tags.map((tag) => ({
									label: tag,
								}))}
								onChange={(selected) =>
									setFormData((prev) => {
										return {
											...prev,
											tags: selected.map((option) =>
												typeof option === "string"
													? option
													: option.label,
											),
										};
									})
								}
							/>
						</FormGroup>

						<FormGroup controlId="description">
							<FormLabel>Kirjeldus</FormLabel>
							<Input
								as="textarea"
								name="description"
								placeholder="Sisesta kirjeldus"
								value={formData.description}
								onChange={(e) =>
									setFormData((prev) => {
										return {
											...prev,
											description: e.target.value,
										};
									})
								}
							/>
						</FormGroup>

						<FormGroup controlId="objective">
							<FormLabel>Eesmärk</FormLabel>
							<Input
								as="textarea"
								name="objective"
								placeholder="Sisesta eesmärk"
								value={formData.objective}
								onChange={(e) =>
									setFormData((prev) => {
										return {
											...prev,
											objective: e.target.value,
										};
									})
								}
							/>
						</FormGroup>

						<FormGroup controlId="problem">
							<FormLabel>Probleem</FormLabel>
							<Input
								as="textarea"
								name="problem"
								placeholder="Sisesta probleem"
								value={formData.problem}
								onChange={(e) =>
									setFormData((prev) => {
										return {
											...prev,
											problem: e.target.value,
										};
									})
								}
							/>
						</FormGroup>

						<FormGroup controlId="background">
							<FormLabel>Taust</FormLabel>
							<Input
								as="textarea"
								name="background"
								placeholder="Sisesta taust"
								value={formData.background}
								onChange={(e) =>
									setFormData((prev) => {
										return {
											...prev,
											background: e.target.value,
										};
									})
								}
							/>
						</FormGroup>

						<FormGroup controlId="teamSizeMin">
							<FormLabel>Meeskonna minimaalne suurus</FormLabel>
							<Input
								name="teamSizeMin"
								type="number"
								placeholder="Sisesta meeskonna minimaalne suurus"
								min={1}
								max={10}
								value={formData.teamSizeMin}
								onChange={(e) =>
									setFormData((prev) => {
										return {
											...prev,
											teamSizeMin: parseInt(
												e.target.value,
												10,
											),
										};
									})
								}
							/>
						</FormGroup>
						<FormGroup controlId="teamSizeMax">
							<FormLabel>Meeskonna maksimaalne suurus</FormLabel>
							<Input
								name="teamSizeMax"
								type="number"
								placeholder="Sisesta meeskonna maksimaalne suurus"
								min={1}
								max={10}
								value={formData.teamSizeMax}
								onChange={(e) =>
									setFormData((prev) => {
										return {
											...prev,
											teamSizeMax: parseInt(
												e.target.value,
												10,
											),
										};
									})
								}
							/>
						</FormGroup>

						<FormGroup controlId="comment">
							<FormLabel>Kommentaar</FormLabel>
							<Input
								as="textarea"
								name="comment"
								placeholder="Sisesta kommentaar"
								value={formData.comment}
								onChange={(e) =>
									setFormData((prev) => {
										return {
											...prev,
											comment: e.target.value,
										};
									})
								}
							/>
						</FormGroup>
						<FormGroup>
							<div className="d-flex gap-3">
								<CustomInput
									id=":r19:"
									inline
									name="wantsToSuperviseOrWrite"
									label="Soovin juhendada seda projekti"
									type="radio"
									onChange={(e) =>
										setFormData((prev) => {
											return {
												...prev,
												wantsToSuperviseOrWrite:
													"supervise",
											};
										})
									}
								/>
								<CustomInput
									id=":r19:"
									inline
									name="wantsToSuperviseOrWrite"
									label="Soovin ise tegeleda selle projektiga"
									type="radio"
									onChange={(e) =>
										setFormData((prev) => {
											return {
												...prev,
												wantsToSuperviseOrWrite:
													"write",
											};
										})
									}
								/>
								<CustomInput
									id=":r19:"
									inline
									name="wantsToSuperviseOrWrite"
									label="Ei soovi juhendada ega ise tegeleda selle projektiga"
									type="radio"
									checked={
										formData.wantsToSuperviseOrWrite == "no"
									}
									onChange={(e) =>
										setFormData((prev) => {
											return {
												...prev,
												wantsToSuperviseOrWrite: "no",
											};
										})
									}
								/>
							</div>
						</FormGroup>

						<FormGroup controlId="supervisors">
							<FormLabel>
								Soovituslik(-ud) projekti juhendaja(-d)
							</FormLabel>
							<div
								style={{
									fontSize: "12px",
									color: "#6c757d",
									marginBottom: "4px",
								}}
							>
								Esimene on põhijuhendaja, teine on kaasjuhendaja
							</div>
							<Typeahead
								clearButton
								id="supervisors"
								multiple
								allowNew
								newSelectionPrefix="Uus juhendaja: "
								options={supervisorOptions}
								placeholder="Vali juhendaja"
								positionFixed
								selected={formData.supervisors.map(
									(supervisor) => ({
										label: supervisor,
									}),
								)}
								onChange={(selected) =>
									setFormData((prev) => {
										return {
											...prev,
											supervisors: selected.map(
												(option) =>
													typeof option === "string"
														? option
														: option.label,
											),
										};
									})
								}
							/>
						</FormGroup>
						<TTNewButton type="submit" disabled={message?.type === "loading"}>Esita</TTNewButton>
					</form>
				</TTNewCardContent>
			</TTNewCard>
		</TTNewContainer>
	);
}
