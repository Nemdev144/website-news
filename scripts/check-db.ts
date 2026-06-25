import "dotenv/config";
import { createPrismaClient } from "../src/lib/prisma";

const EXPECTED_TABLES = ["user", "category", "article", "media"] as const;

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL is not set in .env");
    process.exit(1);
  }

  const dbName = new URL(databaseUrl.replace(/^mysql:\/\//, "http://")).pathname.slice(1);
  console.log(`Checking database: ${dbName}`);
  console.log(`Host: ${databaseUrl.replace(/\/\/.*@/, "//***@")}\n`);

  const prisma = createPrismaClient();

  try {
    const rows = await prisma.$queryRaw<Array<Record<string, string>>>`
      SHOW TABLES
    `;
    const tables = rows.map((row) => Object.values(row)[0].toLowerCase()).sort();

    console.log("Connection: OK");
    console.log(`Tables found (${tables.length}): ${tables.join(", ") || "(none)"}\n`);

    const missing = EXPECTED_TABLES.filter((table) => !tables.includes(table));
    if (missing.length > 0) {
      console.error(`❌ Missing tables: ${missing.join(", ")}`);
      process.exit(1);
    }

    const [users, categories, articles, media] = await Promise.all([
      prisma.user.count(),
      prisma.category.count(),
      prisma.article.count(),
      prisma.media.count(),
    ]);

    console.log("Row counts:");
    console.log(`  User:     ${users}`);
    console.log(`  Category: ${categories}`);
    console.log(`  Article:  ${articles}`);
    console.log(`  Media:    ${media}`);
    console.log("\n✅ Database is ready.");
  } catch (error) {
    console.error("❌ Database check failed:");
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
