import clientPromise from "@/lib/mongo";
import employeeSeed from "@/app/api/employee/seed/employee.json";

const DB_COLLECTION = 'employee';
async function getCollection() {
  const client = await clientPromise;
  const db = client.db();

  return db.collection(DB_COLLECTION);
}

export async function seedEmployee() {
  const collection = await getCollection();

  return collection.insertMany(employeeSeed);
}

export async function getEmployee() {
  const collection = await getCollection();

  return collection.find().toArray();
}

export async function getEmployeeById(employeeId: string) {
  const collection = await getCollection();

  return collection.findOne({ employeeId });
}

export async function updateEmployee(employeeId: string, update: any) {
  const collection = await getCollection();

  return collection.updateOne({ employeeId }, update);
}