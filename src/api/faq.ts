import axios from "axios";
import { baseURL } from "./auth";

export const getFaqList = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/faq`, {
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
