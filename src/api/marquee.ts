import axios from "axios";
import { baseURL } from "./auth";

export const getMarqueeList = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/marquee/`, {
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
