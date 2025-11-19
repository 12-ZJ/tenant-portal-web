import axios from 'axios';
import { authHeader, handleApiError } from '..';
import { SaveInvoiceDto } from '../../types';

const url = 'https://asset-world-poc-api.onrender.com';

export const getInvoiceAPI = async () => {
    try {
        const headers = await authHeader();
        const res = await axios.get(`${url}/invoice`, { headers });
        return res.data;
    } catch (error) {
        return handleApiError(error);
    }
}

export const saveInvoiceAPI = async (req: SaveInvoiceDto) => {
    try {
        const headers = await authHeader();
        const res = await axios.post(`${url}/invoice/save`, req, { headers });
        return res.data;
    } catch (error) {
        return handleApiError(error);
    }
}