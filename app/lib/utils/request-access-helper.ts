import { ACCESS_STATUS } from "@/app/lib/constants";
import { IconType } from "react-icons";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaRegCircleXmark, FaRegPaperPlane, FaRegPenToSquare } from "react-icons/fa6";

type StatusStyle = {
  bg: string;
  text: string;
  border: string;
  icon: IconType;
};

export const getStatusStyle = (status?: string): StatusStyle => {
  switch (status) {
    case undefined:
      return { bg: "#e1e6e8", text: "#8c9396", border: "#8c9396", icon: FaRegPenToSquare };
    case ACCESS_STATUS.PENDING:
      return { bg: "#eee0c8", text: "#d89f3d", border: "#d89f3d", icon: FaRegPaperPlane };
    case ACCESS_STATUS.REJECT:
      return { bg: "#f5cccb", text: "#be3c3a", border: "#be3c3a", icon: FaRegCircleXmark };
    case ACCESS_STATUS.APPROVE:
      return { bg: "#c8f5eb", text: "#0f9477", border: "#0f9477", icon: FaRegCheckCircle };
    default:
      return { bg: "#e1e6e8", text: "#8c9396", border: "#8c9396", icon: FaRegPenToSquare };
  }
};