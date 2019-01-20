// @flow strict
import { type DB } from '../database';
import { Serializable } from '../../common/Serializable';
import { type Entity, type GameObject } from '../../common/ecs';

export type DataStorage = {|
  +db: DB;
|};

const serializeComponents = (components) => components
  .filter(el => el.constructor.networkable)
  .map((data: Serializable) => ({
    data: data.serialize(),
    type: data.constructor.componentName,
  }));

export const saveGameObject = (ds: DataStorage) => async (...objects: GameObject<[]>[]) => {
  if (!objects.length) return;
  const collection = ds.db.connection.db('sphericalWorld').collection('gameObjects');
  await collection.insert(objects.map(({ id, ...components }) => ({
    _id: id,
    id,
    components: serializeComponents([...Object.values(components)]),
  })));
};

export const updateGameObject = (ds: DataStorage) => async (...objects: GameObject<[]>[]) => {
  if (!objects.length) return;
  const collection = ds.db.connection.db('sphericalWorld').collection('gameObjects');
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
  return Object.assign({ id }, ...rawObject.components.map(({ data, type }) => ({ [type]: data })));
};
