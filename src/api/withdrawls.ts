import axios from "axios";
import { baseURL } from "./auth";

export const getWithdrawls = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/withdrawal/available-balance`, {
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

export const getWithdrawlsBonus = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/withdrawal/bonus`, {
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

export const getAllWithdrawlsHistory = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/withdrawal/my`, {
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

export const getAllWithdrawlsBonusHistory = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/withdrawal/bonus/my`, {
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

export const withdrawRequest = async (token: string) => {
  try {
    const res = await axios.post(`${baseURL}/withdrawal/request`, "", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const bonusWithdrawRequest = async (
  token: string,
  bonusType: string
) => {
  try {
    const res = await axios.post(
      `${baseURL}/withdrawal/bonus`,
      { bonusType },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    return error;
  }
};
