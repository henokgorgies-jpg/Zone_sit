import { Link } from "react-router-dom";
import { ArrowRight, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

const FALLBACK_IMAGES = [
  { src: "/images/hero-1.png", alt: "Modern Government Building" },
  { src: "/images/hero-2.png", alt: "Digital Citizen Services" },
  { src: "/images/ceo.png", alt: "Institutional Leadership" },
];

export function HeroSection() {
  const [heroImages, setHeroImages] = useState(FALLBACK_IMAGES);
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchHeroData = async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "hero_carousel")
        .maybeSingle();

      if (data && data.value) {
        try {
          setHeroImages(JSON.parse(data.value));
        } catch (e) {
          console.error("Error parsing hero carousel data", e);
        }
      }
    };
    fetchHeroData();
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground min-h-[600px] flex items-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="gov-container relative py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side: Content */}
          <div className="z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sm mb-6 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gov-teal-light opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-gov-teal-light"></span>
              </span>
              {t('nav.officialGateway')}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-6 animate-slide-up">
              {t('home.welcome')}
              <span className="block text-gov-teal-light font-black uppercase tracking-tighter">Digital Hub</span>
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-xl animate-slide-up" style={{ animationDelay: "0.1s" }}>
              {t('home.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Link to="/services">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 gap-2 h-14 px-8 rounded-full font-bold">
                  <FileText className="h-5 w-5" />
                  {t('common.viewAll')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2 h-14 px-8 rounded-full font-bold">
                  <Users className="h-5 w-5" />
                  {t('about.ourMission')}
                </Button>
              </Link>
            </div>

            {/* Stats - Compact version for grid layout */}
            <div className="mt-12 grid grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
              {[
                { value: "24/7", label: "Availability" },
                { value: "100+", label: "E-Services" },
              ].map((stat) => (
                <div key={stat.label} className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <p className="text-2xl font-black text-gov-teal-light">{stat.value}</p>
                  <p className="text-xs uppercase tracking-widest font-bold text-primary-foreground/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Image Slider */}
          <div className="relative z-10 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden border-8 border-white/10 shadow-2xl">
              <div className="embla h-full" ref={emblaRef}>
                <div className="embla__container h-full flex">
                  {heroImages.map((image, index) => (
                    <div className="embla__slide flex-[0_0_100%] h-full relative" key={index}>
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                      <div className="absolute bottom-8 left-8">
                        <p className="text-white font-black uppercase tracking-widest text-sm opacity-80">{image.alt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gov-teal-light/20 blur-3xl rounded-full" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/20 blur-3xl rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
