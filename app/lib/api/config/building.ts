"use server"

import { StaticFilter } from "../../types";
import axios from 'axios';
import { handleApiError } from "../error-handler";
import { authHeader } from "../auth";

const url = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export const getBuildingAPI = async (params: StaticFilter) => {
    try {
        const headers = await authHeader();
        const res = await axios.get(`${url}/building`, { params, headers });
        return res.data;
    } catch (error) {
        return handleApiError(error);
    }
}