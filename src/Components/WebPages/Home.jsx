import HeroSection from "./HomeCompo/HeroSection/HeroSection";
import FeaturedProperties from "./HomeCompo/FeaturedProperties/FeaturedProperties";
import FreshPropertiesSection from "./HomeCompo/FreshPropertiesSection/FreshPropertiesSection";
import HighDemandProjects from "./HomeCompo/HighDemandProjects";
import InteriorBanner from "./HomeCompo/InteriorBanner";
import PropertyToolsSection from "./HomeCompo/PropertyToolsSection";
import PropertyCategories from "./HomeCompo/PropertyCategories";
import ExploreServices from "./HomeCompo/ExploreServices";
import ExploreCities from "./HomeCompo/ExploreCities";
import TestimonialsSection from "./HomeCompo/TestimonialsSection";
import FAQSection from "./HomeCompo/FAQSection";

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <FeaturedProperties />


            <FreshPropertiesSection />
            <HighDemandProjects />
            <InteriorBanner />
            <PropertyToolsSection />
            <PropertyCategories />
            <ExploreServices />
            {/* <ExploreCities /> */}
            <TestimonialsSection />
            <FAQSection />
        </>
    );
}