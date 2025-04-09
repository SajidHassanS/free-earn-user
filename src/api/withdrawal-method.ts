import axios from "axios";
import { baseURL } from "./auth";

export const getWithdrawalMethods = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/withdrawal-method`, {
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

export const createWithdrawalMethod = async (data: any, token: string) => {
  try {
    const res = await axios.post(`${baseURL}/withdrawal-method`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const markWithdrawalMethod = async (data: any, token: string) => {
  try {
    const res = await axios.patch(
      `${baseURL}/withdrawal-method/default?uuid=${data.uuid}`,
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
