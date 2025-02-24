"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTransactionStore } from "../hooks/store";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function BudgetSettings() {
  const { transactions } = useTransactionStore();
  const [budgets, setBudgets] = useState<Record<string, number>>({});

  // Get unique categories
  const categories = Array.from(new Set(transactions.map((t) => t.category)));

  // Calculate actual spending by category
  const spendingByCategory = transactions.reduce((acc, transaction) => {
    acc[transaction.category] =
      (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const handleBudgetChange = (category: string, amount: string) => {
    setBudgets((prev) => ({
      ...prev,
      [category]: Number.parseFloat(amount) || 0,
    }));
  };

  // Calculate overspending
  const getOverspending = (category: string) => {
    const budget = budgets[category] || 0;
    const spent = spendingByCategory[category] || 0;
    return spent > budget ? spent - budget : 0;
  };

  const getOverspendingPercentage = (category: string) => {
    const budget = budgets[category] || 0;
    const spent = spendingByCategory[category] || 0;
    return budget > 0 ? ((spent - budget) / budget) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Budget Settings</h2>
        <p className="text-muted-foreground">
          Set budget limits for each spending category.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Set Budget Limits</CardTitle>
            <CardDescription>
              Enter your monthly budget for each category
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {categories.map((category) => (
              <div key={category} className="space-y-2">
                <Label htmlFor={category}>{category}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id={category}
                    type="number"
                    placeholder="Enter budget amount"
                    value={budgets[category] || ""}
                    onChange={(e) =>
                      handleBudgetChange(category, e.target.value)
                    }
                  />
                  <span className="text-sm text-muted-foreground w-32">
                    Spent: ${spendingByCategory[category]?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget Alerts</CardTitle>
            <CardDescription>
              View categories where you've exceeded your budget
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {categories.map((category) => {
              const overspending = getOverspending(category);
              const percentage = getOverspendingPercentage(category);

              if (overspending > 0) {
                return (
                  <Alert key={category} variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Overspending in {category}</AlertTitle>
                    <AlertDescription>
                      You've exceeded your budget by ${overspending.toFixed(2)}{" "}
                      ({percentage.toFixed(1)}%)
                      <br />
                      <span className="text-sm">
                        Suggestion: Try to reduce {category} expenses by looking
                        for better deals or alternatives.
                      </span>
                    </AlertDescription>
                  </Alert>
                );
              }
              return null;
            })}
            {!categories.some((category) => getOverspending(category) > 0) && (
              <p className="text-center text-muted-foreground">
                No budget alerts at this time.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
