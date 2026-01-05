import { Link } from "react-router-dom";
import { Building2, Phone, Mail, MapPin, Facebook, Twitter, Youtube } from "lucide-react";

const footerLinks = [
  {
    title: "Government",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Leadership", href: "/leadership" },
      { label: "Departments", href: "/departments" },
      { label: "Constitutional Laws", href: "/documents?category=laws" },
      { label: "Projects & Programs", href: "/page/projects" },
    ]
  },
  {
    title: "Citizen Services",
    links: [
      { label: "All Services", href: "/services" },
      { label: "Online Applications", href: "/page/e-portal" },
      { label: "Service Requirements", href: "/services" },
      { label: "Forms & Downloads", href: "/documents" },
      { label: "Help & FAQs", href: "/page/faqs" },
    ]
  },
  {
    title: "Transparency",
    links: [
      { label: "News & Releases", href: "/news" },
      { label: "Reports & Publications", href: "/reports" },
      { label: "Tenders & Vacancies", href: "/tenders" },
      { label: "Open Data Portal", href: "/page/open-data" },
      { label: "Strategic Plans", href: "/page/strategic-plans" },
    ]
  },
  {
    title: "Engagement",
    links: [
      { label: "Feedback & Suggestions", href: "/page/engagement" },
      { label: "Contact Support", href: "/contact" },
      { label: "Public Consultation", href: "/page/consultation" },
      { label: "Media Gallery", href: "/page/gallery" },
      { label: "Privacy Policy", href: "/page/privacy" },
    ]
  }
];

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200 border-t border-slate-800">
      <div className="gov-container py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          {/* Institutional Branding */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-xl shadow-primary/20">
                <Building2 className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xl font-black text-white tracking-tighter leading-none uppercase">Government Portal</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Official Digital Gateway</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              We are committed to providing transparent, efficient, and inclusive public services. Our digital portal serves as the primary bridge between the institution and the citizens we serve.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-primary hover:text-white transition-all duration-300">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Categorized Links */}
          {footerLinks.map((cat) => (
            <div key={cat.title} className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{cat.title}</h3>
              <ul className="space-y-4">
                {cat.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                    >
                      <div className="h-1 w-0 bg-primary group-hover:w-2 transition-all rounded-full" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 rounded-[2rem] bg-slate-800/50 border border-slate-700/50 mb-16">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-slate-800 text-primary">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-500">Legal Address</p>
              <p className="text-sm font-bold text-white">123 Government St, Capital HQ</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-slate-800 text-primary">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-500">Service Hotline</p>
              <p className="text-sm font-bold text-white">+1 (555) 012-3456</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-slate-800 text-primary">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-500">Email Inquiry</p>
              <p className="text-sm font-bold text-white">support@gov.portal.org</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <p className="text-center text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} Government Institution. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
