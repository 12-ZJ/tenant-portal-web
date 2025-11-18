"use server"

import { ChangeRequestMaintainStatusDto } from "../../types";
import axios from 'axios';
import { handleApiError } from "../error-handler";
import { authHeader } from "../auth";

const url = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export const changeRequestMaintainStatusAPI = async (req: ChangeRequestMaintainStatusDto) => {
    try {
        const headers = await authHeader();
        const res = await axios.post(`${url}/request-maintain/change-status`, req, { headers });
        return res.data;
    } catch (error) {
        return handleApiError(error);
    }
}