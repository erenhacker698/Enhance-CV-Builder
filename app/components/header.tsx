import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronDown, Download } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-teal-500">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12.5v5l4-2.5-4-2.5z"
                fill="currentColor"
              />
            </svg>
          </Link>

          <Button variant="ghost">Documents</Button>

          <Button variant="ghost" className="flex items-center gap-1">
            Resume Examples <ChevronDown size={16} />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Saved</span>
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-1" /> Download
          </Button>
          <Button size="sm" className="bg-teal-500 hover:bg-teal-600">
            Upgrade
          </Button>
        </div>
      </div>
    </header>
  )
}
