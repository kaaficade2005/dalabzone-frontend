"use client";

import React from "react";

export default function Loader({
    size = 40,
    className = "",
}: {
    size?: number;
    className?: string;
}) {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div
                style={{ width: size, height: size }}
                className="border-4 border-muted border-t-primary rounded-full animate-spin"
            />
        </div>
    );
}
