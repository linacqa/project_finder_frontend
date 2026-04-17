"use client";
import ApplicationCard from "@/components/applications/ApplicationCard";
import { ApplicationService } from "@/services/ApplicationService";
import { IApplication } from "@/types/domain/IApplication";
import { useEffect, useState } from "react";
import {
	ALERT_POSITION_TYPES,
	ALERT_SIZE,
	ALERT_STATUS_TYPE,
	TTNewAlert,
	TTNewContainer,
} from "taltech-styleguide";

export default function ApplicationsPage() {
	const [applications, setApplications] = useState<IApplication[]>([]);
	const applicationService = new ApplicationService();

	const [message, setMessage] = useState<{
		type: string;
		text: string;
	} | null>(null);

	useEffect(() => {
		setMessage({ type: "loading", text: "Laadin taotlusi..." });
		applicationService.getAllAsync().then((res) => {
			if (res.data) {
				setApplications(res.data);
				setMessage(null);
				return;
			}

			setMessage({
				type: "error",
				text: `${res.statusCode ?? "Error"} - ${res.errors}`,
			});
		});
	}, []);

	const handleAccept = async (id: string) => {
		setMessage({ type: "loading", text: "Kinnitan taotlust..." });
		const res = await applicationService.acceptByIdAsync(id);
		console.log(res);

		if (res && res.statusCode && res.statusCode <= 300) {
			// TODO
			console.log("Application accepted successfully", res.data);
			setMessage({ type: "success", text: "Kandideerimine vastu võetud!" });
			return;
		}

		setMessage({
			type: "error",
			text: `${res.statusCode ?? "Error"} - ${res.errors}`,
		});
	};

	const handleDecline = async (id: string) => {
		setMessage({ type: "loading", text: "Keeldun taotlusest..." });
		const res = await applicationService.declineByIdAsync(id);

		if (res && res.statusCode && res.statusCode <= 300) {
			// TODO
			console.log("Application declined successfully", res.data);
			setMessage({ type: "success", text: "Kandideerimine tagasi lükatud!" });
			return;
		}

		setMessage({
			type: "error",
			text: `${res.statusCode ?? "Error"} - ${res.errors}`,
		});
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
			<h1>Kandideerimised</h1>
			<div className="application-list-container">
				{applications.map((application) => (
					<ApplicationCard
						key={application.id}
						application={application}
						handleAccept={handleAccept}
						handleDecline={handleDecline}
					/>
				))}
			</div>
		</TTNewContainer>
	);
}
