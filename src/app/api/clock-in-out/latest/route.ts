import { NextResponse } from "next/server";
import { getLatestActivities } from "../service";

export async function GET() {
  const activities = await getLatestActivities();

  return NextResponse.json(activities);
}