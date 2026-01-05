import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Building2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

import { useTranslation } from "react-i18next";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  const navCategories = [
    {
      title: t('nav.government'),
      items: [
        { label: t('nav.aboutUs'), href: "/about", description: t('about.subtitle') }, // Using about.subtitle as fallback/similar
        { label: t('nav.departments'), href: "/departments", description: t('departments.subtitle') },
        { label: t('nav.leadership'), href: "/leadership", description: t('leadership.subtitle') },
        { label: t('nav.projects'), href: "/page/projects", description: t('home.featuredProjects') },
      ]
    },
    {
      title: t('nav.services'),
      items: [
        { label: t('nav.citizenServices'), href: "/services", description: t('services.subtitle') },
        { label: t('nav.businessServices'), href: "/services?tab=business", description: t('services.subtitle') },
        { label: t('nav.ePortal'), href: "/page/e-portal", description: t('nav.officialGateway') },
        { label: t('nav.formsDocuments'), href: "/documents", description: t('documents.subtitle') },
      ]
    },
    {
      title: t('nav.information'),
      items: [
        { label: t('nav.newsAnnouncements'), href: "/news", description: t('news.subtitle') },
        { label: t('nav.lawsPolicies'), href: "/documents?category=legal", description: t('documents.subtitle') },
        { label: t('nav.reportsPublications'), href: "/reports", description: t('reports.subtitle') },
        { label: t('nav.tendersVacancies'), href: "/tenders", description: t('tenders.subtitle') },
      ]
    },
    {
      title: t('nav.engagement'),
      items: [
        { label: t('nav.citizenEngagement'), href: "/page/engagement", description: t('engagement.subtitle') },
        { label: t('nav.helpFaqs'), href: "/page/faqs", description: t('faqs.subtitle') },
        { label: t('nav.mediaGallery'), href: "/page/gallery", description: t('gallery.subtitle') },
        { label: t('nav.contactUs'), href: "/contact", description: t('contact.subtitle') },
      ]
    }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="gov-container">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xl font-black text-foreground tracking-tighter leading-none">GOVERNMENT PORTAL</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{t('nav.officialGateway')}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-2">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/" className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-bold transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                    location.pathname === "/" && "text-primary"
                  )}>
                    {t('nav.home')}
                  </Link>
                </NavigationMenuItem>

                {navCategories.map((cat) => (
                  <NavigationMenuItem key={cat.title}>
                    <NavigationMenuTrigger className="bg-transparent font-bold text-sm">
                      {cat.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] bg-card border rounded-xl shadow-2xl">
                        {cat.items.map((item) => (
                          <li key={item.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={item.href}
                                className="block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground focus:bg-muted focus:text-accent-foreground"
                              >
                                <div className="text-sm font-bold leading-none">{item.label}</div>
                                <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                  {item.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Action Area */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex">
              <LanguageSwitcher />
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <Link to="/admin">
                <Button variant="outline" size="sm" className="font-bold border-primary/20 hover:border-primary/50">
                  {t('nav.staffPortal')}
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="xl:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="xl:hidden py-6 border-t border-border animate-slide-up bg-card">
            <div className="flex flex-col gap-4">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="px-4 text-sm font-black uppercase tracking-widest text-primary">{t('nav.home')}</Link>

              {navCategories.map(cat => (
                <div key={cat.title} className="space-y-2 px-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">{cat.title}</p>
                  <div className="grid grid-cols-1 gap-1">
                    {cat.items.map(item => (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="py-2 text-sm font-bold hover:text-primary transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              <div className="px-4 pt-4 border-t space-y-3">
                <LanguageSwitcher />
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full font-bold">{t('nav.staffPortal')}</Button>
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
