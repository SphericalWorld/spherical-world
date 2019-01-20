// @flow strict
import { MongoClient } from 'mongodb';

type Config = {|
  +host: string,
  +port: number,
  +authDB: string,
  +user: string,
  +password: string,
|};

const createURL = ({
  host, port, authDB, user, password,
}) => `mongodb://${user}:${password}@${host}:${port}/${authDB}`;

const createDatabase = async (config: Config) => MongoClient
  .connect(createURL(config)).then(el => ({
    connection: el,
  }));

export default createDatabase;
