"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();

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
              className="text-xl font-bold text-primary glow-cyan-hover flex items-center gap-2 transition-all"
            >
              <span className="text-2xl">⚡</span>
              Gestor Simplificado
            </Link>
          </div>

          {/* Links de Navegação */}
          <div className="flex items-center gap-1">
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

          {/* Botão de Ação */}
          <div>
            <Button asChild className="glow-cyan-hover">
              <Link href="/vendas/nova">+ Nova Venda</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

