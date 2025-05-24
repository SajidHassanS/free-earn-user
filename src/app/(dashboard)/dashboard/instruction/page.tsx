"use client";

import InstructionSection from "@/components/ui/InstructionSection";
import { useContextConsumer } from "@/context/Context";
import { useGetInsList } from "@/hooks/apis/useDashboard";
import { Toaster } from "react-hot-toast";

export default function Instructions() {
  const { token } = useContextConsumer();
  const { data } = useGetInsList(token);

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
    <>
      <Toaster />
      <div className="space-y-6 p-10 rounded-2xl max-w-4xl mx-auto">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold text-primary ">Instructions</h2>
        </div>
        {instructions?.length <= 0 && <p>No Instructions Available</p>}
        <InstructionSection data={instructions} />
      </div>
    </>
  );
}
