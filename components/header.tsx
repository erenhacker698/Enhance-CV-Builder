import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronDown, Download } from "lucide-react"
import Image from "next/image"
import Logo from '@/public/Logo.svg'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-teal-500">
            <Image src={Logo} alt="Enhance CV Logo" />
          </Link>

          <Button variant="ghost">Documents</Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button size="sm" className="bg-teal-500 hover:bg-teal-600">
            Upgrade
          </Button>
        </div>
      </div>
    </header>
  )
}
