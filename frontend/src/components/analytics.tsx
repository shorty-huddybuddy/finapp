"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useTransactionStore } from "../hooks/store";
import {
  LineChart,
  PieChart,
  Pie,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { format, startOfMonth, parseISO, isValid, subMonths } from "date-fns";
import { ArrowDown, ArrowUp, CreditCard, DollarSign, TrendingDown, TrendingUp, BarChart3 } from "lucide-react";
import { Transaction } from "@/types/transaction";

interface AnalyticsSummary {
  income: number;
  expenses: number;
  balance: number;
  savingsRate: number;
}

export default function Analytics() {
  const { transactions } = useTransactionStore();

  const [summary, setSummary] = useState<AnalyticsSummary>({
    income: 0,
    expenses: 0,
    balance: 0,
    savingsRate: 0,
  });

  // Format transactions data
  const processedTransactions = useMemo(() => {
    return transactions.map(t => ({
      ...t,
      // Ensure date is properly parsed
      parsedDate: isValid(parseISO(t.date)) ? parseISO(t.date) : new Date(),
      // For spending, convert positive amounts to negative (expenses)
      spendingAmount: t.amount < 0 ? Math.abs(t.amount) : 0,
      // For income, keep only positive amounts
      incomeAmount: t.amount > 0 ? t.amount : 0
    }));
  }, [transactions]);

  // Calculate spending by category (only expenses)
  const spendingByCategory = useMemo(() => {
    const expensesByCategory = processedTransactions.reduce((acc, transaction) => {
      if (transaction.amount < 0) {
        const category = transaction.category;
        acc[category] = (acc[category] || 0) + Math.abs(transaction.amount);
      }
      return acc;
    }, {} as Record<string, number>);

    // Sort by amount (highest first) and take top 5
    return Object.entries(expensesByCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([category, amount], index) => ({
        category,
        amount,
        color: getChartColor(index)
      }));
  }, [processedTransactions]);

  // Calculate monthly spending
  const monthlyData = useMemo(() => {
    // Get last 6 months
    const months = Array.from({ length: 6 }, (_, i) => 
      startOfMonth(subMonths(new Date(), i))
    ).reverse();
    
    // Initialize with zero values
    const monthlyTotals = months.reduce((acc, month) => {
      const monthKey = format(month, 'MMM yyyy');
      acc[monthKey] = { expenses: 0, income: 0 };
      return acc;
    }, {} as Record<string, { expenses: number, income: number }>);
    
    // Fill in the data
    processedTransactions.forEach(transaction => {
      const monthKey = format(transaction.parsedDate, 'MMM yyyy');
      if (monthlyTotals[monthKey]) {
        if (transaction.amount < 0) {
          monthlyTotals[monthKey].expenses += Math.abs(transaction.amount);
        } else {
          monthlyTotals[monthKey].income += transaction.amount;
        }
      }
    });
    
    // Convert to array for chart
    return Object.entries(monthlyTotals).map(([month, data]) => ({
      month,
      expenses: data.expenses,
      income: data.income,
      savings: data.income - data.expenses
    }));
  }, [processedTransactions]);

  // Calculate total income, expenses and balance
  const calculateSummary = (transactions: Transaction[]) => {
    const summary = transactions.reduce(
      (acc, transaction) => ({
        income: acc.income + (transaction.type === 'income' ? transaction.amount : 0),
        expenses: acc.expenses + (transaction.type === 'expense' ? transaction.amount : 0),
        balance: 0,
        savingsRate: 0
      }),
      { income: 0, expenses: 0, balance: 0, savingsRate: 0 }
    );
    
    summary.balance = summary.income - summary.expenses;
    summary.savingsRate = summary.income > 0 
      ? (summary.balance / summary.income * 100) 
      : 0;

    return summary;
  };

  const financialSummary = useMemo(() => {
    const summary = processedTransactions.reduce(
      (acc, t) => {
        if (t.amount < 0) {
          acc.expenses += Math.abs(t.amount);
        } else {
          acc.income += t.amount;
        }
        return acc;
      },
      { income: 0, expenses: 0, balance: 0, savingsRate: 0 }
    );
    
    summary.balance = summary.income - summary.expenses;
    summary.savingsRate = summary.income > 0 
      ? (summary.balance / summary.income * 100) 
      : 0;
    
    return summary;
  }, [processedTransactions]);

  // Get top expense transaction
  const topExpense = useMemo(() => {
    return processedTransactions
      .filter(t => t.amount < 0)
      .sort((a, b) => a.amount - b.amount)[0];
  }, [processedTransactions]);

  // Get repeated expenses (patterns)
  const repeatedExpenses = useMemo(() => {
    const expenseMap: Record<string, number> = {};
    
    processedTransactions.forEach(t => {
      if (t.amount < 0) {
        // Look for common patterns in descriptions
        const desc = t.description.toLowerCase();
        Object.keys(expenseMap).forEach(key => {
          if (desc.includes(key.toLowerCase())) {
            expenseMap[key] += 1;
          }
        });
        
        // Add new entries
        if (!Object.keys(expenseMap).some(key => desc.includes(key.toLowerCase()))) {
          expenseMap[t.description] = 1;
        }
      }
    });
    
    // Get top repeated expenses
    return Object.entries(expenseMap)
      .filter(([_, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([description, count]) => ({ description, count }));
  }, [processedTransactions]);

  // Get chart colors
  function getChartColor(index: number) {
    const colors = [
      '#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', 
      '#d0ed57', '#ffc658', '#ff8042', '#ff6361', '#bc5090'
    ];
    return colors[index % colors.length];
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Financial Analytics</h2>
        <p className="text-muted-foreground">
          Insights and patterns from your transaction history.
        </p>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100 dark:from-green-950/50 dark:to-emerald-950/30 dark:border-green-900/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-300 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(financialSummary.income)}
            </div>
            <p className="text-xs text-green-700/70 dark:text-green-400/70 mt-1">
              All earnings and deposits
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-100 dark:from-red-950/50 dark:to-rose-950/30 dark:border-red-900/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-800 dark:text-red-300 flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(financialSummary.expenses)}
            </div>
            <p className="text-xs text-red-700/70 dark:text-red-400/70 mt-1">
              All outgoing transactions
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 dark:from-blue-950/50 dark:to-indigo-950/30 dark:border-blue-900/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Net Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(financialSummary.balance)}
            </div>
            <p className="text-xs text-blue-700/70 dark:text-blue-400/70 mt-1">
              Income minus expenses
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-100 dark:from-purple-950/50 dark:to-violet-950/30 dark:border-purple-900/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-300 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Savings Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {financialSummary.savingsRate.toFixed(1)}%
            </div>
            <p className="text-xs text-purple-700/70 dark:text-purple-400/70 mt-1">
              Percent of income saved
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="spending">Spending Analysis</TabsTrigger>
          <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Top Spending Categories */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle>Top Spending Categories</CardTitle>
                <CardDescription>Where your money is going</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] pt-4">
                {spendingByCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={spendingByCategory}
                        dataKey="amount"
                        nameKey="category"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label={({ category, percent }) =>
                          `${category}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {spendingByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => formatCurrency(Number(value))} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">No expense data available</p>
                  </div>
                )}
              </CardContent>
              {spendingByCategory.length > 0 && (
                <CardFooter className="flex-col items-start border-t pt-4">
                  <p className="text-sm font-medium mb-2">Top Categories:</p>
                  <div className="w-full space-y-1">
                    {spendingByCategory.map((category, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-3 h-3 rounded-full inline-block" 
                            style={{ backgroundColor: category.color }}
                          ></span>
                          <span className="capitalize">{category.category}</span>
                        </div>
                        <span className="font-medium">
                          {formatCurrency(category.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardFooter>
              )}
            </Card>

            {/* Monthly Income vs Expenses */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle>Monthly Income vs Expenses</CardTitle>
                <CardDescription>Your financial balance over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] pt-4">
                {monthlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${value}`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Bar dataKey="income" name="Income" fill="#4ade80" />
                      <Bar dataKey="expenses" name="Expenses" fill="#f87171" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">No monthly data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Quick Insights */}
            <Card className="md:col-span-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader>
                <CardTitle>Financial Insights</CardTitle>
                <CardDescription>Key observations from your transaction data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 mb-2 font-medium">
                      <CreditCard className="h-4 w-4" />
                      Largest Expense
                    </div>
                    {topExpense ? (
                      <>
                        <p className="text-lg font-bold text-amber-700 dark:text-amber-400">
                          {formatCurrency(Math.abs(topExpense.amount))}
                        </p>
                        <p className="text-sm text-amber-700/70 dark:text-amber-400/70 mt-1 capitalize">
                          {topExpense.description} ({topExpense.category})
                        </p>
                        <p className="text-xs text-amber-600/60 dark:text-amber-500/60 mt-1">
                          {format(topExpense.parsedDate, 'MMM d, yyyy')}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-amber-700/70 dark:text-amber-400/70">
                        No expense data available
                      </p>
                    )}
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 mb-2 font-medium">
                      <ArrowUp className="h-4 w-4" />
                      Income Sources
                    </div>
                    {processedTransactions.some(t => t.amount > 0) ? (
                      <div className="space-y-2">
                        {Array.from(new Set(processedTransactions
                          .filter(t => t.amount > 0)
                          .map(t => t.category)))
                          .slice(0, 3)
                          .map((category, i) => (
                            <div key={i} className="text-sm">
                              <span className="capitalize">{category}</span>
                            </div>
                          ))
                        }
                      </div>
                    ) : (
                      <p className="text-sm text-blue-700/70 dark:text-blue-400/70">
                        No income data available
                      </p>
                    )}
                  </div>
                  
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-800 dark:text-green-300 mb-2 font-medium">
                      <ArrowDown className="h-4 w-4" />
                      Recurring Payments
                    </div>
                    {repeatedExpenses.length > 0 ? (
                      <div className="space-y-2">
                        {repeatedExpenses.slice(0, 3).map((item, i) => (
                          <div key={i} className="text-sm">
                            <span>{item.description.substring(0, 20)}{item.description.length > 20 ? '...' : ''}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-green-700/70 dark:text-green-400/70">
                        No recurring expenses found
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="spending">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle>Detailed Spending Analysis</CardTitle>
              <CardDescription>Category breakdown and spending patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] mb-6">
                {spendingByCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={spendingByCategory}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis type="number" tickFormatter={(value) => `$${value}`} />
                      <YAxis type="category" dataKey="category" width={100} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Bar dataKey="amount" name="Amount" radius={[0, 4, 4, 0]}>
                        {spendingByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">No expense data available</p>
                  </div>
                )}
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Top Expenses</h3>
                  <div className="space-y-3 max-h-[250px] overflow-y-auto">
                    {processedTransactions
                      .filter(t => t.amount < 0)
                      .sort((a, b) => a.amount - b.amount)
                      .slice(0, 5)
                      .map((t, i) => (
                        <div key={i} className="flex justify-between items-center text-sm border-b pb-2 last:border-0">
                          <div>
                            <p className="font-medium">{t.description.substring(0, 30)}{t.description.length > 30 ? '...' : ''}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="capitalize">{t.category}</span>
                              <span>•</span>
                              <span>{format(t.parsedDate, 'MMM d, yyyy')}</span>
                            </div>
                          </div>
                          <span className="font-bold text-red-600 dark:text-red-400">
                            {formatCurrency(Math.abs(t.amount))}
                          </span>
                        </div>
                      ))
                    }
                    {processedTransactions.filter(t => t.amount < 0).length === 0 && (
                      <p className="text-muted-foreground text-sm">No expense data available</p>
                    )}
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Spending Patterns</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Daily Spending:</span>
                      <span className="font-medium">
                        {formatCurrency(financialSummary.expenses / Math.max(monthlyData.length, 1) / 30)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Expense to Income Ratio:</span>
                      <span className="font-medium">
                        {financialSummary.income > 0 
                          ? `${(financialSummary.expenses / financialSummary.income * 100).toFixed(1)}%`
                          : 'N/A'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Category Diversity:</span>
                      <span className="font-medium">
                        {Array.from(new Set(processedTransactions
                          .filter(t => t.amount < 0)
                          .map(t => t.category))).length} categories
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle>Monthly Financial Trends</CardTitle>
              <CardDescription>Income, expenses and savings over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] mb-6">
                {monthlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" tickFormatter={(value) => `$${value}`} />
                      <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `$${value}`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="income" 
                        stroke="#4ade80" 
                        strokeWidth={2}
                        activeDot={{ r: 8 }} 
                        name="Income" 
                      />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="expenses" 
                        stroke="#f87171" 
                        strokeWidth={2}
                        name="Expenses" 
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="savings" 
                        stroke="#60a5fa" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Savings" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">No monthly data available</p>
                  </div>
                )}
              </div>
              
              {monthlyData.length > 0 && (
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Monthly Summary</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 font-medium">Month</th>
                          <th className="text-right py-2 font-medium">Income</th>
                          <th className="text-right py-2 font-medium">Expenses</th>
                          <th className="text-right py-2 font-medium">Savings</th>
                          <th className="text-right py-2 font-medium">Savings Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthlyData.map((data, i) => (
                          <tr key={i} className="border-b last:border-0">
                            <td className="py-2">{data.month}</td>
                            <td className="text-right py-2 text-green-600">{formatCurrency(data.income)}</td>
                            <td className="text-right py-2 text-red-600">{formatCurrency(data.expenses)}</td>
                            <td className="text-right py-2 text-blue-600">{formatCurrency(data.savings)}</td>
                            <td className="text-right py-2">
                              {data.income > 0 
                                ? `${((data.savings / data.income) * 100).toFixed(1)}%` 
                                : 'N/A'
                              }
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}