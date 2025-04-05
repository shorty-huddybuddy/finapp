import { Navbar2 } from "@/components/Navbar2";
import { Footer } from "@/components/Footer";
import { SpecificEducationPage } from "@/components/Specific_education_page";



export default async function TopicPage({ params }: any) {
  // Await params to ensure it's resolved
  const topic = await Promise.resolve(params.topic);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar2 />
      <div className="w-full flex-grow">
        <SpecificEducationPage topic={topic} />
      </div>
      <Footer />
    </div>
  );
}
