-- This was manually added to change table names to all be Pascall case
ALTER TABLE IF EXISTS "user" RENAME TO "User";
ALTER TABLE IF EXISTS "list" RENAME TO "List";
ALTER TABLE IF EXISTS "listItem" RENAME TO "ListItem";
ALTER TABLE IF EXISTS "sharedList" RENAME TO "SharedList";