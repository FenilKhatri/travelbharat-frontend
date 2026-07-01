import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import http from "../../../../../../lib/axios";
import { statsService } from "../../../../../../services/statsService";

const fallbackSlides = [
  {
    title: "Experience The Timeless Beauty of Rani Ki Vav",
    subtitle:
      "Explore Gujarat’s UNESCO World Heritage marvel filled with royal carvings, ancient architecture, and breathtaking underground artistry.",
    image:
      "https://plus.unsplash.com/premium_photo-1661919589683-f11880119fb7?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    buttonText: "Explore Heritage",
    buttonLink: "/destinations/gujarat/patan/rani-ki-vav",
  },
  {
    title: "Witness The Grandeur Of Jaipur",
    subtitle:
      "Discover majestic forts, royal palaces, colorful bazaars, and Rajasthan’s rich cultural heritage.",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=1600&auto=format&fit=crop",
    buttonText: "Explore Jaipur",
    buttonLink: "/states/rajasthan",
  },
  {
    title: "Discover The Serenity Of Kerala",
    subtitle:
      "Cruise through peaceful backwaters, lush tea gardens, tropical beaches, and authentic South Indian culture.",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1600&auto=format&fit=crop",
    buttonText: "Explore Kerala",
    buttonLink: "/states/kerala",
  },
  {
    title: "Adventure Through The Himalayas",
    subtitle:
      "Experience snow-capped mountains, spiritual valleys, monasteries, and unforgettable trekking destinations.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop",
    buttonText: "Explore Himalayas",
    buttonLink: "/states/himachal-pradesh",
  },
  {
    title: "Feel The Energy Of Mumbai",
    subtitle:
      "Dive into India’s city of dreams filled with iconic skylines, street food, nightlife, and Bollywood culture.",
    image:
      "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=1600&auto=format&fit=crop",
    buttonText: "Explore Mumbai",
    buttonLink: "/states/maharashtra",
  },
];

export const useHeroData = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const { data: statsData } = useQuery({
    queryKey: ["publicStats"],
    queryFn: () => statsService.getPublicStats(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: banners } = useQuery({
    queryKey: ["activeBanners"],
    queryFn: async () => {
      const res = await http.get("/admin/banners/active");
      return res.data?.banners || [];
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const sliderData = useMemo(() => {
    if (
      banners &&
      banners.length >= 5 &&
      banners.every((banner) => banner?.image && banner?.title && banner?.subtitle)
    ) {
      return [...banners].slice(0, 5).map((banner) => ({
        title: banner.title,
        subtitle: banner.subtitle,
        image: banner.image,
        buttonText: banner.buttonText || "Explore Now",
        buttonLink: banner.targetUrl || "/states",
      }));
    }
    return fallbackSlides;
  }, [banners]);

  const currentBanner = sliderData[currentSlide] || fallbackSlides[0];

  useEffect(() => {
    if (isHovered) return;

    const autoSlide = setInterval(() => {
      setCurrentSlide((prev) => (prev >= sliderData.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(autoSlide);
  }, [currentSlide, isHovered, sliderData.length]);

  const handleCTAClick = () => {
    const link = currentBanner.buttonLink || "/states";
    if (link.startsWith("/")) {
      navigate(link);
    } else {
      window.location.href = link;
    }
  };

  return {
    statsData,
    sliderData,
    currentBanner,
    currentSlide,
    setCurrentSlide,
    setIsHovered,
    handleCTAClick,
  };
};
