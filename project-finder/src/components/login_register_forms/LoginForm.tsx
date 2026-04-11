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
	TTNewAlert,
	TTNewButton,
} from "taltech-styleguide";

export default function LoginForm() {
	const accountService = new AccountService();

	const { setAccountInfo } = useContext(AccountContext);

	const router = useRouter();

	const [message, setMessage] = useState<{
		type: string;
		text: string;
	} | null>(null);

	type Inputs = {
		email: string;
		password: string;
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>({
		defaultValues: {
			email: "user@taltech.ee",
			password: "Foo.Bar.2",
		},
	});

	const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
		console.log(data);
		setMessage({ type: "loading", text: "Laadin..." });

		try {
			var result = await accountService.loginAsync(
				data.email,
				data.password,
			);
			console.log(result);
			if (result.errors) {
				setMessage({
					type: "error",
					text: result.statusCode + " - " + result.errors[0],
				});
				return;
			}

			setMessage({ type: "success", text: "Sisselogimine õnnestus!" });

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
			});
			router.push("/");
		} catch (error) {
			setMessage({
				type: "error",
				text: "Sisselogimine ebaõnnestus - " + (error as Error).message,
			});
		}
	};

	return (
		<>
			<div style={{ textAlign: "center", gridArea: "login" }}>
				<h2>Logi sisse</h2>

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
					{/* TODO: make fields less wide on desktop */}
					<div
						className="text-danger validation-summary-valid"
						role="alert"
						data-valmsg-summary="true"
					></div>
					<div>
						<label className="field-label" htmlFor="Input_Email">
							Email
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
						<label className="field-label" htmlFor="Input_Password">
							Parool
						</label>
						<input
							className="login-field"
							aria-required="true"
							placeholder="parool"
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

					<ButtonGroup
						className="mt-4 centered-button"
						onClick={handleSubmit(onSubmit)}
					>
						<TTNewButton variant="light">Logi sisse</TTNewButton>
					</ButtonGroup>
					{/* <ButtonGroup className="centered-button">
						<TTNewButton
							variant="secondary"
							onClick={() => {}}
						>
							Logi sisse UNI-IDga
						</TTNewButton>
					</ButtonGroup> */}
					<p>või</p>
					<ButtonGroup className="centered-button">
						<TTNewButton
							variant="secondary"
							onClick={() => router.push("/register")}
						>
							Loo konto
						</TTNewButton>
					</ButtonGroup>
				</form>
			</div>
		</>
	);
}
