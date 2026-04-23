import User from "./User.js";
import Account from "./Account.js";
import Card from "./Card.js";
import Transaction from "./Transaction.js";
import Activity from "./Activity.js";
import SavingsPlan from "./SavingsPlan.js";

// 1. Export them as named exports
export { User, Account, Card, Transaction, Activity, SavingsPlan };

export const initializeSchemas = async () => {
  // Use the models array directly here
  const allModels = [User, Account, Card, Transaction, Activity, SavingsPlan];
  await Promise.all(
    allModels.map(async (model) => {
      await model.createCollection().catch(() => null);
      await model.syncIndexes();
    })
  );
};