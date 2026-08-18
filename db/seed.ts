import { PageView, db } from "../src/lib/db";

await db.insert(PageView).values([
  { date: new Date(), url: "/" },
  { date: new Date(Date.now() - 1000), url: "/test" },
]);
