import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogIn, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import schoolLogo from "@/assets/school-logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Courses", path: "/courses" },
  { label: "Staff", path: "/staff" },
  { label: "Gallery", path: "/gallery" },
  { label: "News", path: "/news" },
  { label: "Events", path: "/events" },
  { label: "Contact", path: "/contact" },
];

const portalLinks = [
  { label: "Student Portal", path: "/portal" },
  { label: "Staff Portal", path: "/staff-portal" },
  { label: "LMS", path: "/lms" },
  { label: "Fee Payment", path: "/fees" },
  { label: "Admin Dashboard", path: "/admin" },
];

const moreLinks = [
  { label: "Admissions", path: "/admissions" },
  { label: "Downloads", path: "/downloads" },
  { label: "Announcements", path: "/announcements" },
  { label: "Alumni", path: "/alumni" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
      <div className="container-max flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src={schoolLogo}
            alt="School Logo"
            className="w-10 h-10 object-contain drop-shadow-sm"
          />
          <div className="hidden sm:block">
            <span className="font-bold text-sm leading-none text-foreground">S.D.A Nursing & Midwifery</span>
            <span className="block text-xs text-muted-foreground leading-none mt-1">Training College - Anyinasu</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-secondary hover:text-secondary-foreground ${location.pathname === link.path ? "bg-secondary text-secondary-foreground" : "text-muted-foreground"
                }`}>
              {link.label}
            </Link>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger className="px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-secondary hover:text-secondary-foreground text-muted-foreground flex items-center gap-1">
              More <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {moreLinks.map(link => (
                <DropdownMenuItem key={link.path} asChild>
                  <Link to={link.path}>{link.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex items-center gap-2">
          {/* Portals menu commented out
          <DropdownMenu>
            <DropdownMenuTrigger className="hidden md:flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <LogIn className="h-3.5 w-3.5" /> Portals <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {portalLinks.map(link => (
                <DropdownMenuItem key={link.path} asChild>
                  <Link to={link.path}>{link.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          */}

          <Link to="/admissions">
            <Button size="sm" className="hidden sm:inline-flex bg-college-red hover:bg-college-red/90 text-college-red-foreground">
              Apply Now
            </Button>
          </Link>
          <button className="lg:hidden p-2 text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t bg-background">
          <nav className="container-max px-4 py-4 flex flex-col gap-1">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}
                className={`px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${location.pathname === link.path ? "bg-secondary text-secondary-foreground" : "text-muted-foreground hover:bg-secondary"
                  }`}>
                {link.label}
              </Link>
            ))}

            {/* Portals in mobile commented out
            <div className="border-t my-2" />
            <p className="px-3 text-xs text-muted-foreground font-semibold uppercase tracking-wide">Portals</p>
            {portalLinks.map(link => (
              <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 text-sm font-medium rounded-md text-muted-foreground hover:bg-secondary">
                {link.label}
              </Link>
            ))}
            */}

            <div className="border-t my-2" />
            <p className="px-3 text-xs text-muted-foreground font-semibold uppercase tracking-wide">More</p>
            {moreLinks.map(link => (
              <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 text-sm font-medium rounded-md text-muted-foreground hover:bg-secondary">
                {link.label}
              </Link>
            ))}
            <Link to="/admissions" onClick={() => setMobileOpen(false)}>
              <Button size="sm" className="w-full mt-2 bg-college-red hover:bg-college-red/90 text-college-red-foreground">
                Apply Now
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
