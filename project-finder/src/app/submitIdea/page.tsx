"use client";
import { useEffect, useState } from "react";
import {
	CustomInput,
	Heading,
	Input,
	Stepper,
	TTNewButton,
	TTNewCard,
	TTNewCardContent,
	TTNewContainer,
	TTNewRow,
	Typeahead,
} from "taltech-styleguide";
import { FormGroup, FormLabel } from "react-bootstrap";
import { TagService } from "@/services/TagService";
import { UserService } from "@/services/UserService";

export default function SubmitIdea() {
	const [tagOptions, setTagOptions] = useState<{ label: string }[]>([]);
	const [loadingTags, setLoadingTags] = useState(false);
	const [supervisorOptions, setSupervisorOptions] = useState<{ label: string }[]>([]);
	const [loadingSupervisors, setLoadingSupervisors] = useState(false);

	const [formData, setFormData] = useState({
		titleInEstonian: "",
		titleInEnglish: "",
		type: "finalThesis",
		tags: [] as string[],
		description: "",
		objective: "",
		problem: "",
		background: "",
		teamSizeMin: 1,
		teamSizeMax: 1,
		comment: "",
		supervisors: [] as string[],
		wantsToSuperviseOrWrite: "no"
	});

	useEffect(() => {
		let mounted = true;
		const tagService = new TagService();
		setLoadingTags(true);
		tagService
			.getAllAsync()
			.then((res) => {
				if (!mounted) return;
				if (res && res.data) {
					setTagOptions(res.data.map((t) => ({ label: t.name})));
				}
			})
			.catch((err) => console.error(err))
			.finally(() => {
				if (mounted) setLoadingTags(false);
			});

		const userService = new UserService();
		setLoadingSupervisors(true);
		userService
			.getAllSupervisorsAsync()
			.then((res) => {
				if (!mounted) return;
				if (res && res.data) {
					setSupervisorOptions(res.data.map((s) => ({ label: s.firstName + " " + s.lastName + " (" + s.email + ")"})));
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

	return (
		<TTNewContainer>
			<TTNewCard className="mb-4 w-auto">
				<TTNewCardContent>
					<Heading as="h3" visual="h5" className="mb-4 font-bold">
						Submit New Project Idea
					</Heading>
					<form onSubmit={(e) => {
						e.preventDefault();
						console.log(formData);
						// TODO: send data to email
					}}>
						<FormGroup controlId="titleInEstonian">
							<FormLabel>Pealkiri eesti keeles</FormLabel>
							<Input
								name="titleInEstonian"
								placeholder="Sisesta eestikeelne pealkiri"
								value={formData.titleInEstonian}
								onChange={(e) => setFormData(prev => {
									return {
										...prev,
										titleInEstonian: e.target.value
									}
								})}
							/>
						</FormGroup>
						<FormGroup controlId="titleInEnglish">
							<FormLabel>Pealkiri inglise keeles</FormLabel>
							<Input
								name="titleInEnglish"
								placeholder="Sisesta ingliskeelne pealkiri"
								value={formData.titleInEnglish}
								onChange={(e) => setFormData(prev => {
									return {
										...prev,
										titleInEnglish: e.target.value
									}
								})}
							/>
						</FormGroup>

						<FormGroup>
							<FormLabel>Projekti tüüp</FormLabel>
							<div className="d-flex gap-3">
								<CustomInput
									id="project-type-final-thesis"
									name="type"
									label="Lõputöö"
									type="radio"
									inline
									checked={formData.type == "finalThesis"}
									onChange={(e) => setFormData(prev => {
										return {
											...prev,
											type: "finalThesis"
										}
									})}
								/>
								<CustomInput
									id="project-type-internship"
									name="type"
									label="Praktika"
									type="radio"
									inline
									// checked={formData.type == "internship"}
									onChange={(e) => setFormData(prev => {
										return {
											...prev,
											type: "internship"
										}
									})}
								/>
								<CustomInput
									id="project-type-final-thesis-internship"
									name="type"
									label="Lõputöö + Praktika"
									type="radio"
									inline
									// checked={formData.type == "finalThesisInternship"}
									onChange={(e) => setFormData(prev => {
										return {
											...prev,
											type: "finalThesisInternship"
										}
									})}
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
								onChange={(selected) => setFormData(prev => {
									return {
										...prev,
										tags: selected.map(option => typeof option === 'string' ? option : option.label)
									}
								})}
							/>
						</FormGroup>

						<FormGroup controlId="description">
							<FormLabel>Kirjeldus</FormLabel>
							<Input
								as="textarea"
								name="description"
								placeholder="Sisesta kirjeldus"
								value={formData.description}
								onChange={(e) => setFormData(prev => {
									return {
										...prev,
										description: e.target.value
									}
								})}
							/>
						</FormGroup>

						<FormGroup controlId="objective">
							<FormLabel>Eesmärk</FormLabel>
							<Input
								as="textarea"
								name="objective"
								placeholder="Sisesta eesmärk"
								value={formData.objective}
								onChange={(e) => setFormData(prev => {
									return {
										...prev,
										objective: e.target.value
									}
								})}
							/>
						</FormGroup>

						<FormGroup controlId="problem">
							<FormLabel>Probleem</FormLabel>
							<Input
								as="textarea"
								name="problem"
								placeholder="Sisesta probleem"
								value={formData.problem}
								onChange={(e) => setFormData(prev => {
									return {
										...prev,
										problem: e.target.value
									}
								})}
							/>
						</FormGroup>

						<FormGroup controlId="background">
							<FormLabel>Taust</FormLabel>
							<Input
								as="textarea"
								name="background"
								placeholder="Sisesta taust"
								value={formData.background}
								onChange={(e) => setFormData(prev => {
									return {
										...prev,
										background: e.target.value
									}
								})}
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
								onChange={(e) => setFormData(prev => {
									return {
										...prev,
										teamSizeMin: parseInt(e.target.value, 10)
									}
								})}
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
								onChange={(e) => setFormData(prev => {
									return {
										...prev,
										teamSizeMax: parseInt(e.target.value, 10)
									}
								})}
							/>
						</FormGroup>

						<FormGroup controlId="comment">
							<FormLabel>Kommentaar</FormLabel>
							<Input
								as="textarea"
								name="comment"
								placeholder="Sisesta kommentaar"
								value={formData.comment}
								onChange={(e) => setFormData(prev => {
									return {
										...prev,
										comment: e.target.value
									}
								})}
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
								onChange={(e) => setFormData(prev => {
										return {
											...prev,
											wantsToSuperviseOrWrite: "supervise"
										}
									})}
							/>
							<CustomInput
								id=":r19:"
								inline
								name="wantsToSuperviseOrWrite"
								label="Soovin ise tegeleda selle projektiga"
								type="radio"
								onChange={(e) => setFormData(prev => {
										return {
											...prev,
											wantsToSuperviseOrWrite: "write"
										}
									})}
							/>
							<CustomInput
								id=":r19:"
								inline
								name="wantsToSuperviseOrWrite"
								label="Ei soovi juhendada ega ise tegeleda selle projektiga"
								type="radio"
								checked={formData.wantsToSuperviseOrWrite == "no"}
								onChange={(e) => setFormData(prev => {
										return {
											...prev,
											wantsToSuperviseOrWrite: "no"
										}
									})}
							/>
							</div>
						</FormGroup>

						<FormGroup controlId="supervisors">
							<FormLabel>Soovituslik(-ud) projekti juhendaja(-d)</FormLabel>
							<div
								style={{
									fontSize: "12px",
									color: "#6c757d",
									marginBottom: "4px",
								}}
							>
								Esimene on põhiuhendaja, teine on kaasjuhendaja
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
								selected={formData.supervisors.map((supervisor) => ({
									label: supervisor,
								}))}
								onChange={(selected) => setFormData(prev => {
									return {
										...prev,
										supervisors: selected.map(option => typeof option === 'string' ? option : option.label)
									}
								})}
								// isInvalid={
								// 	formData.isWantsToSuperviseOrWrite &&
								// 	(formData.userType === "Õppejõud" ||
								// 		formData.userType === "Ettevõte") &&
								// 	formData.supervisors.length === 0
								// }
							/>
							{/* {formData.isWantsToSuperviseOrWrite &&
								(formData.userType === "Õppejõud" ||
									formData.userType === "Ettevõte") &&
								formData.supervisors.length === 0 && (
									<div
										style={{
											color: "red",
											fontSize: "12px",
											marginTop: "4px",
										}}
									>
										Juhendaja on kohustuslik
									</div>
								)} */}
						</FormGroup>
						<TTNewButton type="submit">Esita</TTNewButton>
					</form>
				</TTNewCardContent>
			</TTNewCard>
		</TTNewContainer>
	);
}
