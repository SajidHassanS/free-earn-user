import axios from "axios";
import { baseURL } from "./auth";

export const getUniqueNameandPass = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/dashboard/unique-name-and-pass`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const premiumCredentials = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/dashboard/premium-credentials`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const uploadPremiumEmail = async (data: FormData, token: string) => {
  try {
    const res = await axios.post(`${baseURL}/dashboard/premium-email`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const getEmailsStats = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/email/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "true",
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};
