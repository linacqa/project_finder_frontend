import { AccountContext } from "@/context/AccountContext";
import { ILoginDto } from "@/types/ILoginDto";
import axios, { AxiosInstance } from "axios";
import { useContext } from "react";

export abstract class BaseService {
	protected axiosInstance: AxiosInstance;

	constructor() {
		this.axiosInstance = axios.create({
			baseURL: "http://localhost:5231/api/v1.0/",
			// TODO: change baseURL before production
			// baseUrl: "/api/api/v1.0/",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		});

		this.axiosInstance.interceptors.request.use(
			(config) => {
				const token = localStorage.getItem("_jwt");
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
				return config;
			},
			(error) => {
				return Promise.reject(error);
			},
		);

		this.axiosInstance.interceptors.response.use(
			(response) => {
				return response;
			},

			async (error) => {
				const originalRequest = error.config;
				if (
					error.response &&
					error.response.status === 401 &&
					!originalRequest._retry
				) {
					originalRequest._retry = true;
					try {
						const jwt = localStorage.getItem("_jwt");
						const refreshToken =
							localStorage.getItem("_refreshToken");
						const response = await axios.post<ILoginDto>(
							this.axiosInstance.defaults.baseURL +
								// "account/renewRefreshToken?jwtExpiresInSeconds=5",
								"account/renewRefreshToken",
							{
								jwt: jwt,
								refreshToken: refreshToken,
							},
						);

						if (response && response.status <= 300) {
							localStorage.setItem("_jwt", response.data.jwt);
							localStorage.setItem(
								"_refreshToken",
								response.data.refreshToken,
							);
							originalRequest.headers.Authorization = `Bearer ${response.data.jwt}`;

							return this.axiosInstance(originalRequest);
						}

						return Promise.reject(error);
					} catch (error) {
						console.error("Error refreshing token:", error);
						return Promise.reject(error);
					}
				}
				return Promise.reject(error);
			},
		);
	}
}
