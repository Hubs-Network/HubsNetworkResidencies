"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SessionSwitcher } from "./SessionSwitcher";
import { useStore } from "@/store/useStore";

// Define the type for nav links
interface NavLink {
  href: string;
  label: string;
  highlight?: boolean;
}

export function Navbar() {
  const pathname = usePathname();
  const { session } = useStore();

  // Dynamic nav links based on session type
  const getNavLinks = (): NavLink[] => {
    const baseLinks: NavLink[] = [{ href: "/", label: "Home" }];

    // Add dashboard link if logged in
    if (session.type === "HUB") {
      baseLinks.push({ href: "/hubs/dashboard", label: "My Dashboard", highlight: true });
    } else if (session.type === "PILGRIM") {
      baseLinks.push({ href: "/pilgrims/dashboard", label: "My Dashboard", highlight: true });
    } else if (session.type === "PATRON") {
      baseLinks.push({ href: "/patrons/dashboard", label: "My Dashboard", highlight: true });
    }

    // Common links for all users
    baseLinks.push(
      { href: "/hubs", label: "Hubs" },
      { href: "/pilgrims", label: "Pilgrims" },
      { href: "/patrons", label: "Patrons" },
      { href: "/seasons", label: "Seasons" },
      { href: "/map", label: "Map" }
    );

    return baseLinks;
  };

  const navLinks = getNavLinks();
  
  return (
    <nav className="border-b-4 border-black bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold">
              Hubs Network
            </Link>
            <div className="hidden md:flex gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-medium transition-colors ${
                    pathname === link.href
                      ? "text-black border-b-2 border-black"
                      : link.highlight
                      ? "text-black bg-accent1 px-3 py-1 rounded hover:bg-accent1/80"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/settings"
              className="text-gray-600 hover:text-black transition-colors"
            >
              Settings
            </Link>
            <SessionSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}
