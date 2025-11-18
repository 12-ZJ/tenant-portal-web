"use client"

import { LoginDto } from '../../types';
import { errorValidation } from "../../utils";
import { loginAPI } from '../../api/user';

export const login = async (req: LoginDto) => {
    const res = await loginAPI(req);
    errorValidation(res);

    const accessToken = res.accessToken ?? "";
    return accessToken;
}