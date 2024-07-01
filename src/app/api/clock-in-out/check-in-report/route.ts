import { NextResponse } from "next/server";
import { getLatestActivities } from "../service";

export async function GET() {
  const activities = await getLatestActivities('IN');

  return NextResponse.json(activities);
}