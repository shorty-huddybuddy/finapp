import { Navbar2 } from "@/components/Navbar2";
import { Footer } from "@/components/Footer";
import { SpecificEducationPage } from "@/components/Specific_education_page";

interface TopicPageProps {
  params: {
    topic: string;
  };
}

export default function TopicPage({ params }: TopicPageProps) {
  const { topic } = params;

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
