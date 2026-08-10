export type RoleName = 'ciudadano' | 'municipal' | 'administrador';
export type RequestStatus = 'recibida' | 'asignada' | 'en_proceso' | 'resuelta' | 'rechazada' | 'cerrada';
export type Priority = 'baja' | 'media' | 'alta';

export interface Role { id: number; name: RoleName; label: string; description: string; active: boolean; }
export interface Municipality { id: number; code: string; name: string; province: string; active: boolean; }
export interface Department { id: number; municipalityId: number; name: string; description: string; active: boolean; }
export interface User {
  id: number;
  roleId: number;
  municipalityId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: 'pendiente' | 'activo' | 'bloqueado' | 'inactivo';
  demo: true;
}
export interface Category {
  id: number;
  departmentId: number;
  name: string;
  description: string;
  defaultPriority: Priority;
  targetHours: number;
  requiresLocation: boolean;
  active: boolean;
}
export interface CitizenRequest {
  id: number;
  code: string;
  citizenId: number;
  municipalityId: number;
  categoryId: number;
  departmentId?: number;
  title: string;
  description: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  priority: Priority;
  status: RequestStatus;
  registeredAt: string;
  dueAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  updatedAt: string;
  demo: true;
}
export interface Attachment { id: number; requestId: number; userId: number; originalName: string; mime: string; size: number; createdAt: string; demo: true; }
export interface Assignment { id: number; requestId: number; departmentId: number; employeeId?: number; assignedBy: number; assignedAt: string; note?: string; active: boolean; demo: true; }
export interface StatusHistory { id: number; requestId: number; previous?: RequestStatus; current: RequestStatus; comment?: string; changedBy: number; changedAt: string; demo: true; }
export interface Comment { id: number; requestId: number; authorId: number; message: string; visibility: 'ciudadana' | 'interna'; createdAt: string; demo: true; }
export interface Notification { id: number; userId: number; requestId?: number; title: string; message: string; readAt?: string; createdAt: string; demo: true; }
export interface SatisfactionSurvey { id: number; requestId: number; citizenId: number; rating: number; comment?: string; answeredAt: string; demo: true; }
export interface AuditEvent { id: number; userId?: number; action: string; entity: string; entityId?: string; detail: string; createdAt: string; demo: true; }

export interface DemoDatabase {
  roles: Role[];
  municipalities: Municipality[];
  departments: Department[];
  users: User[];
  categories: Category[];
  requests: CitizenRequest[];
  attachments: Attachment[];
  assignments: Assignment[];
  statusHistory: StatusHistory[];
  comments: Comment[];
  notifications: Notification[];
  surveys: SatisfactionSurvey[];
  audit: AuditEvent[];
}

export interface NewRequestInput {
  municipalityId: number;
  categoryId: number;
  title: string;
  description: string;
  address: string;
  latitude?: number;
  longitude?: number;
  evidence?: { name: string; type: string; size: number };
}

export const STATUS_LABEL: Record<RequestStatus, string> = {
  recibida: 'Recibida',
  asignada: 'Asignada',
  en_proceso: 'En proceso',
  resuelta: 'Resuelta',
  rechazada: 'Rechazada',
  cerrada: 'Cerrada',
};

export const STATUS_ORDER: RequestStatus[] = ['recibida', 'asignada', 'en_proceso', 'resuelta', 'cerrada'];
