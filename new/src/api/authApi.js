import axios from "./axiosConfig";

export const loginUser = (emailOrMobile, password) =>
  axios.post("/auth/login", { emailOrMobile, password });

export const signupUser = (data) => axios.post("/auth/signup", data);
