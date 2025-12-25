import Link from "next/link";
import { Facebook, Twitter, Instagram, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#F0F0F0] mt-20">
      <div className="max-w-[1240px] mx-auto px-4">
        {/* Newsletter Section */}
        <div className="relative -top-[90px] mb-[-40px]">
          <div className="bg-black rounded-[20px] px-6 sm:px-12 lg:px-16 py-7 sm:py-9">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-7 lg:gap-8">
              <h3 className="text-[28px] sm:text-[36px] lg:text-[40px] font-black text-white leading-[1.2] max-w-[550px] text-center lg:text-left">
                STAY UPTO DATE ABOUT OUR LATEST OFFERS
              </h3>
              <div className="w-full lg:w-auto flex flex-col gap-3.5 min-w-[280px] lg:min-w-[350px]">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full h-12 pl-12 pr-4 rounded-full bg-white text-black placeholder:text-black/40 focus:outline-none focus:ring-0 text-base"
                  />
                  <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <button className="h-12 px-6 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-colors text-base">
                  Subscribe to Newsletter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="pt-12 pb-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-10 xl:gap-12">
          {/* Company Info */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="inline-block mb-5">
              <span className="text-[28px] sm:text-[33px] font-black text-black uppercase tracking-tight">
                SHOP.CO
              </span>
            </Link>
            <p className="text-sm text-black/60 mb-7 leading-[1.6] max-w-[248px]">
              We have clothes that suits your style and which you're proud to wear. From women to men.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-[35px] h-[35px] flex items-center justify-center bg-white border border-black/10 rounded-full hover:bg-black hover:text-white hover:border-black transition-colors"
              >
                <Twitter className="h-[18px] w-[18px]" fill="currentColor" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-[35px] h-[35px] flex items-center justify-center bg-white border border-black/10 rounded-full hover:bg-black hover:text-white hover:border-black transition-colors"
              >
                <Facebook className="h-[18px] w-[18px]" fill="currentColor" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-[35px] h-[35px] flex items-center justify-center bg-white border border-black/10 rounded-full hover:bg-black hover:text-white hover:border-black transition-colors"
              >
                <Instagram className="h-[18px] w-[18px]" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-[35px] h-[35px] flex items-center justify-center bg-white border border-black/10 rounded-full hover:bg-black hover:text-white hover:border-black transition-colors"
              >
                <Github className="h-[18px] w-[18px]" fill="currentColor" />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-medium text-black text-base tracking-[3px] mb-5 uppercase">
              COMPANY
            </h4>
            <ul className="space-y-3.5">
              <li>
                <Link
                  href="/about"
                  className="text-base text-black/60 hover:text-black transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="text-base text-black/60 hover:text-black transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/works"
                  className="text-base text-black/60 hover:text-black transition-colors"
                >
                  Works
                </Link>
              </li>
              <li>
                <Link
                  href="/career"
                  className="text-base text-black/60 hover:text-black transition-colors"
                >
                  Career
                </Link>
              </li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="font-medium text-black text-base tracking-[3px] mb-5 uppercase">
              HELP
            </h4>
            <ul className="space-y-3.5">
              <li>
                <Link
                  href="/support"
                  className="text-base text-black/60 hover:text-black transition-colors"
                >
                  Customer Support
                </Link>
              </li>
              <li>
                <Link
                  href="/delivery"
                  className="text-base text-black/60 hover:text-black transition-colors"
                >
                  Delivery Details
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-base text-black/60 hover:text-black transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-base text-black/60 hover:text-black transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* FAQ Links */}
          <div>
            <h4 className="font-medium text-black text-base tracking-[3px] mb-5 uppercase">
              FAQ
            </h4>
            <ul className="space-y-3.5">
              <li>
                <Link
                  href="/account"
                  className="text-base text-black/60 hover:text-black transition-colors"
                >
                  Account
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="text-base text-black/60 hover:text-black transition-colors"
                >
                  Manage Deliveries
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="text-base text-black/60 hover:text-black transition-colors"
                >
                  Orders
                </Link>
              </li>
              <li>
                <Link
                  href="/payments"
                  className="text-base text-black/60 hover:text-black transition-colors"
                >
                  Payments
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-medium text-black text-base tracking-[3px] mb-5 uppercase">
              RESOURCES
            </h4>
            <ul className="space-y-3.5">
              <li>
                <Link
                  href="/ebooks"
                  className="text-base text-black/60 hover:text-black transition-colors"
                >
                  Free eBooks
                </Link>
              </li>
              <li>
                <Link
                  href="/tutorials"
                  className="text-base text-black/60 hover:text-black transition-colors"
                >
                  Development Tutorial
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-base text-black/60 hover:text-black transition-colors"
                >
                  How to - Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/playlist"
                  className="text-base text-black/60 hover:text-black transition-colors"
                >
                  Youtube Playlist
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-5 border-t border-black/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-black/60">
              Shop.co © 2000-2023, All Rights Reserved
            </p>
            <div className="flex items-center gap-2.5">
              <div className="h-[30px] px-3 bg-white border border-black/10 rounded-[5px] flex items-center justify-center">
                <span className="text-xs font-medium text-black">Visa</span>
              </div>
              <div className="h-[30px] px-3 bg-white border border-black/10 rounded-[5px] flex items-center justify-center">
                <span className="text-xs font-medium text-black">Mastercard</span>
              </div>
              <div className="h-[30px] px-3 bg-white border border-black/10 rounded-[5px] flex items-center justify-center">
                <span className="text-xs font-medium text-black">PayPal</span>
              </div>
              <div className="h-[30px] px-3 bg-white border border-black/10 rounded-[5px] flex items-center justify-center">
                <span className="text-xs font-medium text-black">Apple Pay</span>
              </div>
              <div className="h-[30px] px-3 bg-white border border-black/10 rounded-[5px] flex items-center justify-center">
                <span className="text-xs font-medium text-black">Google Pay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
