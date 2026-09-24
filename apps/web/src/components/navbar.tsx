"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, ExternalLink, Radio, Sparkles, LayoutGrid, WalletCards, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { WalletConnectButton } from "@/components/connect-button"
import convexLogo from "@/assets/convex.png"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Markets", href: "/markets" },
  { name: "Create", href: "/create" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "Docs", href: "https://docs.arc.network", external: true },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-[#0a0d14]/80 backdrop-blur-lg">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {/* Mobile menu button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <div className="flex items-center gap-2 mb-8">
                <Image
                  src={convexLogo}
                  alt="Convex logo"
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-contain"
                  priority
                />
                <span className="font-bold text-lg text-white">
                  Convex
                </span>
              </div>
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className={`flex items-center gap-2 text-base font-medium transition-colors hover:text-primary ${
                      pathname === link.href.replace(/#.*/, "") ? "text-foreground" : "text-foreground/70"
                    }`}
                  >
                    {link.name}
                    {link.external && <ExternalLink className="h-4 w-4" />}
                  </Link>
                ))}
                <div className="mt-6 pt-6 border-t">
                  <Button asChild className="w-full bg-primary text-white hover:bg-primary/90">
                    <WalletConnectButton />
                  </Button>
                </div>
                <div className="pt-4">
                  <Button asChild className="w-full bg-secondary text-white hover:bg-secondary/80">
                    <Link href="/create">Create market</Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image
              src={convexLogo}
              alt="Convex logo"
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-contain"
              priority
            />
            <span className="hidden font-bold text-xl tracking-tight text-white sm:inline-block">
              Convex
            </span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${
                pathname === link.href.replace(/#.*/, "")
                  ? "text-foreground"
                  : "text-foreground/70"
              }`}
            >
              {link.name}
              {link.external && <ExternalLink className="h-4 w-4" />}
            </Link>
          ))}

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-semibold text-emerald-300 lg:flex">
              <Radio className="h-3.5 w-3.5" /> Arc Mainnet · 5042
            </span>
            <WalletConnectButton />
            <Button asChild className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">
              <Link href="/create"><Sparkles className="mr-2 h-4 w-4" />Create market</Link>
            </Button>
          </div>
        </nav>
      </div>
      <nav className="fixed bottom-4 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center justify-around rounded-2xl border border-zinc-800 bg-[#111722]/90 px-3 py-2 shadow-2xl backdrop-blur-lg md:hidden">
        {[
          { href: "/markets", label: "Markets", icon: LayoutGrid },
          { href: "/dashboard", label: "Positions", icon: WalletCards },
          { href: "/resolver", label: "Resolver", icon: ShieldCheck },
        ].map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={`flex min-w-16 flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[10px] font-semibold ${pathname?.startsWith(href) ? "text-primary" : "text-zinc-500"}`}>
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
