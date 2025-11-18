"use server"

import { StaticFilter } from "../../types";
import axios from 'axios';
import { handleApiError } from "../error-handler";
import { authHeader } from "../auth";

const url = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export const getNewsTypeAPI = async (params: StaticFilter) => {
    try {
        const headers = await authHeader();
        const res = await axios.get(`${url}/news-type`, { params, headers });
        return res.data;
    } catch (error) {
        return handleApiError(error);
    }
}

export const getDropdownAPI = async (params: StaticFilter) => {
    try {
        const headers = await authHeader();
        const res = await axios.get(`${url}/dropdown`, { params, headers });
        return res.data;
    } catch (error) {
        return handleApiError(error);
    }
}