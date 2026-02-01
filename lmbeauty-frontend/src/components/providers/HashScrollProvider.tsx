"use client";

import {useHashScroll} from "@/hooks/useHashScroll";

export function HashScrollProvider({children}: { children: React.ReactNode }) {
    useHashScroll();
    return <>{children}</>;
}
