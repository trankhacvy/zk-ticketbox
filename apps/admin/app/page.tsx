import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Ticket,
  Shield,
  Zap,
  CheckCircle,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f5f3ff] bg-gradient-to-br from-[#f5f3ff] to-[#eff6ff] relative overflow-hidden">
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-[#ddd6fe] opacity-60 blur-xl"></div>
      <div className="absolute bottom-40 right-10 w-40 h-40 rounded-full bg-[#bfdbfe] opacity-40 blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-[#99f6e4] opacity-30 blur-lg"></div>

      <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col items-center mb-16 relative">
          <div className="relative mb-6">
            <h1 className="text-7xl md:text-8xl font-black tracking-tighter">
              <span className="inline-block transform -rotate-3 text-[#7c3aed]">
                TICKET
              </span>
              <span className="inline-block transform rotate-3 text-[#2563eb]">
                BOX
              </span>
            </h1>
            <Sparkles className="absolute -top-6 -right-6 text-[#fbbf24] w-10 h-10" />
            <Sparkles className="absolute -bottom-4 left-10 text-[#fbbf24] w-8 h-8" />
          </div>

          <p className="text-2xl mb-10 font-medium text-center max-w-2xl">
            Collect Moments, Not Merch
          </p>

          <div className="flex flex-col items-center">
            <div className="flex space-x-4 mb-4">
              <Link
                href="/dashboard"
                className="block transform hover:rotate-2 transition-transform hover:scale-105"
              >
                <div className="bg-[#7c3aed] text-white rounded-xl px-6 py-3 flex items-center space-x-2 shadow-lg">
                  <Ticket className="w-5 h-5" />
                  <span className="font-medium">I'm a Host</span>
                </div>
              </Link>
              <a
                href="https://zk-ticketbox.vercel.app/"
                className="block transform hover:-rotate-2 transition-transform hover:scale-105"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="bg-[#2563eb] text-white rounded-xl px-6 py-3 flex items-center space-x-2 shadow-lg">
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">I'm an Attendee</span>
                </div>
              </a>
            </div>
            <p className="text-sm text-gray-600">Built on Solana blockchain</p>
          </div>
        </div>

        <div className="flex justify-center mb-20">
          <div className="relative">
            <div className="bg-gradient-to-br from-[#8b5cf6] to-[#3b82f6] rounded-[24px] w-64 h-[320px] p-3 transform rotate-3 shadow-xl">
              <div className="bg-white w-full h-full rounded-[18px] flex flex-col items-center justify-center overflow-hidden p-4">
                <div className="w-16 h-16 mb-4 bg-[#f5f3ff] rounded-full flex items-center justify-center">
                  <Ticket className="w-8 h-8 text-[#7c3aed]" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-1">SOLANA SUMMIT</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Proof of Participation
                  </p>
                  <div className="bg-gray-100 rounded-lg px-3 py-1 text-xs font-mono">
                    #0x8f3d...7e9b
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-8 -right-8 w-16 h-16 bg-[#fcd34d] rounded-full flex items-center justify-center transform rotate-12 shadow-lg">
              <span className="font-bold text-black text-sm">VERIFIED</span>
            </div>
            <Sparkles className="absolute -bottom-6 -left-6 text-[#fcd34d] w-12 h-12" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl p-6 transform hover:scale-105 transition-transform hover:shadow-lg border border-[#ede9fe]">
            <h3 className="text-2xl font-bold mb-4 flex items-center text-[#7c3aed]">
              <span className="w-8 h-8 bg-[#7c3aed] text-white rounded-full flex items-center justify-center mr-2">
                1
              </span>
              Easy Claiming
            </h3>
            <p className="mb-4 text-gray-700">
              Claim your proof of participation NFTs with just a few clicks. No
              complex wallet setup required.
            </p>
            <div className="aspect-video bg-gradient-to-br from-[#f5f3ff] to-[#eff6ff] rounded-xl overflow-hidden flex items-center justify-center p-4">
              <div className="flex space-x-3 items-center">
                <div className="w-10 h-10 bg-[#ede9fe] rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-[#7c3aed]" />
                </div>
                <div className="h-0.5 w-16 bg-[#ddd6fe]"></div>
                <div className="w-10 h-10 bg-[#ede9fe] rounded-full flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-[#7c3aed]" />
                </div>
                <div className="h-0.5 w-16 bg-[#ddd6fe]"></div>
                <div className="w-10 h-10 bg-[#ede9fe] rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#7c3aed]" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl p-6 transform hover:scale-105 transition-transform hover:shadow-lg border border-[#dbeafe]">
            <h3 className="text-2xl font-bold mb-4 flex items-center text-[#2563eb]">
              <span className="w-8 h-8 bg-[#2563eb] text-white rounded-full flex items-center justify-center mr-2">
                2
              </span>
              ZK Compression
            </h3>
            <p className="mb-4 text-gray-700">
              Powered by zero-knowledge compression technology for efficient and
              low-cost NFT minting on Solana.
            </p>
            <div className="aspect-video bg-gradient-to-br from-[#eff6ff] to-[#f5f3ff] rounded-xl overflow-hidden flex items-center justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-[#dbeafe] rounded-lg flex items-center justify-center">
                  <Zap className="w-10 h-10 text-[#2563eb]" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#dbeafe] rounded-md flex items-center justify-center border-2 border-white">
                  <Zap className="w-5 h-5 text-[#2563eb]" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl p-6 transform hover:scale-105 transition-transform hover:shadow-lg border border-[#ccfbf1]">
            <h3 className="text-2xl font-bold mb-4 flex items-center text-[#0d9488]">
              <span className="w-8 h-8 bg-[#0d9488] text-white rounded-full flex items-center justify-center mr-2">
                3
              </span>
              Solana Powered
            </h3>
            <p className="mb-4 text-gray-700">
              Built on Solana for lightning-fast transactions and minimal
              environmental impact.
            </p>
            <div className="aspect-video bg-gradient-to-br from-[#f0fdfa] to-[#eff6ff] rounded-xl overflow-hidden flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#ccfbf1] flex items-center justify-center mb-2">
                  <div className="w-8 h-8 bg-[#0d9488] rounded-full"></div>
                </div>
                <div className="text-xs font-mono text-[#0d9488]">
                  SOLANA BLOCKCHAIN
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl p-6 transform hover:scale-105 transition-transform hover:shadow-lg border border-[#e0e7ff]">
            <h3 className="text-2xl font-bold mb-4 flex items-center text-[#4f46e5]">
              <span className="w-8 h-8 bg-[#4f46e5] text-white rounded-full flex items-center justify-center mr-2">
                4
              </span>
              Verify Anywhere
            </h3>
            <p className="mb-4 text-gray-700">
              Easily verify your participation credentials across platforms and
              communities.
            </p>
            <div className="aspect-video bg-gradient-to-br from-[#eef2ff] to-[#f5f3ff] rounded-xl overflow-hidden flex items-center justify-center">
              <div className="grid grid-cols-3 gap-2">
                <div className="w-10 h-10 bg-[#e0e7ff] rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#4f46e5]" />
                </div>
                <div className="w-10 h-10 bg-[#e0e7ff] rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#4f46e5]" />
                </div>
                <div className="w-10 h-10 bg-[#e0e7ff] rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-[#4f46e5]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#ede9fe] rounded-full flex items-center justify-center mb-4">
                <Ticket className="w-8 h-8 text-[#7c3aed]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Attend Event</h3>
              <p className="text-gray-600">
                Participate in Solana ecosystem events, hackathons, or community
                activities
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#dbeafe] rounded-full flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-[#2563eb]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Claim Your NFT</h3>
              <p className="text-gray-600">
                Connect your wallet and claim your compressed NFT proof of
                participation
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#ccfbf1] rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-[#0d9488]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Verify & Share</h3>
              <p className="text-gray-600">
                Use your NFT to verify participation and unlock community
                benefits
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#8b5cf6] to-[#3b82f6] rounded-3xl p-8 mb-16 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Join the waitlist</h3>
              <p>Get early access to TicketBox and upcoming event NFTs</p>
            </div>
            <div className="w-full md:w-auto">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-4 py-3 rounded-l-xl border-2 border-white focus:outline-none w-full md:w-64 text-gray-800"
                />
                <button className="bg-black text-white px-4 py-3 rounded-r-xl hover:bg-gray-800 transition-colors">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-[#ddd6fe]">
          <div>
            <h4 className="font-bold mb-4 text-[#7c3aed]">Community</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="hover:underline inline-block transform hover:-rotate-3 transition-transform text-gray-600 hover:text-[#7c3aed]"
                >
                  Discord
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:underline inline-block transform hover:rotate-3 transition-transform text-gray-600 hover:text-[#7c3aed]"
                >
                  Twitter
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:underline inline-block transform hover:-rotate-3 transition-transform text-gray-600 hover:text-[#7c3aed]"
                >
                  Telegram
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:underline inline-block transform hover:rotate-3 transition-transform text-gray-600 hover:text-[#7c3aed]"
                >
                  GitHub
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-[#2563eb]">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="hover:underline inline-block transform hover:-rotate-3 transition-transform text-gray-600 hover:text-[#2563eb]"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:underline inline-block transform hover:rotate-3 transition-transform text-gray-600 hover:text-[#2563eb]"
                >
                  API
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:underline inline-block transform hover:-rotate-3 transition-transform text-gray-600 hover:text-[#2563eb]"
                >
                  Tutorials
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-[#0d9488]">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="hover:underline inline-block transform hover:rotate-3 transition-transform text-gray-600 hover:text-[#0d9488]"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:underline inline-block transform hover:-rotate-3 transition-transform text-gray-600 hover:text-[#0d9488]"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:underline inline-block transform hover:rotate-3 transition-transform text-gray-600 hover:text-[#0d9488]"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-[#4f46e5]">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="hover:underline inline-block transform hover:-rotate-3 transition-transform text-gray-600 hover:text-[#4f46e5]"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:underline inline-block transform hover:rotate-3 transition-transform text-gray-600 hover:text-[#4f46e5]"
                >
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-16">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} TicketBox. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
