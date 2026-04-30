"use client";
import { Menu, X, BookOpen, Code2, Shield, Zap, Users, BarChart3, Info, Star, Handshake, FileText, Lock, RefreshCw, BookMarked, Calendar, HelpCircle } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link, useNavigate } from "react-router-dom";

/* ─── data ──────────────────────────────────────────────────────────────────── */

const productItems = [
  { title: "Getting Started",     href: "/getting-started", description: "Learn how to use PULSE effectively",        icon: BookOpen,  color: "#1e9df1" },
  { title: "API Reference",       href: "/api",             description: "Build custom integrations with our API",    icon: Code2,     color: "#a855f7" },
  { title: "Security Features",   href: "/security",        description: "Enterprise-grade security and encryption",  icon: Shield,    color: "#22c55e" },
  { title: "Real-time Messaging", href: "/realtime",        description: "Instant message delivery with WebSocket",   icon: Zap,       color: "#f59e0b" },
  { title: "Team Collaboration",  href: "/collaboration",   description: "Tools to help your teams work better",      icon: Users,     color: "#ec4899" },
  { title: "Analytics",           href: "/analytics",       description: "Track and analyze your messaging metrics",  icon: BarChart3, color: "#06b6d4" },
];

const companyItems1 = [
  { title: "About Us",          href: "/about",        description: "Our mission and the team behind PULSE",  icon: Info,      color: "#1e9df1" },
  { title: "Customer Stories",  href: "/stories",      description: "See how teams use PULSE",                icon: Star,      color: "#f59e0b" },
  { title: "Partnerships",      href: "/partnerships", description: "Integrate PULSE with your solutions",    icon: Handshake, color: "#22c55e" },
];

const companyItems2 = [
  { title: "Terms of Service", href: "/terms",         description: "Legal terms and conditions",             icon: FileText,   color: "#94a3b8" },
  { title: "Privacy Policy",   href: "/privacy",       description: "How we protect your data",               icon: Lock,       color: "#94a3b8" },
  { title: "Refund Policy",    href: "/refund",        description: "Our refund and cancellation policy",     icon: RefreshCw,  color: "#94a3b8" },
  { title: "Security Blog",    href: "/security-blog", description: "Security insights and deep-dives",       icon: BookMarked, color: "#94a3b8" },
  { title: "Schedule a Demo",  href: "/contact",       description: "Book a personalised demo",               icon: Calendar,   color: "#1e9df1" },
  { title: "Help Center",      href: "/help",          description: "Get support and find answers",           icon: HelpCircle, color: "#94a3b8" },
];

/* ─── Header ─────────────────────────────────────────────────────────────────── */

