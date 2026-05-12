import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

const getFilePath = (model: string) => path.join(DATA_DIR, `${model}.json`);

const readData = (model: string) => {
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

const writeData = (model: string, data: any) => {
  fs.writeFileSync(getFilePath(model), JSON.stringify(data, null, 2));
};

export const localDb = {
  findMany: (model: string, args: any = {}) => {
    let data = readData(model);
    
    if (args.where) {
      data = data.filter((item: any) => {
        return Object.entries(args.where).every(([key, value]: [string, any]) => {
          if (value && typeof value === 'object' && 'in' in value) {
            return value.in.includes(item[key]);
          }
          return item[key] === value;
        });
      });
    }

    if (args.orderBy) {
      const [field, direction] = Object.entries(args.orderBy)[0] as [string, string];
      data.sort((a: any, b: any) => {
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

  findUnique: (model: string, args: any) => {
    const data = readData(model);
    const item = data.find((item: any) => {
      return Object.entries(args.where).every(([key, value]) => item[key] === value);
    });
    return Promise.resolve(item || null);
  },

  create: (model: string, args: any) => {
    const data = readData(model);
    const newItem = {
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...args.data,
    };

    // Handle nested creates (like images for report)
    if (model === 'report' && args.data.images?.create) {
      const images = args.data.images.create.map((img: any) => ({
        id: Math.random().toString(36).substring(2, 15),
        ...img,
        reportId: newItem.id,
        createdAt: new Date().toISOString()
      }));
      const existingImages = readData('image');
      writeData('image', [...existingImages, ...images]);
      delete (newItem as any).images;
    }

    data.push(newItem);
    writeData(model, data);
    return Promise.resolve(newItem);
  },

  createMany: (model: string, args: any) => {
    const data = readData(model);
    const newItems = args.data.map((item: any) => ({
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...item,
    }));
    writeData(model, [...data, ...newItems]);
    return Promise.resolve({ count: newItems.length });
  },

  update: (model: string, args: any) => {
    const data = readData(model);
    const index = data.findIndex((item: any) => {
      return Object.entries(args.where).every(([key, value]) => item[key] === value);
    });

    if (index === -1) return Promise.reject(new Error('Record not found'));

    data[index] = {
      ...data[index],
      ...args.data,
      updatedAt: new Date().toISOString(),
    };

    writeData(model, data);
    return Promise.resolve(data[index]);
  },

  upsert: (model: string, args: any) => {
    return localDb.findUnique(model, { where: args.where }).then((item) => {
      if (item) {
        return localDb.update(model, { where: args.where, data: args.update });
      } else {
        return localDb.create(model, { data: args.create });
      }
    });
  },

  count: (model: string) => {
    return Promise.resolve(readData(model).length);
  }
};
