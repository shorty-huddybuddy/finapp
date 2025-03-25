"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTransactionStore } from "../hooks/store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DownloadIcon,
  ChevronsUpDown,
  Filter,
  FileDown,
  ArrowUpDown,
  Banknote,
  Calendar,
  Tag,
  Search,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  CircleDollarSign,
  Receipt,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

export default function TransactionList() {
  const { transactions } = useTransactionStore();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof typeof transactions[0] | null;
    direction: "ascending" | "descending";
  }>({ key: "date", direction: "descending" });

  // Extract categories for filtering
  const categories = useMemo(() => {
    return Array.from(new Set(transactions.map((t) => t.category)));
  }, [transactions]);

  // Extract unique months for date filtering
  const months = useMemo(() => {
    const dates = transactions.map((t) => t.date);
    const uniqueMonths = new Set();
    
    dates.forEach(dateStr => {
      try {
        const date = new Date(dateStr);
        const monthYear = format(date, "MMMM yyyy");
        uniqueMonths.add(monthYear);
      } catch (e) {
        // Skip invalid dates
      }
    });
    
    return Array.from(uniqueMonths) as string[];
  }, [transactions]);

  // Calculate financial summary
  const summary = useMemo(() => {
    let income = 0;
    let expenses = 0;
    
    transactions.forEach(t => {
      if (t.amount > 0) {
        income += t.amount;
      } else {
        expenses += Math.abs(t.amount);
      }
    });
    
    return {
      income,
      expenses,
      balance: income - expenses,
      totalTransactions: transactions.length,
    };
  }, [transactions]);

  // Handle sorting
  const requestSort = (key: keyof typeof transactions[0]) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  // Apply filters and sorting
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = [...transactions];
    
    // Apply search filter
    if (search) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }
    
    // Apply date filter
    if (dateFilter !== "all") {
      filtered = filtered.filter(t => {
        try {
          const date = new Date(t.date);
          return format(date, "MMMM yyyy") === dateFilter;
        } catch (e) {
          return false;
        }
      });
    }
    
    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    
    return filtered;
  }, [transactions, search, categoryFilter, dateFilter, sortConfig]);

  // Function to export transactions to CSV
  const exportToCSV = () => {
    const csvData = [
      ["Date", "Description", "Category", "Amount"],
      ...filteredAndSortedTransactions.map(t => [
        t.date,
        t.description,
        t.category,
        t.amount.toString()
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    link.setAttribute("href", url);
    link.setAttribute("download", `transactions-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format date for better display
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, "MMM d, yyyy");
    } catch (e) {
      return dateStr;
    }
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      groceries: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
      entertainment: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
      restaurant: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800",
      shopping: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
      housing: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
      income: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
      utilities: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800",
      transportation: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800",
      health: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
      travel: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800",
    };
    
    const lowercaseCategory = category.toLowerCase();
    for (const [key, value] of Object.entries(colors)) {
      if (lowercaseCategory.includes(key)) {
        return value;
      }
    }
    
    // Default color for categories not specifically matched
    return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Transactions</h2>
        <p className="text-muted-foreground">
          View, filter, and manage your transaction history.
        </p>
      </div>
      
      {/* Summary Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100 dark:from-green-950/50 dark:to-emerald-950/30 dark:border-green-900/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-300 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${summary.income.toFixed(2)}
            </div>
            <p className="text-xs text-green-700/70 dark:text-green-400/70 mt-1">
              All positive transactions
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
              ${summary.expenses.toFixed(2)}
            </div>
            <p className="text-xs text-red-700/70 dark:text-red-400/70 mt-1">
              All negative transactions
            </p>
          </CardContent>
        </Card>
        
        <Card className={`bg-gradient-to-br ${
          summary.balance >= 0 
          ? "from-blue-50 to-cyan-50 border-blue-100 dark:from-blue-950/50 dark:to-cyan-950/30 dark:border-blue-900/50" 
          : "from-amber-50 to-orange-50 border-amber-100 dark:from-amber-950/50 dark:to-orange-950/30 dark:border-amber-900/50"
        }`}>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm font-medium flex items-center gap-2 ${
              summary.balance >= 0 
              ? "text-blue-800 dark:text-blue-300" 
              : "text-amber-800 dark:text-amber-300"
            }`}>
              <CircleDollarSign className="h-4 w-4" />
              Net Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              summary.balance >= 0 
              ? "text-blue-600 dark:text-blue-400" 
              : "text-amber-600 dark:text-amber-400"
            }`}>
              ${summary.balance.toFixed(2)}
            </div>
            <p className={`text-xs mt-1 ${
              summary.balance >= 0 
              ? "text-blue-700/70 dark:text-blue-400/70" 
              : "text-amber-700/70 dark:text-amber-400/70"
            }`}>
              Income minus expenses
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-100 dark:from-purple-950/50 dark:to-violet-950/30 dark:border-purple-900/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-300 flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {summary.totalTransactions}
            </div>
            <p className="text-xs text-purple-700/70 dark:text-purple-400/70 mt-1">
              Total number of records
            </p>
          </CardContent>
        </Card>
      </div>
       */}
      {/* Filters */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="pb-3 bg-gray-50 dark:bg-gray-800/60 rounded-t-lg border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {/* <CardTitle>Transaction History</CardTitle> */}
           
              {/* <FileDown className="h-4 w-4" /> */}
              
            {/* </Button> */}
          </div>
          <CardDescription>
            Browse and filter your transaction history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by description or category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 border-gray-200 dark:border-gray-700 focus:border-blue-300 dark:focus:border-blue-600"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px] border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                    <SelectValue placeholder="Category" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[180px] border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-teal-500 dark:text-teal-400" />
                    <SelectValue placeholder="Time Period" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Transaction Table */}
          <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-800/60">
                <TableRow className="hover:bg-gray-100 dark:hover:bg-gray-800">
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100/80 dark:hover:bg-gray-800/80 text-gray-700 dark:text-gray-300"
                    onClick={() => requestSort('date')}
                  >
                    <div className="flex items-center gap-1">
                      Date
                      {sortConfig.key === 'date' && (
                        <ArrowUpDown className="h-3 w-3 text-blue-500 dark:text-blue-400" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100/80 dark:hover:bg-gray-800/80 text-gray-700 dark:text-gray-300"
                    onClick={() => requestSort('description')}
                  >
                    <div className="flex items-center gap-1">
                      Description
                      {sortConfig.key === 'description' && (
                        <ArrowUpDown className="h-3 w-3 text-blue-500 dark:text-blue-400" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-100/80 dark:hover:bg-gray-800/80 text-gray-700 dark:text-gray-300"
                    onClick={() => requestSort('category')}
                  >
                    <div className="flex items-center gap-1">
                      Category
                      {sortConfig.key === 'category' && (
                        <ArrowUpDown className="h-3 w-3 text-blue-500 dark:text-blue-400" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right cursor-pointer hover:bg-gray-100/80 dark:hover:bg-gray-800/80 text-gray-700 dark:text-gray-300"
                    onClick={() => requestSort('amount')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Amount
                      {sortConfig.key === 'amount' && (
                        <ArrowUpDown className="h-3 w-3 text-blue-500 dark:text-blue-400" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      {transactions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-1 text-muted-foreground py-8">
                          <div className="bg-purple-50 p-3 rounded-full dark:bg-purple-900/30">
                            <Banknote className="h-8 w-8 text-purple-500 dark:text-purple-400" />
                          </div>
                          <p className="mt-2 font-medium text-gray-700 dark:text-gray-300">No transactions found</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Upload a statement to get started</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-1 text-muted-foreground py-8">
                          <div className="bg-amber-50 p-3 rounded-full dark:bg-amber-900/30">
                            <Filter className="h-8 w-8 text-amber-500 dark:text-amber-400" />
                          </div>
                          <p className="mt-2 font-medium text-gray-700 dark:text-gray-300">No matching transactions</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Try adjusting your filters</p>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedTransactions.map((transaction, index) => (
                    <TableRow key={index} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                      <TableCell className="font-medium text-gray-700 dark:text-gray-300">
                        {formatDate(transaction.date)}
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate text-gray-700 dark:text-gray-300">
                        {transaction.description}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`capitalize ${getCategoryColor(transaction.category)}`}
                        >
                          {transaction.category}
                        </Badge>
                      </TableCell>
                      <TableCell 
                        className={`text-right font-medium ${
                          transaction.amount >= 0 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        <span className={`px-2 py-0.5 rounded-md ${
                          transaction.amount >= 0 
                            ? 'bg-green-50 dark:bg-green-900/20' 
                            : 'bg-red-50 dark:bg-red-900/20'
                        }`}>
                          {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="opacity-0 group-hover:opacity-100 h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-indigo-600 dark:text-indigo-400">Edit category</DropdownMenuItem>
                            <DropdownMenuItem className="text-blue-600 dark:text-blue-400">Add notes</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 dark:text-red-400">
                              Flag as incorrect
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination (simplified) */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{filteredAndSortedTransactions.length}</span> of{" "}
              <span className="font-medium">{transactions.length}</span> transactions
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={filteredAndSortedTransactions.length === transactions.length}
                onClick={() => {
                  setSearch("");
                  setCategoryFilter("all");
                  setDateFilter("all");
                }}
                className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800 dark:hover:bg-amber-900/50 disabled:opacity-50"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}