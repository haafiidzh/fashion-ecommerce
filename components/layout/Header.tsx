"use client";

import Link from "next/link";
import { ShoppingCart, User, Menu, X, Search } from "lucide-react";
import { useState } from "react";
import { useUserRole } from "@/hooks/useUserRole";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { session, getDashboardUrl } = useUserRole();

  return (
    <header className="w-full border-b border-black/10 bg-white">
      <div className="max-w-[1240px] mx-auto px-4">
        <div className="flex h-[60px] items-center justify-between gap-4 lg:gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <span className="text-[25px] sm:text-[32px] font-black text-black uppercase tracking-tight">
              SHOP.CO
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6">
            <Link
              href="/products"
              className="text-base text-black hover:text-black/60 transition-colors whitespace-nowrap"
            >
              Shop
            </Link>
            <Link
              href="/products?filter=new"
              className="text-base text-black hover:text-black/60 transition-colors whitespace-nowrap"
            >
              On Sale
            </Link>
            <Link
              href="/products?filter=arrivals"
              className="text-base text-black hover:text-black/60 transition-colors whitespace-nowrap"
            >
              New Arrivals
            </Link>
            <Link
              href="/about"
              className="text-base text-black hover:text-black/60 transition-colors whitespace-nowrap"
            >
              Brands
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-[450px] xl:max-w-[577px]">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black/40" />
              <input
                type="search"
                placeholder="Search for products..."
                className="w-full h-11 pl-12 pr-4 text-sm bg-[#F0F0F0] rounded-full border-0 text-black placeholder:text-black/40 focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* Search Icon - Mobile */}
            <button className="md:hidden p-1.5 hover:bg-black/5 rounded-full transition-colors">
              <Search className="h-5 w-5 text-black" />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-1.5 hover:bg-black/5 rounded-full transition-colors"
            >
              <ShoppingCart className="h-5 w-5 text-black" />
              <span className="absolute -top-0.5 -right-0.5 h-[18px] min-w-[18px] px-1 rounded-full bg-black text-white text-[11px] flex items-center justify-center font-medium">
                0
              </span>
            </Link>

            {/* User Menu */}
            {session ? (
              <Link
                href={getDashboardUrl()}
                className="p-1.5 hover:bg-black/5 rounded-full transition-colors"
                title={session.user.name || "Profile"}
              >
                <User className="h-5 w-5 text-black" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center justify-center h-9 px-5 text-sm font-medium text-white bg-black rounded-full hover:bg-black/90 transition-colors whitespace-nowrap"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 hover:bg-black/5 rounded-full transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-black" />
              ) : (
                <Menu className="h-5 w-5 text-black" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-5 border-t border-black/10">
            <nav className="flex flex-col gap-5">
              <Link
                href="/products"
                className="text-base text-black hover:text-black/60 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/products?filter=new"
                className="text-base text-black hover:text-black/60 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                On Sale
              </Link>
              <Link
                href="/products?filter=arrivals"
                className="text-base text-black hover:text-black/60 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                New Arrivals
              </Link>
              <Link
                href="/about"
                className="text-base text-black hover:text-black/60 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Brands
              </Link>
              {!session && (
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center h-10 px-6 text-sm font-medium text-white bg-black rounded-full hover:bg-black/90 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
