// import React from "react"
// import DropdownButton from "react-bootstrap/DropdownButton";
// import Dropdown from "react-bootstrap/Dropdown";
// import {LineChart} from "lucide-react";

// export function Navbar() { 

// return(
// <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
//     <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
//         <div className="flex items-center space-x-2">
//         <LineChart className="h-6 w-6" />
//         <span className="text-xl font-bold">FinanceHub</span>
//         </div>
//         <div className="hidden md:flex space-x-8">  
//             <a href="#features" className="hover:text-black-1200">
//                 Features
//             </a>
//             {/* Dropdown for Market Data */}
//             <DropdownButton
//                 id="dropdown-basic-button"
//                 title="Market Data"
//                 // variant="link"
//                 className="text-white hover:text-white-200" >
//                 <Dropdown.Item href="/stock-dashboard">Stocks</Dropdown.Item>
//                 <Dropdown.Item href="/finance-dashboard">Cryptocurrencies</Dropdown.Item>
//             </DropdownButton>
//             <a href="/calendar"> Calender </a>
//             <a href="/ai_tools"> AI Tools </a>
//             <a href="/portfolio"> Portfolio </a>
//             <a href="/edu"> Education </a>
//             {/* <a href="#testimonials" className="hover:text-white-800">
//                 Testimonials
//             </a> */}

//         </div>  
//         <button className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-50 transition-colors">
//         Get Started
//         </button>
//     </nav>

// </div>
// )}
"use client"

import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  
  function Navbar() {
    return (
      // <Breadcrumb className="bg-black text-white px-20 py-5 text-lg">
    <nav className="container bg-blue mx-auto px-6 py-4 flex justify-between items-center">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">FinanceHub</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <DropdownMenu>
              <DropdownMenuTrigger className="hover:text-foreground">
                <BreadcrumbEllipsis />
                <span className="sr-only">Toggle menu</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <a href="/stock-dashboard">Stocks</a>
                </DropdownMenuItem> 
                <DropdownMenuItem asChild>
                  <a href="/finance-dashboard"> Cryptocurrencies </a>
                </DropdownMenuItem>
                {/* <DropdownMenuItem asChild>
                  <a href="#">GitHub</a>                        
                </DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/ai_landing">AI Tools</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/calendar">Calendar</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/portfolio">Portfolio </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/education">Education</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {/* <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem> */}
        </BreadcrumbList>
      </Breadcrumb>
      </nav>
    );
  }
  
  export { Navbar };
  