import { Firestore } from "@google-cloud/firestore";

let _db: Firestore | null = null;

export function getDb(): Firestore {
  if (_db) return _db;
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!key) throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY is not set");
  const credentials = JSON.parse(key);
  _db = new Firestore({ projectId: "second-form-499516-a2", credentials });
  return _db;
}
