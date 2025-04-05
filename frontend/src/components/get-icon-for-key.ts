import {
  LineChart,
  BarChart,
  BookOpen,
  Briefcase,
  MessageCircle,
  Table,
} from "lucide-react"

export type IconKey =
  | "line-chart"
  | "bar-chart"
  | "book-open"
  | "briefcase"
  | "message-circle"
  | "table"

export function getIconForKey(key: IconKey) {
  const icons = {
    "line-chart": LineChart,
    "bar-chart": BarChart,
    "book-open": BookOpen,
    "briefcase": Briefcase,
    "message-circle": MessageCircle,
    "table": Table,
  }
  return icons[key]
}
