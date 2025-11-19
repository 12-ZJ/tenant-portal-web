import { getInvoiceAPI, saveInvoiceAPI } from "../../api/request";
import { InvoiceDto, SaveInvoiceDto } from "../../types";
import { errorValidation } from "../../utils";

export const getInvoice = async (): Promise<InvoiceDto[]> => {
    const res = await getInvoiceAPI();
    errorValidation(res);

    const data: InvoiceDto[] = res;
    return data;
}

export const saveInvoice = async (req: SaveInvoiceDto) => {
    const res = await saveInvoiceAPI(req);
    errorValidation(res);

    const data = res;
    return data;
}