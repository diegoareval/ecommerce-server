import { Db } from "mongodb";

export const assignDocumentId = async (
  database: Db,
  collection: string,
  sort: object = { registerDate: -1 }
) => {
  const lastElement = await database
    .collection(collection)
    .find()
    .limit(1)
    .sort(sort)
    .toArray();

  if (lastElement.length === 0) {
    return '1';
  }
  return String(lastElement[0].id + 1);
};

export const findOneElement = async (collection: string, database: Db, filter: object) =>{
   return database.collection(collection).findOne(filter);
}

export const insertOneElement = async(collection: string, database: Db, document: object) =>{
    return await database.collection(collection).insertOne(document)
}

export const insertManyElement = async(collection: string, database: Db, documents: Array<object>) =>{
    return await database.collection(collection).insertMany(documents)
}

export const findAllElements = async(collection: string, database: Db, filter: object = {}) => {
    return await database.collection(collection).find(filter).toArray()
}

export const updateOneElement = async(collection: string, database: Db, filter: object, objectUpdate: object) => {
  return await database.collection(collection).updateOne(
    filter, objectUpdate)
}
