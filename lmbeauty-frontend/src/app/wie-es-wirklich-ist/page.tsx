import { Metadata } from "next";
import { RealityPage } from "@/components/pages/reality";

export const metadata: Metadata = {
    title: "Wie es wirklich ist | LM Beauty",
    description: "Deine Fragen. Ehrliche Antworten. Erfahre, was dich bei deinem ersten Wimperntermin wirklich erwartet – ohne Verkaufssprache, ohne Übertreibung.",
    openGraph: {
        title: "Wie es wirklich ist | LM Beauty",
        description: "Erfahre, was dich bei deinem ersten Wimperntermin wirklich erwartet.",
        type: "website",
    },
};

/**
 * "Wie es wirklich ist" Page
 * 
 * Anxiety-reduction page for nervous first-timers.
 * Addresses the 3 main fears: pain, unnatural look, inability to relax.
 * 
 * Conversion Goal: "Okay, it's not scary. I can do this."
 */
export default function WieEsWirklichIstPage() {
    return <RealityPage />;
}
