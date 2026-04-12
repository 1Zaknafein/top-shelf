-- CreateTable: UserGame (join table between User and Game)
CREATE TABLE "UserGame" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "tier" TEXT NOT NULL DEFAULT 'unassigned',
    "order_in_tier" INTEGER,

    CONSTRAINT "UserGame_pkey" PRIMARY KEY ("id")
);

-- Migrate existing data: insert UserGame rows from old Game rows,
-- resolving duplicate titles by keeping the lexicographically smallest id.
INSERT INTO "UserGame" ("id", "userId", "gameId", "tier", "order_in_tier")
SELECT
    gen_random_uuid()::TEXT,
    g."userId",
    (SELECT g2."id" FROM "Game" g2 WHERE g2."title" = g."title" ORDER BY g2."id" ASC LIMIT 1),
    g."tier",
    g."order_in_tier"
FROM "Game" g;

-- Remove duplicate Game rows — keep one canonical row per title.
DELETE FROM "Game"
WHERE "id" NOT IN (
    SELECT MIN("id") FROM "Game" GROUP BY "title"
);

-- Drop user-specific columns from Game
ALTER TABLE "Game" DROP COLUMN "userId";
ALTER TABLE "Game" DROP COLUMN "tier";
ALTER TABLE "Game" DROP COLUMN "order_in_tier";

-- Drop old compound unique constraint
ALTER TABLE "Game" DROP CONSTRAINT IF EXISTS "Game_userId_title_key";

-- Game.title is now globally unique
ALTER TABLE "Game" ADD CONSTRAINT "Game_title_key" UNIQUE ("title");

-- Foreign keys for UserGame
ALTER TABLE "UserGame" ADD CONSTRAINT "UserGame_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserGame" ADD CONSTRAINT "UserGame_gameId_fkey"
    FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Unique: one entry per user per game
ALTER TABLE "UserGame" ADD CONSTRAINT "UserGame_userId_gameId_key" UNIQUE ("userId", "gameId");
