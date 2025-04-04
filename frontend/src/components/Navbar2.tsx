"use client";
import React, { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import {
  LineChart,
  Menu,
  X,
  Users,
  Calendar,
  Brain,
  Wallet,
  GraduationCap,
  BarChart,
  LineChart as ChartLineUp, // Use LineChart as ChartLineUp since the icon doesn't exist
} from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { motion } from "framer-motion";

import Head from "next/head";

export function Navbar2() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Add useEffect to ensure proper initialization
  useEffect(() => {
    // Force re-render of dropdown elements
    const dropdownElements = document.querySelectorAll(".dropdown-toggle");
    dropdownElements.forEach((el) => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const parent = el.parentElement;
        if (parent) {
          const menu = parent.querySelector(".dropdown-menu");
          if (menu) {
            menu.classList.toggle("show");
          }
        }
      });
    });

    // Close dropdowns when clicking outside
    document.addEventListener("click", () => {
      document.querySelectorAll(".dropdown-menu.show").forEach((menu) => {
        menu.classList.remove("show");
      });
    });

    // Add custom styles for links and font
    const style = document.createElement("style");
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
      
      .navbar-font {
        font-family: 'Poppins', sans-serif;
      }
      
      .navbar-font a {
        text-decoration: none !important;
      }
      
      .dropdown-toggle::after {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      // Cleanup event listeners and styles
      document.querySelectorAll(".dropdown-toggle").forEach((el) => {
        el.removeEventListener("click", () => {});
      });
      document.removeEventListener("click", () => {});
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg relative navbar-font">
        <motion.nav
          initial="hidden"
          animate="visible"
          variants={navVariants}
          className="gap-4 container mx-auto px-6 py-4 flex justify-between items-center"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center space-x-3"
          >
            <LineChart className="h-7 w-7 text-blue-200" />
            <span className="text-2xl font-bold tracking-tight">
              FinAura
            </span>
          </motion.div>

          {/* Mobile menu button */}
          <motion.button
            variants={itemVariants}
            className="md:hidden focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </motion.button>

          {/* Desktop Navigation - Fixed the className to remove 'hidden' */}
          <motion.div
            variants={navVariants}
            className="hidden md:flex items-center space-x-4"
          >
            <motion.a
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              href="/"
              className="text-blue-100 transition-all duration-300 font-medium no-underline flex items-center gap-2 whitespace-nowrap"
            >
              <LineChart className="w-4 h-4" />
              Home
            </motion.a>

            <motion.a
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              href="/social"
              className="text-blue-100 transition-all duration-300 font-medium no-underline flex items-center gap-2 whitespace-nowrap"
            >
              <Users className="w-4 h-4" />
              Social Trading
            </motion.a>

            <motion.div
              variants={itemVariants}
              className="relative group"
              style={{ zIndex: 1050 }}
            >
              <button className="flex items-center text-blue-100 hover:text-white transition-all duration-300 font-medium gap-2 whitespace-nowrap">
                <BarChart className="w-4 h-4" />
                Market Data
                <svg
                  className="ml-1 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <a
                  href="/stock-dashboard"
                  className="block px-4 py-2 text-gray-800 hover:bg-blue-100 no-underline"
                >
                  Stocks
                </a>
                <a
                  href="/finance-dashboard"
                  className="block px-4 py-2 text-gray-800 hover:bg-blue-100 no-underline"
                >
                  Cryptocurrencies
                </a>
              </div>
            </motion.div>

            <motion.a
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              href="/calendar"
              className="text-blue-100 transition-all duration-300 font-medium no-underline flex items-center gap-2 whitespace-nowrap"
            >
              <Calendar className="w-4 h-4" />
              Calendar
            </motion.a>

            <motion.a
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              href="/ai_landing"
              className="text-blue-100 transition-all duration-300 font-medium no-underline flex items-center gap-2 whitespace-nowrap"
            >
              <Brain className="w-4 h-4" />
              AI Tools
            </motion.a>

            <motion.a
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              href="/portfolio"
              className="text-blue-100 transition-all duration-300 font-medium no-underline flex items-center gap-2 whitespace-nowrap"
            >
              <Wallet className="w-4 h-4" />
              Portfolio
            </motion.a>

            <motion.a
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              href="/education"
              className="text-blue-100 transition-all duration-300 font-medium no-underline flex items-center gap-2 whitespace-nowrap"
            >
              <GraduationCap className="w-4 h-4" />
              Education
            </motion.a>

            <motion.a
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              href="/predictions"
              className="text-blue-100 transition-all duration-300 font-medium no-underline flex items-center gap-2 whitespace-nowrap"
            >
              <ChartLineUp className="w-4 h-4" />
              Predictions
            </motion.a>
          </motion.div>

          {/* Desktop Auth Button - Enhanced */}
          <motion.div
            variants={itemVariants}
            className="hidden md:flex items-center space-x-4"
          >
            {" "}
            {/* Added space-x-4 for spacing */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-white text-blue-700 px-6 py-2 rounded-full font-semibold hover:bg-blue-50 hover:shadow-lg transition-all duration-300 whitespace-nowrap">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    rootBox: "w-10 h-10",
                    userButtonAvatarBox: "w-10 h-10",
                    userButtonTrigger: "hover:opacity-80 transition-opacity",
                    userButtonPopoverCard: "shadow-xl",
                    userButtonPopoverActionButton: "hover:bg-blue-50",
                    userButtonPopoverActionButtonText: "font-medium",
                    userButtonPopoverFooter: "hidden",
                  },
                  variables: {
                    colorPrimary: "#1d4ed8",
                  },
                }}
              />
            </SignedIn>
          </motion.div>
        </motion.nav>

        {/* Mobile menu with improved animation */}
        <motion.div
          animate={{
            height: isMenuOpen ? "auto" : 0,
            opacity: isMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className={`md:hidden overflow-hidden bg-blue-800 shadow-lg px-6 py-2`}
          style={{ zIndex: 1040 }}
        >
          <a
            href="/"
            className="block py-3 text-blue-100 hover:text-white border-b border-blue-700 no-underline"
          >
            <div className="flex items-center">
              <LineChart className="w-4 h-4 mr-2" />
              Home
            </div>
          </a>

          {/* Add Social Trading to mobile menu */}
          <a
            href="/social"
            className="block py-3 text-blue-100 hover:text-white border-b border-blue-700 no-underline"
          >
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Social Trading
            </div>
          </a>

          <div className="py-2 border-b border-blue-700">
            <Dropdown className="w-full">
              <Dropdown.Toggle
                variant="link"
                id="mobile-dropdown"
                className="p-0 py-1 text-blue-100 hover:text-white no-underline flex items-center"
              >
                <BarChart className="w-4 h-4 mr-2" />
                Market Data
              </Dropdown.Toggle>
              <Dropdown.Menu
                style={{
                  backgroundColor: "#1e40af",
                  border: "none",
                  width: "100%",
                }}
              >
                <Dropdown.Item
                  href="/stock-dashboard"
                  style={{ color: "white" }}
                  className="hover:bg-blue-700 py-2 no-underline"
                >
                  Stocks
                </Dropdown.Item>
                <Dropdown.Item
                  href="/finance-dashboard"
                  style={{ color: "white" }}
                  className="hover:bg-blue-700 py-2 no-underline"
                >
                  Cryptocurrencies
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <a
            href="/calendar"
            className="block py-3 text-blue-100 hover:text-white border-b border-blue-700 no-underline"
          >
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Calendar
            </div>
          </a>
          <a
            href="/ai_landing"
            className="block py-3 text-blue-100 hover:text-white border-b border-blue-700 no-underline"
          >
            <div className="flex items-center">
              <Brain className="w-4 h-4 mr-2" />
              AI Tools
            </div>
          </a>
          <a
            href="/portfolio"
            className="block py-3 text-blue-100 hover:text-white border-b border-blue-700 no-underline"
          >
            <div className="flex items-center">
              <Wallet className="w-4 h-4 mr-2" />
              Portfolio
            </div>
          </a>
          <a
            href="/education"
            className="block py-3 text-blue-100 hover:text-white border-b border-blue-700 no-underline"
          >
            <div className="flex items-center">
              <GraduationCap className="w-4 h-4 mr-2" />
              Education
            </div>
          </a>
          <a
            href="/prediction"
            className="block py-3 text-blue-100 hover:text-white border-b border-blue-700 no-underline"
          >
            <div className="flex items-center">
              <ChartLineUp className="w-4 h-4 mr-2" />
              Predictions
            </div>
          </a>

          {/* Mobile Auth Button - Enhanced */}
          <div className="my-4 flex justify-center">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="w-full bg-white text-blue-700 px-6 py-2 rounded-full font-semibold hover:bg-blue-50 hover:shadow transition-colors">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    rootBox: "w-10 h-10",
                    userButtonAvatarBox: "w-10 h-10",
                    userButtonTrigger: "hover:opacity-80 transition-opacity",
                    userButtonPopoverCard: "shadow-xl",
                    userButtonPopoverActionButton: "hover:bg-blue-50",
                    userButtonPopoverActionButtonText: "font-medium",
                    userButtonPopoverFooter: "hidden",
                  },
                  variables: {
                    colorPrimary: "#1d4ed8",
                  },
                }}
              />
            </SignedIn>
          </div>
        </motion.div>
      </div>
    </>
  );
}