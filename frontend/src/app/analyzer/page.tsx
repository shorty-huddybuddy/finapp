"use client"

import { useState } from "react"
import { ResultItem } from "@/types/analyzer"

import InvestmentForm from "../../components/InvestmentForm"
import ResultDisplay from "../../components/ResultDisplay"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar2 } from "@/components/Navbar2"

export default function App() {
  const [result, setResult] = useState<ResultItem[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-gray-200">
      <Navbar2 />
      <main className="flex-grow py-8"> 
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="w-full max-w-6xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  className="w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: "spring", stiffness: 80, damping: 15 }}
                >
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-xl p-5 md:p-6 border border-gray-100">
                    <InvestmentForm setResult={setResult} setParentLoading={setIsLoading} />
                  </div>
                </motion.div>

                <AnimatePresence>
                  {!result && !isLoading && (
                    <motion.div
                      className="hidden md:block"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg border border-dashed border-gray-300 p-5 md:p-6 h-full flex items-center justify-center min-h-[320px]">
                        <p className="text-gray-400 text-center">Your investment plan will appear here</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {(isLoading || result) && (
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ type: "spring", stiffness: 80, damping: 15 }}
                    >
                      <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-xl p-5 md:p-6 border border-gray-100 h-full flex flex-col items-center justify-center min-h-[320px]">
                        {isLoading ? (
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <p className="mt-3 text-gray-600 text-center">Generating your investment plan...</p>
                          </div>
                        ) : (
                          result && <ResultDisplay result={result} setResult={(value: ResultItem[] | null) => setResult(value)} />
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

