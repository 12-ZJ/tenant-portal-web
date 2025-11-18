import { getAuthToken } from "../api";

export const authHeader = async () => {
  const token = await getAuthToken();
  return { Authorization: `Bearer ${token}` };
};