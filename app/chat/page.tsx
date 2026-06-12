import { Suspense } from "react";
import ChatPage from "./ChatPage";
import { PageLoader } from "@/components/ui/LoadingSpinner";

export default function Page() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ChatPage />
    </Suspense>
  );
}
