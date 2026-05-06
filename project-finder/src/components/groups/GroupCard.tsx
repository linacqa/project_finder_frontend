"use client";
import {
	Heading,
	TTNewCard,
	TTNewCardContent,
} from "taltech-styleguide";
import { useContext } from "react";
import { IUserInfo } from "@/types/IUserInfo";
import { IUserGroup } from "@/types/domain/IUserGroup";
import Link from "next/link";
import { AccountContext } from "@/context/AccountContext";

export default function GroupCard({
	id,
	name,
	creator,
	users,
}: {
	id: string;
	name: string;
	creator: IUserInfo;
	users: IUserGroup[];
}) {

	const { accountInfo } = useContext(AccountContext);

	return (
		<TTNewCard className="mb-4 w-auto" key={id}>
			<TTNewCardContent>
				{accountInfo?.isAuthenticated && accountInfo.userId === creator?.id ? (
					<Link href={`/groups/${id}`} passHref>
						<Heading as="h3" visual="h4" className="mb-3 project-header-title">
							{name}
						</Heading>
					</Link>
				) : (
					<Heading as="h3" visual="h4" className="mb-3 project-header-title">
						{name}
					</Heading>
				)}
				<div className="mb-3">
					Looja: <Link href={`/profile/${creator.id}`}>{creator.firstName} {creator.lastName}</Link> (
					{creator.email})
				</div>
				{users.length > 0 && (
					<Heading as="h4" visual="h5">
						Liikmed:
					</Heading>
				)}
				{users.map((user, index) => (
					<div key={user.id}>
						{index + 1}) <Link href={`/profile/${user.userId}`}>{user.user.firstName} {user.user.lastName}</Link>{" "}
						({user.user.email}) - {user.role}
					</div>
				))}
			</TTNewCardContent>
		</TTNewCard>
	);
}
