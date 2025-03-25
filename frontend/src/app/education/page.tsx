import { Navbar2 } from "../../components/Navbar2";
import { Footer } from "../../components/Footer";
import React from "react";
import { FeaturesSectionWithHoverEffects } from "../../components/feature-section-with-hover-effects";

export default function Education() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar2 />
            <div className="w-full flex-grow">
                <FeaturesSectionWithHoverEffects />
            </div>
            <Footer />
        </div>
    );
}


// import React from "react";
// import { FeaturesSectionWithHoverEffects } from "@/components/blocks/feature-section-with-hover-effects";

// function FeaturesSectionWithHoverEffectsDemo() {
//   return (
//     <div className="min-h-screen w-full">
//       <div className="absolute top-0 left-0 w-full">
//         <FeaturesSectionWithHoverEffects />
//       </div>
//     </div>
//   );
// }

// export { FeaturesSectionWithHoverEffectsDemo };
