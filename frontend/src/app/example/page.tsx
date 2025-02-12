"use client"
import { Chatbot } from "@/components/Chatbot";
import React from "react"
import { useAuth } from "@clerk/nextjs"






export default function ExamplePage() {
    return (
        <div className="flex items-center justify-center h-screen">
        <Chatbot />
        </div>
    );
}