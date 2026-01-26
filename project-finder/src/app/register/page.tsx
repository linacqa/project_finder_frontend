"use client";

import { AccountContext } from "@/context/AccountContext";
import { AccountService } from "@/services/AccountService";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function Register() {
	const accountService = new AccountService();

	const { setAccountInfo } = useContext(AccountContext);

	const router = useRouter();

	const [errorMessage, setErrorMessage] = useState("");

	type Inputs = {
		email: string;
		firstName: string;
		lastName: string;
		password: string;
		confirmPassword: string;
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>({
		defaultValues: {
			email: "user33@taltech.ee",
			firstName: "User",
			lastName: "Test",
			password: "Foo.Bar.33",
			confirmPassword: "Foo.Bar.33",
		},
	});

	const onSubmit: SubmitHandler<Inputs> = async (data: Inputs) => {
		console.log(data);
		setErrorMessage("Loading...");

		if (data.password !== data.confirmPassword) {
			setErrorMessage("Passwords do not match");
			return;
		}

		try {
			var result = await accountService.registerAsync(
				data.firstName,
				data.lastName,
				data.email,
				data.password,
			);
			if (result.errors) {
				setErrorMessage(result.statusCode + " - " + result.errors[0]);
				return;
			}

			setErrorMessage("");

			setAccountInfo!({
				jwt: result.data!.jwt,
				refreshToken: result.data!.refreshToken,
				firstName: data.firstName,
				lastName: data.lastName,
			});
			router.push("/");
		} catch (error) {
			setErrorMessage(
				"Registration failed - " + (error as Error).message,
			);
		}
	};

	return (
		<div>
			<h2 className="mb-4">Register</h2>

			{errorMessage}

			<form onSubmit={handleSubmit(onSubmit)}>
				<div
					className="text-danger validation-summary-valid"
					role="alert"
					data-valmsg-summary="true"
				></div>
				<div className="form-floating mb-3">
					<input
						className="form-control"
						aria-required="true"
						placeholder="Name"
						autoComplete="first-name"
						type="text"
						id="Input_FirstName"
						{...register("firstName", { required: true })}
					/>
					<label className="form-label" htmlFor="Input_FirstName">
						First Name
					</label>
					{errors.firstName && (
						<span
							className="text-danger field-validation-valid"
							data-valmsg-for="Input.FirstName"
							data-valmsg-replace="true"
						>
							Required!
						</span>
					)}
				</div>
				<div className="form-floating mb-3">
					<input
						className="form-control"
						aria-required="true"
						placeholder="Surname"
						autoComplete="Surname"
						type="text"
						id="Input_LastName"
						{...register("lastName", { required: true })}
					/>
					<label className="form-label" htmlFor="Input_LastName">
						Last Name
					</label>
					{errors.lastName && (
						<span
							className="text-danger field-validation-valid"
							data-valmsg-for="Input.LastName"
							data-valmsg-replace="true"
						>
							Required!
						</span>
					)}
				</div>
				<div className="form-floating mb-3">
					<input
						className="form-control"
						aria-required="true"
						placeholder="name@example.com"
						autoComplete="username"
						type="email"
						id="Input_Email"
						{...register("email", { required: true })}
					/>
					<label className="form-label" htmlFor="Input_Email">
						Email
					</label>
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
				<div className="form-floating mb-3">
					<input
						className="form-control"
						aria-required="true"
						placeholder="password"
						type="password"
						id="Input_Password"
						autoComplete="current-password"
						{...register("password", { required: true })}
					/>
					<label className="form-label" htmlFor="Input_Password">
						Password
					</label>
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
				<div className="form-floating mb-3">
					<input
						className="form-control"
						aria-required="true"
						placeholder="password"
						type="password"
						id="Input_ConfirmPassword"
						autoComplete="new-password"
						{...register("password", { required: true })}
					/>
					<label
						className="form-label"
						htmlFor="Input_ConfirmPassword"
					>
						Confirm Password
					</label>
					{errors.confirmPassword && (
						<span
							className="text-danger field-validation-valid"
							data-valmsg-for="Input.ConfirmPassword"
							data-valmsg-replace="true"
						>
							Required!
						</span>
					)}
				</div>

				<div>
					<button
						id="register-submit"
						type="submit"
						className="w-100 btn btn-lg btn-primary"
					>
						Register
					</button>
				</div>
			</form>
		</div>
	);
}
