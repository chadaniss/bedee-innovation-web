/** @format */

import PageTitle from "@/components/PageTitle";
import {
  ShieldQuestion,
  Users,
  ClipboardList,
  ShieldCheck,
} from "lucide-react";
import Card, { CardContent, CardProps } from "@/components/Card";
import BarChart from "@/components/BarChart";
import RecentActive from "./recentActive";

const cardData: CardProps[] = [
  {
    label: "Today",
    amount: "65",
    description: "Will come to the office today",
    icon: Users,
  },
  {
    label: "Active Now",
    amount: "+59",
    description: "Office now",
    icon: ShieldCheck,
  },
  {
    label: "Inactive",
    amount: "-6",
    description: "Where are they?",
    icon: ShieldQuestion,
  },
  {
    label: "Take Leave",
    amount: "3",
    description: "Submit the time off request",
    icon: ClipboardList,
  },
];

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title="Dashboard" />
      <section className="grid w-full grid-cols-1 gap-4 gap-x-8 transition-all sm:grid-cols-2 xl:grid-cols-4">
        {cardData.map((d, i) => (
          <Card
            key={i}
            amount={d.amount}
            description={d.description}
            icon={d.icon}
            label={d.label}
          />
        ))}
      </section>
      <section className="grid grid-cols-1  gap-4 transition-all lg:grid-cols-2">
        <CardContent>
          <p className="p-4 font-semibold">Overview</p>

          <BarChart />
        </CardContent>

        <RecentActive />
      </section>
    </div>
  );
}
