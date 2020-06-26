import type { MongoClient, Collection } from 'mongodb';

export type DB = Readonly<{
  connection: MongoClient
}>;

// export const constSaveToDB = (collection: Collection<any>) => (data) => ((data instanceof Array)
//   ? collection.insertOne(data)
//   : collection.insertMany(docs, callback));

// export const getFromDB = (db: DB) => (id: Entity) => db.get(id);
