"use client";

import { createContext } from "react";

export interface IAccountInfo {
	jwt?: string;
	refreshToken?: string;
	userId?: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	role?: "admin" | "user" | "student" | "teacher";
}

export interface IAccountState {
	accountInfo?: IAccountInfo;
	setAccountInfo?: (value: IAccountInfo) => void;
}

export const AccountContext = createContext<IAccountState>({});
