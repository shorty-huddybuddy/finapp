"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadStatement from "../../components/upload-statement";
import TransactionList from "../../components/transaction-list";
import BudgetSettings from "../../components/budget-settings";
import Analytics from "../../components/analytics";
import {Navbar2} from "../../components/Navbar2";

export default function ExpensePage() {
  const [activeTab, setActiveTab] = useState("upload");

  const handleUploadSuccess = () => {
    setActiveTab("transactions");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar2 />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Expense Tracker
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Manage your expenses, track transactions, and analyze your spending habits
          </p>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full flex justify-between mb-8 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              <TabsTrigger 
                value="upload" 
                className="flex-1 py-2.5 data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 data-[state=active]:shadow-sm rounded-md"
              >
                Upload Statement
              </TabsTrigger>
              <TabsTrigger 
                value="transactions" 
                className="flex-1 py-2.5 data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 data-[state=active]:shadow-sm rounded-md"
              >
                Transactions
              </TabsTrigger>
              <TabsTrigger 
                value="budget" 
                className="flex-1 py-2.5 data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 data-[state=active]:shadow-sm rounded-md"
              >
                Budget Settings
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="flex-1 py-2.5 data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 data-[state=active]:shadow-sm rounded-md"
              >
                Analytics
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-4">
              <TabsContent value="upload" className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <UploadStatement onSuccess={handleUploadSuccess} />
              </TabsContent>
              <TabsContent value="transactions" className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <TransactionList />
              </TabsContent>
              <TabsContent value="budget" className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <BudgetSettings />
              </TabsContent>
              <TabsContent value="analytics" className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <Analytics />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  );
}