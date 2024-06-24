/** @format */
"use client";
import React from "react";
import {
  BarChart as BarGraph,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Bar,
} from "recharts";

type Props = {};

const data = [
  {
    name: "BD",
    total: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "BP",
    total: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "MKT",
    total: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "OPR",
    total: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "PD",
    total: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "TS",
    total: Math.floor(Math.random() * 100) + 1,
  },
  {
    name: "HR",
    total: Math.floor(Math.random() * 100) + 1,
  },
];

export default function BarChart({}: Props) {
  return (
    <ResponsiveContainer width={"100%"} height={350}>
      <BarGraph data={data}>
        <XAxis
          dataKey={"name"}
          tickLine={false}
          axisLine={false}
          stroke="#888888"
          fontSize={12}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          stroke="#888888"
          fontSize={12}
          tickFormatter={(value) => `${value}%`}
        />
        <Bar dataKey={"total"} radius={[4, 4, 0, 0]} />
      </BarGraph>
    </ResponsiveContainer>
  );
}
