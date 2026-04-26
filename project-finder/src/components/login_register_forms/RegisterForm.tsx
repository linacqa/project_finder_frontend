"use client";

import { AccountContext, IAccountInfo } from "@/context/AccountContext";
import { AccountService } from "@/services/AccountService";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
	ALERT_POSITION_TYPES,
	ALERT_SIZE,
	ALERT_STATUS_TYPE,
	ButtonGroup,
	CustomInput,
	TTNewAlert,
	TTNewButton,
} from "taltech-styleguide";

export default function RegisterForm() {
	const accountService = new AccountService();

	const { setAccountInfo } = useContext(AccountContext);

	const router = useRouter();

	const [message, setMessage] = useState<{
		type: string;
		text: string;
	} | null>(null);

	const programOptions = [
		"IT süsteemide arendus (IADB)",
		"IT süsteemide administreerimine (IAAB)",
		"Cyber Security Engineering (IVSB)",
		"Infosüsteemide analüüs ja kavandamine (IAAM)",
	];

	type Inputs = {
		email: string;
		phoneNumber?: string;
		firstName: string;
		lastName: string;
		password: string;
		confirmPassword: string;
		role: "teacher" | "student" | "user";
		uniId?: string;
		matriculationNumber?: string;
		program?: string;
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<Inputs>({
		defaultValues: {
			email: "",
			firstName: "",
			lastName: "",
			password: "",
			confirmPassword: "",
			role: "user",
		},
	});

	const roleValue = watch("role");

	const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
		setMessage({ type: "loading", text: "Laadin..." });

		if (
			data.email.trim() === "" ||
			data.firstName.trim() === "" ||
			data.lastName.trim() === "" ||
			data.password.trim() === "" ||
			data.confirmPassword.trim() === ""
		) {
			setMessage({
				type: "error",
				text: "Palun täida kõik kohustuslikud väljad!",
			});
			return;
		}
		if (data.role === "student" || data.role === "teacher") {
			if (data.uniId?.trim() === "") {
				setMessage({
					type: "error",
					text: "Palun täida kõik kohustuslikud väljad!",
				});
				return;
			}
		}
		if (data.role === "student") {
			if (
				data.matriculationNumber?.trim() === "" ||
				data.program?.trim() === ""
			) {
				setMessage({
					type: "error",
					text: "Palun täida kõik kohustuslikud väljad!",
				});
				return;
			}
		}
		if (data.password !== data.confirmPassword) {
			setMessage({ type: "error", text: "Paroolid ei kattu" });
			return;
		}

		try {
			var result = await accountService.registerAsync(
				data.firstName,
				data.lastName,
				data.email.trim(),
				data.password,
				data.role,
				data.uniId,
				data.matriculationNumber,
				data.program,
				data.phoneNumber,
			);
			if (result.errors) {
				setMessage({
					type: "error",
					text: result.statusCode + " - " + result.errors[0],
				});
				return;
			}

			setMessage({ type: "success", text: "Registreerimine õnnestus!" });

			var accountInfo: IAccountInfo = {
				jwt: result.data!.jwt,
				refreshToken: result.data!.refreshToken,
			};
			setAccountInfo!(accountInfo);
			var userInfo = await accountService.getCurrentUserInfoAsync();

			setAccountInfo!({
				...accountInfo,
				firstName: userInfo.data!.firstName,
				lastName: userInfo.data!.lastName,
				role: userInfo.data!.role,
				userId: userInfo.data!.id,
				email: userInfo.data!.email,
			});
			router.push("/");
		} catch (error) {
			setMessage({
				type: "error",
				text:
					"Registreerimine ebaõnnestus - " + (error as Error).message,
			});
		}
	};

	return (
		<div style={{ textAlign: "center", gridArea: "register" }}>
			<h2 className="mb-4">Registreeri</h2>

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

			<form onSubmit={handleSubmit(onSubmit)}>
				<div
					className="text-danger validation-summary-valid"
					role="alert"
					data-valmsg-summary="true"
				></div>
				<div>
					<label className="field-label" htmlFor="Input_FirstName">
						Eesnimi*
					</label>
					<input
						className="login-field"
						aria-required="true"
						placeholder="Eesnimi"
						autoComplete="first-name"
						type="text"
						id="Input_FirstName"
						{...register("firstName", { required: true })}
					/>
					{errors.firstName && (
						<span
							className="text-danger field-validation-valid"
							data-valmsg-for="Input.FirstName"
							data-valmsg-replace="true"
						>
							Kohustuslik!
						</span>
					)}
				</div>
				<div>
					<label className="field-label" htmlFor="Input_LastName">
						Perekonnanimi*
					</label>
					<input
						className="login-field"
						aria-required="true"
						placeholder="Perekonnanimi"
						autoComplete="Surname"
						type="text"
						id="Input_LastName"
						{...register("lastName", { required: true })}
					/>
					{errors.lastName && (
						<span
							className="text-danger field-validation-valid"
							data-valmsg-for="Input.LastName"
							data-valmsg-replace="true"
						>
							Kohustuslik!
						</span>
					)}
				</div>
				<div>
					<label className="field-label" htmlFor="Input_Email">
						Email*
					</label>
					<input
						className="login-field"
						aria-required="true"
						placeholder="name@example.com"
						autoComplete="username"
						type="email"
						id="Input_Email"
						{...register("email", { required: true })}
					/>
					{errors.email && (
						<span
							className="text-danger field-validation-valid"
							data-valmsg-for="Input.Email"
							data-valmsg-replace="true"
						>
							Kohustuslik!
						</span>
					)}
				</div>
				<div>
					<label className="field-label" htmlFor="Input_PhoneNumber">
						Telefoninumber
					</label>
					<input
						className="login-field"
						aria-required="true"
						placeholder="+37258123456"
						type="tel"
						id="Input_PhoneNumber"
						{...register("phoneNumber", { required: false })}
					/>
					{errors.phoneNumber && (
						<span
							className="text-danger field-validation-valid"
							data-valmsg-for="Input.PhoneNumber"
							data-valmsg-replace="true"
						>
							Kohustuslik!
						</span>
					)}
				</div>
				<div>
					<label className="field-label" htmlFor="Input_Password">
						Parool*
					</label>
					<input
						className="login-field"
						aria-required="true"
						placeholder="Parool"
						type="password"
						id="Input_Password"
						autoComplete="current-password"
						{...register("password", { required: true })}
					/>
					{errors.password && (
						<span
							className="text-danger field-validation-valid"
							data-valmsg-for="Input.Password"
							data-valmsg-replace="true"
						>
							Kohustuslik!
						</span>
					)}
				</div>
				<div>
					<label
						className="field-label"
						htmlFor="Input_ConfirmPassword"
					>
						Kinnita parool*
					</label>
					<input
						className="login-field"
						aria-required="true"
						placeholder="Parool"
						type="password"
						id="Input_ConfirmPassword"
						autoComplete="new-password"
						{...register("confirmPassword", { required: true })}
					/>
					{errors.confirmPassword && (
						<span
							className="text-danger field-validation-valid"
							data-valmsg-for="Input.ConfirmPassword"
							data-valmsg-replace="true"
						>
							Kohustuslik!
						</span>
					)}
				</div>

				<div className="my-4">
					<h5 className="mt-5">
						Oled sa üliõpilane, õppejõud või muu?
					</h5>
					<div className="d-flex justify-content-center gap-4">
						<label className="small text-bold">
							<CustomInput
								type="radio"
								value="student"
								{...register("role", { required: true })}
							/>
							Üliõpilane
						</label>
						<label className="small text-bold">
							<CustomInput
								type="radio"
								value="teacher"
								{...register("role", { required: true })}
							/>{" "}
							Õppejõud
						</label>
						<label className="small text-bold">
							<CustomInput
								type="radio"
								value="user"
								{...register("role", { required: true })}
							/>{" "}
							Muu
						</label>
					</div>
				</div>

				{roleValue === "student" || roleValue === "teacher" ? (
					<div>
						<label htmlFor="uni-id" className="field-label">
							Uni-ID*
						</label>
						<input
							className="login-field"
							aria-required="true"
							type="text"
							id="Input_UniId"
							placeholder="Uni-ID (nt. mamets)"
							{...register("uniId", { required: true })}
						/>
						{errors.uniId && (
							<span
								className="text-danger field-validation-valid"
								data-valmsg-for="Input.UniId"
								data-valmsg-replace="true"
							>
								Kohustuslik!
							</span>
						)}
					</div>
				) : null}

				{roleValue === "student" && (
					<>
						<div>
							<label
								htmlFor="matriklinumber"
								className="field-label"
							>
								Matriklinumber*
							</label>
							<input
								className="login-field"
								aria-required="true"
								type="text"
								id="Input_MatriculationNumber"
								placeholder="Matriklinumber (nt. 241234IADB)"
								{...register("matriculationNumber", {
									required: true,
								})}
							/>
							{errors.matriculationNumber && (
								<span
									className="text-danger field-validation-valid"
									data-valmsg-for="Input.MatriculationNumber"
									data-valmsg-replace="true"
								>
									Kohustuslik!
								</span>
							)}
						</div>
						<div>
							<label htmlFor="oppekava" className="field-label">
								Õppekava*
							</label>
							<select
								className="login-field"
								id="Input_Program"
								{...register("program", { required: true })}
							>
								<option value="">Vali õppekava</option>
								{programOptions.map((option) => (
									<option key={option} value={option}>
										{option}
									</option>
								))}
							</select>
							{errors.program && (
								<span
									className="text-danger field-validation-valid"
									data-valmsg-for="Input.Program"
									data-valmsg-replace="true"
								>
									Kohustuslik!
								</span>
							)}
						</div>
					</>
				)}

				<ButtonGroup
					className="mt-4 centered-button"
					onClick={handleSubmit(onSubmit)}
				>
					<TTNewButton variant="secondary" type="submit">
						Registreeri
					</TTNewButton>
				</ButtonGroup>
			</form>
		</div>
	);
}
