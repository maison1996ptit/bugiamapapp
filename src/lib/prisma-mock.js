const { localDb } = require('./local-db');

const createModelProxy = (model) => {
  return {
    findMany: (args) => localDb.findMany(model, args),
    findUnique: (args) => localDb.findUnique(model, args),
    create: (args) => localDb.create(model, args),
    createMany: (args) => localDb.createMany(model, args),
    update: (args) => localDb.update(model, args),
    upsert: (args) => localDb.upsert(model, args),
    count: (args) => localDb.count(model),
  };
};

const prisma = {
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

module.exports = { prisma };
