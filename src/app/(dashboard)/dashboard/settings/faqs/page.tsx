import TabLayout from "@/components/layout/TabLayout";
import FaqSection from "@/components/ui/faq";
import { faqs } from "@/constant/data";

export default function FAQs() {
  return (
    <TabLayout>
      <FaqSection data={faqs} />
    </TabLayout>
  );
}
