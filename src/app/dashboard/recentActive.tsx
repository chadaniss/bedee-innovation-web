/** @format */
"use client";

import { CardContent } from "@/components/Card";
import ActiveCard, { ActiveProps } from "@/components/ActiveCard";
import { useEffect, useState } from "react";

export default function RecentActive() {
  const [checkInData, setCheckInData] = useState<ActiveProps[]>([]);

  const fetchCheckInData = async () => {
    try {
      const response = await fetch("/api/clock-in-out/check-in-report");
      const result = await response.json();

      // Map the data
      const fetchedData = result.map((item: any) => ({
        name: `${item.employee.firstName} ${item.employee.lastName}`,
        id: item.employeeId,
        time: item.time,
      }));

      setCheckInData(fetchedData);
    } catch (error) {
      console.log("fetch check-in error: ", error);
    }
  };

  useEffect(() => {
    fetchCheckInData();
  }, []);

  const recentData = checkInData.slice(0, 5);

  return (
    <CardContent className="flex justify-between gap-4">
      <section>
        <p>Recent Active</p>
        <p className="text-sm text-gray-400">
          {checkInData.length} active this today.
        </p>
      </section>
      {recentData.map((d, i) => (
        <ActiveCard key={i} id={d.id} name={d.name} time={d.time} />
      ))}
    </CardContent>
  );
}
