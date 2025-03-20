import { PostFeed } from "@/components/post-feed";
import { Chatbot } from "@/components/Chatbot";
export default function Home() {
  return (
    <div className="container max-w-4xl mx-auto">
      <PostFeed />
      <Chatbot />
    </div>
  );
}
