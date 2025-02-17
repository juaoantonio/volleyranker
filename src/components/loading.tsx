import { LoaderCircle } from "lucide-react";

export function Loading() {
    return (
        <div className={"flex h-full items-center justify-center"}>
            <LoaderCircle className={"text-primary animate-spin"} />
        </div>
    );
}
