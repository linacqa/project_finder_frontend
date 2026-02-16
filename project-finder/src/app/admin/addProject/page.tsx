"use client";
import ConfirmationModal from "@/components/modal/ConfirmationModal";
import TagList from "@/components/tags/TagList";
import { SupervisorService } from "@/services/SupervisorService";
import { TagService } from "@/services/TagService";
import { IProjectAdd } from "@/types/domain/IProjectAdd";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
	ButtonGroup,
	Dropdown,
	Heading,
	Input,
	TTNewButton,
	TTNewCard,
	TTNewCardContent,
	TTNewContainer,
} from "taltech-styleguide";

export default function AddThesis() {
	const [project, setProject] = useState<IProjectAdd>({
		titleInEstonian: "",
		titleInEnglish: "",
		authorId: "",
		description: "",
		client: null,
		supervisorId: null,
		supervisor: null,
		externalSupervisorId: null,
		externalSupervisor: null,
		minStudents: 1,
		maxStudents: 1,
		projectTypeId: "",
		projectStatusId: "",
		deadline: "",
		folderIds: [],
		tagIds: [],
		stepIds: [],
	});
	const [tagOptions, setTagOptions] = useState<{ label: string, id: string }[]>([]);
	const [loadingTags, setLoadingTags] = useState(false);
	const [projectStatusOptions, setProjectStatusOptions] = useState<{
		label: string;
		id: string;
	}[]>([]);
	const [loadingProjectStatuses, setLoadingProjectStatuses] = useState(false);
	const [supervisorOptions, setSupervisorOptions] = useState<{ label: string, id: string }[]>([]);
	const [loadingSupervisors, setLoadingSupervisors] = useState(false);

	const [showDeleteModal, setShowDeleteModal] = useState(false);

	useEffect(() => {
			let mounted = true;
			const tagService = new TagService();
			setLoadingTags(true);
			tagService
				.getAllAsync()
				.then((res) => {
					if (!mounted) return;
					if (res && res.data) {
						setTagOptions(res.data.map((t) => ({ label: t.name, id: t.id })));
					}
				})
				.catch((err) => console.error(err))
				.finally(() => {
					if (mounted) setLoadingTags(false);
				});

			const supervisorService = new SupervisorService();
			setLoadingSupervisors(true);
			supervisorService
				.getAllAsync()
				.then((res) => {
					if (!mounted) return;
					if (res && res.data) {
						setSupervisorOptions(res.data.map((s) => ({ label: s.firstName + " " + s.lastName + " (" + s.email + ")", id: s.id })));
					}
				})
				.catch((err) => console.error(err))
				.finally(() => {
					if (mounted) setLoadingSupervisors(false);
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
									Title in english
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
									placeholder="Title in english"
								/>
								<Heading as="h4" visual="h4">
									Author
								</Heading>
								<Dropdown className="my-3">
									<Dropdown.Toggle
										variant="outline"
										className="border border-primary text-primary fw-semibold px-4 py-2"
									>
										Vali autor
									</Dropdown.Toggle>

									<Dropdown.Menu className="shadow-sm border-0">
										{/* {Object.values(EFTTags).map(
											(tag, index) => (
												<Dropdown.Item
													key={index}
													className="text-primary px-3 py-2"
													onClick={() =>
														handleAddTag(tag)
													}
												>
													{tag}
												</Dropdown.Item>
											),
										)} */}
									</Dropdown.Menu>
								</Dropdown>
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
														if (!project.tagIds.includes(tag.id)) {
															setProject({
																...project,
																tagIds: [...project.tagIds, tag.id],
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
									tags={tagOptions.filter((t) => project.tagIds.includes(t.id)).map((t) => t.label) || []}
									handleRemoveTag={(index) => {
										const tagIdToRemove = project.tagIds[index];
										setProject({
											...project,
											tagIds: project.tagIds.filter((id) => id !== tagIdToRemove),
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

								<Input
									className="mb-2"
									value="1"
									type="number"
									min="1"
									// onChange={(e) => {
									// 	handleFieldChange(
									// 		"teamSize",
									// 		e.target.value,
									// 	);
									// 	handleTeamSizeChange(e.target.value);
									// }}
								/>
								<Input
									className="mb-3"
									value="5"
									type="number"
									min="1"
									// onChange={(e) => {
									// 	handleFieldChange(
									// 		"teamSize",
									// 		e.target.value,
									// 	);
									// 	handleTeamSizeChange(e.target.value);
									// }}
								/>

								<Heading
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
										{/* {Object.values(EITRole).map((role) => (
											<Dropdown.Item
												key={role}
												onClick={() =>
													handleAddRole(role)
												}
											>
												{role}
											</Dropdown.Item>
										))} */}
									</Dropdown.Menu>
								</Dropdown>

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
									Tiim ja kontaktid
								</Heading>
								{/* <Divider className="mb-2" /> */}
								<div>
									<div>
										<div className="mb-2">
											<strong>Kaasjuhendaja:</strong>
										</div>

										<Input
											value={
												project.externalSupervisor || ""
											}
											onChange={(e) =>
												handleStringFieldChange(
													"externalSupervisor",
													e.target.value,
												)
											}
											placeholder="Kaasjuhendaja"
										/>
									</div>

									{/* <p className="admin-thesis-details-uldinfo-titles">
										Kontakt:{" "}
										<Link href={`mailto:`}>
												{thesis.contacts}
										</Link>
									</p> */}
								</div>
							</div>
							{/* </div> */}

							<div>
								<Heading
									className="admin-thesis-details-titles"
									as="h4"
									visual="h4"
								>
									Lisainfo
								</Heading>
								{/* <Divider className="mb-2" /> */}
								<div className="mb-2">
											<strong>Klient:</strong>
								</div>
								{/* <Link href="" target="_blank">
									{thesis.client}
									klientinimi
								</Link> */}
								<Input
									value={project.client || ""}
									onChange={(e) =>
										handleStringFieldChange(
											"client",
											e.target.value,
										)
									}
									placeholder="Klient"
								/>

								{/* <p>
								<strong>Teema lisatud:</strong>
								{thesis.since}
								kuupäev
							</p> */}

								<form
									onSubmit={(e) => {
										e.preventDefault();
										// handleSave();
									}}
								>
									<ButtonGroup className="mt-4">
										<TTNewButton
											variant="success"
											type="submit"
										>
											Salvesta ja kinnita teema
										</TTNewButton>
									</ButtonGroup>
								</form>

								<ButtonGroup className="my-6">
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
								/>

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
										Tagasi teemade juurde
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
