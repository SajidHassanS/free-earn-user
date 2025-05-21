"use client";

import TabLayout from "@/components/layout/TabLayout";
import FaqSection from "@/components/ui/faq";
import { useContextConsumer } from "@/context/Context";
import { useGetFaqList } from "@/hooks/apis/useDashboard";

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
    <TabLayout>
      <FaqSection data={sortedFaqs} />
    </TabLayout>
  );
}
