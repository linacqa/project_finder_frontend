import { IProject } from "@/types/domain/IProject";
import { Heading, Separator, Tag, TagVariants, TTNewContainer } from "taltech-styleguide";

interface ProjectHeaderSectionProps {
	project: IProject;
}

export default function ProjectHeaderSection({ project }: ProjectHeaderSectionProps) {
	const author = project.users?.find(
		(userProject) => userProject.userProjectRole.name === "Author",
	)?.user;

	return (
		<TTNewContainer className="py-3">
			<Heading as="h1" visual="h1" className="mb-2">
				{project.titleInEstonian}
			</Heading>
			<Heading as="h2" visual="h3" className="mb-2">
				{project.titleInEnglish}
			</Heading>
			<Heading as="h2" visual="h6" className="mb-2">
				Autor: {author?.firstName} {author?.lastName}
			</Heading>
			{project.client && project.client !== "" && (
				<Heading as="h2" visual="h6" className="mb-3">
					Klient: {project.client}
				</Heading>
			)}
			<div className="d-flex gap-2 flex-wrap">
				{project.tags?.map((tag, index) => (
					<Tag
						key={index}
						text={tag.name}
						variant={TagVariants.PRIMARY}
						as="div"
					/>
				))}
			</div>
			<Separator />
		</TTNewContainer>
	);
}
