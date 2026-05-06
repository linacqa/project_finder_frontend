import axios, { AxiosInstance } from "axios";

export abstract class BaseService {
	protected axiosInstance: AxiosInstance;

	constructor() {
		this.axiosInstance = axios.create({
			// baseURL: "http://localhost:5231/api/v1.0/",
			// TODO: change baseURL before production
			baseURL: process.env.NEXT_PUBLIC_API_URL + "/v1.0/",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			withCredentials: true,
		});

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
						const response = await axios.post(
							this.axiosInstance.defaults.baseURL +
								// "Account/RenewRefreshToken?jwtExpiresInSeconds=5",
								"Account/RenewRefreshToken",
						);

						if (response && response.status <= 300) {
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
