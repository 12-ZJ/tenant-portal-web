"use client"

import ConfigForm from "../form/config-layout";
import { InputLayout } from "../form/input-layout";
import { useCallback, useEffect, useState } from "react";
import { BuildingModel, ExportDto, Option, SaveNewsAttachmentDto, SaveNewsBuildingDto, SaveNewsDetailDto, SaveNewsDto } from "@/app/lib/types";
import { useParams, useRouter } from "next/navigation";
import { useLoadingStore, useUserStore } from "@/app/store";
import { createChangeHandler, formatDate, getInputClass, handleApiErrorWithRedirect, inputNumberValue, removeByIndex, toastWarning, validate, validateGreaterThan, validateRequired } from "@/app/lib/utils";
import { defaultNews } from "@/app/lib/constants";
import { Checkbox, IconButton, SelectField } from "../common";
import { getBuilding, getNewsDetail, saveNews } from "@/app/lib/services";
import { mergeWithFallback } from "@/app/lib/utils";
import { getNewsType } from "@/app/lib/services/config/static";
import { useFormSubmit } from "@/app/lib/hooks/form";
import DatePicker from "../common/date-picker";
import { BiTrash } from "react-icons/bi";
import { downloadBase64File, downloadLocalFile, fileToBase64 } from "@/app/lib/utils/file";
import Upload from "../common/upload";
import { AiOutlinePaperClip } from "react-icons/ai";

const defaultError: Partial<Record<keyof SaveNewsDto, string>> = {
    topicTH: "",
    topicEN: "",
    detailTH: "",
    detailEN: "",
    newsTypeId: "",
    displayDateStart: "",
    displayDateEnd: "",
};

