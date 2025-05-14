"use client";

import { Marquee } from "@devnomic/marquee";
import "@devnomic/marquee/dist/index.css";

const DashboardMarquee = () => {
  return (
    <div className="bg-primary/80 text-white text-sm font-medium py-2 relative z-50 w-full">
      <Marquee
        fade={true}
        direction="left"
        pauseOnHover={true}
        className="gap-12 text-white"
      >
        <div>🌾 Welcome to FreeEarn — Explore Marketing Stuffs!</div>
        <div>🚀 FreeEarn is for users managed by admin</div>
        <div>📢 Manage withdrawls, chats with admin and more</div>
        <div>📞 Contact Support for Verification Help</div>
      </Marquee>
    </div>
  );
};

export default DashboardMarquee;
