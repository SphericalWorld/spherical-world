// @flow strict
import { type MongoClient, type Collection } from 'mongodb';

export type DB = {|
  +connection: MongoClient
|};

// export const constSaveToDB = (collection: Collection<any>) => (data) => ((data instanceof Array)
//   ? collection.insertOne(data)
//   : collection.insertMany(docs, callback));

// export const getFromDB = (db: DB) => (id: Entity) => db.get(id);
