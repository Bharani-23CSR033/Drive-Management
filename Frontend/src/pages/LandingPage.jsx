// src/pages/LandingPage.jsx

import { useRef } from 'react';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorks from '../components/landing/HowItWorks';
import TestimonialsSection from '../components/landing/TestimonialsSection';

const LandingPage = () => {
  const featuresRef = useRef(null);

  return (
    <div className="overflow-x-hidden">
      <HeroSection featuresRef={featuresRef} />
      <FeaturesSection ref={featuresRef} />
      <HowItWorks />
      <TestimonialsSection />
    </div>
  );
};

export default LandingPage;