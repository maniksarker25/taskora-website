import Cta from "@/components/home/Cta";
import CustomerReview from "@/components/home/CustomerReview";
import FAQ from "@/components/home/FAQ";
import HeroSection from "@/components/home/HeroSection";
import HowWorks from "@/components/home/HowWorks";
import PopularCategory from "@/components/home/PopularCategory";
import PopularService from "@/components/home/PopularService";
import Servify from "@/components/home/Servify";
import TrustBar from "@/components/home/TrustBar";
import MainLayout from "../main-layout";

const HomePage = () => {
  return (
    <MainLayout>
      <div>
        <HeroSection />
        <TrustBar />
        <PopularCategory />
        <PopularService />
        <HowWorks />
        <Servify />
        <CustomerReview />
        <FAQ></FAQ>
        <Cta />
      </div>
    </MainLayout>
  );
};

export default HomePage;
