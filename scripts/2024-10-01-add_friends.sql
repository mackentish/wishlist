INSERT INTO "Friend" ("userId", "friendId")
SELECT LEAST(u1."id", u2."id") AS "userId", GREATEST(u1."id", u2."id") AS "friendId"
FROM "User" u1
CROSS JOIN "User" u2
WHERE u1."id" < u2."id"
  AND NOT EXISTS (
      SELECT 1 
      FROM "Friend" f 
      WHERE (f."userId" = LEAST(u1."id", u2."id") AND f."friendId" = GREATEST(u1."id", u2."id"))
  );