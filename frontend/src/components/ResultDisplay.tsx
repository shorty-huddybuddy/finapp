import { motion } from "framer-motion"
import { useState } from "react"
import { Button } from "./ui/Button_a"
import { ChartPie, Wallet, AlertTriangle } from "lucide-react"
import { ResultItem } from "@/types/analyzer"

interface ResultDisplayProps {
  result: ResultItem[];
  setResult: (value: ResultItem[] | null) => void;
}

export default function ResultDisplay({ result, setResult }: ResultDisplayProps) {
  const total = result.reduce((sum, item) => sum + Number(item.Allocation), 0);
  const totalAllocation = `${total.toFixed(2)}%`;

  const getRiskIcon = (risk: string) => {
    switch(risk.toLowerCase()) {
      case 'very low':
      case 'low': return '🟢'
      case 'moderate': return '🟡'
      default: return '🔴'
    }
  }

  const [showAll, setShowAll] = useState(false)
  const [pageIndex, setPageIndex] = useState(0)
  const pageSize = 4
  const totalPages = Math.ceil(result.length / pageSize)
  const visibleCards = result.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)

  return (
    <div className="flex flex-col">
      <div className="text-center space-y-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Investment Portfolio</h2>
        <p className="text-lg text-gray-600">Total Allocation: {totalAllocation}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {visibleCards.map((item, index) => {
          const riskColor =
            item["Risk"].toLowerCase() === "very low" || item["Risk"].toLowerCase() === "low"
              ? "bg-green-50 border-green-200 hover:bg-green-100"
              : item["Risk"].toLowerCase() === "moderate"
              ? "bg-yellow-50 border-yellow-200 hover:bg-yellow-100"
              : "bg-red-50 border-red-200 hover:bg-red-100"

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 60, damping: 12 }}
              className={`p-3 rounded-lg shadow-md border ${riskColor} transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900">
                  {item["Investment Option"]}
                </h3>
                <span className="text-xl" title={`Risk: ${item["Risk"]}`}>
                  {getRiskIcon(item["Risk"])}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="relative pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-600">
                      Allocation
                    </span>
                    <span className="text-xs font-semibold text-gray-600">
                      {item.Allocation}%
                    </span>
                  </div>
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                    <div
                      style={{ width: `${item.Allocation}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                    ></div>
                  </div>
                </div>

                <div className="space-y-1 text-sm">
                  <p className="text-gray-700 flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    <span className="font-medium">Liquidity:</span> {item["Liquidity"]}
                  </p>
                  <p className="text-gray-700 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-medium">Risk:</span> {item["Risk"]}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {pageIndex > 0 && (
            <Button  onClick={() => setPageIndex(pageIndex - 1)}>
              Previous
            </Button>
          )}
          {pageIndex < totalPages - 1 && (
            <Button onClick={() => setPageIndex(pageIndex + 1)}>
              Next
            </Button>
          )}
        </div>
      )}

      <div className="mt-6 text-center">
        <Button 
          onClick={() => setResult(null)}
          className="hover:bg-gray-100"
        >
          Edit Preferences
        </Button>
      </div>
    </div>
  )
}