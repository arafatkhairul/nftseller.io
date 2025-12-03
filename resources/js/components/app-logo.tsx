import { cn } from "@/lib/utils";
import { ImgHTMLAttributes } from "react";

export default function AppLogo({ className, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <div className={cn("flex items-center justify-center", className)}>
            <img
                src="/logo.png"
                alt="NFTSeller Logo"
                className="h-8 w-auto object-contain"
                {...props}
            />
        </div>
    );
}
