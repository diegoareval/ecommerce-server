import { IPaginationOptions } from "./../interfaces/pagination-options";
import { Db } from "mongodb";
import { pagination } from "./pagination";

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
    return "1";
  }
  const id = +lastElement[0].id + 1;
  return String(id);
};

export const findOneElement = async (
  collection: string,
  database: Db,
  filter: object
) => {
  return database.collection(collection).findOne(filter);
};

export const insertOneElement = async (
  collection: string,
  database: Db,
  document: object
) => {
  return await database.collection(collection).insertOne(document);
};

export const insertManyElement = async (
  collection: string,
  database: Db,
  documents: Array<object>
) => {
  return await database.collection(collection).insertMany(documents);
};

export const findAllElements = async (
  collection: string,
  database: Db,
  filter: object = {},
  paginationOptions: IPaginationOptions = {
    page: 1,
    pages: 1,
    itemsPage: -1,
    skip: 0,
    total: -1,
  }
) => {
  if (paginationOptions.total === -1) {
    return await database.collection(collection).find(filter).toArray();
  }
  return await database
    .collection(collection)
    .find(filter)
    .limit(paginationOptions.itemsPage)
    .skip(paginationOptions.skip)
    .toArray();
};

export const updateOneElement = async (
  collection: string,
  database: Db,
  filter: object,
  objectUpdate: object
) => {
  return await database.collection(collection).updateOne(filter, objectUpdate);
};

export const removeOneElement = async (
  collection: string,
  database: Db,
  filter: object
) => {
  return await database.collection(collection).deleteOne(filter);
};

export const countElements = async (collection: string, database: Db) => {
  return await database.collection(collection).countDocuments();
};
