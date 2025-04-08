import { useForm, Controller } from "react-hook-form"
import { motion, HTMLMotionProps } from "framer-motion" 
import axios from "axios"
import { useState } from "react"
import { Slider } from "./ui/Slider_a"
import { Select } from "./ui/Select_a"
import { Input } from "./ui/Input_a"
import { Button } from "./ui/Button_a"
import { API_URL } from '@/lib/config'
import { ResultItem } from "@/types/analyzer"

interface InvestmentFormProps {
  setResult: (result: ResultItem[] | null) => void;
  setParentLoading: (loading: boolean) => void;
}

type FormData = {
  balance: string;
  liquidity: number;
  experience: string;
  risk: string;
  freezingPeriod: string;
}

const MotionForm = motion.form as any;

export default function InvestmentForm({ setResult, setParentLoading }: InvestmentFormProps) {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      balance: "",
      liquidity: 50,
      experience: "",
      risk: "",
      freezingPeriod: "",
    },
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const balance = watch("balance")
  const liquidity = watch("liquidity")

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setParentLoading(true)
    
    try {
      const response = await axios.post(`${API_URL}/generate?type=investment_planner`, {
        balance: Number(data.balance),
        experience: data.experience,
        preference: "short-term",
        liquidity: data.liquidity,
        risk_bearing: data.risk,
        minimum_freezing_period: Number(data.freezingPeriod),
      })
      const rdata = await response.data
      const jsonString = rdata.response.replace(/```json\n|\n```/g, '')

      const parsedData = JSON.parse(jsonString)
      setResult(parsedData)
    } catch (error) {
      console.error("Error parsing response:", error)
    } finally {
      setIsLoading(false)
      setParentLoading(false)
    }
  }

  return (
    <div className="h-full">
      <h2 className="text-3xl font-bold text-blue-800 mb-6">AI-Powered Investment Advisor</h2>
      <p className="text-gray-600 mb-8">
        Get personalized investment advice tailored to your financial goals and preferences.
      </p>
      <MotionForm
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div>
          <label htmlFor="balance" className="block text-sm font-medium text-gray-700">
            Balance
          </label>
          <Controller
            name="balance"
            control={control}
            rules={{
              required: "Balance is required",
              validate: (value) => Number(value) > 0 || "Balance must be positive",
            }}
            render={({ field }) => (
              <Input {...field} type="text" placeholder="Enter your total balance" error={errors.balance?.message} />
            )}
          />
        </div>

        <div>
          <label htmlFor="liquidity" className="block text-sm font-medium text-gray-700">
            Liquidity Preference
          </label>
          <Controller
            name="liquidity"
            control={control}
            rules={{ required: "Liquidity preference is required" }}
            render={({ field }) => (
              <Slider {...field} min={0} max={100} step={1} disabled={!balance} error={errors.liquidity?.message} />
            )}
          />
        </div>

        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
            Experience Level
          </label>
          <Controller
            name="experience"
            control={control}
            rules={{ required: "Experience level is required" }}
            render={({ field }) => (
              <Select
                {...field}
                options={[
                  { value: "beginner", label: "Beginner" },
                  { value: "intermediate", label: "Intermediate" },
                  { value: "advanced", label: "Advanced" },
                ]}
                error={errors.experience?.message}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Risk Preference</label>
          <Controller
            name="risk"
            control={control}
            rules={{ required: "Risk preference is required" }}
            render={({ field }) => (
              <div className="flex space-x-4 mt-2">
                {["low", "medium", "high"].map((risk) => (
                  <Button
                    key={risk}
                    type="button"
                    onClick={() => field.onChange(risk)}
                    variant={field.value === risk ? "primary" : "secondary"}
                  >
                    {risk.charAt(0).toUpperCase() + risk.slice(1)}
                  </Button>
                ))}
              </div>
            )}
          />
          {errors.risk && <p className="mt-1 text-sm text-red-600">{errors.risk.message}</p>}
        </div>

        <div>
          <label htmlFor="freezingPeriod" className="block text-sm font-medium text-gray-700">
            Minimum Freezing Period (days)
          </label>
          <Controller
            name="freezingPeriod"
            control={control}
            rules={{
              required: "Freezing period is required",
              min: { value: 1, message: "Freezing period must be at least 1 day" },
            }}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                placeholder="Enter minimum freezing period in days"
                error={errors.freezingPeriod?.message}
              />
            )}
          />
        </div>

        <Button type="submit" isLoading={isLoading}>
          Get My Investment Plan
        </Button>
      </MotionForm>
    </div>
  )
}

