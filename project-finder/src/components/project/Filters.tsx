import { useState } from "react";
import { TTNewButton, TTNewSelect, Typeahead } from "taltech-styleguide";

type SelectOption = {
	value: string;
	label: string;
};

export default function Filters({
	isOpen,
	onClose,
	onFilterChange,
	statusOptions,
	tagOptions,
	projectTypeOptions,
}: {
	isOpen: boolean;
	onClose: () => void;
	onFilterChange: (filters: any) => void;
	statusOptions: { id: string; name: string }[];
	tagOptions: { id: string; name: string }[];
	projectTypeOptions: { id: string; name: string }[];
}) {
	const [minStudents, setMinStudents] = useState<number>(1);
	const [maxStudents, setMaxStudents] = useState<number>(10);
	const [statusIds, setStatusIds] = useState<string[]>([]);
	const [tagIds, setTagIds] = useState<string[]>([]);
	const [projectTypeIds, setProjectTypeIds] = useState<string[]>([]);

	const handleMinStudentsChange = (delta: number) => {
		const newMin = minStudents + delta;
		if (newMin >= 1 && newMin <= maxStudents && newMin <= 10) {
			setMinStudents(newMin);
		}
	};

	const handleMaxStudentsChange = (delta: number) => {
		const newMax = maxStudents + delta;
		if (newMax >= minStudents && newMax <= 10) {
			setMaxStudents(newMax);
		}
	};

	const clearFilters = () => {
		setMinStudents(1);
		setMaxStudents(10);
		setStatusIds([]);
		setTagIds([]);
		setProjectTypeIds([]);
		onFilterChange({
			minStudents: 1,
			maxStudents: 10,
			statusIds: [],
			tagIds: [],
			projectTypeIds: [],
		});
		onClose();
	};

	return (
		<div className={`filter-container ${isOpen ? "open" : ""}`}>
			<div className="filters-content">
				<h2>Filtrid</h2>

				<h5>Meeskonna suurus</h5>
				<div className="d-flex flex-row mb-4 align-items-center justify-content-between">
					<div>Miinimum</div>
					<div className="d-flex flex-align-items-center">
						<TTNewButton
							size="xs"
							variant="light"
							onClick={() => handleMinStudentsChange(-1)}
						>
							-
						</TTNewButton>

						<span
							className="text-dark-gray text-center"
							style={{ width: "3ch" }}
						>
							{minStudents}
						</span>

						<TTNewButton
							size="xs"
							variant="light"
							onClick={() => handleMinStudentsChange(1)}
						>
							+
						</TTNewButton>
					</div>
				</div>
				<div className="d-flex flex-row mb-4 align-items-center justify-content-between">
					<div>Maksimum</div>
					<div className="d-flex flex-align-items-center">
						<TTNewButton
							size="xs"
							variant="light"
							onClick={() => handleMaxStudentsChange(-1)}
						>
							-
						</TTNewButton>
						<span
							className="text-dark-gray text-center"
							style={{ width: "3ch" }}
						>
							{maxStudents}
						</span>
						<TTNewButton
							size="xs"
							variant="light"
							onClick={() => handleMaxStudentsChange(1)}
						>
							+
						</TTNewButton>
					</div>
				</div>

				<h5>Staatus</h5>

				<Typeahead
					className="mb-3"
					options={statusOptions.map((s) => ({
						value: s.id,
						label: s.name,
					}))}
					multiple
					onChange={(selected) =>
						setStatusIds(selected.filter((s): s is SelectOption => typeof s !== "string" && "value" in s).map((s) => s.value))
					}
				/>

				<h5>Sildid</h5>

				<Typeahead
					className="mb-3"
					options={tagOptions.map((t) => ({
						value: t.id,
						label: t.name,
					}))}
					multiple
					onChange={(selected) =>
						setTagIds(selected.filter((t): t is SelectOption => typeof t !== "string" && "value" in t).map((t) => t.value))
					}
				/>

				<h5>Projekti tüüp</h5>

				<TTNewSelect
					className="mb-3"
					options={projectTypeOptions.map((pt) => ({
						value: pt.id,
						label: pt.name,
					}))}
					multiple
					onChange={(selected: SelectOption[]) =>
						setProjectTypeIds(selected.filter((pt): pt is SelectOption => typeof pt !== "string" && "value" in pt).map((pt) => pt.value))
					}
					placeholder="Vali"
				/>

				<TTNewButton
					className="mb-2"
					variant="primary"
					onClick={() =>
						onFilterChange({
							minStudents,
							maxStudents,
							statusIds,
							tagIds,
							projectTypeIds,
						})
					}
				>
					Rakenda filtrid
				</TTNewButton>
				<TTNewButton
					className="mb-2"
					variant="light"
					onClick={clearFilters}
				>
					Tühjenda filtrid
				</TTNewButton>
				<TTNewButton
					variant="secondary"
					onClick={onClose}
					className=""
				>
					Sulge
				</TTNewButton>
			</div>
		</div>
	);
}
