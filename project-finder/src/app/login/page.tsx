import LoginForm from "@/components/login_register_forms/LoginForm";
import RegisterForm from "@/components/login_register_forms/RegisterForm";

export default function Login() {
	return (
		<div className="login-container">
			<LoginForm />

			<div className="login-horizontal-divider">
				<h2 className="login-grid-element">või</h2>
			</div>
			<div className="login-vertical-divider"></div>

			<RegisterForm />
		</div>
	);
}
