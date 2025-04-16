import axios from "axios";
import { baseURL } from "./auth";

export const getUsersList = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/chat/admins`, {
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

export const getMessages = async (uuid: any, token: string) => {
  try {
    const res = await axios.get(`${baseURL}/chat/messages?uuid=${uuid}`, {
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

export const getUnreadCount = async (uuid: any, token: string) => {
  try {
    const res = await axios.get(`${baseURL}/chat/unread-count?uuid=${uuid}`, {
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
