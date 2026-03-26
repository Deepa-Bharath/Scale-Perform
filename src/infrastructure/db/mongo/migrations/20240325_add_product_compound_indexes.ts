import { Db } from "mongodb";

export const up = async (db: Db) => {
  try {
    console.log("Running Migration: Add Compound Indexes for Products");
    const collection = db.collection("products");
    const indexes = await collection.indexes();

    const hasCategoryPriceAscIdIndex = indexes.some(
      (idx) => idx.name === "idx_prod_cat_price_asc_id"
    );
    const hasCategoryPriceDescIdIndex = indexes.some(
      (idx) => idx.name === "idx_prod_cat_price_desc_id"
    );
    const hasCategoryPriceAscIdActiveIndex = indexes.some(
      (idx) => idx.name === "idx_prod_cat_price_asc_id_active"
    );
    const hasCategoryPriceDescIdActiveIndex = indexes.some(
      (idx) => idx.name === "idx_prod_cat_price_desc_id_active"
    );

    if (!hasCategoryPriceAscIdIndex) {
      await collection.createIndex(
        { category: 1, price: 1, _id: 1 },
        { name: "idx_prod_cat_price_asc_id", background: true }
      );
      console.log('Created index "idx_prod_cat_price_asc_id"');
    } else {
      console.log('Index "idx_prod_cat_price_asc_id" already exists');
    }

    if (!hasCategoryPriceDescIdIndex) {
      await collection.createIndex(
        { category: 1, price: -1, _id: 1 },
        { name: "idx_prod_cat_price_desc_id", background: true }
      );
      console.log('Created index "idx_prod_cat_price_desc_id"');
    } else {
      console.log('Index "idx_prod_cat_price_desc_id" already exists');
    }

    if (!hasCategoryPriceAscIdActiveIndex) {
      await collection.createIndex(
        { category: 1, price: 1, _id: 1 },
        {
          name: "idx_prod_cat_price_asc_id_active",
          background: true,
          partialFilterExpression: { isActive: true },
        }
      );
      console.log('Created index "idx_prod_cat_price_asc_id_active"');
    } else {
      console.log('Index "idx_prod_cat_price_asc_id_active" already exists');
    }

    if (!hasCategoryPriceDescIdActiveIndex) {
      await collection.createIndex(
        { category: 1, price: -1, _id: 1 },
        {
          name: "idx_prod_cat_price_desc_id_active",
          background: true,
          partialFilterExpression: { isActive: true },
        }
      );
      console.log('Created index "idx_prod_cat_price_desc_id_active"');
    } else {
      console.log('Index "idx_prod_cat_price_desc_id_active" already exists');
    }
  } catch (error) {
    console.error("Error creating index:", error);
    process.exit(1);
  }
};

export const down = async (db: Db) => {
  console.log("Rolling Back: Removing Product Compound Indexes");
  const collection = db.collection("products");
  const indexes = await collection.indexes();

  if (indexes.some((idx) => idx.name === "idx_prod_cat_price_asc_id")) {
    await collection.dropIndex("idx_prod_cat_price_asc_id");
  }

  if (indexes.some((idx) => idx.name === "idx_prod_cat_price_desc_id")) {
    await collection.dropIndex("idx_prod_cat_price_desc_id");
  }

  if (indexes.some((idx) => idx.name === "idx_prod_cat_price_asc_id_active")) {
    await collection.dropIndex("idx_prod_cat_price_asc_id_active");
  }

  if (indexes.some((idx) => idx.name === "idx_prod_cat_price_desc_id_active")) {
    await collection.dropIndex("idx_prod_cat_price_desc_id_active");
  }
};
