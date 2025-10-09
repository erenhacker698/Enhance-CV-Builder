import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import Image from "next/image"
import Logo from '@/public/logo.png'
import { Github } from "lucide-react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"

export default function Header() {
  const { primaryColor } = useSelector((s: RootState) => s.settings)

  return (
    <header className="main-navbar bg-white sticky top-0 z-[2]">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="" style={{ color: primaryColor }}>
            <Image src={Logo} className="w-10 h-10" alt="Enhance CV Logo" />
          </Link>

          <Button asChild variant="ghost" className="cursor-pointer">
            <Link href="/documents">Documents</Link>
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Link href="https://github.com/r00tmebaby/Enhance-CV-Builder" target="_blank" className={buttonVariants({ variant: "outline" })}><Github/> Github</Link>
        </div>
      </div>
    </header>
  )
}
