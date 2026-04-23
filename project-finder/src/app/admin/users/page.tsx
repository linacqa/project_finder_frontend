"use client";
import { AccountContext } from "@/context/AccountContext";
import { UserService } from "@/services/UserService";
import { IUserInfo } from "@/types/IUserInfo";
import { useRouter } from "next/dist/client/components/navigation";
import { useContext, useEffect, useState } from "react";
import { TTNewButton, TTNewContainer, TTNewSelect } from "taltech-styleguide";

export default function Users() {
	const [users, setUsers] = useState<IUserInfo[]>([]);
	const [selectedUser, setSelectedUser] = useState<IUserInfo | undefined>(
		undefined,
	);
	const [newRole, setNewRole] = useState<string>("");
	const userService = new UserService();

	const { accountInfo } = useContext(AccountContext);
	const router = useRouter();

	const updateUserRole = async () => {
		if (!selectedUser || !newRole || newRole === selectedUser.role) {
			return;
		}

		const res = await userService.changeUsersRoleAsync(
			selectedUser.id,
			newRole,
		);

		if (res.statusCode && res.statusCode <= 300) {
			setSelectedUser({
				...selectedUser,
				role: newRole,
			});
			setUsers((currentUsers) =>
				currentUsers.map((user) =>
					user.id === selectedUser.id
						? { ...user, role: newRole }
						: user,
				),
			);
			setNewRole("");
			return;
		}
	};

	useEffect(() => {
		// Wait for AppState hydration before deciding auth redirect.
		if (accountInfo === undefined) {
			return;
		}

		if (!accountInfo.jwt) {
			router.push("/login");
			return;
		}
		if (accountInfo.role !== "admin") {
			router.push("/");
			return;
		}
	}, [accountInfo]);

	useEffect(() => {
		const loadUsers = async () => {
			const res = await userService.getAllAsync();
			if (res.data) {
				setUsers(res.data);
			}
		};

		void loadUsers();
	}, []);

	return (
		<TTNewContainer>
			<h1>Kasutajad</h1>
			<TTNewSelect
				label="Vali kasutaja"
				options={users.map((user) => ({
					value: user.id,
					label: `${user.firstName} ${user.lastName} (${user.email})`,
				}))}
				onChange={(value) => {
					if (!value || Array.isArray(value)) {
						setSelectedUser(undefined);
						return;
					}

					const user = users.find(
						(u) => u.id.toString() === value.value.toString(),
					);
					setSelectedUser(user);
				}}
				value={
					selectedUser
						? {
								value: selectedUser.id,
								label: `${selectedUser.firstName} ${selectedUser.lastName} (${selectedUser.email})`,
							}
						: null
				}
				placeholder="Vali kasutaja"
			/>

			{selectedUser && (
				<>
					<TTNewSelect
						className="mt-3"
						label="Kasutaja roll"
						options={[
							{ value: "admin", label: "admin" },
							{ value: "teacher", label: "teacher" },
							{ value: "student", label: "student" },
							{ value: "user", label: "user" },
						]}
						value={{
							value: newRole || selectedUser.role,
							label: newRole || selectedUser.role,
						}}
						onChange={(value) => {
							if (!value || Array.isArray(value)) {
								return;
							}

							setNewRole(value.value);
						}}
					/>
					<TTNewButton
						className="mt-3"
						onClick={updateUserRole}
						disabled={!newRole || newRole === selectedUser.role}
					>
						Salvesta
					</TTNewButton>
				</>
			)}
		</TTNewContainer>
	);
}
