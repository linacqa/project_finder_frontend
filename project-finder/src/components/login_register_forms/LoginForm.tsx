"use client";

import { AccountContext, IAccountInfo } from "@/context/AccountContext";
import { AccountService } from "@/services/AccountService";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ButtonGroup, TTNewButton } from "taltech-styleguide";

export default function LoginForm() {
	const accountService = new AccountService();

	const { setAccountInfo } = useContext(AccountContext);

	const router = useRouter();

	const [errorMessage, setErrorMessage] = useState("");

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
		setErrorMessage("Loading...");

		try {
			var result = await accountService.loginAsync(
				data.email,
				data.password,
			);
			if (result.errors) {
				setErrorMessage(result.statusCode + " - " + result.errors[0]);
				return;
			}

			setErrorMessage("");

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
			});
			router.push("/");
		} catch (error) {
			setErrorMessage("Login failed - " + (error as Error).message);
		}
	};

	return (
		<>
			<div style={{ textAlign: "center", gridArea: "login" }}>
				<h2>Logi sisse</h2>

				{errorMessage}

				<form onSubmit={handleSubmit(onSubmit)}>
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
								Required!
							</span>
						)}
					</div>
					<div>
						<label className="field-label" htmlFor="Input_Password">
							Password
						</label>
						<input
							className="login-field"
							aria-required="true"
							placeholder="password"
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
								Required!
							</span>
						)}
					</div>

					<ButtonGroup
						className="mt-4 centered-button"
						onClick={handleSubmit(onSubmit)}
					>
						<TTNewButton variant="light">Logi sisse</TTNewButton>
					</ButtonGroup>
				</form>
			</div>
		</>
	);
}
