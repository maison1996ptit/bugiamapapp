export type UserRole = 'admin' | 'officer' | 'citizen';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  role: UserRole;
  department?: string;
  phoneNumber?: string;
}

export interface CitizenReport {
  id: string;
  title: string;
  description: string;
  category: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  imageUrls: string[];
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  createdAt: any;
  updatedAt: any;
  reporterId?: string;
  lookupCode: string; // 8 random chars
  officerId?: string;
  feedback?: string;
}
