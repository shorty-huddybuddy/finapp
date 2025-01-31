import React from "react"
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import {LineChart} from "lucide-react";

export function Navbar() { 

return(
<div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
    <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
        <LineChart className="h-6 w-6" />
        <span className="text-xl font-bold">FinanceHub</span>
        </div>
        <div className="hidden md:flex space-x-8">
        <a href="#features" className="hover:text-blue-200">
            Features
        </a>
        {/* Dropdown for Market Data */}
        <DropdownButton
            id="dropdown-basic-button"
            title="Market Data"
            // variant="link"
            className="text-white hover:text-blue-200"
        >
            <Dropdown.Item href="/stock-dashboard">Stocks</Dropdown.Item>
            <Dropdown.Item href="/finance-dashboard">
            Cryptocurrencies
            </Dropdown.Item>
        </DropdownButton>
        <a href="#testimonials" className="hover:text-blue-200">
            Testimonials
        </a>
        </div>
        <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-50 transition-colors">
        Get Started
        </button>
    </nav>

</div>
)}