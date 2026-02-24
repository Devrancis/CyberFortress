"use client";

import { useState, useEffect } from "react";

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      url: "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Smiling female business owner",
      quote: '"CyberShield caught the phishing attempt before it even reached my inbox. Total peace of mind."',
      author: "- Amina Y. CEO of LogisticsPro"
    },
    {
      url: "https://images.unsplash.com/photo-1676151216182-765f05bb43d6?q=80&w=698&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Smiling male tech founder",
      quote: '"The AI triage isolated a ransomware payload in seconds. They literally saved our entire database."',
      author: "- Chidi O. Founder of AgroSecure"
    },
    {
      url: "https://plus.unsplash.com/premium_photo-1698527167839-02bb12a80d12?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Relieved business team",
      quote: '"Compliance used to be our biggest headache. Now, it is fully automated and we pass every audit."',
      author: "- Sarah T. Director at FinTech NG"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="hidden md:block relative h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-700 group">
      
      {slides.map((slide, index) => {
        const isActive = index === currentIndex;
        
        return (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out
              ${isActive ? "opacity-100 z-10" : "opacity-0 z-0"}
            `}
          >
            {/* The Image */}
            <img 
              src={slide.url} 
              alt={slide.alt} 
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* The Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
            
            {/* The Glassmorphism Text Box */}
            <div className={`absolute bottom-6 left-6 right-6 transition-all duration-1000 delay-200 ${isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-xl">
                <p className="text-sm font-medium text-white leading-relaxed">{slide.quote}</p>
                <p className="text-xs text-cyan-400 mt-3 font-bold tracking-wide">{slide.author}</p>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Dots (Hidden until hover for a cleaner look) */}
      <div className="absolute top-4 right-4 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 
              ${index === currentIndex ? "bg-cyan-500 w-6" : "bg-white/40 hover:bg-white/80"}
            `}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}