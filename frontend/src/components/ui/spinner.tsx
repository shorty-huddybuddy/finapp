import { cn } from "@/lib/utils"

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn("animate-spin rounded-full border-4 border-muted border-t-primary h-8 w-8", className)} />
  )
}
