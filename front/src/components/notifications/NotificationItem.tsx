import { AlertTriangle, CheckCircle } from "lucide-react";

type Props = {
  title: string;
  description: string;
  time: string;
  type: "warning" | "success";
};

export default function NotificationItem({
  title,
  description,
  time,
  type,
}: Props) {

  const isWarning = type === "warning";

  return (
    <div className="bg-[#1c2746] p-5 rounded-xl flex justify-between items-start mb-4">

      <div className="flex gap-4">

        <div className={`
          p-3 rounded-lg
          ${isWarning ? "bg-red-500/20" : "bg-green-500/20"}
        `}>
          {isWarning ? (
            <AlertTriangle className="text-red-400" />
          ) : (
            <CheckCircle className="text-green-400" />
          )}
        </div>

        <div>
          <h3 className="font-semibold">{title}</h3>

          <p className="text-sm text-gray-400 mt-1">
            {description}
          </p>

          <p className="text-xs text-gray-500 mt-2">
            {time}
          </p>
        </div>

      </div>

      <div className="flex items-center gap-3">

        {isWarning && (
          <button className="bg-yellow-400 text-black px-3 py-1 rounded-lg text-sm">
            Tomar Acción
          </button>
        )}

        <button className="text-gray-400 hover:text-white">
          ✕
        </button>

      </div>

    </div>
  );
}