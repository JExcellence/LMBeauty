import { Metadata } from "next";
import { AboutPage } from "@/components/pages/about";

export const metadata: Metadata = {
    title: "Über mich | LM Beauty",
    description: "Lisa Marie. Wimpern seit 2019. Ein kleines Studio in Mönchengladbach-Rheydt – ruhig, persönlich, ohne Hektik.",
    openGraph: {
        title: "Über mich | LM Beauty",
        description: "Lisa Marie. Wimpern seit 2019. Ein kleines Studio in Mönchengladbach.",
        type: "website",
    },
};

/**
 * "Über LM Beauty" Page
 * 
 * Tier 1: Trust & Connection
 * Personal, warm, authentic. Lisa's story.
 * Focus on connection, not credentials.
 */
export default function UeberLMBeautyPage() {
    return <AboutPage />;
}
