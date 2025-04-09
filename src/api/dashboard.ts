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
