import fs from 'fs';
import path from 'path';
import os from 'os';

// Default data to ensure demo works even if file system fails
const DEFAULT_DATA: Record<string, any[]> = {
  user: [
    {
      id: 'admin-id',
      email: 'admin@mps.gov.vn',
      name: 'Quản trị viên hệ thống',
      // admin123 hashed
      password: '$2a$10$7R0ZfN3F/qYV1S6A2Vb/u.I.9Xw5X6v/8w6J9z8e6m2k8s7t9u0v2',
      role: 'ADMIN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'officer-id',
      email: 'officer@mps.gov.vn',
      name: 'Cán bộ Nguyễn Văn A',
      // admin123 hashed
      password: '$2a$10$7R0ZfN3F/qYV1S6A2Vb/u.I.9Xw5X6v/8w6J9z8e6m2k8s7t9u0v2',
      role: 'OFFICER',
      department: 'Phòng CSGT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ],
  report: [
    {
      id: 'report-1',
      lookupCode: 'GT123456',
      title: 'Lấn chiếm lòng lề đường',
      description: 'Nhiều hộ kinh doanh bày bán hàng hóa tràn ra đường gây cản trở giao thông.',
      category: 'traffic',
      latitude: 21.0285,
      longitude: 105.8542,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ],
  news: [
    {
      id: 'news-1',
      title: 'Bù Gia Mập: Tăng cường tuần tra, đảm bảo an ninh trật tự dịp lễ',
      content: 'Công an xã Bù Gia Mập phối hợp cùng các lực lượng chức năng triển khai kế hoạch tuần tra 24/7 nhằm đảm bảo an ninh trật tự, an toàn giao thông trên các tuyến đường trọng điểm...',
      category: 'Tin an ninh',
      imageUrl: 'https://images.unsplash.com/photo-1593115057322-e94b77572f20?q=80&w=2071&auto=format&fit=crop',
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ],
  document: [
    {
      id: 'doc-1',
      title: 'Mẫu đơn trình báo mất tài sản',
      fileName: 'mau_don_trinh_bao_mat_tai_san.pdf',
      fileUrl: '/documents/mau_don_trinh_bao_mat_tai_san.pdf',
      uploadedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ],
  image: [],
  auditLog: [],
  notification: [],
  pushToken: []
};

const DATA_DIR = process.env.VERCEL 
  ? path.join(os.tmpdir(), 'data')
  : path.join(process.cwd(), 'data');

// Ensure data directory exists
const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (e) {
      console.error('Failed to create DATA_DIR:', e);
    }
  }
};

const getFilePath = (model: string) => path.join(DATA_DIR, `${model}.json`);

const readData = (model: string): any[] => {
  ensureDataDir();
  const filePath = getFilePath(model);
  
  if (!fs.existsSync(filePath)) {
    // Return default data if exists for this model
    return DEFAULT_DATA[model] || [];
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    // If file is empty array, still consider returning default data for some models
    if (data.length === 0 && DEFAULT_DATA[model] && DEFAULT_DATA[model].length > 0) {
      return DEFAULT_DATA[model];
    }
    return data;
  } catch (e) {
    return DEFAULT_DATA[model] || [];
  }
};

const writeData = (model: string, data: any[]) => {
  ensureDataDir();
  try {
    fs.writeFileSync(getFilePath(model), JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(`Failed to write data for ${model}:`, e);
  }
};

export const mockDb = {
  findMany: async (model: string, args: any = {}) => {
    let data = readData(model);
    
    if (args.where) {
      data = data.filter((item: any) => {
        return Object.entries(args.where).every(([key, value]: [string, any]) => {
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
      const entries = Object.entries(orderBy);
      if (entries.length > 0) {
        const [field, direction] = entries[0] as [string, string];
        data.sort((a: any, b: any) => {
          if (a[field] < b[field]) return direction === 'asc' ? -1 : 1;
          if (a[field] > b[field]) return direction === 'asc' ? 1 : -1;
          return 0;
        });
      }
    }

    if (args.take) {
      data = data.slice(0, args.take);
    }

    return data;
  },

  findUnique: async (model: string, args: any) => {
    const data = readData(model);
    const item = data.find((item: any) => {
      return Object.entries(args.where).every(([key, value]) => item[key] === value);
    });
    
    if (item && args.include) {
      const newItem = { ...item };
      if (args.include.images) newItem.images = readData('image').filter(img => img.reportId === item.id);
      if (args.include.auditLogs) newItem.auditLogs = readData('auditLog').filter(log => log.reportId === item.id).sort((a,b) => b.createdAt.localeCompare(a.createdAt));
      if (args.include.reporter) newItem.reporter = readData('user').find(u => u.id === item.reporterId);
      return newItem;
    }

    return item || null;
  },

  create: async (model: string, args: any) => {
    const data = readData(model);
    const newItem = {
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...args.data,
    };

    // Handle nested creates
    if (args.data.images?.create) {
      const imgData = args.data.images.create;
      const images = (Array.isArray(imgData) ? imgData : [imgData]).map((img: any) => ({
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
      const logData = args.data.auditLogs.create;
      const logs = (Array.isArray(logData) ? logData : [logData]).map((log: any) => ({
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
    return newItem;
  },

  createMany: async (model: string, args: any) => {
    const data = readData(model);
    const newItems = args.data.map((item: any) => ({
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...item,
    }));
    writeData(model, [...data, ...newItems]);
    return { count: newItems.length };
  },

  update: async (model: string, args: any) => {
    const data = readData(model);
    const index = data.findIndex((item: any) => {
      return Object.entries(args.where).every(([key, value]) => item[key] === value);
    });

    if (index === -1) throw new Error('Record not found');

    const updateData = { ...args.data };

    // Handle nested creates in update
    if (updateData.auditLogs?.create) {
      const logData = updateData.auditLogs.create;
      const logs = (Array.isArray(logData) ? logData : [logData]).map((log: any) => ({
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
    return data[index];
  },

  upsert: async (model: string, args: any) => {
    const item = await mockDb.findUnique(model, { where: args.where });
    if (item) {
      return mockDb.update(model, { where: args.where, data: args.update });
    } else {
      return mockDb.create(model, { data: args.create });
    }
  },

  count: async (model: string) => {
    return readData(model).length;
  }
};
