import User from "./User.js";
import Account from "./Account.js";
import Card from "./Card.js";
import Transaction from "./Transaction.js";
import Activity from "./Activity.js";

const models = {
  User,
  Account,
  Card,
  Transaction,
  Activity,
};

export const initializeSchemas = async () => {
  await Promise.all(
    Object.values(models).map(async (model) => {
      await model.createCollection().catch(() => null);
      await model.syncIndexes();
    })
  );
};

export default models;
