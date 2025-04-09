import axios from "axios";
import { baseURL } from "./auth";

export const getNotificationList = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/notification/all`, {
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

export const getUnreadNotificationCount = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/notification/unread-count`, {
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

export const readNotification = async (data: any, token: string) => {
  try {
    const res = await axios.post(
      `${baseURL}/notification/read?uuid=${data.uuid}`,
      "",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const markAllRead = async (token: string) => {
  try {
    const res = await axios.post(`${baseURL}/notification/mark-all-read`, "", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};
