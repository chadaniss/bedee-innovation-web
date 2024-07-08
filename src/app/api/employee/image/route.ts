import { mkdir, unlink, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { updateEmployee } from "../service";

const IMAGE_FOLDER = 'camera/known_faces';

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const file = formData.get('file') as File;
  if (!file) return NextResponse.json({ error: 'FILE_REQUIRED' }, { status: 400 });

  const employeeId = formData.get('employeeId') as string;
  if (!employeeId) return NextResponse.json({ error: 'EMPLOYEE_ID_REQUIRED' }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = file.name.replaceAll(' ', '_');

  try {
    const filePath = `${IMAGE_FOLDER}/${employeeId}`;
    const fullPath = `${filePath}/${fileName}`;

    await mkdir(filePath, { recursive: true });
    await writeFile(fullPath, buffer);
    await updateEmployee(employeeId, { $push: { images: fullPath }});

    return NextResponse.json({ message: 'IMAGE_UPLOADED' });
  } catch (error) {
    console.log('UPLOAD_FAILED: ', error);

    return NextResponse.json({ error: 'UPLOAD_FAILED' }, { status: 500 });
  }
}