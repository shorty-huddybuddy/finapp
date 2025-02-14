"use client"

import { useState } from "react"

import InvestmentForm from "../../components/InvestmentForm"
import ResultDisplay from "../../components/ResultDisplay"
import { motion, AnimatePresence } from "framer-motion"

export default function App() {
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* <Header /> */}
      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center">
            <div className="w-full max-w-6xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                  className={`w-full ${!result && !isLoading ? 'lg:col-span-2 lg:max-w-2xl lg:mx-auto' : ''}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: "spring", stiffness: 80, damping: 15 }}
                >
                  <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
                    <InvestmentForm setResult={setResult} setParentLoading={setIsLoading} />
                  </div>
                </motion.div>

                <AnimatePresence>
                  {(isLoading || result) && (
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ type: "spring", stiffness: 80, damping: 15 }}
                    >
                      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 h-full flex flex-col items-center justify-center min-h-[400px]">
                        {isLoading ? (
                          <div className="flex flex-col items-center">
                            <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            <p className="mt-4 text-gray-600 text-center">Generating your investment plan...</p>
                          </div>
                        ) : (
                          result && <ResultDisplay result={result} setResult={setResult} />
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
      {/* <Footer /> */}
    </div>
  )
}