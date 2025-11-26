export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Ad {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: number;
  updatedAt: number;
  status: 'active' | 'draft' | 'paused';
}

export enum ViewState {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  DASHBOARD = 'DASHBOARD',
  CREATE_AD = 'CREATE_AD',
  EDIT_AD = 'EDIT_AD',
}

export interface AdFormData {
  title: string;
  description: string;
  imageUrl: string;
}