import { Input } from "@/components/ui/input"
import { Search, Image, Film, BarChart2, MapPin, Smile, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SearchHeader() {
  return (
    <div className="sticky top-0 z-10 backdrop-blur-sm border-b border-border bg-background/80">
      <div className="flex flex-col p-4 gap-4">
        <div className="relative flex-1 max-w-2xl mx-auto w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder="Search users or posts..." className="pl-10 w-full bg-muted" />
        </div>

        <div className="max-w-2xl mx-auto w-full">
          <div className="flex items-center gap-2 border rounded-lg p-2">
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600">
                <Image className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600">
                <Film className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600">
                <BarChart2 className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600">
                <Smile className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600">
                <Calendar className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-600">
                <MapPin className="w-5 h-5" />
              </Button>
            </div>
            <div className="ml-auto">
              <Button>Post</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

