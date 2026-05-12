import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: "postgresql://postgres:d5ExmbRgh1Hemj47@ipv4.db.usqtfymjbwrkyvfttrbc.supabase.co:5432/postgres",
  },
});
