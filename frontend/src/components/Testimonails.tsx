import React from "react";

export function Testimonails(){
return (
    <section id="testimonials" className="py-20 bg-gray-50">
    <div className="container mx-auto px-6">
    <h2 className="text-3xl font-bold text-center mb-16">
        Success Stories
    </h2>
    <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="flex items-center mb-4">
            <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100"
            alt="Sarah Johnson"
            className="w-12 h-12 rounded-full mr-4"
            />
            <div>
            <h4 className="font-semibold">Sarah Johnson</h4>
            <p className="text-gray-600">Investment Analyst</p>
            </div>
        </div>
        <p className="text-gray-700">
            "The AI-powered insights have revolutionized my investment
            strategy. The platform's ability to analyze market trends and
            provide actionable recommendations is incredible."
        </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="flex items-center mb-4">
            <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100"
            alt="Mark Thompson"
            className="w-12 h-12 rounded-full mr-4"
            />
            <div>
            <h4 className="font-semibold">Mark Thompson</h4>
            <p className="text-gray-600">Small Business Owner</p>
            </div>
        </div>
        <p className="text-gray-700">
            "As someone new to investing, the AI-driven learning resources
            have been invaluable. I've gained confidence in making financial
            decisions."
        </p>
        </div>
    </div>
    </div>
    </section>
)}
