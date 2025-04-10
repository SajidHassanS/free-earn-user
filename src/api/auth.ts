import axios from "axios";

export const baseURL = "http://13.61.146.137/api";

export const createAccount = async (data: createAccountPayload) => {
  try {
    const res = await axios.post(`${baseURL}/user/auth/signup`, data);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const login = async (data: any) => {
  try {
    const res = await axios.post(`${baseURL}/user/auth/login`, data);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const updateUserAccountPassword = async (data: any, token: string) => {
  try {
    const res = await axios.patch(
      `${baseURL}/user/auth/password/update`,
      data,
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

// get  profile
export const getUserProfile = async (token: string) => {
  try {
    const res = await axios.get(`${baseURL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

// update  profile
export const updateUserProfile = async (data: any, token: string) => {
  try {
    const res = await axios.patch(`${baseURL}/user/profile`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw error;
  }
};
