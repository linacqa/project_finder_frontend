import { ITag } from "@/types/domain/ITag";
import Link from "next/link";
import {
	Heading,
	STATUS_TYPE,
	StatusTag,
	TTNewButton,
	TTNewCard,
	TTNewCardContent,
} from "taltech-styleguide";

interface ProjectCardProps {
	id: string;
	titleInEstonian: string;
	titleInEnglish: string;
	author: string;
	tags: ITag[];
	status: string;
	supervisorMissing: boolean;
	supervisor: string | null;
	teamSizeMin: number;
	teamSizeMax: number;
	deadline: string;
	createdAt: string;
	type: string;
}

export default function ProjectCard({
	id,
	titleInEstonian,
	titleInEnglish,
	author,
	tags,
	status,
	supervisorMissing,
	supervisor,
	teamSizeMin,
	teamSizeMax,
	deadline,
	createdAt,
	type,
}: ProjectCardProps) {
	return (
		<TTNewCard className="mb-4 project-card">
			<TTNewCardContent className="d-flex flex-column h-100 project-card-content">
				<div className="project-card-main">
					<Link href={`/project/${id}`} passHref className="d-block min-w-0">
						<Heading
							as="h3"
							visual="h5"
							className="mb-2 font-bold cursor-pointer project-card-title"
						>
							{titleInEstonian}
						</Heading>
					</Link>

					<div className="d-flex gap-2 flex-wrap">
						{status === "Suletud" ? (
							<StatusTag
								className="px-3 lead"
								type={STATUS_TYPE.DANGER}
							>
								{status}
							</StatusTag>
						) : (
							<>
								<StatusTag
									className="px-3 lead"
									type={STATUS_TYPE.SUCCESS}
								>
									{status}
								</StatusTag>
								{supervisorMissing && (
									<StatusTag
										className="px-3 lead"
										type={STATUS_TYPE.WARNING}
									>
										Juhendaja puudub
									</StatusTag>
								)}
							</>
						)}
					</div>

					<p className="pt-2 text-sm fw-semibold">Autor: {author}</p>
					<p className="text-sm fw-semibold">Juhendaja: {supervisor || "Puudub"}</p>
					<p className="text-sm fw-semibold">Tüüp: {type}</p>

					<div className="d-flex gap-2 flex-wrap">
						{tags.map((tag, index) => (
							<StatusTag
								className="px-3 lead"
								key={index}
								type={STATUS_TYPE.INFO}
							>
								{tag.name}
							</StatusTag>
						))}
					</div>
				</div>

				<div className="project-card-meta">
					<p className="text-sm text-accent-second mt-2">
							Lubatud tiimi suurus:{" "}
							{teamSizeMin === teamSizeMax
								? teamSizeMin
								: `${teamSizeMin} - ${teamSizeMax}`}
					</p>
					{deadline && deadline.trim() !== "" && (
						<p className="text-sm mt-2">
							Tähtaeg:{" "}
							{new Date(deadline).toLocaleDateString("et-EE", {
								year: "numeric",
								month: "2-digit",
								day: "2-digit",
							})}
						</p>
					)}
					<p className="text-sm mt-2">
						{new Date(createdAt).toLocaleDateString("et-EE", {
							year: "numeric",
							month: "2-digit",
							day: "2-digit",
						})}
					</p>
				</div>
			</TTNewCardContent>
		</TTNewCard>
	);
}
