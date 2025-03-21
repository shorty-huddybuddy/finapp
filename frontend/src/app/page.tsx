"use client";
import React, { useEffect, useState } from "react";
import {ArrowRight, Users, MessageSquare, TrendingUp, Share2, ArrowUp} from "lucide-react";
import { Chatbot } from "../components/Chatbot";
import { MarketWidgets } from "../components/MarketWidgets";
import {Footer} from "../components/Footer";
import {Testimonails} from "../components/Testimonails";  
import {Features} from "../components/Features_2";
import "bootstrap/dist/css/bootstrap.min.css";
import { Header } from "../components/Header";
import { Navbar } from "../components/Navbar";
import Link from "next/link";
import { PageTransition } from "../components/page-transition";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

function App() {
  return (
    <div>
      <PageTransition>
        <Navbar/>
        <div className="min-h-screen bg-white">
          {/* Market Ticker */}
          {/* <MarketTicker /> */}

          {/* Hero Section */}
          <Header/>

          {/* Features Section */}
          <Features/>

          {/* Market Data Section */}
          <MarketWidgets />

          {/* New Social Trading Section */}
          <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-blue-900 mb-4">Social Trading Features</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Connect with fellow traders, share insights, and learn from the community
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <Users className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Community Trading</h3>
                  <p className="text-gray-600">Follow successful traders and replicate their winning strategies</p>
                </div>

                <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <MessageSquare className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Live Discussions</h3>
                  <p className="text-gray-600">Engage in real-time conversations about market trends and opportunities</p>
                </div>

                <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <TrendingUp className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Performance Tracking</h3>
                  <p className="text-gray-600">Track and showcase your trading performance to build credibility</p>
                </div>

                <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <Share2 className="w-12 h-12 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Share Analysis</h3>
                  <p className="text-gray-600">Share your technical analysis and trading ideas with the community</p>
                </div>
              </div>

              <div className="text-center mt-12">
                <Link href="/social" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors">
                  Join the Trading Community
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </section>

          <Testimonails/>
          
          {/* CTA Section */}
          <section className="bg-blue-600 text-white py-20">
            <div className="container mx-auto px-6 text-center">
              <h2 className="text-3xl font-bold mb-8">
                Ready to Transform Your Financial Journey?
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Join thousands of investors who are leveraging AI to make smarter
                financial decisions and achieve their goals.
              </p>
              <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors inline-flex items-center">
                Start Your AI-Powered Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </section>

          <ScrollToTop />
          <Footer/>
          <Chatbot />
        </div>
      </PageTransition>
    </div>
  );
}

export default App;
