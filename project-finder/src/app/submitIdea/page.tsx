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

export default function SubmitIdea() {
	const [tagOptions, setTagOptions] = useState<{ label: string, id: string }[]>([]);
	const [loadingTags, setLoadingTags] = useState(false);

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
					<form onSubmit={() => {}}>
						<FormGroup controlId="topic">
							<FormLabel>Pealkiri</FormLabel>
							<Input
								name="topic"
								placeholder="Sisesta pealkiri"
								// value={formData.topic}
								// onChange={handleChange}
							/>
						</FormGroup>

						<FormGroup>
							<FormLabel>Projekti tüüp</FormLabel>
							<div className="d-flex gap-3">
								<CustomInput
									id="project-type-final-thesis"
									label="Lõputöö"
									type="radio"
									inline
								/>
								<CustomInput
									id="project-type-internship"
									label="Praktika"
									type="radio"
									inline
								/>
								<CustomInput
									id="project-type-final-thesis-internship"
									label="Lõputöö + Praktika"
									type="radio"
									inline
								/>
							</div>
						</FormGroup>

						<FormGroup controlId="tags">
							<FormLabel>Projekti märksõnad</FormLabel>
							<Typeahead
								clearButton
								id="tags"
								multiple
								// allowNew
								newSelectionPrefix="Uus märksõna: "
								options={tagOptions.map((tag) => ({label: tag.label}))}
								placeholder="Vali"
								positionFixed
								// selected={formData.tags.map((tag) => ({
								// 	label: tag,
								// }))}
								// onChange={handleTagsChange}
							/>
						</FormGroup>

						<FormGroup controlId="description">
							<FormLabel>Kirjeldus</FormLabel>
							<Input
								as="textarea"
								name="description"
								placeholder="Sisesta kirjeldus"
								// value={formData.description}
								// onChange={handleChange}
							/>
						</FormGroup>

						<FormGroup controlId="objective">
							<FormLabel>Eesmärk</FormLabel>
							<Input
								as="textarea"
								name="objective"
								placeholder="Sisesta eesmärk"
								// value={formData.objective}
								// onChange={handleChange}
							/>
						</FormGroup>

						<FormGroup controlId="problem">
							<FormLabel>Probleem</FormLabel>
							<Input
								as="textarea"
								name="problem"
								placeholder="Sisesta probleem"
								// value={formData.problem}
								// onChange={handleChange}
							/>
						</FormGroup>

						<FormGroup controlId="background">
							<FormLabel>Taust</FormLabel>
							<Input
								as="textarea"
								name="background"
								placeholder="Sisesta taust"
								// value={formData.background}
								// onChange={handleChange}
							/>
						</FormGroup>

						<FormGroup controlId="teamSize">
							<FormLabel>Meeskonna minimaalne suurus</FormLabel>
							<Input
								name="teamSize"
								type="number"
								placeholder="Sisesta meeskonna minimaalne suurus"
								min={1}
								max={10}
								// value={formData.teamSize}
								// onChange={handleChange}
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
								// value={formData.teamSize}
								// onChange={handleChange}
							/>
						</FormGroup>

						<FormGroup controlId="comment">
							<FormLabel>Kommentaar</FormLabel>
							<Input
								as="textarea"
								name="comment"
								placeholder="Sisesta kommentaar"
								// value={formData.comment}
								// onChange={handleChange}
							/>
						</FormGroup>
						<FormGroup>
							<CustomInput
								id=":r19:"
								inline
								name="isWantsToSuperviseOrWrite"
								label="Soovin juhendada seda projekti"
								type="checkbox"
							/>
						</FormGroup>
						<FormGroup controlId="supervisors">
							<FormLabel>Projekti juhendaja/d</FormLabel>
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
								// options={supervisorsOptions}
								options={[]}
								placeholder="Vali juhendaja"
								positionFixed
								// selected={formData.supervisors.map(
								// 	(supervisor) => ({ label: supervisor }),
								// )}
								// onChange={(selected) => {
								// 	if (selected.length <= 2) {
								// 		handleSupervisorsChange(selected);
								// 	}
								// }}
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
					</form>
					<TTNewButton type="submit">Esita</TTNewButton>
				</TTNewCardContent>
			</TTNewCard>
		</TTNewContainer>
	);
}
