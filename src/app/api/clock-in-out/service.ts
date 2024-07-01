import dayjs from "@/lib/dayjs";
import clientPromise from "@/lib/mongo";
import { ObjectId } from "mongodb";

const DB_COLLECTION = 'clock_in_out';
async function getCollection() {
  const client = await clientPromise;
  const db = client.db();

  return db.collection(DB_COLLECTION);
}

function getTodayRange() {
  const now = dayjs().tz();
  const startOfDay = now.startOf('day').toDate();
  const endOfDay = now.endOf('day').toDate();

  return { now: now.toDate(), startOfDay, endOfDay };
}

async function findTodayRecords(
  employeeId: string,
  startOfDay: Date,
  endOfDay: Date
) {
  const collection = await getCollection();

  return collection.find({
    employeeId,
    timestamp: {
      $gte: startOfDay,
      $lte: endOfDay
    }
  }).toArray();
}

function toDateTime(timestamp: Date) {
  return {
    date: dayjs(timestamp).tz().format('YYYY-MM-DD'),
    time: dayjs(timestamp).tz().format('HH:mm:ss')
  };
}

function toInsertData(
  employeeId: string,
  employee: object,
  timestamp: Date,
  type: string,
) {
  const { date, time } = toDateTime(timestamp);

  return {
    employeeId,
    employee,
    timestamp,
    date,
    time,
    type
  };
}

async function insertCheckIn(
  employeeId: string,
  employee: object,
  timestamp: Date
) {
  const collection = await getCollection();
  const data = toInsertData(employeeId, employee, timestamp, 'IN');

  return collection.insertOne(data);
}

async function insertCheckOut(
  employeeId: string,
  employee: object,
  timestamp: Date
) {
  const collection = await getCollection();
  const data = toInsertData(employeeId, employee, timestamp, 'OUT');

  return collection.insertOne(data);
}

async function updateCheckOut(
  _id: ObjectId,
  timestamp: Date
) {
  const collection = await getCollection();
  const { date, time } = toDateTime(timestamp);

  return collection.updateOne(
    { _id },
    {
      $set: {
        timestamp,
        date,
        time,
        type: 'OUT'
      }
    }
  );

}

export async function clockInOut(
  employeeId: string,
  employee: object,
) {
  const { now, startOfDay, endOfDay } = getTodayRange();
  const todayRecords = await findTodayRecords(
    employeeId,
    startOfDay,
    endOfDay
  );

  let message = '';
  if (todayRecords.length === 0) {
    await insertCheckIn(employeeId, employee, now);
    message = 'CHECKED_IN';
  }
  if (todayRecords.length === 1) {
    await insertCheckOut(employeeId, employee, now);
    message = 'CHECKED_OUT';
  }
  if (todayRecords.length > 1) {
    const _id = todayRecords[todayRecords.length - 1]._id;
    await updateCheckOut(_id, now)
    message = 'CHECKED_OUT';
  }

  return { message };
}

export async function getLatestActivities(type?: string) {
  const collection = await getCollection();

  return collection
    .find({ type })
    .sort({ timestamp: -1 })
    .limit(10)
    .toArray();
}