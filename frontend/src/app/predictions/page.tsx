// pages/index.js
'use client'
import React from "react";
import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import PredictionChart from "../../components/PredictionChart";

export default function Prediction() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Navbar/><br /><br />
      <div className="max-w-4xl mx-auto">
        < PredictionChart />
      </div>
      <br /><br /><Footer/>
    </div>
  );
}