const Header = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 4);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header>
      <nav
        className={cn(
          "fixed z-50 w-full px-3 md:px-4 transition-all duration-300 bg-[#0a0a14]",
          isScrolled ? "shadow-lg border-transparent" : "border-b border-white/10"
        )}
      >
        <div
          className={cn(
            "mx-auto transition-all duration-300",
            isScrolled
              ? "max-w-5xl mt-2 rounded-2xl border border-white/10 px-4 bg-[#0d0d1e]/95 backdrop-blur-xl"
              : "max-w-7xl"
          )}
        >
          <div className="relative flex items-center justify-between gap-3 py-3">
            {/* Logo */}
            <Link to="/landing" aria-label="home" className="flex gap-2.5 items-center flex-shrink-0">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">PULSE</span>
            </Link>

            {/* Desktop nav — centred */}
            <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2">
              <DesktopMenus />
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
              <Button
                variant="ghost"
                onClick={() => navigate("/login")}
                className="text-white/80 hover:text-white hover:bg-white/10 border border-white/15 font-medium text-sm"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate("/register")}
                className="bg-[#1e9df1] hover:bg-[#1a8fd6] text-white font-semibold text-sm shadow-md shadow-[#1e9df1]/25"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuState(!menuState)}
              className="lg:hidden p-2 text-white/80 hover:text-white"
            >
              {menuState ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile panel */}
          {menuState && (
            <div className="lg:hidden border-t border-white/10 pb-5 pt-3">
              <MobileMenu onClose={() => setMenuState(false)} navigate={navigate} />
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

/* ─── Desktop dropdown ───────────────────────────────────────────────────────── */

function DesktopMenus() {
  const navigate = useNavigate();

  return (
    <NavigationMenu>
      <NavigationMenuList className="gap-0">
        {/* Pricing */}
        <NavigationMenuItem>
          <NavigationMenuLink
            className={cn(
              navigationMenuTriggerStyle(),
              "bg-transparent text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 cursor-pointer h-9 px-4"
            )}
            onClick={() => navigate("/pricing")}
          >
            Pricing
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Product */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 h-9 px-4 data-[state=open]:bg-white/10 data-[state=open]:text-white">
            Product
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="p-4 w-[560px]">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/35 mb-3 px-2">Product</p>
              <ul className="grid grid-cols-2 gap-0.5">
                {productItems.map((item) => (
                  <DropdownItem key={item.title} item={item} />
                ))}
              </ul>
              <div className="mt-3 pt-3 border-t border-white/10 px-2">
                <button
                  onClick={() => navigate("/contact")}
                  className="text-xs text-[#1e9df1] hover:text-[#1a8fd6] font-medium transition-colors"
                >
                  Interested? Schedule a demo →
                </button>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Company */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 h-9 px-4 data-[state=open]:bg-white/10 data-[state=open]:text-white">
            Company
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="p-4 w-[580px]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/35 mb-3 px-2">Company</p>
                  <ul className="space-y-0.5">
                    {companyItems1.map((item) => (
                      <DropdownItem key={item.title} item={item} />
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/35 mb-3 px-2">Resources</p>
                  <ul className="space-y-0.5">
                    {companyItems2.map((item) => (
                      <DropdownItem key={item.title} item={item} />
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

/* ─── Dropdown row ───────────────────────────────────────────────────────────── */

type NavItem = {
  title: string;
  href: string;
  description: string;
  icon: React.ElementType;
  color: string;
};

function DropdownItem({ item }: { item: NavItem }) {
  const Icon = item.icon;
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={item.href}
          className="flex items-start gap-3 rounded-lg px-2.5 py-2.5 transition-all duration-150 cursor-pointer group"
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.07)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          {/* Coloured icon box */}
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{
              backgroundColor: `${item.color}1a`,
              border: `1px solid ${item.color}40`,
            }}
          >
            <Icon className="w-4 h-4" style={{ color: item.color }} />
          </div>
          {/* Text */}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white leading-none mb-1 group-hover:text-[#1e9df1] transition-colors">
              {item.title}
            </p>
            <p className="text-xs text-white/45 leading-snug line-clamp-2 group-hover:text-white/65 transition-colors">
              {item.description}
            </p>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

/* ─── Mobile menu ─────────────────────────────────────────────────────────────── */

function MobileMenu({ onClose, navigate }: { onClose: () => void; navigate: (p: string) => void }) {
  const sections = [
    { label: "General",  items: [{ title: "Pricing", href: "/pricing", icon: BarChart3, color: "#1e9df1", description: "" }] },
    { label: "Product",  items: productItems },
    { label: "Company",  items: [...companyItems1, ...companyItems2] },
  ];

  return (
    <div className="space-y-5 px-1">
      {sections.map((section) => (
        <div key={section.label}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2 px-2">
            {section.label}
          </p>
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.title}>
                  <button
                    onClick={() => { navigate(item.href); onClose(); }}
                    className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-left transition-colors duration-150"
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.07)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <div
                      className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${item.color}1a`, border: `1px solid ${item.color}40` }}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                    </div>
                    <span className="text-sm text-white/85 font-medium">{item.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <div className="flex flex-col gap-2 pt-3 border-t border-white/10">
        <Button
          variant="ghost"
          onClick={() => { navigate("/login"); onClose(); }}
          className="text-white/80 hover:text-white border border-white/15 w-full"
        >
          Sign In
        </Button>
        <Button
          onClick={() => { navigate("/register"); onClose(); }}
          className="bg-[#1e9df1] hover:bg-[#1a8fd6] text-white w-full"
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}

export { Header };