import { Link } from "react-router-dom";
import { FileText, Download, Phone, HelpCircle, ExternalLink } from "lucide-react";

const quickLinks = [
  {
    icon: FileText,
    title: "Forms & Applications",
    description: "Download official forms and application templates",
    href: "/documents",
  },
  {
    icon: Download,
    title: "Public Documents",
    description: "Access reports, policies, and public records",
    href: "/documents",
  },
  {
    icon: Phone,
    title: "Contact Directory",
    description: "Find contact information for all departments",
    href: "/contact",
  },
  {
    icon: HelpCircle,
    title: "FAQs",
    description: "Get answers to frequently asked questions",
    href: "/about#faq",
  },
];

export function QuickLinksSection() {
  return (
    <section className="gov-section bg-gov-cream">
      <div className="gov-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Quick Access
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find what you need quickly with these frequently accessed resources.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link, index) => (
            <Link
              key={link.title}
              to={link.href}
              className="group bg-card p-6 rounded-lg border border-border hover:border-accent hover:shadow-lg transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <link.icon className="h-6 w-6" />
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                {link.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {link.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
