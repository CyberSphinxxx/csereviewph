import type { Metadata } from "next";
import { ReviewTayoHomeView } from "@/components/home/ReviewTayoHomeView";

export const metadata: Metadata = {
  title: "Philippine Exam Reviewer & Mock Tests",
  description:
    "Free Philippine exam reviewer and preparation platform. Practice the Civil Service Exam (CSE-PPT) today with full mock tests, and explore upcoming reviewers.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Philippine Exam Reviewer & Mock Tests | ReviewTayo",
    description:
      "Philippine exam preparation platform. Practice the Civil Service Exam with continuous timers, subtest drills, and discover upcoming licensure reviews.",
    url: "/",
    type: "website",
  },
};

export default function HomePage() {
  return <ReviewTayoHomeView />;
}
