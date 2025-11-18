"use server"

import axios from 'axios';
import { handleApiError } from "../error-handler";
import { cookies } from "next/headers";
import { LoginDto } from '../../types';
import { jwtDecode } from 'jwt-decode';

const url = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export const loginAPI = async (req: LoginDto) => {
    try {
        const res = await axios.post(`${url}/auth/login`, req );
        const accessToken = res.data.accessToken;
        const exp = jwtDecode(accessToken).exp || 0;
        const expires = new Date(exp * 1000);
        (await cookies()).set("accessToken", accessToken, { expires, httpOnly: true });

        return res.data;
    } catch (error) {
        return handleApiError(error);
    }
}