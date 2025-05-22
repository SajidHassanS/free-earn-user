"use client";

import TabLayout from "@/components/layout/TabLayout";
import InstructionSection from "@/components/ui/InstructionSection";
import { useContextConsumer } from "@/context/Context";
import { useGetInsList } from "@/hooks/apis/useDashboard";

export default function Instructions() {
  const { token } = useContextConsumer();
  const { data } = useGetInsList(token);

  console.log(data, "instructions");

  const instructions =
    data?.data
      ?.filter((item: any) => item.isEnabled)
      ?.sort((a: any, b: any) => a.order - b.order)
      ?.map((item: any, index: number) => ({
        id: index + 1,
        title: item.title,
        description: item.description,
        icon: "📘",
        iconPosition: "left",
      })) ?? [];

  return (
    <TabLayout>
      {instructions?.length <= 0 && <p>No Instructions Available</p>}
      <InstructionSection data={instructions} />
    </TabLayout>
  );
}
