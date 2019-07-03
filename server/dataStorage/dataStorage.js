// @flow strict
import { type DB } from '../database';
import { Serializable } from '../../common/Serializable';
import { type Entity, typeof GameObject } from '../../common/ecs';

export type DataStorage = {|
  +db: DB;
|};

const serializeComponents = (components) => components
  .filter(el => el.constructor.networkable)
  .map((data: Serializable) => ({
    data: data.serialize(),
    type: data.constructor.componentName,
  }));

const deserializeGameObject = (rawObject) =>
  Object.assign({ id: rawObject.id }, ...rawObject.components.map(({ data, type }) => ({ [type]: data })));

export const saveGameObject = (ds: DataStorage, collectionName: string = 'gameObjects') => async (...objects: GameObject<[]>[]) => {
  if (!objects.length) return;
  const collection = ds.db.connection.db('sphericalWorld').collection(collectionName);
  await collection.insert(objects.map(({ id, ...components }) => ({
    _id: id,
    id,
    components: serializeComponents([...Object.values(components)]),
  })));
};

export const updateGameObject = (ds: DataStorage, collectionName: string = 'gameObjects') => async (...objects: GameObject<[]>[]) => {
  if (!objects.length) return;
  const collection = ds.db.connection.db('sphericalWorld').collection(collectionName);
  await collection.bulkWrite(objects.map(({ id, ...components }) => ({
    updateOne: {
      filter: { _id: id },
      update: {
        id,
        components: serializeComponents([...Object.values(components)]),
      },
    },
  })));
};

export const getGameObject = (ds: DataStorage) => async (id: Entity) => {
  const collection = ds.db.connection.db('sphericalWorld').collection('gameObjects');
  const rawObject = await collection.findOne({ _id: id });
  if (!rawObject) {
    throw new Error('object not found');
  }
  return deserializeGameObject(rawObject);
};

export const getAllGameObjects = (ds: DataStorage, collectionName: string = 'gameObjects') => async () => {
  const collection = ds.db.connection.db('sphericalWorld').collection(collectionName);
  const cursor = collection.find();
  const items = await cursor.toArray();
  return items.map(deserializeGameObject);
};

export const deleteGameObject = (ds: DataStorage, collectionName: string = 'gameObjects') => {
  const collection = ds.db.connection.db('sphericalWorld').collection(collectionName);
  return async (id: Entity) => {
    await collection.deleteOne({ _id: id });
  };
};
