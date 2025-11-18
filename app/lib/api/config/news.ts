"use server"

import { NewsFilterDto, SaveNewsDetailDto, SaveNewsDto } from "../../types";
import axios from 'axios';
import { handleApiError } from "../error-handler";
import { authHeader } from "../auth";

const url = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export const getNewsAPI = async (params: NewsFilterDto) => {
    try {
        const headers = await authHeader();
        const res = await axios.post(`${url}/news/list`, params, { headers });
        return res.data;
    } catch (error) {
        return handleApiError(error);
    }
}

export const getNewsDetailAPI = async (id: number) => {
    try {
        const params = { id: id };
        const headers = await authHeader();
        const res = await axios.get(`${url}/news/detail`, { params, headers });
        return res.data;
    } catch (error) {
        return handleApiError(error);
    }
}

export const saveNewsAPI = async (req: SaveNewsDetailDto) => {
    try {
        const headers = await authHeader();
        const res = await axios.post(`${url}/news/save`, req, { headers });
        return res.data;
    } catch (error) {
        return handleApiError(error);
    }
}