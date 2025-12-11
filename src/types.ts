
import { GeoPoint } from 'firebase/firestore';

export enum UserRole {
    USER = 'USER',
    OWNER = 'OWNER',
    ADMIN = 'ADMIN'
}

export interface User {
    id: string;
    email: string;
    phone: string;
    name: string;
    role: UserRole;
    language: 'en' | 'fr' | 'ar';
    verified: boolean;
    vehicle?: {
        model: string;
        plate: string;
    };
    companyName?: string;
    isAvailable?: boolean;
    truckType?: 'flatbed' | 'hook_and_chain' | 'wheel_lift';
    location?: GeoPoint;
    lastUpdate?: number;
}

export interface TruckOwner extends User {
    role: UserRole.OWNER;
    companyName: string;
    isAvailable: boolean;
    truckType: 'flatbed' | 'hook_and_chain' | 'wheel_lift';
    location: GeoPoint;
    lastUpdate: number;
}

export enum RequestStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    ARRIVED = 'ARRIVED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
  status: MessageStatus;
  type: 'text' | 'location';
  locationData?: { lat: number; lng: number };
}

export interface AssistanceRequest {
    id: string;
    userId: string;
    userLocation: GeoPoint;
    truckOwnerId?: string;
    status: RequestStatus;
    note: string;
    createdAt: any; // Allow for ServerTimestamp
    messages: ChatMessage[];
}
