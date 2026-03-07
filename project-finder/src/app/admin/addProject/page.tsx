"use client";
import ConfirmationModal from "@/components/modal/ConfirmationModal";
import TagList from "@/components/tags/TagList";
import { ProjectStatusService } from "@/services/ProjectStatusService";
import { ProjectTypeService } from "@/services/ProjectTypeService";
import { UserService } from "@/services/UserService";
import { TagService } from "@/services/TagService";
import { FolderService } from "@/services/FolderService";
import { StepService } from "@/services/StepService";
import { ProjectService } from "@/services/ProjectService";
import { IProjectAdd } from "@/types/domain/IProjectAdd";
import { useEffect, useState } from "react";
import {
	ButtonGroup,
	CustomInput,
	DateTimePicker,
	Dropdown,
	Heading,
	Input,
	TTNewButton,
	TTNewCard,
	TTNewCardContent,
	TTNewContainer,
} from "taltech-styleguide";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/router";

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
	const [loadingTags, setLoadingTags] = useState(false);

	const [projectTypeOptions, setProjectTypeOptions] = useState<
		{
			label: string;
			id: string;
		}[]
	>([]);
	const [loadingProjectTypes, setLoadingProjectTypes] = useState(false);

	const [projectStatusOptions, setProjectStatusOptions] = useState<
		{
			label: string;
			id: string;
		}[]
	>([]);
	const [loadingProjectStatuses, setLoadingProjectStatuses] = useState(false);

	const [authorOptions, setAuthorOptions] = useState<
		{ label: string; id: string }[]
	>([]);
	const [loadingAuthors, setLoadingAuthors] = useState(false);

	const [supervisorOptions, setSupervisorOptions] = useState<
		{ label: string; id: string }[]
	>([]);
	const [loadingSupervisors, setLoadingSupervisors] = useState(false);

	const [supervisorIsRegistered, setSupervisorIsRegistered] = useState(true);
	const [externalSupervisorIsRegistered, setExternalSupervisorIsRegistered] =
		useState(true);

	const [steps, setSteps] = useState<{ label: string; id: string }[]>([]);
	const [loadingSteps, setLoadingSteps] = useState(false);

	const [folders, setFolders] = useState<{ label: string; id: string }[]>([]);
	const [loadingFolders, setLoadingFolders] = useState(false);

	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const router = useRouter();

	useEffect(() => {
		let mounted = true;
		const projectTypeService = new ProjectTypeService();
		setLoadingProjectTypes(true);
		projectTypeService
			.getAllAsync()
			.then((res) => {
				if (!mounted) return;
				if (res && res.data) {
					setProjectTypeOptions(
						res.data.map((pt) => ({ label: pt.name, id: pt.id })),
					);
				}
			})
			.catch((err) => console.error(err))
			.finally(() => {
				if (mounted) setLoadingProjectTypes(false);
			});

		const projectStatusService = new ProjectStatusService();
		setLoadingProjectStatuses(true);
		projectStatusService
			.getAllAsync()
			.then((res) => {
				if (!mounted) return;
				if (res && res.data) {
					setProjectStatusOptions(
						res.data.map((ps) => ({ label: ps.name, id: ps.id })),
					);
				}
			})
			.catch((err) => console.error(err))
			.finally(() => {
				if (mounted) setLoadingProjectStatuses(false);
			});

		const tagService = new TagService();
		setLoadingTags(true);
		tagService
			.getAllAsync()
			.then((res) => {
				if (!mounted) return;
				if (res && res.data) {
					setTagOptions(
						res.data.map((t) => ({ label: t.name, id: t.id })),
					);
				}
			})
			.catch((err) => console.error(err))
			.finally(() => {
				if (mounted) setLoadingTags(false);
			});

		const userService = new UserService();
		setLoadingAuthors(true);
		userService
			.getAllAsync()
			.then((res) => {
				if (!mounted) return;
				if (res && res.data) {
					setAuthorOptions(
						res.data.map((u) => ({
							label:
								u.firstName +
								" " +
								u.lastName +
								" (" +
								u.email +
								")",
							id: u.id,
						})),
					);
				}
			})
			.catch((err) => console.error(err))
			.finally(() => {
				if (mounted) setLoadingAuthors(false);
			});

		setLoadingSupervisors(true);
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
							id: s.id,
						})),
					);
				}
			})
			.catch((err) => console.error(err))
			.finally(() => {
				if (mounted) setLoadingSupervisors(false);
			});

		const folderService = new FolderService();
		setLoadingFolders(true);
		folderService
			.getAllAsync()
			.then((res) => {
				if (!mounted) return;
				if (res && res.data) {
					setFolders(
						res.data.map((f) => ({
							label: f.name,
							id: f.id,
						})),
					);
				}
			})
			.catch((err) => console.error(err))
			.finally(() => {
				if (mounted) setLoadingFolders(false);
			});

		const stepService = new StepService();
		setLoadingSteps(true);
		stepService
			.getAllAsync()
			.then((res) => {
				if (!mounted) return;
				if (res && res.data) {
					setSteps(
						res.data.map((s) => ({
							label: s.name,
							id: s.id,
						})),
					);
				}
			})
			.catch((err) => console.error(err))
			.finally(() => {
				if (mounted) setLoadingSteps(false);
			});

		return () => {
			mounted = false;
		};
	}, []);

	const handleStringFieldChange = (
		field: keyof IProjectAdd,
		value: string,
	) => {
		setProject({ ...project, [field]: value });
	};

	const handleSave = () => {
		const projectService = new ProjectService();
		projectService.addAsync(project).then((res) => {
			if (res && res.data) {
				router.push("/admin/projects");
				console.log("Project created with id: ", res.data.id);
			}
		});
	};

	return (
		<>
			<TTNewContainer>
				<TTNewCard className="mb-4 w-auto">
					<TTNewCardContent className="grid-container">
						<div className="d-flex flex-column gap-3">
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
										{authorOptions.map((author, index) => (
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
										authorOptions
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
								{/* <Divider className="mb-2" /> */}

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
								{/* <Divider className="mb-2" /> */}
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
													// onClick={() =>
													// 	handleAddTag(tag)
													// }
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

								{/* <Heading
									className="admin-thesis-details-titles"
									as="h4"
									visual="h4"
								>
									Tiimi rollid
								</Heading>

								<Dropdown className="my-3">
									<Dropdown.Toggle
										variant="outline"
										className="border border-primary text-primary fw-semibold px-4 py-2"
									>
										Vali rollid
									</Dropdown.Toggle>

									<Dropdown.Menu>
										{Object.values(EITRole).map((role) => (
											<Dropdown.Item
												key={role}
												onClick={() =>
													handleAddRole(role)
												}
											>
												{role}
											</Dropdown.Item>
										))}
									</Dropdown.Menu>
								</Dropdown> */}

								{/* <TagList
									tags={thesis.roles!}
									handleRemoveTag={handleRemoveRole}
								/> */}
							</div>

							<div>
								<Heading
									className="admin-thesis-details-titles"
									as="h4"
									visual="h4"
								>
									Juhendajad
								</Heading>
								{/* <Divider className="mb-2" /> */}
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
															primarySupervisorId: null,
														})
													}
												/>
											</>
										) : (
											<Input
												className="mb-2"
												value={project.primarySupervisor || ""}
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
													{supervisorOptions.map(
														(externalSupervisor, index) => (
															<Dropdown.Item
																key={index}
																onClick={() => {
																	setProject({
																		...project,
																		externalSupervisorId:
																			externalSupervisor.id,
																	});
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
													supervisorOptions
														.filter(
															(s) =>
																project.externalSupervisorId ===
																s.id,
														)
														.map((s) => s.label) ||
													[]
												}
												handleRemoveTag={() =>
													setProject({
														...project,
														externalSupervisorId: null,
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
							{/* </div> */}
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
									value={dayjs(project.deadline) || null}
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
								{/* <div className="d-flex gap-3">
								{projectStatusOptions.map((option) => (

										<CustomInput
											id={`project-status-${option.id}`}
											name="projectStatus"
											label={option.label}
											type="radio"
											inline
											checked={
												project.projectStatusId ===
												option.id
											}
											onChange={() =>
												setProject({
													...project,
													projectStatusId: option.id,
												})
											}
										/>

								))}
								</div> */}
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
								<Heading
									className="admin-thesis-details-titles"
									as="h4"
									visual="h4"
								>
									Kaustad
								</Heading>
								<Dropdown className="my-3">
									<Dropdown.Toggle
										variant="outline"
										className="border border-primary text-primary fw-semibold px-4 py-2"
									>
										Vali kaustad
									</Dropdown.Toggle>

									<Dropdown.Menu className="shadow-sm border-0">
										{folders.map((folder, index) => (
											<Dropdown.Item
												key={index}
												className="text-primary px-3 py-2"
												onClick={() => {
													if (
														!project.folderIds.includes(
															folder.id,
														)
													) {
														setProject({
															...project,
															folderIds: [
																...project.folderIds,
																folder.id,
															],
														});
													}
												}}
											>
												{folder.label}
											</Dropdown.Item>
										))}
									</Dropdown.Menu>
								</Dropdown>
								<TagList
									tags={
										folders
											.filter((f) =>
												project.folderIds.includes(f.id),
											)
											.map((f) => f.label) || []
									}
									handleRemoveTag={(index) => {
										const folderIdToRemove =
											project.folderIds[index];
										setProject({
											...project,
											folderIds: project.folderIds.filter(
												(id) => id !== folderIdToRemove,
											),
										});
									}}
								/>
							</div>

							<div>
								<form
									onSubmit={(e) => {
										e.preventDefault();
										console.log(
											"Project to save:",
											project,
										);
										handleSave();
									}}
								>
									<ButtonGroup className="mt-4">
										<TTNewButton
											variant="success"
											type="submit"
										>
											Lisa projekt
										</TTNewButton>
									</ButtonGroup>
								</form>

								{/* <ButtonGroup className="my-6">
									<TTNewButton
										variant="danger"
										onClick={() => setShowDeleteModal(true)}
									>
										Eemalda teema
									</TTNewButton>
								</ButtonGroup>

								<ConfirmationModal
									show={showDeleteModal}
									hideAction={() => setShowDeleteModal(false)}
									title="Kas olete kindel?"
									text="Kas soovite selle lõputöö teema jäädavalt kustutada? Seda toimingut ei saa tagasi võtta."
									confirmText="Jah, kustuta"
									// confirmAction={handleDeleteConfirm}
									confirmAction={() => {}}
								/> */}

								<ButtonGroup
									className="mt-4"
									onClick={() => {
										// handleSave();
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
			{/* </div> */}
		</>
	);
}
