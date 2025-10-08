import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import Image from "next/image"
import Logo from '@/public/Logo.svg'
import { Github } from "lucide-react"

export default function Header() {

  return (
    <header className="main-navbar bg-white sticky top-0 z-[2]">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-teal-500">
            <Image src={Logo} alt="Enhance CV Logo" />
          </Link>

          <Button variant="ghost">Documents</Button>
        </div>

        <div className="flex items-center space-x-2">
          <Link href="https://github.com/r00tmebaby/Enhance-CV-Builder" target="_blank" className={buttonVariants({ variant: "outline" })}><Github/> Github</Link>
        </div>
      </div>
    </header>
  )
}
