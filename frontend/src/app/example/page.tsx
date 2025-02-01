import { Chatbot } from "@/components/Chatbot";
"use client"
import React from "react"
import { useAuth } from "@clerk/nextjs"

export default function ExamplePage() {
    return (
        <div className="flex items-center justify-center h-screen">
        <Chatbot />
        </div>
    );
}