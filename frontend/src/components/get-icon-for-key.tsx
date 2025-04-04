import { 
  BarChart2, BookOpen, Briefcase, LineChart, MessageCircle, Table,
  type LucideIcon 
} from "lucide-react"

export type IconKey = 
  | "line-chart" 
  | "bar-chart" 
  | "book-open" 
  | "briefcase" 
  | "message-circle" 
  | "table"

export function getIconForKey(key: IconKey): LucideIcon {
  const iconMap: Record<IconKey, LucideIcon> = {
    "line-chart": LineChart,
    "bar-chart": BarChart2,
    "book-open": BookOpen,
    "briefcase": Briefcase,
    "message-circle": MessageCircle,
    "table": Table
  }
  
  return iconMap[key]
}