export default function NewsForm() {
    const [mounted, setMounted] = useState(false);
    const [typeOption, setTypeOption] = useState<Option[]>([]);
    const [dataSource, setDataSource] = useState<SaveNewsDto>(defaultNews);
    const [buildingMaster, setBuildingMaster] = useState<BuildingModel[]>([]);
    const [buildings, setBuildings] = useState<SaveNewsBuildingDto[]>([]);
    const [selectBuilding, setSelectBuilding] = useState(0);
    const [attachments, setAttachments] = useState<SaveNewsAttachmentDto[]>([]);
    const [uploadFiles, setUploadFiles] = useState<File[]>([]);
    const [errors, setErrors] = useState(defaultError);
    const { fetching, processing, setFetching, setProcessing } = useLoadingStore((state) => state);
    const { userId } = useUserStore((state) => state);

    const router = useRouter();
    const searchParams = useParams();
    const id = Number(searchParams.id);

    const { handleSubmit } = useFormSubmit<SaveNewsDto>();
    const { multi: handleMultiChange } = createChangeHandler(dataSource, setDataSource);

    const fetchData = useCallback(async () => {
        try {
            const type = await getNewsType({isActive: 1});
            const building = await getBuilding({isActive: 1});
            const res = await getNewsDetail(id);
            const newsBuilding = res.newsBuilding || [];
            const newsAttachment = res.newsAttachment || [];
            const data = mergeWithFallback<SaveNewsDto>(res.news, defaultNews);

            setTypeOption(type.map(e => ({ value: String(e.id), label: e.nameEN })));
            setBuildingMaster(building);
            setDataSource(data);
            setBuildings(newsBuilding.map(e => ({ 
                id: e.id,
                newsId: e.newsId,
                buildingId: e.buildingId
            })));
            setAttachments(newsAttachment.map(e => ({ 
                id: e.id,
                newsId: e.newsId,
                filename: e.filename,
                base64: e.base64
            })));
        } catch (error) {
            handleApiErrorWithRedirect(error, router);
        } finally {
            setFetching(false);
        }
    }, [id, router]);

    useEffect(() => {
        setMounted(true);
        setFetching(true);
        fetchData();
    }, [fetchData]);

    if (!mounted || fetching) return null;

    const isNew = id == 0;

    const buildingOption = () => {
        const items: Option[] = buildingMaster
            .filter(b => !buildings.some(item => item.buildingId === b.id))
            .map(i => ({
                value: String(i.id),
                label: i.nameEN
            }));
        return items;
    }

    const buildingName = (id: number) => {
        const name = buildingMaster.find(item => item.id === id)?.nameEN ?? "";
        return name;
    }

    const handleAddBuilding = () => {
        if (selectBuilding === 0) { return };

        const updated = buildings;
        updated.push({
            id: 0,
            newsId: id,
            buildingId: selectBuilding
        });
        setBuildings(updated);
        setSelectBuilding(0);
    }

    const handleRemoveProduct = (index: number) => {
        const updated = removeByIndex(buildings, index);
        setBuildings(updated);
    };

    const handleUploadAttachment = async (value: FormData | undefined) => {
        if (!value) return;

        const files: File[] = [];
        const currentFilenames = attachments?.map(e => e.filename) || [];

        for (const [, file] of value.entries()) {
            if (file instanceof File) {
                const isDuplicate = currentFilenames.includes(file.name);
                if (!isDuplicate) {
                    files.push(file);
                } else {
                    toastWarning(`${file.name} is a duplicate and will be ignored.`);
                }
            }
        }

        if (files.length === 0) return;

        const newAttachmentList: SaveNewsAttachmentDto[] = await Promise.all(
            files.map(async (e) => ({
                id: 0,
                newsId: id,
                filename: e.name,
                base64: await fileToBase64(e)
            }))
        );

        setAttachments(prev => [...(prev ?? []), ...newAttachmentList]);
        setUploadFiles(prev => [...(prev ?? []), ...files]);
    };

    const handleRemoveAttachment = (value: string) => {
        const updatedAttachList = attachments?.filter(
            (e) => e.filename !== value
        );

        setAttachments(updatedAttachList || []);
    };

    const handleDownloadAttachment = async (base64: string, name: string) => {
        if (base64 !== "") {
            const file: ExportDto = {
                filename: name,
                base64: base64
            }
            downloadBase64File(file);
        } else {
            downloadLocalFile(uploadFiles.find(e => e.name === name) as File);
        }
    }

    const validateForm = () => {
        const fieldValidators = {
            topicTH: [validateRequired()],
            topicEN: [validateRequired()],
            detailTH: [validateRequired()],
            detailEN: [validateRequired()],
            newsTypeId: [validateRequired()],
            displayDateStart: [validateRequired()],
        };

        const newErrors = validate(dataSource, fieldValidators);
        setErrors(newErrors);
        const isValid = Object.values(true).every((v) => !v);
        return isValid;
    };

    const postData = async () => {
        const data: SaveNewsDetailDto = {
            news: {
                id: dataSource.id,
                topicTH: dataSource.topicTH,
                topicEN: dataSource.topicEN,
                detailTH: dataSource.detailTH,
                detailEN: dataSource.detailEN,
                newsTypeId: dataSource.newsTypeId,
                displayDateStart: dataSource.displayDateStart,
                displayDateEnd: dataSource.displayDateEnd,
                isActive: dataSource.isActive,
                isTenant: dataSource.isTenant,
                isTenantService: dataSource.isTenantService,
                isPropertyService: dataSource.isPropertyService,
                isSafety: dataSource.isSafety
            },
            newsBuilding: buildings,
            newsAttachment: attachments.map(item => ({
                ...item,
                base64: !!item.id ? "" : item.base64
            })),
            userId: userId
        };
        console.log("save payload:", data);
        await saveNews(data);
    };

    const handleSave = (e: React.FormEvent) => {
        handleSubmit({ e, validateForm, onSave: postData, processing, setProcessing, redirectPath: "/news", });
    }

    return (
        <ConfigForm title={"News"} isNew={isNew} onSave={handleSave}>
            <InputLayout label={"Type"} error={errors.newsTypeId}>
                <SelectField
                    id="select_newsTypeId"
                    name="newsTypeId"
                    disabled={processing}
                    value={dataSource.newsTypeId}
                    options={typeOption} 
                    selectAction={(e) => handleMultiChange({newsTypeId: e?.value})}
                    error={errors.newsTypeId}                 
                />
            </InputLayout>
            <InputLayout label={"Display Date"} error={errors.displayDateStart}>
                <DatePicker
                    placeholder={"Display Date"}
                    useRange={true}
                    disable={processing}
                    start={dataSource.displayDateStart ? new Date(dataSource.displayDateStart) : null}
                    end={dataSource.displayDateEnd ? new Date(dataSource.displayDateEnd) : null}
                    onChange={(e) => handleMultiChange({
                        displayDateStart: e.startDate ? formatDate(e.startDate, "YYYY-MM-DD") : "",
                        displayDateEnd: e.endDate ? formatDate(e.endDate, "YYYY-MM-DD") : ""
                    })}
                    invalid={!!errors.displayDateStart}
                />
            </InputLayout>
            <InputLayout label={"Topic (TH)"} error={errors.topicTH}>
                <textarea className={getInputClass(!!errors.topicTH)}
                    rows={2}
                    maxLength={100}
                    disabled={processing}
                    onChange={(e) => handleMultiChange({topicTH: e.target.value})}
                    value={dataSource.topicTH}
                />
            </InputLayout>
            <InputLayout label={"Topic (EN)"} error={errors.topicEN}>
                <textarea className={getInputClass(!!errors.topicEN)}
                    rows={2}
                    maxLength={100}
                    disabled={processing}
                    onChange={(e) => handleMultiChange({topicEN: e.target.value})}
                    value={dataSource.topicEN}
                />
            </InputLayout>
            <InputLayout label={"Detail (TH)"} error={errors.detailTH}>
                <textarea className={getInputClass(!!errors.detailTH)}
                    rows={10}
                    maxLength={1000}
                    disabled={processing}
                    onChange={(e) => handleMultiChange({detailTH: e.target.value})}
                    value={dataSource.detailTH}
                />
            </InputLayout>
            <InputLayout label={"Detail (EN)"} error={errors.detailEN}>
                <textarea className={getInputClass(!!errors.detailEN)}
                    rows={10}
                    maxLength={1000}
                    disabled={processing}
                    onChange={(e) => handleMultiChange({detailEN: e.target.value})}
                    value={dataSource.detailEN}
                />
            </InputLayout>
            <InputLayout label={"Building"} isRequired={false}>
                <div className="space-y-2">
                    <div className="flex gap-5">
                        <SelectField
                            id="select_product"
                            name="product"
                            className="w-[90%]"
                            disabled={processing}
                            value={selectBuilding}
                            options={buildingOption()} 
                            selectAction={(e) => setSelectBuilding(Number(e?.value))} 
                        />
                        <button type="button" className="tertiary-button !min-w-20 !w-[10%]" disabled={processing || selectBuilding === 0} onClick={handleAddBuilding}> Add </button>
                    </div>
                    <div className="flex gap-2 mt-2">
                        {buildings.map((item, index) => {
                            return (
                                <div key={`id_${index+1}`} className="flex gap-2 px-2 py-1 bg-theme_greyLight border border-theme_border rounded">
                                    { !processing && <IconButton className="text-theme_orange" icon={<BiTrash />} size={14} onClick={() => handleRemoveProduct(index)}/> }
                                    <span className="font-normal">{buildingName(item.buildingId)}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </InputLayout>
            <InputLayout label={"Role"} isRequired={false}>
                <div className="flex gap-8">
                    <Checkbox checked={dataSource.isTenant} disabled={processing} label={"Tenant"} onChange={(e) => handleMultiChange({isTenant: e.target.checked})} />
                    <Checkbox checked={dataSource.isTenantService} disabled={processing} label={"Tenant Service"} onChange={(e) => handleMultiChange({isTenantService: e.target.checked})} />
                    <Checkbox checked={dataSource.isPropertyService} disabled={processing} label={"Property Service"} onChange={(e) => handleMultiChange({isPropertyService: e.target.checked})} />
                    <Checkbox checked={dataSource.isSafety} disabled={processing} label={"Safety"} onChange={(e) => handleMultiChange({isSafety: e.target.checked})} />
                </div>
            </InputLayout>
            <InputLayout label={"Status"} isRequired={false}>
                <Checkbox checked={dataSource.isActive ?? false} disabled={processing} onChange={(e) => handleMultiChange({isActive: e.target.checked})} />
            </InputLayout>
            <InputLayout label="Attachment" isRequired={false}>
                <Upload
                    onUpload={handleUploadAttachment} 
                    multiple={true}
                    accept={{
                        "image/*": [],
                        "application/pdf": [".pdf"]
                    }}
                />
                <div className="mt-2">
                    {attachments.map((e) => (
                    <div key={e.filename} className="flex items-center gap-2 font-normal">
                        {!processing ? (
                            <IconButton className="text-theme_red" icon={<BiTrash />} onClick={() => handleRemoveAttachment(e.filename)}/>
                            ) : (
                            <AiOutlinePaperClip size={16} className="cursor-pointer text-theme_grey" />
                        )}
                        <button type="button" onClick={() => handleDownloadAttachment(e.base64, e.filename)}>{e.filename}</button>
                    </div>
                ))}
                </div>
            </InputLayout>
        </ConfigForm>
    )
}