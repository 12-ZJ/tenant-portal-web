"use server"

import { ChangeRequestAccessStatusDto, NewsFilterDto, SaveNewsDetailDto, SaveNewsDto, SaveRequestAccessDto } from "../../types";
import axios from 'axios';
import { handleApiError } from "../error-handler";
import { authHeader } from "../auth";

const url = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export const getRequestAccessAPI = async () => {
    try {
        const headers = await authHeader();
        const res = await axios.get(`${url}/request-access/list`, { headers });
        return res.data;
    } catch (error) {
        return handleApiError(error);
    }
}

export const getRequestAccessDetailAPI = async (id: number) => {
    try {
        const params = { id: id };
        const headers = await authHeader();
        const res = await axios.get(`${url}/request-access/detail`, { params, headers });
        return res.data;
    } catch (error) {
        return handleApiError(error);
    }
}

export const saveRequestAccessAPI = async (req: SaveRequestAccessDto) => {
    try {
        const headers = await authHeader();
        const res = await axios.post(`${url}/request-access/save`, req, { headers });
        return res.data;
    } catch (error) {
        return handleApiError(error);
    }
}

export const changeRequestAccessStatusAPI = async (req: ChangeRequestAccessStatusDto) => {
    try {
        const headers = await authHeader();
        const res = await axios.post(`${url}/request-access/change-status`, req, { headers });
        return res.data;
    } catch (error) {
        return handleApiError(error);
    }
}