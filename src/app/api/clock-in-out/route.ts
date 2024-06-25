import { NextRequest, NextResponse } from 'next/server';
import { clockInOut } from '@/app/api/clock-in-out/service';
import { getEmployeeById } from '../employee/service';

export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  const { employeeId } = await req.json();
  if (!employeeId) {
    const error = 'EMPLOYEE_ID_REQUIRED';
    return NextResponse.json({ error }, { status: 400 });
  }

  const employee = await getEmployeeById(employeeId);
  if (!employee) {
    const error = 'EMPLOYEE_NOT_FOUND';
    return NextResponse.json({ error }, { status: 404 });
  }

  const message = await clockInOut(employeeId, employee);

  return NextResponse.json({ message });
}
