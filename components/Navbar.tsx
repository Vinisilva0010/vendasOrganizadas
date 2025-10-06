"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Dashboard" },
    { href: "/clients", label: "Clientes" },
    { href: "/parcelas", label: "Parcelas" },
    { href: "/despesas", label: "Despesas" },
    { href: "/guia", label: "📚 Guia" },
  ];

  return (
    <nav className="border-b bg-card/95 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Título */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-lg md:text-xl font-bold text-primary glow-cyan-hover flex items-center gap-2 transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="text-2xl">⚡</span>
              <span className="hidden sm:inline">Gestor Simplificado</span>
              <span className="sm:hidden">Gestor</span>
            </Link>
          </div>

          {/* Links de Navegação - Desktop */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-all duration-300",
                  pathname === link.href
                    ? "bg-primary text-primary-foreground glow-cyan"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:scale-105"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Botão de Ação - Desktop */}
          <div className="hidden md:block">
            <Button asChild className="glow-cyan-hover">
              <Link href="/vendas/nova">+ Nova Venda</Link>
            </Button>
          </div>

          {/* Menu Hamburguer - Mobile */}
          <button
            className="lg:hidden p-2 text-foreground hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 space-y-2 animate-fade-in">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 text-sm font-medium rounded-md transition-all",
                  pathname === link.href
                    ? "bg-primary text-primary-foreground glow-cyan"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2">
              <Button asChild className="w-full glow-cyan-hover">
                <Link href="/vendas/nova" onClick={() => setIsMenuOpen(false)}>
                  + Nova Venda
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

