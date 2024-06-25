import { NextResponse } from 'next/server';
import { seedEmployee } from '@/app/api/employee/service';

export async function GET() {
  const result = await seedEmployee();

  return NextResponse.json({ result });
}