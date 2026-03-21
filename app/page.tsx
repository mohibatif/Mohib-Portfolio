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
      {/* Mobile view (< 768px): No avatar */}
      <div className="md:hidden">
        <MobileView />
      </div>

      {/* Desktop view (>= 768px): With avatar */}
      <div className="hidden md:block">
        <DesktopView />
      </div>
    </div>
  );
}

function MobileView() {
  return (
    <>
      <div className={styles.avatarHero}>
        <div className={styles.nameOverlay}>
          <NameDisplay isMobile={true} />
        </div>
      </div>
      <MainUI />
    </>
  );
}

function DesktopView() {
  return (
    <>
      <div className={styles.avatarHero}>
        <div className={styles.nameOverlay}>
          <NameDisplay />
        </div>
        <div className={styles.splineContainer}>
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
      <MainUI />
    </>
  );
}

function MainUI() {
  return (
    <>
      <div className={styles.ui}>
        <ChatInterface ownerName="Mohib Atif" />
        <Currently />
        <ToolsSection />
        <ProjectsGrid />
      </div>

      <div className={styles.footer}>
        <ConnectFooter />
      </div>

      <BackToTop />
    </>
  );
}

import { LEDText } from "@/components/LEDText";

// ── LED style name display ─────────────────
function NameDisplay({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <div className={styles.nameContainer}>
      {/* 
        Slightly smaller dots for top name, larger for bottom. 
        Adjust gap and color to taste.
      */}
      <LEDText
        text="MOHIB"
        dotSize={isMobile ? 8 : 7}
        gap={isMobile ? 2 : 3}
        stroke={isMobile ? 1 : 2}
        vStroke={isMobile ? 1 : 2}
        color="rgba(200, 200, 200, 0.05)"
        glowColor="#D0D0D0"
        className={styles.nameTop}
      />

      <LEDText
        text="ATIF"
        dotSize={isMobile ? 8 : 7}
        gap={isMobile ? 2 : 3}
        stroke={isMobile ? 1 : 2}
        vStroke={isMobile ? 1 : 2}
        color="rgba(200, 200, 200, 0.05)"
        glowColor="#D0D0D0"
        className={styles.nameBottom}
      />
    </div>
  );
}
