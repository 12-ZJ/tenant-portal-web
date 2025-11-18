"use client"

import { changeRequestMaintainStatusAPI } from "../../api/request";
import { ChangeRequestMaintainStatusDto } from "../../types";
import { errorValidation } from "../../utils";

export const changeRequestMaintainStatus = async (req: ChangeRequestMaintainStatusDto) => {
    const res = await changeRequestMaintainStatusAPI(req);
    errorValidation(res);

    const data = res;
    return data;
}