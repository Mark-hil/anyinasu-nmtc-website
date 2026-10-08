import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import schoolLogo from "@/assets/school-logo.png";

const Footer = () => {
  return (
    <footer className="bg-college-green-dark text-primary-foreground">
      <div className="container-max px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={schoolLogo}
                alt="School Logo"
                className="w-10 h-10 object-contain bg-white/95 rounded-full p-0.5 shadow-sm"
              />
              <span className="font-bold text-base">S.D.A Nursing & Midwifery</span>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              S.D.A Nursing and Midwifery Training College - Anyinasu is dedicated to producing competent, compassionate healthcare professionals who serve communities across Ghana and beyond.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-80">
              {[
                { label: "About Us", path: "/about" },
                { label: "Our Courses", path: "/courses" },
                { label: "Meet Our Staff", path: "/staff" },
                { label: "News & Events", path: "/news" },
                { label: "Contact / Apply", path: "/contact" },
                { label: "Verify a Transcript", path: "/verify-transcript" },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="hover:opacity-100 transition-opacity">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm opacity-80">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Anyinasu, Ashanti Region, Ghana</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+233 20 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <span>info@Anyinasuntc.edu.gh</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm opacity-80 mb-3">Stay updated with college news and events.</p>
            <div className="flex gap-2">
              <Input
                placeholder="Your email"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 text-sm"
              />
              <Button size="icon" className="bg-college-gold hover:bg-college-gold/90 text-college-gold-foreground shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-primary-foreground/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs opacity-60">
            © {new Date().getFullYear()} S.D.A Nursing and Midwifery Training College - Anyinasu. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="opacity-60 hover:opacity-100 transition-opacity">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
