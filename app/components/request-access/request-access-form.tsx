"use client"

import { InputLayout } from "../form/input-layout";
import { useCallback, useEffect, useState } from "react";
import { ChangeRequestAccessStatusDto, DropdownDto, ExportDto, Option, RequestAccessDetailDto, SaveRequestAccess, SaveRequestAccessDto, SaveRequestAccessPeople, SaveRequestAccessPeopleAttachment } from "@/app/lib/types";
import { useRouter } from "next/navigation";
import { useLoadingStore, useUserStore } from "@/app/store";
import { createChangeHandler, createChangeHandlerArray, formatDate, getInputClass, handleApiErrorWithRedirect, removeByIndex, toastSuccess, toastWarning } from "@/app/lib/utils";
import { ACCESS_ACTIVITY, ACCESS_STATUS, defaultRequestAccess, defaultRequestAccessDetail, defaultRequestAccessPeople, TOAST_DURATION_MS } from "@/app/lib/constants";
import { ActionButton, IconButton, SelectField } from "../common";
import { getDropdown } from "@/app/lib/services/config/static";
import { useFormSubmit } from "@/app/lib/hooks/form";
import DatePicker from "../common/date-picker";
import { BiTrash } from "react-icons/bi";
import { downloadBase64File, downloadLocalFile, fileToBase64 } from "@/app/lib/utils/file";
import Upload from "../common/upload";
import { AiOutlinePaperClip } from "react-icons/ai";
import RequestHeader from "./request-header";
import { changeRequestAccessStatus, getRequestAccessDetail, saveRequestAccess } from "@/app/lib/services/request";

const defaultRequestError: Partial<Record<keyof SaveRequestAccess, string>> = {
    buildingId: "",
    floorId: "",
    areaId: "",
    accessDate: "",
    note: ""
};

const defaultPeopleError: Partial<Record<keyof SaveRequestAccessPeople, string>> = {
    requestAccessId: "",
    genderId: "",
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    requestAccessPeopleAttachment: "",
};

interface Props {
    id: number;
    isSubmit: boolean;
}

