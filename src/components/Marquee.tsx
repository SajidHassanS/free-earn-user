"use client";

import { useContextConsumer } from "@/context/Context";
import { useGetMarqueeList } from "@/hooks/apis/useMarquee";
import { Marquee } from "@devnomic/marquee";
import "@devnomic/marquee/dist/index.css";

const DashboardMarquee = () => {
  const { token } = useContextConsumer();
  const { data } = useGetMarqueeList(token);

  const sortedMarqueeMessages =
    data?.data
      ?.filter((item: any) => item.isEnabled)
      ?.sort((a: any, b: any) => a.order - b.order) || [];

  return (
    <div className="bg-primary/80 text-white text-sm font-medium py-2 relative z-50 w-full">
      <Marquee
        fade={true}
        direction="left"
        pauseOnHover={true}
        className="gap-12 text-white"
      >
        {sortedMarqueeMessages.length > 0 ? (
          sortedMarqueeMessages.map((item: any) => (
            <div key={item.uuid}>{item.message}</div>
          ))
        ) : (
          <div>No active marquees available</div>
        )}
      </Marquee>
    </div>
  );
};

export default DashboardMarquee;
