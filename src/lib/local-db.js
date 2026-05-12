const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

const getFilePath = (model) => path.join(DATA_DIR, `${model}.json`);

const readData = (model) => {
  const filePath = getFilePath(model);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) {
    return [];
  }
};

const writeData = (model, data) => {
  fs.writeFileSync(getFilePath(model), JSON.stringify(data, null, 2));
};

const localDb = {
  findMany: (model, args = {}) => {
    let data = readData(model);
    
    if (args.where) {
      data = data.filter((item) => {
        return Object.entries(args.where).every(([key, value]) => {
          if (value && typeof value === 'object') {
            if ('in' in value) return value.in.includes(item[key]);
            if ('not' in value) return item[key] !== value.not;
          }
          return item[key] === value;
        });
      });
    }

    // Handle include (basic)
    if (args.include) {
      data = data.map(item => {
        const newItem = { ...item };
        if (args.include.images) newItem.images = readData('image').filter(img => img.reportId === item.id);
        if (args.include.auditLogs) newItem.auditLogs = readData('auditLog').filter(log => log.reportId === item.id);
        if (args.include.reporter) newItem.reporter = readData('user').find(u => u.id === item.reporterId);
        return newItem;
      });
    }

    if (args.orderBy) {
      const orderBy = Array.isArray(args.orderBy) ? args.orderBy[0] : args.orderBy;
      const [field, direction] = Object.entries(orderBy)[0];
      data.sort((a, b) => {
        if (a[field] < b[field]) return direction === 'asc' ? -1 : 1;
        if (a[field] > b[field]) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    if (args.take) {
      data = data.slice(0, args.take);
    }

    return Promise.resolve(data);
  },

  findUnique: (model, args) => {
    const data = readData(model);
    const item = data.find((item) => {
      return Object.entries(args.where).every(([key, value]) => item[key] === value);
    });
    
    if (item && args.include) {
      const newItem = { ...item };
      if (args.include.images) newItem.images = readData('image').filter(img => img.reportId === item.id);
      if (args.include.auditLogs) newItem.auditLogs = readData('auditLog').filter(log => log.reportId === item.id).sort((a,b) => b.createdAt.localeCompare(a.createdAt));
      if (args.include.reporter) newItem.reporter = readData('user').find(u => u.id === item.reporterId);
      return Promise.resolve(newItem);
    }

    return Promise.resolve(item || null);
  },

  create: (model, args) => {
    const data = readData(model);
    const newItem = {
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...args.data,
    };

    // Handle nested creates
    if (args.data.images?.create) {
      const images = (Array.isArray(args.data.images.create) ? args.data.images.create : [args.data.images.create]).map((img) => ({
        id: Math.random().toString(36).substring(2, 15),
        ...img,
        reportId: newItem.id,
        createdAt: new Date().toISOString()
      }));
      const existingImages = readData('image');
      writeData('image', [...existingImages, ...images]);
      delete newItem.images;
    }

    if (args.data.auditLogs?.create) {
      const logs = (Array.isArray(args.data.auditLogs.create) ? args.data.auditLogs.create : [args.data.auditLogs.create]).map((log) => ({
        id: Math.random().toString(36).substring(2, 15),
        ...log,
        reportId: newItem.id,
        createdAt: new Date().toISOString()
      }));
      const existingLogs = readData('auditLog');
      writeData('auditLog', [...existingLogs, ...logs]);
      delete newItem.auditLogs;
    }

    data.push(newItem);
    writeData(model, data);
    return Promise.resolve(newItem);
  },

  createMany: (model, args) => {
    const data = readData(model);
    const newItems = args.data.map((item) => ({
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...item,
    }));
    writeData(model, [...data, ...newItems]);
    return Promise.resolve({ count: newItems.length });
  },

  update: (model, args) => {
    const data = readData(model);
    const index = data.findIndex((item) => {
      return Object.entries(args.where).every(([key, value]) => item[key] === value);
    });

    if (index === -1) return Promise.reject(new Error('Record not found'));

    const updateData = { ...args.data };

    // Handle nested creates in update
    if (updateData.auditLogs?.create) {
      const logs = (Array.isArray(updateData.auditLogs.create) ? updateData.auditLogs.create : [updateData.auditLogs.create]).map((log) => ({
        id: Math.random().toString(36).substring(2, 15),
        ...log,
        reportId: data[index].id,
        createdAt: new Date().toISOString()
      }));
      const existingLogs = readData('auditLog');
      writeData('auditLog', [...existingLogs, ...logs]);
      delete updateData.auditLogs;
    }

    data[index] = {
      ...data[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    writeData(model, data);
    return Promise.resolve(data[index]);
  },

  upsert: (model, args) => {
    return localDb.findUnique(model, { where: args.where }).then((item) => {
      if (item) {
        return localDb.update(model, { where: args.where, data: args.update });
      } else {
        return localDb.create(model, { data: args.create });
      }
    });
  },

  count: (model) => {
    return Promise.resolve(readData(model).length);
  }
};

module.exports = { localDb };
