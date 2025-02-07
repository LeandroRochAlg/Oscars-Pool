import { Key } from "react";

const NomineeCardSkeleton = () => {
    return (
        <>
            {Array.from({ length: 5 }).map((_: any, index: Key | null | undefined) => (
                <div key={index} className="flex w-52 flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <div className="skeleton h-32 my-1 md:h-24 w-24 min-w-24 md:w-20 md:min-w-20 shrink-0 rounded-xl"></div>
                        <div className="flex flex-col gap-4">
                            <div className="skeleton h-4 w-20"></div>
                            <div className="skeleton h-4 w-28"></div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

export default NomineeCardSkeleton;