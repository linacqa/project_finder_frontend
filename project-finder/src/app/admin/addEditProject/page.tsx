"use client";
import TagList from "@/components/tags/TagList";
import { ProjectStatusService } from "@/services/ProjectStatusService";
import { ProjectTypeService } from "@/services/ProjectTypeService";
import { UserService } from "@/services/UserService";
import { TagService } from "@/services/TagService";
import { StepService } from "@/services/StepService";
import { ProjectStepService } from "@/services/ProjectStepService";
import { ProjectService } from "@/services/ProjectService";
import { IProjectAdd } from "@/types/domain/IProjectAdd";
import { useContext, useEffect, useState } from "react";
import {
	ALERT_POSITION_TYPES,
	ALERT_SIZE,
	ALERT_STATUS_TYPE,
	ButtonGroup,
	CustomInput,
	DateTimePicker,
	Dropdown,
	Heading,
	Input,
	TTNewAlert,
	TTNewButton,
	TTNewCard,
	TTNewCardContent,
	TTNewContainer,
} from "taltech-styleguide";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import ConfirmationModal from "@/components/modal/ConfirmationModal";
import { AccountContext } from "@/context/AccountContext";

export default function AddProject() {
	const [project, setProject] = useState<IProjectAdd>({
		titleInEstonian: "",
		titleInEnglish: "",
		authorId: "",
		description: "",
		client: null,
		primarySupervisorId: null,
		primarySupervisor: null,
		externalSupervisorId: null,
		externalSupervisor: null,
		minStudents: 1,
		maxStudents: 1,
		projectTypeId: "",
		projectStatusId: "",
		deadline: null,
		folderIds: [],
		tagIds: [],
		stepIds: [],
	});
	const [tagOptions, setTagOptions] = useState<
		{ label: string; id: string }[]
	>([]);

	const [projectTypeOptions, setProjectTypeOptions] = useState<
		{
			label: string;
			id: string;
		}[]
	>([]);

	const [projectStatusOptions, setProjectStatusOptions] = useState<
		{
			label: string;
			id: string;
		}[]
	>([]);

	const [usersOptions, setUsersOptions] = useState<
		{ label: string; id: string }[]
	>([]);

	const [supervisorOptions, setSupervisorOptions] = useState<
		{ label: string; id: string }[]
	>([]);

	const [supervisorIsRegistered, setSupervisorIsRegistered] = useState(true);
	const [externalSupervisorIsRegistered, setExternalSupervisorIsRegistered] =
		useState(true);

	const [steps, setSteps] = useState<{ label: string; id: string }[]>([]);

	const [message, setMessage] = useState<{
		type: string;
		text: string;
	} | null>(null);

	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const { accountInfo } = useContext(AccountContext);

	const router = useRouter();
	const searchParams = useSearchParams();
	const projectIdToEdit = searchParams.get("id")?.trim() || null;
	const isEditMode = !!projectIdToEdit;

	const projectService = new ProjectService();
	const projectTypeService = new ProjectTypeService();
	const projectStatusService = new ProjectStatusService();
	const tagService = new TagService();
	const userService = new UserService();
	const stepService = new StepService();
	const projectStepService = new ProjectStepService();

	useEffect(() => {
		// Wait for AppState hydration before deciding auth redirect.
		if (accountInfo === undefined) {
			return;
		}

		if (!accountInfo.isAuthenticated) {
			router.push("/login");
			return;
		}
		if (accountInfo.role !== "admin") {
			router.push("/");
			return;
		}
	}, [accountInfo]);

	useEffect(() => {
		let mounted = true;
		const loadInitialData = async () => {
			setMessage({ type: "loading", text: "Laadin..." });

			try {
				const [
					projectTypesRes,
					projectStatusesRes,
					tagsRes,
					usersRes,
					supervisorsRes,
					stepsRes,
					projectRes,
					projectStepsRes,
				] = await Promise.all([
					projectTypeService.getAllAsync(),
					projectStatusService.getAllAsync(),
					tagService.getAllAsync(),
					userService.getAllAsync(),
					userService.getAllSupervisorsAsync(),
					stepService.getAllAsync(),
					isEditMode && projectIdToEdit
						? projectService.getByIdAsync(projectIdToEdit)
						: Promise.resolve(null),
					isEditMode && projectIdToEdit
						? projectStepService.getAllByProjectIdAsync(
								projectIdToEdit,
							)
						: Promise.resolve(null),
				]);

				if (!mounted) return;

				if (projectTypesRes.data) {
					setProjectTypeOptions(
						projectTypesRes.data.map((pt) => ({
							label: pt.name,
							id: pt.id,
						})),
					);
				}

				if (projectStatusesRes.data) {
					setProjectStatusOptions(
						projectStatusesRes.data.map((ps) => ({
							label: ps.name,
							id: ps.id,
						})),
					);
				}

				if (tagsRes.data) {
					setTagOptions(
						tagsRes.data.map((t) => ({ label: t.name, id: t.id })),
					);
				}

				if (usersRes.data) {
					setUsersOptions(
						usersRes.data.map((u) => ({
							label: `${u.firstName} ${u.lastName} (${u.email})`,
							id: u.id,
						})),
					);
				}

				if (supervisorsRes.data) {
					setSupervisorOptions(
						supervisorsRes.data.map((s) => ({
							label: `${s.firstName} ${s.lastName} (${s.email})`,
							id: s.id,
						})),
					);
				}

				if (stepsRes.data) {
					setSteps(
						stepsRes.data.map((s) => ({ label: s.name, id: s.id })),
					);
				}

				if (isEditMode && projectRes?.data) {
					const loadedProject = projectRes.data;

					const authorId =
						loadedProject.users.find(
							(u) => u.userProjectRole.name === "Author",
						)?.userId || "";
					const primarySupervisorId =
						loadedProject.users.find(
							(u) => u.userProjectRole.name === "Supervisor",
						)?.userId || null;
					const externalSupervisorId =
						loadedProject.users.find(
							(u) =>
								u.userProjectRole.name ===
								"External Supervisor",
						)?.userId || null;

					setSupervisorIsRegistered(!!primarySupervisorId);
					setExternalSupervisorIsRegistered(!!externalSupervisorId);

					setProject((prev) => ({
						...prev,
						authorId,
						titleInEstonian: loadedProject.titleInEstonian ?? "",
						titleInEnglish: loadedProject.titleInEnglish ?? "",
						description: loadedProject.description ?? "",
						client: loadedProject.client ?? null,
						minStudents: loadedProject.minStudents ?? 1,
						maxStudents: loadedProject.maxStudents ?? 1,
						projectTypeId: loadedProject.projectTypeId ?? "",
						projectStatusId: loadedProject.projectStatusId ?? "",
						deadline: loadedProject.deadline ?? null,
						tagIds: loadedProject.tags?.map((t) => t.id) ?? [],
						stepIds:
							projectStepsRes?.data?.map(
								(projectStep) => projectStep.stepId,
							) ?? [],
						primarySupervisorId,
						primarySupervisor: primarySupervisorId
							? null
							: (loadedProject.supervisor ?? null),
						externalSupervisorId,
						externalSupervisor: externalSupervisorId
							? null
							: (loadedProject.externalSupervisor ?? null),
					}));
				}

				setMessage(null);
			} catch (error) {
				if (!mounted) return;

				setMessage({
					type: "error",
					text: "Andmete laadimine ebaõnnestus.",
				});
				console.error(error);
			}
		};

		void loadInitialData();

		return () => {
			mounted = false;
		};
	}, [isEditMode, projectIdToEdit]);

	const handleStringFieldChange = (
		field: keyof IProjectAdd,
		value: string,
	) => {
		setProject({ ...project, [field]: value });
	};

	const handleSave = async () => {
		if (!project.titleInEstonian.trim()) {
			setMessage({
				type: "error",
				text: "Pealkirjad ei tohi olla tühjad.",
			});
			return;
		} else if (!project.authorId) {
			setMessage({ type: "error", text: "Autor peab olema valitud." });
			return;
		} else if (!project.projectTypeId) {
			setMessage({
				type: "error",
				text: "Projekti tüüp peab olema valitud.",
			});
			return;
		} else if (!project.description.trim()) {
			setMessage({ type: "error", text: "Kirjeldus ei tohi olla tühi." });
			return;
		} else if (
			project.minStudents < 1 ||
			project.maxStudents < 1 ||
			project.minStudents > project.maxStudents
		) {
			setMessage({
				type: "error",
				text: "Õpilaste arv peab olema positiivne ja minimaalne arv ei tohi olla suurem kui maksimaalne arv.",
			});
			return;
		} else if (!project.projectStatusId) {
			setMessage({
				type: "error",
				text: "Projekti staatus peab olema valitud.",
			});
			return;
		}

		if (supervisorIsRegistered) {
			setProject((prev) => ({
				...prev,
				primarySupervisor: null,
			}));
		} else {
			setProject((prev) => ({
				...prev,
				primarySupervisorId: null,
			}));
		}

		if (externalSupervisorIsRegistered) {
			setProject((prev) => ({
				...prev,
				externalSupervisor: null,
			}));
		} else {
			setProject((prev) => ({
				...prev,
				externalSupervisorId: null,
			}));
		}

		setMessage({
			type: "loading",
			text: isEditMode
				? "Salvestan projekti muudatusi..."
				: "Loon projekti...",
		});

		try {
			const res =
				isEditMode && projectIdToEdit
					? await projectService.updateByIdAsync(
							projectIdToEdit,
							project,
						)
					: await projectService.addAsync(project);

			if (
				(res && res.data) ||
				(isEditMode && res.statusCode && res.statusCode <= 300)
			) {
				setMessage({
					type: "success",
					text: isEditMode
						? "Projekt edukalt uuendatud!"
						: "Projekt edukalt loodud!",
				});
				router.push("/");
				return;
			}

			setMessage({
				type: "error",
				text: isEditMode
					? "Projekti uuendamine ebaõnnestus."
					: "Projekti loomine ebaõnnestus.",
			});
		} catch (error) {
			console.error(error);
			setMessage({
				type: "error",
				text: isEditMode
					? "Projekti uuendamine ebaõnnestus."
					: "Projekti loomine ebaõnnestus.",
			});
		}
	};

	const handleDeleteConfirm = async () => {
		if (!projectIdToEdit) return;

		setMessage({ type: "loading", text: "Kustutan projekti..." });

		try {
			const res = await projectService.deleteByIdAsync(projectIdToEdit);

			if (res && res.statusCode && res.statusCode <= 300) {
				setMessage({
					type: "success",
					text: "Projekt edukalt kustutatud!",
				});
				router.push("/");
				return;
			}

			setMessage({
				type: "error",
				text: "Projekti kustutamine ebaõnnestus.",
			});
		} catch (error) {
			setMessage({
				type: "error",
				text: "Projekti kustutamine ebaõnnestus.",
			});
		}
	};

	return (
		<>
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
					<TTNewCardContent className="grid-container">
						<div className="d-flex flex-column gap-3">
							<Heading as="h3" visual="h3">
								{isEditMode ? "Muuda projekti" : "Lisa projekt"}
							</Heading>
							<div>
								<Heading as="h4" visual="h4">
									Pealkiri eesti keeles
								</Heading>
								<Input
									className="mb-3"
									value={project.titleInEstonian}
									onChange={(e) =>
										handleStringFieldChange(
											"titleInEstonian",
											e.target.value,
										)
									}
									placeholder="Pealkiri eesti keeles"
								/>
								<Heading as="h4" visual="h4">
									Pealkiri inglise keeles
								</Heading>
								<Input
									className="mb-3"
									value={project.titleInEnglish}
									onChange={(e) =>
										handleStringFieldChange(
											"titleInEnglish",
											e.target.value,
										)
									}
									placeholder="Pealkiri inglise keeles"
								/>
								<Heading as="h4" visual="h4">
									Autor
								</Heading>
								<Dropdown className="my-3">
									<Dropdown.Toggle
										variant="outline"
										className="border border-primary text-primary fw-semibold px-4 py-2"
									>
										Vali autor
									</Dropdown.Toggle>

									<Dropdown.Menu className="shadow-sm border-0">
										{usersOptions.map((author, index) => (
											<Dropdown.Item
												key={index}
												className="text-primary px-3 py-2"
												onClick={() => {
													setProject({
														...project,
														authorId: author.id,
													});
												}}
											>
												{author.label}
											</Dropdown.Item>
										))}
									</Dropdown.Menu>
								</Dropdown>
								<TagList
									tags={
										usersOptions
											.filter(
												(a) =>
													project.authorId === a.id,
											)
											.map((a) => a.label) || []
									}
									handleRemoveTag={() =>
										setProject({
											...project,
											authorId: "",
										})
									}
								/>
							</div>
							<div>
								<Heading
									className="admin-thesis-details-titles"
									as="h4"
									visual="h4"
								>
									Projekti tüüp
								</Heading>
								<div className="d-flex gap-3">
									{projectTypeOptions.map((option) => (
										<CustomInput
											id={`project-type-${option.id}`}
											key={option.id}
											name="projectType"
											label={option.label}
											type="radio"
											inline
											checked={
												project.projectTypeId ===
												option.id
											}
											onChange={() =>
												setProject({
													...project,
													projectTypeId: option.id,
												})
											}
										/>
									))}
								</div>
							</div>
							<div>
								<Heading
									className="admin-thesis-details-titles"
									as="h4"
									visual="h4"
								>
									Kirjeldus
								</Heading>

								<Input
									as="textarea"
									value={project.description}
									onChange={(e) =>
										handleStringFieldChange(
											"description",
											e.target.value,
										)
									}
									placeholder="Kirjeldus"
									rows={5}
								/>
							</div>

							<div>
								<Heading
									className="admin-thesis-details-titles"
									as="h4"
									visual="h4"
								>
									Sildid
								</Heading>
								<Dropdown className="my-3">
									<Dropdown.Toggle
										variant="outline"
										className="border border-primary text-primary fw-semibold px-4 py-2"
									>
										Vali sildid
									</Dropdown.Toggle>

									<Dropdown.Menu className="shadow-sm border-0">
										{Object.values(tagOptions).map(
											(tag, index) => (
												<Dropdown.Item
													key={index}
													className="text-primary px-3 py-2"
													onClick={() => {
														if (
															!project.tagIds.includes(
																tag.id,
															)
														) {
															setProject({
																...project,
																tagIds: [
																	...project.tagIds,
																	tag.id,
																],
															});
														}
													}}
												>
													{tag.label}
												</Dropdown.Item>
											),
										)}
									</Dropdown.Menu>
								</Dropdown>
								<TagList
									tags={
										tagOptions
											.filter((t) =>
												project.tagIds.includes(t.id),
											)
											.map((t) => t.label) || []
									}
									handleRemoveTag={(index) => {
										const tagIdToRemove =
											project.tagIds[index];
										setProject({
											...project,
											tagIds: project.tagIds.filter(
												(id) => id !== tagIdToRemove,
											),
										});
									}}
								/>
							</div>

							<div>
								<Heading
									className="admin-thesis-details-titles"
									as="h4"
									visual="h4"
								>
									Meeskonna suurus
								</Heading>

								<strong>Minimaalne</strong>
								<Input
									className="mb-2"
									value={project.minStudents}
									type="number"
									min={1}
									max={10}
									onChange={(e) =>
										setProject({
											...project,
											minStudents:
												parseInt(e.target.value, 10) ||
												1,
										})
									}
								/>
								<strong>Maksimaalne</strong>
								<Input
									className="mb-3"
									value={project.maxStudents}
									type="number"
									min={1}
									max={10}
									onChange={(e) =>
										setProject({
											...project,
											maxStudents:
												parseInt(e.target.value, 10) ||
												1,
										})
									}
								/>
							</div>

							<div>
								<Heading
									className="admin-thesis-details-titles"
									as="h4"
									visual="h4"
								>
									Juhendajad
								</Heading>
								<div className="mb-3">
									<div>
										<div className="mb-2">
											<strong>Peamine juhendaja:</strong>
										</div>

										<CustomInput
											className="mb-2"
											id="supervisorIsRegistered"
											name="supervisorIsRegistered"
											label="Juhendaja on registreeritud kasutajana"
											type="checkbox"
											checked={supervisorIsRegistered}
											onChange={() =>
												setSupervisorIsRegistered(
													!supervisorIsRegistered,
												)
											}
										/>

										{supervisorIsRegistered ? (
											<>
												<Dropdown className="my-3">
													<Dropdown.Toggle
														variant="outline"
														className="border border-primary text-primary fw-semibold px-4 py-2"
													>
														Vali juhendaja
													</Dropdown.Toggle>

													<Dropdown.Menu className="shadow-sm border-0">
														{supervisorOptions.map(
															(
																supervisor,
																index,
															) => (
																<Dropdown.Item
																	key={index}
																	onClick={() => {
																		setProject(
																			{
																				...project,
																				primarySupervisorId:
																					supervisor.id,
																				primarySupervisor:
																					null,
																			},
																		);
																	}}
																>
																	{
																		supervisor.label
																	}
																</Dropdown.Item>
															),
														)}
													</Dropdown.Menu>
												</Dropdown>
												<TagList
													tags={
														supervisorOptions
															.filter(
																(s) =>
																	project.primarySupervisorId ===
																	s.id,
															)
															.map(
																(s) => s.label,
															) || []
													}
													handleRemoveTag={() =>
														setProject({
															...project,
															primarySupervisorId:
																null,
														})
													}
												/>
											</>
										) : (
											<Input
												className="mb-2"
												value={
													project.primarySupervisor ||
													""
												}
												onChange={(e) =>
													handleStringFieldChange(
														"primarySupervisor",
														e.target.value,
													)
												}
												placeholder="Peamine juhendaja"
											/>
										)}
									</div>
								</div>
								<div>
									<div>
										<div className="mb-2">
											<strong>Kaasjuhendaja:</strong>
										</div>

										<CustomInput
											id="externalSupervisorIsRegistered"
											name="externalSupervisorIsRegistered"
											label="Kaasjuhendaja on registreeritud kasutajana"
											type="checkbox"
											checked={
												externalSupervisorIsRegistered
											}
											onChange={() =>
												setExternalSupervisorIsRegistered(
													!externalSupervisorIsRegistered,
												)
											}
										/>

										{externalSupervisorIsRegistered ? (
											<>
												<Dropdown className="my-3">
													<Dropdown.Toggle
														variant="outline"
														className="border border-primary text-primary fw-semibold px-4 py-2"
													>
														Vali kaasjuhendaja
													</Dropdown.Toggle>

													<Dropdown.Menu className="shadow-sm border-0">
														{usersOptions.map(
															(
																externalSupervisor,
																index,
															) => (
																<Dropdown.Item
																	key={index}
																	onClick={() => {
																		setProject(
																			{
																				...project,
																				externalSupervisorId:
																					externalSupervisor.id,
																				externalSupervisor:
																					null,
																			},
																		);
																	}}
																>
																	{
																		externalSupervisor.label
																	}
																</Dropdown.Item>
															),
														)}
													</Dropdown.Menu>
												</Dropdown>
												<TagList
													tags={
														usersOptions
															.filter(
																(s) =>
																	project.externalSupervisorId ===
																	s.id,
															)
															.map(
																(s) => s.label,
															) || []
													}
													handleRemoveTag={() =>
														setProject({
															...project,
															externalSupervisorId:
																null,
														})
													}
												/>
											</>
										) : (
											<Input
												value={
													project.externalSupervisor ||
													""
												}
												onChange={(e) =>
													handleStringFieldChange(
														"externalSupervisor",
														e.target.value,
													)
												}
												placeholder="Kaasjuhendaja"
											/>
										)}
									</div>
								</div>
							</div>
							<div>
								<Heading
									className="admin-thesis-details-titles"
									as="h4"
									visual="h4"
								>
									Projekti etapid
								</Heading>
								<Dropdown className="my-3">
									<Dropdown.Toggle
										variant="outline"
										className="border border-primary text-primary fw-semibold px-4 py-2"
									>
										Vali projekti etapid
									</Dropdown.Toggle>

									<Dropdown.Menu className="shadow-sm border-0">
										{steps.map((step, index) => (
											<Dropdown.Item
												key={index}
												className="text-primary px-3 py-2"
												onClick={() => {
													if (
														!project.stepIds.includes(
															step.id,
														)
													) {
														setProject({
															...project,
															stepIds: [
																...project.stepIds,
																step.id,
															],
														});
													}
												}}
											>
												{step.label}
											</Dropdown.Item>
										))}
									</Dropdown.Menu>
								</Dropdown>
								<TagList
									tags={
										steps
											.filter((s) =>
												project.stepIds.includes(s.id),
											)
											.map((s) => s.label) || []
									}
									handleRemoveTag={(index) => {
										const stepIdToRemove =
											project.stepIds[index];
										setProject({
											...project,
											stepIds: project.stepIds.filter(
												(id) => id !== stepIdToRemove,
											),
										});
									}}
								/>
							</div>

							<div>
								<Heading
									className="admin-thesis-details-titles"
									as="h4"
									visual="h4"
								>
									Lisainfo
								</Heading>
								<div className="mb-2">
									<strong>Klient:</strong>
								</div>
								<Input
									className="mb-2"
									value={project.client || ""}
									onChange={(e) =>
										handleStringFieldChange(
											"client",
											e.target.value,
										)
									}
									placeholder="Klient"
								/>
								<div className="mb-2">
									<strong>Tähtaeg:</strong>
								</div>
								<DateTimePicker
									value={
										project.deadline
											? dayjs(project.deadline)
											: null
									}
									onChange={(date) => {
										setProject({
											...project,
											deadline: date?.toISOString() || "",
										});
									}}
								/>
							</div>
							<div>
								<Heading
									className="admin-thesis-details-titles"
									as="h4"
									visual="h4"
								>
									Projekti staatus
								</Heading>
								<Dropdown className="my-3">
									<Dropdown.Toggle
										variant="outline"
										className="border border-primary text-primary fw-semibold px-4 py-2"
									>
										Vali projekti staatus
									</Dropdown.Toggle>

									<Dropdown.Menu className="shadow-sm border-0">
										{Object.values(
											projectStatusOptions,
										).map((projectStatus, index) => (
											<Dropdown.Item
												key={index}
												className="text-primary px-3 py-2"
												onClick={() => {
													setProject({
														...project,
														projectStatusId:
															projectStatus.id,
													});
												}}
											>
												{projectStatus.label}
											</Dropdown.Item>
										))}
									</Dropdown.Menu>
								</Dropdown>
								<TagList
									tags={
										projectStatusOptions
											.filter(
												(ps) =>
													project.projectStatusId ===
													ps.id,
											)
											.map((ps) => ps.label) || []
									}
									handleRemoveTag={() =>
										setProject({
											...project,
											projectStatusId: "",
										})
									}
								/>
							</div>

							<div>
								<form
									onSubmit={(e) => {
										e.preventDefault();
										handleSave();
									}}
								>
									<ButtonGroup className="mt-4">
										<TTNewButton
											variant="success"
											type="submit"
										>
											{isEditMode
												? "Salvesta muudatused"
												: "Lisa projekt"}
										</TTNewButton>
									</ButtonGroup>
								</form>

								{isEditMode && (
									<>
										<ButtonGroup className="my-6">
											<TTNewButton
												variant="danger"
												onClick={() =>
													setShowDeleteModal(true)
												}
											>
												Kustuta projekt
											</TTNewButton>
										</ButtonGroup>

										<ConfirmationModal
											show={showDeleteModal}
											hideAction={() =>
												setShowDeleteModal(false)
											}
											title="Kas olete kindel?"
											text="Kas soovite selle projekti jäädavalt kustutada? Seda toimingut ei saa tagasi võtta."
											confirmText="Jah, kustuta"
											confirmAction={handleDeleteConfirm}
										/>
									</>
								)}

								<ButtonGroup
									className="mt-4"
									onClick={() => {
										router.push("/");
									}}
								>
									<TTNewButton
										variant="light"
										iconLeft="arrow_back"
									>
										Tagasi projektide juurde
									</TTNewButton>
								</ButtonGroup>
							</div>
						</div>
					</TTNewCardContent>
				</TTNewCard>
			</TTNewContainer>
		</>
	);
}
