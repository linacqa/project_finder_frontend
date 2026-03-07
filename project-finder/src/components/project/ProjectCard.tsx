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
	teamSizeMin: number;
	teamSizeMax: number;
	deadline: string;
	createdAt: string;
}

export default function ProjectCard({
	id,
	titleInEstonian,
	titleInEnglish,
	author,
	tags,
	status,
	supervisorMissing,
	teamSizeMin,
	teamSizeMax,
	deadline,
	createdAt,
}: ProjectCardProps) {
	return (
		<TTNewCard className="mb-4 w-auto">
			<TTNewCardContent className="d-flex flex-column h-100">
				<div className="flex-grow-1">
					<Link href={`/project/${id}`} passHref>
						<Heading
							as="h3"
							visual="h5"
							className="mb-2 font-bold cursor-pointer"
						>
							{titleInEstonian}
						</Heading>
					</Link>

					<div className="d-flex gap-2 flex-wrap">
						{status === "Closed" ? (
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

					<div className="d-flex gap-2 flex-wrap">
						{/* <StatusTag
							className="px-3 lead"
							type={STATUS_TYPE.LIGHT}
						>
							{authorRole}
						</StatusTag> */}
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

				{/* <div className="d-flex justify-content-between align-items-end">
					<p className="text-sm text-gray-500">{deadline}</p>
					{isAdmin && (
						<Link href={`/admin/thesis/${id}`}>
							<TTNewButton
								icon="settings"
								size="sm"
								variant="outline"
							>
								Muuda andmeid
							</TTNewButton>
						</Link>
					)}
				</div> */}
			</TTNewCardContent>
		</TTNewCard>
	);
}
