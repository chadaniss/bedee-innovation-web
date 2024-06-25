import { NextResponse } from "next/server";
import { getEmployee } from "@/app/api/employee/service";

export async function GET() {
  const employee = await getEmployee();

  return NextResponse.json(employee);
}