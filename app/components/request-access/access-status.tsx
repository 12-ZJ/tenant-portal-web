import { getStatusStyle } from "@/app/lib/utils";

interface Props {
  id: string;
  name: string;
  showIcon?: boolean;
  showDefault?: boolean;
}

const AccessStatus = ({ id, name, showIcon = true, showDefault = true}: Props) => {
  const { bg, text, border, icon: Icon } = getStatusStyle(id);

  return (
    <>{(!!id || showDefault) &&
      <div
        className="rounded-md min-w-20 px-2 py-1 grid grid-flow-col items-center justify-center gap-2 border-[1.5px] font-medium"
        style={{ backgroundColor: bg, color: text, borderColor: border }}
      >
        {showIcon && <Icon size={14} />}
        {name || "Pending"}
      </div>
    }</>
  );
};

export default AccessStatus;
