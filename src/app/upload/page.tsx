"use client"

import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangeEvent, FormEvent, useState } from "react";
import { Label } from "@/components/ui/label";

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [employeeId, setEmployeeId] = useState<string>('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUserIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmployeeId(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file || !employeeId) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('employeeId', employeeId);

    const res = await fetch(`/api/employee/image`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    console.log(data);
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      <PageTitle title="Upload" />
        <div className="preview flex min-h-[350px] w-full justify-center p-10 items-center">
          <form onSubmit={handleSubmit} className="w-2/3 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                type="text"
                name="employeeId"
                placeholder="Employee ID"
                value={employeeId}
                onChange={handleUserIdChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file">File</Label>
              <Input
                type="file"
                onChange={handleFileChange}
                required
              />
            </div>
          <Button type="submit">Upload</Button>
        </form>
      </div>
    </div>
  );
};

export default Upload;