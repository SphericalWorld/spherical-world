// @flow strict
import { type DB } from '../database';
import { type DataStorage } from './dataStorage';

const createDataStorage = (db: DB): DataStorage => ({ db });

export default createDataStorage;
