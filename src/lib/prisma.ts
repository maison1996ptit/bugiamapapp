import { mockDb } from './db-mock';

const createModelProxy = (model: string) => {
  return {
    findMany: (args?: any) => mockDb.findMany(model, args),
    findUnique: (args: any) => mockDb.findUnique(model, args),
    create: (args: any) => mockDb.create(model, args),
    createMany: (args: any) => mockDb.createMany(model, args),
    update: (args: any) => mockDb.update(model, args),
    upsert: (args: any) => mockDb.upsert(model, args),
    count: (args?: any) => mockDb.count(model),
  };
};

export const prisma = {
  user: createModelProxy('user'),
  report: createModelProxy('report'),
  image: createModelProxy('image'),
  auditLog: createModelProxy('auditLog'),
  notification: createModelProxy('notification'),
  pushToken: createModelProxy('pushToken'),
  news: createModelProxy('news'),
  document: createModelProxy('document'),
  $disconnect: () => Promise.resolve(),
};
