"use client";
import MyProjectCard from "@/components/myProjects/MyProjectCard";
import { AccountContext } from "@/context/AccountContext";
import { ApplicationService } from "@/services/ApplicationService";
import { ProjectService } from "@/services/ProjectService";
import { IApplication } from "@/types/domain/IApplication";
import { IProject } from "@/types/domain/IProject";
import { useRouter } from "next/dist/client/components/navigation";
import { useContext, useEffect, useState } from "react";
import {
	ALERT_POSITION_TYPES,
	ALERT_SIZE,
	ALERT_STATUS_TYPE,
	TTNewAlert,
	TTNewContainer,
} from "taltech-styleguide";

export default function MyProjectsPage() {
	const [projects, setProjects] = useState<IProject[]>([]);
	const [applications, setApplications] = useState<IApplication[]>([]);

	const { accountInfo } = useContext(AccountContext);
	const router = useRouter();

	const [message, setMessage] = useState<{
		type: string;
		text: string;
	} | null>(null);

	const projectService = new ProjectService();
	const applicationService = new ApplicationService();

	useEffect(() => {
		// Wait for AppState hydration before deciding auth redirect.
		if (accountInfo === undefined) {
			return;
		}

		if (!accountInfo.jwt) {
			router.push("/login");
			return;
		}
	}, [accountInfo]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [projectsData, applicationsData] = await Promise.all([
					projectService.getMyAllAsync(),
					applicationService.getCurrentUsersAllAsync(),
				]);
				if (applicationsData.data) {
					setApplications(applicationsData.data);
				} else {
					setMessage({
						type: "error",
						text: "Kandideerimiste laadimine ebaõnnestus.",
					});
				}
				if (projectsData.data) {
					setProjects(projectsData.data);
				} else {
					setMessage({
						type: "error",
						text: "Projektide laadimine ebaõnnestus.",
					});
				}
			} catch (error) {
				setMessage({
					type: "error",
					text: "Andmete laadimine ebaõnnestus.",
				});
			}
		};

		fetchData();
	}, []);

	const deleteApplication = (applicationId: string) => {
		setMessage({ type: "loading", text: "Kustutan kandideerimist..." });
		try {
			applicationService.deleteByIdAsync(applicationId).then((res) => {
				if (res && res.statusCode && res.statusCode <= 300) {
					setApplications((prev) =>
						prev.filter((app) => app.id !== applicationId),
					);
					setMessage({
						type: "success",
						text: "Kandideerimine kustutatud.",
					});
					return;
				}

				setMessage({
					type: "error",
					text: `${res.statusCode ?? "Error"} - ${res.errors}`,
				});
			});
		} catch (err) {
			setMessage({
				type: "error",
				text: "Kandideerimise kustutamine ebaõnnestus.",
			});
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
			<div className="d-flex flex-column gap-2">
				<h1>Minu projektid</h1>
				<p>
					Siin näete kõiki projekte, millega olete seotud, ja
					kandideerimisi, kui olete üliõpilane.
				</p>
				{projects.map((project) => (
					<MyProjectCard
						key={project.id}
						application={null}
						project={project}
						type="project"
						onDeleteApplication={() => {}}
					/>
				))}
				{applications
					.filter(
						(app) => !projects.find((p) => p.id === app.projectId),
					)
					.map((application) => (
						<MyProjectCard
							key={application.id}
							application={application}
							project={null}
							type="application"
							onDeleteApplication={deleteApplication}
						/>
					))}
			</div>
		</TTNewContainer>
	);
}
