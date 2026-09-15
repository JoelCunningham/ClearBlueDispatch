"use client";

import { useEffect } from "react";

export function HydrationTest() {
    useEffect(() => {
        console.log("Route page hydrated");
    }, []);

    return null;
}