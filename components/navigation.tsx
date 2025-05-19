"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Map, Compass, MessageSquare, Trophy, User } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Mapa", icon: Map },
    { href: "/feed", label: "Feed", icon: MessageSquare },
    { href: "/explorar", label: "Explorar", icon: Compass },
    { href: "/missions", label: "Misiones", icon: Trophy },
    { href: "/profile", label: "Perfil", icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t dark:border-gray-800 z-20">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full ${
                isActive ? "text-purple-500" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
              {isActive && (
                <div className="absolute top-0 w-1/5 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
