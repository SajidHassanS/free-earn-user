"use client";

import FaqSection from "@/components/ui/faq";
import { useContextConsumer } from "@/context/Context";
import { useGetFaqList } from "@/hooks/apis/useDashboard";
import { Toaster } from "react-hot-toast";

export default function FAQs() {
  const { token } = useContextConsumer();
  const { data } = useGetFaqList(token);

  const sortedFaqs =
    data?.data
      ?.filter((faq: any) => faq.isEnabled)
      ?.sort((a: any, b: any) => a.order - b.order)
      ?.map((faq: any, index: number) => ({
        id: index + 1,
        question: faq.question,
        answer: faq.answer,
        icon: "❓",
        iconPosition: "left",
      })) ?? [];

  return (
    <>
      <Toaster />
      <div className="space-y-6 p-10 rounded-2xl max-w-4xl mx-auto">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold text-primary ">FAQ&apos;s</h2>
        </div>
        {sortedFaqs?.length <= 0 && <p>No FAQ&apos;s Available</p>}
        <FaqSection data={sortedFaqs} />
      </div>
    </>
  );
}
