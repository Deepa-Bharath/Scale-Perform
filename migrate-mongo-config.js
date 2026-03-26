import "dotenv/config";

const mongoUrl = process.env.MONGO_URI;

if (!mongoUrl) {
  throw new Error("MONGO_URI is required to run Mongo migrations.");
}

const config = {
  mongodb: {
    url: mongoUrl,
    options: {
      serverSelectionTimeoutMS: 5000,
    },
  },
  migrationsDir: "dist/infrastructure/db/mongo/migrations",
  changelogCollectionName: "changelog",
  lockCollectionName: "changelog_lock",
  lockTtl: 0,
  migrationFileExtension: ".js",
  useFileHash: false,
  moduleSystem: "esm",
};

export default config;
