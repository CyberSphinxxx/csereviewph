import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Editorial Support",
  description:
    "Get in touch with the ReviewTayo editorial and technical team for question feedback, corrections, bug reports, and data privacy requests.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
