import { ObjectID } from 'mongodb';

const generateID = (): ObjectID => new ObjectID();

export default generateID;
