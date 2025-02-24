"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UploadStatement from "../../components/upload-statement";
import TransactionList from "../../components/transaction-list";
import BudgetSettings from "../../components/budget-settings";
import Analytics from "../../components/analytics";
export default function ExpensePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Expense Tracker</h1>
      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upload">Upload Statement</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="budget">Budget Settings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="upload" className="space-y-4">
          <UploadStatement />
        </TabsContent>
        <TabsContent value="transactions" className="space-y-4">
          <TransactionList />
        </TabsContent>
        <TabsContent value="budget" className="space-y-4">
          <BudgetSettings />
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Analytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
