"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTransactionStore } from "../hooks/store";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertTriangle,
  DollarSign,
  Check,
  PiggyBank,
  TrendingDown,
  ShieldAlert,
  BarChart,
  FileText,
  Edit,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BudgetSettings() {
  const { transactions } = useTransactionStore();
  const [budgets, setBudgets] = useState<Record<string, number>>({});
  const [editMode, setEditMode] = useState(true);
  const [showOnlyExpenseCategories, setShowOnlyExpenseCategories] =
    useState(true);

  // Categorize transactions by expense vs income
  const categorizedTransactions = useMemo(() => {
    const result = {
      expenseCategories: new Set<string>(),
      incomeCategories: new Set<string>(),
      all: new Set<string>(),
    };

    transactions.forEach((transaction) => {
      const category = transaction.category;
      result.all.add(category);

      if (transaction.amount < 0) {
        result.expenseCategories.add(category);
      } else {
        result.incomeCategories.add(category);
      }
    });

    return result;
  }, [transactions]);

  // Get filtered categories based on toggle
  const filteredCategories = useMemo(() => {
    if (showOnlyExpenseCategories) {
      return Array.from(categorizedTransactions.expenseCategories);
    }
    return Array.from(categorizedTransactions.all);
  }, [categorizedTransactions, showOnlyExpenseCategories]);

  // Calculate actual spending by category (absolute values)
  const spendingByCategory = useMemo(() => {
    return transactions.reduce((acc, transaction) => {
      // Initialize if not exists
      if (!acc[transaction.category]) {
        acc[transaction.category] = {
          spent: 0,
          type: transaction.amount >= 0 ? "income" : "expense",
        };
      }

      // For expenses (negative values), add the absolute value
      if (transaction.amount < 0) {
        acc[transaction.category].spent += Math.abs(transaction.amount);
        acc[transaction.category].type = "expense";
      }
      // For income (positive values), add as income
      else {
        acc[transaction.category].spent += transaction.amount;
        acc[transaction.category].type = "income";
      }

      return acc;
    }, {} as Record<string, { spent: number; type: "income" | "expense" }>);
  }, [transactions]);

  const handleBudgetChange = (category: string, amount: string) => {
    setBudgets((prev) => ({
      ...prev,
      [category]: Number.parseFloat(amount) || 0,
    }));
  };

  // Calculate budget status for expense categories
  const getBudgetStatus = (category: string) => {
    const budget = budgets[category] || 0;
    const spent = spendingByCategory[category]?.spent || 0;
    const isExpense = spendingByCategory[category]?.type === "expense";

    if (!isExpense || budget === 0)
      return { status: "no-budget", percentage: 0, remaining: 0 };

    const percentage = (spent / budget) * 100;

    if (percentage < 75) {
      return { status: "good", percentage, remaining: budget - spent };
    } else if (percentage < 100) {
      return { status: "warning", percentage, remaining: budget - spent };
    } else {
      return { status: "danger", percentage, remaining: budget - spent };
    }
  };

  // Calculate total budgeted amount and spending
  const totals = useMemo(() => {
    let totalBudgeted = 0;
    let totalSpent = 0;

    filteredCategories.forEach((category) => {
      totalBudgeted += budgets[category] || 0;
      if (spendingByCategory[category]?.type === "expense") {
        totalSpent += spendingByCategory[category]?.spent || 0;
      }
    });

    return { totalBudgeted, totalSpent };
  }, [filteredCategories, budgets, spendingByCategory]);

  // Get categories exceeding budget
  const categoriesExceedingBudget = useMemo(() => {
    return filteredCategories.filter((category) => {
      const budget = budgets[category] || 0;
      const spent = spendingByCategory[category]?.spent || 0;
      const isExpense = spendingByCategory[category]?.type === "expense";
      return isExpense && spent > budget && budget > 0;
    });
  }, [filteredCategories, budgets, spendingByCategory]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Budget Settings
          </h2>
          <p className="text-muted-foreground">
            Set budget limits for each spending category and track your
            progress.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Show only expense categories
          </span>
          <Switch
            checked={showOnlyExpenseCategories}
            onCheckedChange={setShowOnlyExpenseCategories}
          />
        </div>
      </div>

      {/* Budget Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100 dark:from-blue-950/50 dark:to-cyan-950/30 dark:border-blue-900/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300 flex items-center gap-2">
              <PiggyBank className="h-4 w-4" />
              Total Budgeted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ${totals.totalBudgeted.toFixed(2)}
            </div>
            <p className="text-xs text-blue-700/70 dark:text-blue-400/70 mt-1">
              {filteredCategories.filter((c) => budgets[c] > 0).length}{" "}
              categories with budget
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-100 dark:from-purple-950/50 dark:to-violet-950/30 dark:border-purple-900/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-300 flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Total Spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              ${totals.totalSpent.toFixed(2)}
            </div>
            <p className="text-xs text-purple-700/70 dark:text-purple-400/70 mt-1">
              {Math.round(
                (totals.totalSpent / Math.max(totals.totalBudgeted, 1)) * 100
              )}
              % of total budget
            </p>
          </CardContent>
        </Card>

        <Card
          className={`bg-gradient-to-br ${
            categoriesExceedingBudget.length === 0
              ? "from-green-50 to-emerald-50 border-green-100 dark:from-green-950/50 dark:to-emerald-950/30 dark:border-green-900/50"
              : "from-amber-50 to-orange-50 border-amber-100 dark:from-amber-950/50 dark:to-orange-950/30 dark:border-amber-900/50"
          }`}
        >
          <CardHeader className="pb-2">
            <CardTitle
              className={`text-sm font-medium flex items-center gap-2 ${
                categoriesExceedingBudget.length === 0
                  ? "text-green-800 dark:text-green-300"
                  : "text-amber-800 dark:text-amber-300"
              }`}
            >
              <ShieldAlert className="h-4 w-4" />
              Budget Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                categoriesExceedingBudget.length === 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-amber-600 dark:text-amber-400"
              }`}
            >
              {categoriesExceedingBudget.length}
            </div>
            <p
              className={`text-xs mt-1 ${
                categoriesExceedingBudget.length === 0
                  ? "text-green-700/70 dark:text-green-400/70"
                  : "text-amber-700/70 dark:text-amber-400/70"
              }`}
            >
              {categoriesExceedingBudget.length === 0
                ? "All budgets on track"
                : `${categoriesExceedingBudget.length} categories exceeding budget`}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="budgets" className="space-y-4">
        <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <TabsTrigger
            value="budgets"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
          >
            <FileText className="h-4 w-4 mr-2" />
            Budget Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="budgets">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3 bg-gray-50 dark:bg-gray-800/60 rounded-t-lg border-b border-gray-100 dark:border-gray-700 flex flex-row justify-between items-center">
              <div>
                <CardTitle>Category Budgets</CardTitle>
                <CardDescription>
                  Set and manage your spending limits by category
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditMode(!editMode)}
                className={
                  editMode
                    ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                    : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                }
              >
                {editMode ? (
                  <>
                    <Save className="h-4 w-4 mr-2" /> Save Budgets
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" /> Edit Budgets
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {filteredCategories.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="flex justify-center mb-3">
                      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full">
                        <DollarSign className="h-6 w-6 text-gray-400" />
                      </div>
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                      No categories found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-md mx-auto">
                      Upload a statement with transactions to start setting up
                      your budgets.
                    </p>
                  </div>
                ) : (
                  filteredCategories.map((category) => {
                    const spent = spendingByCategory[category]?.spent || 0;
                    const isExpense =
                      spendingByCategory[category]?.type === "expense";
                    const budgetStatus = getBudgetStatus(category);

                    return (
                      <div
                        key={category}
                        className="pb-5 border-b border-gray-100 dark:border-gray-700 last:border-0"
                      >
                        <div className="flex flex-wrap md:flex-nowrap justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2 min-w-[40%]">
                            <Badge
                              variant="outline"
                              className={
                                isExpense
                                  ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
                                  : "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
                              }
                            >
                              {isExpense ? "Expense" : "Income"}
                            </Badge>
                            <Label
                              htmlFor={category}
                              className="font-medium text-gray-800 dark:text-gray-200 capitalize"
                            >
                              {category}
                            </Label>
                          </div>

                          <div className="space-y-2 flex-1">
                            {isExpense && (
                              <>
                                {!editMode && budgets[category] > 0 && (
                                  <div className="w-full">
                                    <div className="flex justify-between text-sm mb-1">
                                      <span className="text-gray-600 dark:text-gray-400">
                                        ${spent.toFixed(2)} of $
                                        {budgets[category]?.toFixed(2)}
                                      </span>
                                      <span
                                        className={
                                          budgetStatus.status === "good"
                                            ? "text-green-600 dark:text-green-400"
                                            : budgetStatus.status === "warning"
                                            ? "text-amber-600 dark:text-amber-400"
                                            : budgetStatus.status === "danger"
                                            ? "text-red-600 dark:text-red-400"
                                            : "text-gray-600 dark:text-gray-400"
                                        }
                                      >
                                        {budgetStatus.percentage.toFixed(0)}%
                                      </span>
                                    </div>
                                    <Progress
                                      value={Math.min(
                                        budgetStatus.percentage,
                                        100
                                      )}
                                      className="h-2"
                                      // indicatorClassName={
                                      //   budgetStatus.status === "good"
                                      //     ? "bg-green-500"
                                      //     : budgetStatus.status === "warning"
                                      //     ? "bg-amber-500"
                                      //     : "bg-red-500"
                                      // }
                                    />
                                  </div>
                                )}
                              </>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right min-w-[100px]">
                              <span className="block text-sm font-medium">
                                {isExpense ? "Spent:" : "Earned:"}
                              </span>
                              <span
                                className={`text-base font-bold ${
                                  isExpense
                                    ? "text-red-600 dark:text-red-400"
                                    : "text-green-600 dark:text-green-400"
                                }`}
                              >
                                ${spent.toFixed(2)}
                              </span>
                            </div>

                            {(isExpense || !showOnlyExpenseCategories) && (
                              <div className="min-w-[150px]">
                                {editMode ? (
                                  <Input
                                    id={category}
                                    type="number"
                                    min="0"
                                    placeholder="Set budget"
                                    value={budgets[category] || ""}
                                    onChange={(e) =>
                                      handleBudgetChange(
                                        category,
                                        e.target.value
                                      )
                                    }
                                    className="border-gray-200 dark:border-gray-700"
                                  />
                                ) : (
                                  <div className="text-right">
                                    <span className="block text-sm font-medium">
                                      Budget:
                                    </span>
                                    <span className="text-base font-bold text-blue-600 dark:text-blue-400">
                                      ${(budgets[category] || 0).toFixed(2)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {isExpense &&
                          !editMode &&
                          budgetStatus.status === "danger" && (
                            <Alert
                              variant="destructive"
                              className="mt-2 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                            >
                              <AlertTriangle className="h-4 w-4" />
                              <AlertTitle>Budget Exceeded</AlertTitle>
                              <AlertDescription className="text-sm">
                                You've exceeded your {category} budget by $
                                {Math.abs(budgetStatus.remaining).toFixed(2)} (
                                {(budgetStatus.percentage - 100).toFixed(1)}%
                                over).
                                <br />
                                <span className="block mt-1 text-xs">
                                  Tip: Look for ways to reduce {category}{" "}
                                  expenses or adjust your budget.
                                </span>
                              </AlertDescription>
                            </Alert>
                          )}
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 dark:bg-gray-800/60 border-t border-gray-100 dark:border-gray-700 rounded-b-lg">
              <div className="w-full flex flex-col md:flex-row justify-between gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredCategories.length} categories displayed •{" "}
                  {filteredCategories.filter((c) => budgets[c] > 0).length} with
                  budget
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Good
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Warning
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Over Budget
                    </span>
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="pb-3 bg-gray-50 dark:bg-gray-800/60 rounded-t-lg border-b border-gray-100 dark:border-gray-700">
              <CardTitle>Budget Analytics</CardTitle>
              <CardDescription>
                Visual analysis of your spending vs. budgets
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="text-center py-8">
                  <div className="flex justify-center mb-3">
                    <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-full">
                      <BarChart className="h-6 w-6 text-purple-500 dark:text-purple-400" />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                    Budget analytics will appear here
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-md mx-auto">
                    Set budget limits for your expense categories to see
                    detailed analytics and reports.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
