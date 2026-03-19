"use client";
import dynamic from "next/dynamic";
import { ChatInterface } from "@/components/ChatInterface/ChatInterface";
import { Currently } from "@/components/Currently";
import { ToolsSection } from "@/components/ToolsSection";
import ProjectsGrid from "@/components/ProjectsGrid";
import { ConnectFooter } from "@/components/ConnectFooter";
import { BackToTop } from "@/components/BackToTop";
import { SplineScene } from "@/components/ui/splite";
import styles from "./page.module.css";

export default function Home() {

  return (
    <div className={styles.layout}>
      {/* ── Avatar hero with name behind ─────────────── */}
      <div className={styles.avatarHero}>
        {/* Name sits behind the 3D canvas */}
        <div className={styles.nameOverlay}>
          <NameDisplay />
        </div>

        <div
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 10, position: 'absolute', top: '150px', transform: 'scale(1.4)' }}
        >
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>


      {/* ── Interactive UI below avatar ───────────── */}
      <div className={styles.ui}>
        <ChatInterface
          ownerName="Mohib Atif"
        />

        <Currently />
        <ToolsSection />
        <ProjectsGrid />
      </div>

      {/* ── Footer ─────────────────────────────────── */}
      <div className={styles.footer}>
        <ConnectFooter />
      </div>

      <BackToTop />
    </div>
  );
}

import { LEDText } from "@/components/LEDText";

// ── LED style name display ─────────────────
function NameDisplay() {
  return (
    <div className={styles.nameContainer}>
      {/* 
        Slightly smaller dots for top name, larger for bottom. 
        Adjust gap and color to taste.
      */}
      <LEDText
        text="MOHIB"
        dotSize={7}
        gap={3}
        stroke={2}
        vStroke={2}
        color="rgba(200, 200, 200, 0.05)"
        glowColor="#D0D0D0"
        className={styles.nameTop}
      />

      <LEDText
        text="ATIF"
        dotSize={7}
        gap={3}
        stroke={2}
        vStroke={2}
        color="rgba(200, 200, 200, 0.05)"
        glowColor="#D0D0D0"
        className={styles.nameBottom}
      />
    </div>
  );
}
