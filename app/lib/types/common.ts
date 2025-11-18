import { User } from "./model";

export type ID = {
    id: number
}

export type Option = {
    label: string;
    value: string;
}

export type ApiError = {
    err_code: number;
    err_msg: string;
}

export type RoleFlag = {
    isAdmin: boolean;
}

export type UserInfo = Omit<User, "password" | "isActive" | "createdOn" | "createdBy" | "updatedOn" | "updatedBy"> & RoleFlag & {
    exp: number;
    iat: number;
};

export type ExportDto = {
    filename: string;
    fileType?: string;
    base64: string;
}