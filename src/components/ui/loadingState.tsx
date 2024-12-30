import { SVGProps } from "@/types/props.type"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react";

interface LoadingStateProps extends SVGProps {
    loadingText?: string;
    hideLoaderIcon?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ hideLoaderIcon, loadingText, className, ...props }): React.ReactElement => {
    return (
        <>
            {!hideLoaderIcon && (
                <Loader2
                    className={cn(`mr-2 h-4 2-4 animate-spin`, className)}
                    {...props}
                />
            )}
            {loadingText && <p>{loadingText}</p>}
        </>
    )
}