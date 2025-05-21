import axios from "axios";
import { baseURL } from "./auth";

export const getEmailsList = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/email/all`, {
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

export const getDuplicateEmailList = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/email/duplicate/all`, {
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

export const uploadEmailScreenshot = async (data: FormData, token: string) => {
  try {
    const res = await axios.post(`${baseURL}/email`, data, {
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

export const insertEmails = async (data: any, token: any) => {
  try {
    const res = await axios.post(`${baseURL}/email/bulk-insert`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};
