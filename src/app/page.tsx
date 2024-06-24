/** @format */

import PageTitle from "@/components/PageTitle";
import Image from "next/image";
import {
  ShieldQuestion,
  Users,
  ClipboardList,
  ShieldCheck,
} from "lucide-react";
import Card, { CardContent, CardProps } from "@/components/Card";
import BarChart from "@/components/BarChart";
import ActiveCard, { ActiveProps } from "@/components/ActiveCard";

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

const userActiveData: ActiveProps[] = [
  {
    name: "Chadanis Worapant",
    id: "523456",
    time: "08:02:22",
  },
  {
    name: "Soravis Prommas",
    id: "589263",
    time: "07:59:54",
  },
  {
    name: "Yossapol Witayanont",
    id: "517809",
    time: "07:55:29",
  },
  {
    name: "Phanichpitcha Punyawiboolkit",
    id: "576214",
    time: "07:47:13",
  },
  {
    name: "Natcha Tosilanon",
    id: "527404",
    time: "07:45:09",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-5  w-full">
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
        <CardContent className="flex justify-between gap-4">
          <section>
            <p>Recent Active</p>
            <p className="text-sm text-gray-400">65 active this today.</p>
          </section>
          {userActiveData.map((d, i) => (
            <ActiveCard
              key={i}
              id={d.id}
              name={d.name}
              time={d.time}
            />
          ))}
        </CardContent>

        {/*  */}
      </section>
    </div>
  );
}
