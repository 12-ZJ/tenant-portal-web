"use client"

import { getBuildingAPI } from "../../api/config";
import { BuildingModel, StaticFilter, StaticResponse } from "../../types";
import { errorValidation } from "../../utils";

export const getBuilding = async (params: StaticFilter): Promise<BuildingModel[]> => {
    const res = await getBuildingAPI(params);
    errorValidation(res);

    const data: BuildingModel[] = res;
    return data;
}