export default function RequestAccessForm({ id, isSubmit }: Props) {
    const [mounted, setMounted] = useState(false);
    const [requestId, setRequestId] = useState<number>(id);
    const [dataSource, setDataSource] = useState<RequestAccessDetailDto>();
    const [requestInfo, setRequestInfo] = useState<SaveRequestAccess>(defaultRequestAccess);
    const [peopleInfo, setPeopleInfo] = useState<SaveRequestAccessPeople[]>([]);
    const [dropdownMaster, setDropdownMaster] = useState<DropdownDto>();
    const [uploadFiles, setUploadFiles] = useState<File[]>([]);
    const [requestErrors, setRequestErrors] = useState<typeof defaultRequestError>(defaultRequestError);
    const [peopleErros, setPeopleErrors] = useState<typeof defaultPeopleError[]>([]);
    const { fetching, processing, setFetching, setProcessing } = useLoadingStore((state) => state);
    const { userId } = useUserStore((state) => state);
    const [isOpenQr, setIsOpenQr] = useState(false);
    const [approving, setApproving] = useState(false);
    const [rejecting, setRejecting] = useState(false);

    const router = useRouter();

    const { multi: handleRequestMultiChange } = createChangeHandler(requestInfo, setRequestInfo);
    const { multiAt: handlePeopleMultiChange } = createChangeHandlerArray(peopleInfo, setPeopleInfo);

    const fetchData = useCallback(async () => {
        try {
            const dropdown = await getDropdown({isActive: 1});
            const res = await getRequestAccessDetail(requestId);
            const request = res.requestAccess ?? [];
            const people = res.requestAccessPeople ?? [defaultRequestAccessPeople];

            const errorList = people.map(item => ({
                ...defaultPeopleError
            }));

            setDropdownMaster(dropdown);
            setDataSource(res ?? defaultRequestAccessDetail);
            setRequestInfo(request);
            setPeopleInfo(people.map(e => ({
                id: e.id,
                requestAccessId: e.requestAccessId,
                genderId: e.genderId,
                firstname: e.firstname,
                lastname: e.lastname,
                email: e.email,
                phoneNumber: e.phoneNumber,
                requestAccessPeopleAttachment: e.requestAccessPeopleAttachment.map(i => ({
                    id: i.id,
                    requestAccessPeopleId: i.requestAccessPeopleId,
                    filename: i.filename,
                    base64: i.base64,
                }))
            })));
            setPeopleErrors(errorList);
        } catch (error) {
            handleApiErrorWithRedirect(error, router);
        } finally {
            setFetching(false);
        }
    }, [requestId, router]);

    useEffect(() => {
        setMounted(true);
        setFetching(true);
        fetchData();
    }, [fetchData]);

    if (!mounted || fetching) return null;

    const genderOption: Option[] = dropdownMaster?.gender?.map(item => ({
        value: String(item.id),
        label: item.nameEN
    })) ?? [];

    const buildingOption: Option[] = dropdownMaster?.building?.map(item => ({
        value: String(item.id),
        label: item.nameEN
    })) ?? [];

    const floorOption: Option[] = dropdownMaster?.floor?.
        filter(f => f.buildingId === requestInfo.buildingId)
        .map(item => ({
            value: String(item.id),
            label: item.nameEN
    })) ?? [];

    const areaOption: Option[] = dropdownMaster?.area?.
        filter(f => 
            f.buildingId === requestInfo.buildingId &&
            f.floorId === requestInfo.floorId
        )
        .map(item => ({
            value: String(item.id),
            label: item.nameEN
    })) ?? [];

    const handleAddPerson = () => {
        setPeopleInfo([...peopleInfo, {
            ...defaultRequestAccessPeople,
            requestAccessId: id
        }]);
        setPeopleErrors([...peopleErros, defaultPeopleError]);
    }

    const handleRemovePeople = (index: number) => {
        const updated = removeByIndex(peopleInfo, index);
        setPeopleInfo(updated);
    };

    const handleUploadAttachment = async (index: number, value: FormData | undefined) => {
        if (!value) return;

        const files: File[] = [];
        const currentFilenames = peopleInfo[index].requestAccessPeopleAttachment.map(e => e.filename) || [];

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

        const newAttachmentList: SaveRequestAccessPeopleAttachment[] = await Promise.all(
            files.map(async (e) => ({
                id: 0,
                requestAccessPeopleId: id,
                filename: e.name,
                base64: await fileToBase64(e)
            }))
        );

        const updatedAttachList = [
            ...(peopleInfo[index].requestAccessPeopleAttachment ?? []),
            ...newAttachmentList
        ];

        handlePeopleMultiChange(index, { requestAccessPeopleAttachment: updatedAttachList });
        setUploadFiles(prev => [...(prev ?? []), ...files]);
    };

    const handleRemoveAttachment = (index: number, filename: string) => {
        const updatedAttachList = peopleInfo[index].requestAccessPeopleAttachment.filter(
            (e) => e.filename !== filename
        );

        handlePeopleMultiChange(index, {requestAccessPeopleAttachment: updatedAttachList || []});
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

    const validateForm = (): boolean => {
        const msg = "Please fill out this field.";

        const requestErrors = {
            buildingId: !requestInfo.buildingId ? msg : "",
            floorId: !requestInfo.floorId ? msg : "",
            areaId: !requestInfo.areaId ? msg : "",
            accessDate: !requestInfo.accessDate ? msg : "",
            note: "",
        };

        const peopleErrors = peopleInfo.map((item) => ({
            genderId: !item.genderId ? msg : "",
            firstname: !item.firstname ? msg : "",
            lastname: !item.lastname ? msg : "",
            email: "",
            phoneNumber: !item.phoneNumber ? msg : "",
            requestAccessPeopleAttachment:
            !item.requestAccessPeopleAttachment || item.requestAccessPeopleAttachment.length === 0
                ? "Please attach the file."
                : "",
        }));

        setRequestErrors(requestErrors);
        setPeopleErrors(peopleErrors);

        const isRequestValid = Object.values(requestErrors).every((v) => !v);
        const isPeopleValid = peopleErrors.every((p) =>
            Object.values(p).every((v) => !v)
        );

        const isValid = isRequestValid && isPeopleValid;
        console.log("isValid", isValid);

        return isValid;
    };

    const submitData = async () => {
        const data: SaveRequestAccessDto = {
            requestAccess: {
                id: id,
                requestNo: requestInfo.requestNo,
                buildingId: requestInfo.buildingId,
                floorId: requestInfo.floorId,
                areaId: requestInfo.areaId,
                accessDate: requestInfo.accessDate,
                note: requestInfo.note ?? "",
                accessStatusId: requestInfo.accessStatusId,
            },
            requestAccessPeople: peopleInfo,
            userId: userId
        };
        console.log("submit payload:", data);
        const newId = await saveRequestAccess(data);
    
        console.log("id", newId)
        setRequestId(newId);
    };

    const handleAfterDownloadQR = () => {
        if (!isSubmit) { return; }

        setProcessing(false);
        setIsOpenQr(false);
        setRequestId(0);

    }

    const handleSubmitRequest = async () => {
        try {
            const isValid = validateForm();
            if (!isValid) return;

            setProcessing(true);
            await submitData();
            toastSuccess("Data submitted successfully.");
            setIsOpenQr(true);
        } catch (error) {
            handleApiErrorWithRedirect(error, router);
        } finally {
            setTimeout(() => {
                setIsOpenQr(true);
            }, TOAST_DURATION_MS);
        }
    }

    const reviewData = async (act: string) => {
        const data: ChangeRequestAccessStatusDto = {
            requestNo: requestInfo.requestNo,
            remark: "",
            userId: userId,
            accessActivityId: act
        };
        console.log("submit payload:", data);
        await changeRequestAccessStatus(data);
    };

    const handleReviewRequest = async (act: string) => {
        try {
            setProcessing(true);
            setApproving(act === ACCESS_ACTIVITY.APPROVE);
            setRejecting(act === ACCESS_ACTIVITY.REJECT);
            await reviewData(act);
            toastSuccess("Operation completed successfully.");
            setTimeout(() => router.replace("/request-access"), TOAST_DURATION_MS);
        } catch (error) {
            handleApiErrorWithRedirect(error, router);
        } finally {
            setTimeout(() => {
                setProcessing(false);
                setApproving(false);
                setRejecting(false);
            }, TOAST_DURATION_MS);
        }
    }

    const disable = processing || !isSubmit;

    return (
        <form className="px-6 py-8 space-y-5">
            <RequestHeader
                id={id}
                title={`Request Access`} 
                requestNo={requestInfo.requestNo} 
                statusId={requestInfo.accessStatusId} 
                statusName={dataSource?.requestAccess?.accessStatusNameEN ?? ""}
                openQr={isOpenQr}
                isSubmit={isSubmit}
                onDownload={handleAfterDownloadQR}    
            />

            <div className="flex gap-5">
                <div className="grid w-2/6 space-y-5 h-fit">
                    <div className="w-full content-card !p-10 space-y-4">
                        <InputLayout label={"Access Date"} error={requestErrors.accessDate}>
                            <DatePicker
                                placeholder={"Access Date"}
                                disable={disable}
                                min={new Date()}
                                start={requestInfo.accessDate ? new Date(requestInfo.accessDate) : null}
                                end={requestInfo.accessDate ? new Date(requestInfo.accessDate) : null}
                                onChange={(e) => handleRequestMultiChange({
                                    accessDate: e.startDate ? formatDate(e.startDate, "YYYY-MM-DD") : ""
                                })}
                                invalid={!!requestErrors.accessDate}
                            />
                        </InputLayout>
                        <InputLayout label={"Building"} error={requestErrors.buildingId}>
                            <SelectField
                                id="select_buildingId"
                                name="buildingId"
                                disabled={disable}
                                value={String(requestInfo?.buildingId)}
                                options={buildingOption} 
                                selectAction={(e) => handleRequestMultiChange({
                                    buildingId: Number(e?.value),
                                    floorId: 0,
                                    areaId: 0
                                })}
                                error={requestErrors.buildingId}                 
                            />
                        </InputLayout>
                        <InputLayout label={"Floor"} error={requestErrors.floorId}>
                            <SelectField
                                id="select_floorId"
                                name="floorId"
                                disabled={disable}
                                value={String(requestInfo?.floorId)}
                                options={floorOption} 
                                selectAction={(e) => handleRequestMultiChange({
                                    floorId: Number(e?.value),
                                    areaId: 0
                                })}
                                error={requestErrors.floorId}                 
                            />
                        </InputLayout>
                        <InputLayout label={"Area"} error={requestErrors.areaId}>
                            <SelectField
                                id="select_areaId"
                                name="areaId"
                                disabled={disable}
                                value={requestInfo.areaId}
                                options={areaOption} 
                                selectAction={(e) => handleRequestMultiChange({areaId: Number(e?.value)})}
                                error={requestErrors.areaId}                 
                            />
                        </InputLayout>         
                        <InputLayout label={"Note"} isRequired={false} error={requestErrors.note}>
                            <textarea className={getInputClass(!!requestErrors.note)}
                                rows={5}
                                maxLength={1000}
                                disabled={disable}
                                onChange={(e) => handleRequestMultiChange({note: e.target.value})}
                                value={requestInfo.note ?? ""}
                            />
                        </InputLayout>
                    </div>
                </div>
                <div className="grid w-4/6">
                    <div className="w-full overflow-auto space-y-6">
                        {peopleInfo.map((item, index) => (
                        <div key={`k_${index}`} className="border-b content-card !p-10 space-y-6 relative">
                            { (!disable && peopleInfo.length > 1) &&
                            <button type="button" 
                                className="absolute -top-0 -right-0 pl-1 pb-1 w-14 h-14 text-theme_primary border-l border-b flex items-center justify-center rounded-rt-lg rounded-bl-lg hover:bg-theme_background"
                                onClick={() => handleRemovePeople(index)}>
                                <BiTrash size={16} />
                            </button> }

                            <div className="flex gap-4 mb-4">
                                <InputLayout label={"Gender"} error={peopleErros[index].genderId}>
                                    <SelectField
                                        id="select_genderId"
                                        name="genderId"
                                        disabled={disable}
                                        value={item.genderId}
                                        options={genderOption} 
                                        selectAction={(e) => handlePeopleMultiChange(index, {genderId: e?.value})}
                                        error={peopleErros[index].genderId}                 
                                    />
                                </InputLayout> 
                                <InputLayout label={"Firstname"} error={peopleErros[index].firstname}>
                                    <input className={getInputClass(!!peopleErros[index].firstname)}
                                        type="text"
                                        maxLength={100}
                                        disabled={disable}
                                        onChange={(e) => handlePeopleMultiChange(index, {firstname: e.target.value})}
                                        value={item.firstname}
                                    />
                                </InputLayout>
                                <InputLayout label={"Lastname"} error={peopleErros[index].lastname}>
                                    <input className={getInputClass(!!peopleErros[index].lastname)}
                                        type="text"
                                        maxLength={100}
                                        disabled={disable}
                                        onChange={(e) => handlePeopleMultiChange(index, {lastname: e.target.value})}
                                        value={item.lastname}
                                    />
                                </InputLayout>
                            </div>
                            <div className="flex gap-4 mb-4">
                                <InputLayout label={"Email"} isRequired={false} error={peopleErros[index].email}>
                                    <input className={getInputClass(!!peopleErros[index].email)}
                                        type="text"
                                        maxLength={100}
                                        disabled={disable}
                                        onChange={(e) => handlePeopleMultiChange(index, {email: e.target.value})}
                                        value={item.email}
                                    />
                                </InputLayout>
                                <InputLayout label={"Phone number"} error={peopleErros[index].phoneNumber}>
                                    <input className={getInputClass(!!peopleErros[index].phoneNumber)}
                                        type="text"
                                        maxLength={15}
                                        disabled={disable}
                                        onChange={(e) => handlePeopleMultiChange(index, {phoneNumber: e.target.value})}
                                        value={item.phoneNumber}
                                    />
                                </InputLayout>
                            </div>

                            <InputLayout label="Attachment" className="mb-6" error={peopleErros[index].requestAccessPeopleAttachment}>
                                { !disable &&
                                <Upload
                                    onUpload={(data) => handleUploadAttachment(index, data)} 
                                    multiple={true}
                                    accept={{
                                        "image/*": [],
                                        "application/pdf": [".pdf"]
                                    }}
                                /> }
                                <div className="mt-2">
                                    {item.requestAccessPeopleAttachment.map((e) => (
                                    <div key={e.filename} className="flex items-center gap-2 font-normal">
                                        {!disable ? (
                                            <IconButton className="text-theme_red" icon={<BiTrash />} onClick={() => handleRemoveAttachment(index, e.filename)}/>
                                            ) : (
                                            <AiOutlinePaperClip size={16} className="cursor-pointer text-theme_grey" />
                                        )}
                                        <button type="button" onClick={() => handleDownloadAttachment(e.base64, e.filename)}>{e.filename}</button>
                                    </div>
                                ))}
                                </div>
                            </InputLayout>
                        </div>
                        ))}

                        { !disable &&
                        <div className="w-full flex justify-end content-card">
                            <button type="button" className="secondary-button" onClick={handleAddPerson}>
                                Add Person
                            </button>
                        </div> }
                    </div>
                </div>
            </div>
            <div className="w-full flex justify-center gap-4">
                { !disable && <ActionButton type="button" className="primary-button w-52" label="Submit" onClick={() => handleSubmitRequest()}/> }
                { requestInfo.accessStatusId === ACCESS_STATUS.PENDING && 
                <>
                    <ActionButton type="button" className="approve-button w-52" label="Approve" pending={approving} onClick={() => handleReviewRequest(ACCESS_ACTIVITY.APPROVE)}/> 
                    <ActionButton type="button" className="reject-button w-52" label="Reject" pending={rejecting} onClick={() => handleReviewRequest(ACCESS_ACTIVITY.REJECT)}/> 
                </> }
            </div>
        </form>
    )
}