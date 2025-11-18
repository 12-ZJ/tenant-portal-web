"use server"

import { NewsFilterDto, SaveNewsDetailDto, SaveNewsDto, SaveRequestAccessDto } from "../../types";
import axios from 'axios';
import { handleApiError } from "../error-handler";
import { authHeader } from "../auth";

const url = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export const getRequestAccess = async () => {
    try {
        const headers = await authHeader();
        const res = await axios.get(`${url}/request_access/list`, { headers });
        return res.data;
    } catch (error) {
        return handleApiError(error);
    }
}

export const getRequestAccessAPI = async (id: number) => {
    try {
        const params = { id: id };
        const headers = await authHeader();
        const res = await axios.get(`${url}/request_access/detail`, { params, headers });
        return res.data;
    } catch (error) {
        return handleApiError(error);
    }
}

export const saveRequestAccessAPI = async (req: SaveRequestAccessDto) => {
    try {
        const headers = await authHeader();
        const res = await axios.post(`${url}/request_access/save`, req, { headers });
        return res.data;
    } catch (error) {
        return handleApiError(error);
    }
}