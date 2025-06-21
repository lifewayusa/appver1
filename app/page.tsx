'use client';

import UtilityBar from './components/UtilityBar';
import Navbar from './components/Navbar';
import HeroCarousel from './components/HeroCarousel';
import ToolsShowcase from './components/ToolsShowcase';
import WhyUSAStory from './components/WhyUSAStory';
import BlogPodcastTeasers from './components/BlogPodcastTeasers';
import LeadMagnet from './components/LeadMagnet';
import PricingPlans from './components/PricingPlans';
import VisaMatchCTA from './components/VisaMatchCTA';
import SuccessStories from './components/SuccessStories';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main className="bg-white min-h-screen font-figtree">
      {/* Immigration Hot-Line Bar */}
      <UtilityBar />
      
      {/* Branded Navbar */}
      <Navbar />
      
      {/* "Dream Big" Carousel */}
      <HeroCarousel />
      
      {/* Tools Showcase Grid */}
      <section className="pt-[30px] bg-azul-petroleo text-white">
        <h2 className="text-3xl font-baskerville text-white mb-8 text-center w-full">Ferramentas Exclusivas</h2>
        <ToolsShowcase />
      </section>
      
      {/* "Why the USA?" Story Block */}
      <WhyUSAStory />
      
      {/* Latest Blog / Podcast Teasers */}
      <BlogPodcastTeasers />
      
      {/* "Prepare-se para Partir" Lead Magnet */}
      <LeadMagnet />
      
      {/* Pricing Plans Strip */}
      <PricingPlans />
      
      {/* CTA "Simule seu Visto" */}
      <VisaMatchCTA />
      
      {/* Success Stories Carousel */}
      <SuccessStories />
      
      {/* Site Footer */}
      <Footer />
    </main>
  );
}