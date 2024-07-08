import { NextApiRequest } from "next";
import { getEmployeeById } from "../service";
import { NextResponse } from "next/server";

interface Params {
  id: string;
}

export async function GET(req: NextApiRequest, context: { params: Params }) {
  const { id } = context.params;
  const employee = await getEmployeeById(id);

  return NextResponse.json(employee);
}