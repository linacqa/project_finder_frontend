"use client";
import ApplicationCard from "@/components/applications/ApplicationCard";
import { ApplicationService } from "@/services/ApplicationService";
import { IApplication } from "@/types/domain/IApplication";
import { useEffect, useState } from "react";
import { TTNewContainer } from "taltech-styleguide";

export default function ApplicationsPage() {
	const [applications, setApplications] = useState<IApplication[]>([]);
	const applicationService = new ApplicationService();

	useEffect(() => {
			applicationService.getAllAsync().then((res) => {
				setApplications(res.data as IApplication[]);
			});
		}, []);

	const handleAccept = async (id: string) => {
		const res = await applicationService.acceptByIdAsync(id);
		console.log(res);

		if (res && res.statusCode && res.statusCode <= 300) {
			// TODO
			console.log("Application accepted successfully", res.data);
		}
	};

	const handleDecline = async (id: string) => {
		const res = await applicationService.declineByIdAsync(id);

		if (res && res.statusCode && res.statusCode <= 300) {
			// TODO
			console.log("Application declined successfully", res.data);
		}
	};

	return (
		<TTNewContainer>
			<h1>Applications</h1>
			<div className="application-list-container">
				{applications.map((application) => (
					<ApplicationCard key={application.id} application={application} handleAccept={handleAccept} handleDecline={handleDecline} />
				))}
			</div>
		</TTNewContainer>
	);
}
