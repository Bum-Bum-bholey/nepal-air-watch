import { AlertCircle, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertBannerProps {
  type: "info" | "success" | "warning" | "danger";
  title: string;
  message: string;
  className?: string;
}

const alertConfig = {
  info: {
    icon: AlertCircle,
    bgColor: "bg-blue-500/10 border-blue-500/20",
    textColor: "text-blue-700 dark:text-blue-300",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-500/10 border-green-500/20",
    textColor: "text-green-700 dark:text-green-300",
    iconColor: "text-green-600 dark:text-green-400",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-yellow-500/10 border-yellow-500/20",
    textColor: "text-yellow-700 dark:text-yellow-300",
    iconColor: "text-yellow-600 dark:text-yellow-400",
  },
  danger: {
    icon: XCircle,
    bgColor: "bg-red-500/10 border-red-500/20",
    textColor: "text-red-700 dark:text-red-300",
    iconColor: "text-red-600 dark:text-red-400",
  },
};

const AlertBanner = ({ type, title, message, className }: AlertBannerProps) => {
  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <div className={cn("rounded-xl border p-4", config.bgColor, className)}>
      <div className="flex items-start space-x-3">
        <Icon className={cn("mt-0.5 h-5 w-5 flex-shrink-0", config.iconColor)} />
        <div className="flex-1 space-y-1">
          <h4 className={cn("font-semibold", config.textColor)}>{title}</h4>
          <p className={cn("text-sm", config.textColor)}>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default AlertBanner;
