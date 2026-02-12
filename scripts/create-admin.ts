import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Prisma with correct adapter (same logic as src/lib/prisma.ts)
const prismaAccelerateUrl = process.env.PRISMA_DATABASE_URL;
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (prismaAccelerateUrl && !process.env.DATABASE_URL) {
  process.env.DATABASE_URL = prismaAccelerateUrl;
}

const connectionUrl = prismaAccelerateUrl || databaseUrl;

if (!connectionUrl) {
  console.error("❌ DATABASE_URL alebo PRISMA_DATABASE_URL musí byť nastavené v .env súbore");
  process.exit(1);
}

const prisma =
  connectionUrl && !prismaAccelerateUrl
    ? new PrismaClient({
        adapter: new PrismaPg(new Pool({ connectionString: connectionUrl })),
      })
    : new PrismaClient({
        accelerateUrl: prismaAccelerateUrl || undefined,
      } as any);

async function createAdmin() {
  const email = process.env.DEFAULT_ADMIN_EMAIL || "admin@example.com";
  const password = process.env.DEFAULT_ADMIN_PASSWORD || "admin123";

  console.log(`🔍 Kontrolujem, či admin používateľ s emailom ${email} už existuje...`);

  try {
    const existing = await prisma.adminUser.findUnique({ where: { email } });

    if (existing) {
      console.log(`⚠️  Admin používateľ s emailom ${email} už existuje.`);
      console.log(`   ID: ${existing.id}`);
      console.log(`   Email: ${existing.email}`);
      console.log(`   Vytvorený: ${existing.createdAt}`);
      console.log(`\n💡 Ak chcete zmeniť heslo, vymazajte používateľa z databázy alebo použite iný email.`);
      await prisma.$disconnect();
      return;
    }

    console.log(`🔐 Vytváram admin používateľa...`);
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.adminUser.create({
      data: {
        email,
        passwordHash,
      },
    });

    console.log("\n✅ Admin používateľ bol úspešne vytvorený!");
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Heslo: ${password}`);
    console.log(`\n📝 Môžete sa teraz prihlásiť na /admin/login`);
    console.log(`   Email: ${email}`);
    console.log(`   Heslo: ${password}`);
  } catch (error) {
    console.error("\n❌ Chyba pri vytváraní admin používateľa:", error);
    if (error instanceof Error) {
      console.error(`   Správa: ${error.message}`);
    }
    await prisma.$disconnect();
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin()
  .then(() => {
    console.log("\n✨ Hotovo!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Neočakávaná chyba:", error);
    process.exit(1);
  });
