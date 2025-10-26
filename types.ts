// fix(types): Import Status type from components/admin/types
import type { Status } from './components/admin/types';

// fix(types): Define and export FormData type
export type FormData = {
    prefix: string;
    otherPrefix: string;
    firstName: string;
    lastName: string;
    nationalId: string;
    position: string;
    department: string;
    phone: string;
    email: string;
    purpose: string;
    quantity: number;
    deliveryMethod: 'pickup' | 'postal' | 'email';
    shippingAddress: string;
};

export type StatusHistoryEntry = {
    status: Status;
    date: string;
    notes?: string;
    updatedBy?: string;
};

export interface RequestData extends FormData {
    requestNumber: string;
    submissionDate: string;
    status: Status;
    notes?: string;
    lastUpdatedBy?: string;
    statusHistory: StatusHistoryEntry[];
}