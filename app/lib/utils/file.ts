import { Dispatch, SetStateAction } from "react";
import { ExportDto } from "../types";

function ensureFileExtension(filename: string, fileType: string): string {
  const defaultExtensions: Record<string, string> = {
    'application/pdf': '.pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'image/png': '.png',
    'image/jpeg': '.jpg',
    'text/plain': '.txt',
    'text/csv': '.csv'
  };

  const expectedExt = defaultExtensions[fileType];
  if (expectedExt && filename.toLowerCase().endsWith(expectedExt)) {
    return filename;
  }

  return filename + (expectedExt || '');
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        const base64 = result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };

    reader.onerror = () => {
      reject(new Error(reader.error?.message ?? 'File reading failed'));
    };

    reader.readAsDataURL(file);
  });
}

export function downloadBase64File(file: ExportDto) {
  const bstr = atob(file.base64);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  const blob = new Blob([u8arr], { type: file.fileType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = ensureFileExtension(file.filename, file.fileType ?? "");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadLocalFile(file: File) {
  const url = URL.createObjectURL(file);

  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

type ExportOptions = {
  api: () => Promise<ExportDto>;
  setLoading?: Dispatch<SetStateAction<boolean>>;
};

export const exportHandler = async ({
  api,
  setLoading,
}: ExportOptions) => {
  try {
    setLoading?.(true);
    const res = await api();
    downloadBase64File(res);
  } catch (error) {
    console.error("export failed:", error);
  } finally {
    setLoading?.(false);
  }
};
