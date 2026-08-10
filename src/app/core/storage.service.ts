import { Injectable, computed, signal } from '@angular/core';
import { createDemoDatabase } from './demo-data';
import {
  AuditEvent, CitizenRequest, Comment, DemoDatabase, NewRequestInput, Notification,
  RequestStatus, RoleName, SatisfactionSurvey, User,
} from './models';

const STORAGE_KEY = 'itla_gestion_municipal_demo_v1';
const SESSION_KEY = 'itla_gestion_municipal_session_v1';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly dbState = signal<DemoDatabase>(this.loadDatabase());
  private readonly sessionUserId = signal<number | null>(this.loadSession());
  readonly db = this.dbState.asReadonly();
  readonly currentUser = computed(() => this.dbState().users.find((user) => user.id === this.sessionUserId()) ?? null);
  readonly currentRole = computed<RoleName | null>(() => {
    const user = this.currentUser();
    return user ? this.dbState().roles.find((role) => role.id === user.roleId)?.name ?? null : null;
  });

  private loadDatabase(): DemoDatabase {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return value ? JSON.parse(value) as DemoDatabase : createDemoDatabase();
    } catch {
      return createDemoDatabase();
    }
  }

  private loadSession(): number | null {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? Number(raw) : null;
  }

  private commit(db: DemoDatabase): void {
    this.dbState.set(db);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }

  login(user: User): void {
    this.sessionUserId.set(user.id);
    sessionStorage.setItem(SESSION_KEY, String(user.id));
  }

  logout(): void {
    this.sessionUserId.set(null);
    sessionStorage.removeItem(SESSION_KEY);
  }

  resetDemo(): void {
    this.commit(createDemoDatabase());
    this.logout();
  }

  registerCitizen(input: Pick<User, 'firstName' | 'lastName' | 'email' | 'phone'>): User {
    const db = structuredClone(this.dbState());
    const user: User = { id: this.nextId(db.users), roleId: 1, ...input, email: input.email.toLowerCase(), status: 'activo', demo: true };
    db.users.push(user);
    db.audit.unshift(this.auditEvent(db, user.id, 'CUENTA_DEMO_CREADA', 'usuarios', String(user.id), 'Cuenta ciudadana ficticia creada.'));
    this.commit(db);
    return user;
  }

  createMunicipalUser(input: Pick<User, 'firstName' | 'lastName' | 'email' | 'phone' | 'municipalityId' | 'status'>, actorId: number): User {
    const db = structuredClone(this.dbState());
    if (!input.municipalityId || !db.municipalities.some((item) => item.id === input.municipalityId)) throw new Error('Seleccione un municipio válido.');
    if (db.users.some((item) => item.email.toLowerCase() === input.email.trim().toLowerCase())) throw new Error('El correo ya existe en los datos demo.');
    const user: User = { id: this.nextId(db.users), roleId: 2, ...input, email: input.email.trim().toLowerCase(), demo: true };
    db.users.push(user);
    db.audit.unshift(this.auditEvent(db, actorId, 'PERSONAL_MUNICIPAL_CREADO', 'usuarios', String(user.id), `Cuenta municipal demo asociada al municipio ${input.municipalityId}.`));
    this.commit(db);
    return user;
  }

  createRequest(citizenId: number, input: NewRequestInput): CitizenRequest {
    const db = structuredClone(this.dbState());
    const category = db.categories.find((item) => item.id === input.categoryId);
    if (!category) throw new Error('Categoría no válida.');
    const now = new Date();
    const id = this.nextId(db.requests);
    const request: CitizenRequest = {
      id,
      code: `GSD-${now.getFullYear()}-${String(id).padStart(4, '0')}`,
      citizenId,
      municipalityId: input.municipalityId,
      categoryId: input.categoryId,
      title: input.title.trim(),
      description: input.description.trim(),
      address: input.address.trim(),
      latitude: input.latitude,
      longitude: input.longitude,
      priority: category.defaultPriority,
      status: 'recibida',
      registeredAt: now.toISOString(),
      dueAt: new Date(now.getTime() + category.targetHours * 3_600_000).toISOString(),
      updatedAt: now.toISOString(),
      demo: true,
    };
    db.requests.unshift(request);
    db.statusHistory.unshift({ id: this.nextId(db.statusHistory), requestId: id, current: 'recibida', comment: 'Solicitud recibida por el prototipo.', changedBy: citizenId, changedAt: now.toISOString(), demo: true });
    if (input.evidence) {
      db.attachments.unshift({ id: this.nextId(db.attachments), requestId: id, userId: citizenId, originalName: input.evidence.name, mime: input.evidence.type || 'application/octet-stream', size: input.evidence.size, createdAt: now.toISOString(), demo: true });
    }
    db.notifications.unshift(this.notification(db, citizenId, id, 'Solicitud registrada', `${request.code} fue recibida correctamente.`));
    db.audit.unshift(this.auditEvent(db, citizenId, 'SOLICITUD_CREADA', 'solicitudes', String(id), `Solicitud demo ${request.code} registrada.`));
    this.commit(db);
    return request;
  }

  assignRequest(requestId: number, departmentId: number, employeeId: number | undefined, note: string, actorId: number): void {
    const db = structuredClone(this.dbState());
    const request = this.requireRequest(db, requestId);
    db.assignments.forEach((item) => { if (item.requestId === requestId) item.active = false; });
    db.assignments.unshift({ id: this.nextId(db.assignments), requestId, departmentId, employeeId, assignedBy: actorId, assignedAt: new Date().toISOString(), note: note.trim(), active: true, demo: true });
    request.departmentId = departmentId;
    if (request.status === 'recibida') this.applyStatus(db, request, 'asignada', `Asignada: ${note || 'sin observación adicional'}.`, actorId);
    db.audit.unshift(this.auditEvent(db, actorId, 'SOLICITUD_ASIGNADA', 'asignaciones', String(requestId), `Asignación demo al departamento ${departmentId}.`));
    this.commit(db);
  }

  updateStatus(requestId: number, status: RequestStatus, reason: string, actorId: number): void {
    const db = structuredClone(this.dbState());
    const request = this.requireRequest(db, requestId);
    this.validateTransition(request.status, status, reason);
    this.applyStatus(db, request, status, reason, actorId);
    db.audit.unshift(this.auditEvent(db, actorId, 'ESTADO_ACTUALIZADO', 'solicitudes', String(requestId), `${request.code}: ${status}.`));
    this.commit(db);
  }

  addComment(requestId: number, authorId: number, message: string, visibility: 'ciudadana' | 'interna' = 'ciudadana'): void {
    const db = structuredClone(this.dbState());
    const request = this.requireRequest(db, requestId);
    const comment: Comment = { id: this.nextId(db.comments), requestId, authorId, message: message.trim(), visibility, createdAt: new Date().toISOString(), demo: true };
    db.comments.unshift(comment);
    if (visibility === 'ciudadana' && authorId !== request.citizenId) db.notifications.unshift(this.notification(db, request.citizenId, requestId, 'Nuevo comentario municipal', `${request.code} recibió un mensaje.`));
    db.audit.unshift(this.auditEvent(db, authorId, 'COMENTARIO_AGREGADO', 'comentarios', String(comment.id), `Comentario ${visibility} agregado.`));
    this.commit(db);
  }

  markNotificationRead(notificationId: number): void {
    const db = structuredClone(this.dbState());
    const item = db.notifications.find((notification) => notification.id === notificationId);
    if (item && !item.readAt) item.readAt = new Date().toISOString();
    this.commit(db);
  }

  submitSurvey(requestId: number, citizenId: number, rating: number, comment: string): void {
    const db = structuredClone(this.dbState());
    const request = this.requireRequest(db, requestId);
    if (request.citizenId !== citizenId || !['resuelta', 'cerrada'].includes(request.status)) throw new Error('La solicitud no está disponible para valoración.');
    if (db.surveys.some((item) => item.requestId === requestId)) throw new Error('Esta solicitud ya fue valorada.');
    if (rating < 1 || rating > 5) throw new Error('Seleccione una puntuación de 1 a 5.');
    const survey: SatisfactionSurvey = { id: this.nextId(db.surveys), requestId, citizenId, rating, comment: comment.trim(), answeredAt: new Date().toISOString(), demo: true };
    db.surveys.unshift(survey);
    db.audit.unshift(this.auditEvent(db, citizenId, 'ENCUESTA_REGISTRADA', 'encuestas_satisfaccion', String(survey.id), 'Valoración demo registrada.'));
    this.commit(db);
  }

  toggleActive(entity: 'users' | 'municipalities' | 'departments' | 'categories', id: number, actorId: number): void {
    const db = structuredClone(this.dbState());
    if (entity === 'users') {
      const item = db.users.find((value) => value.id === id);
      if (item) item.status = item.status === 'activo' ? 'inactivo' : 'activo';
    } else {
      const item = db[entity].find((value) => value.id === id);
      if (item) item.active = !item.active;
    }
    db.audit.unshift(this.auditEvent(db, actorId, 'ACTIVACION_MODIFICADA', entity, String(id), 'Estado activo/inactivo actualizado en el prototipo.'));
    this.commit(db);
  }

  private applyStatus(db: DemoDatabase, request: CitizenRequest, status: RequestStatus, comment: string, actorId: number): void {
    const previous = request.status;
    const now = new Date().toISOString();
    request.status = status;
    request.updatedAt = now;
    if (status === 'resuelta') request.resolvedAt = now;
    if (status === 'cerrada') request.closedAt = now;
    db.statusHistory.unshift({ id: this.nextId(db.statusHistory), requestId: request.id, previous, current: status, comment: comment.trim(), changedBy: actorId, changedAt: now, demo: true });
    db.notifications.unshift(this.notification(db, request.citizenId, request.id, `Solicitud ${this.statusLabel(status)}`, `${request.code} cambió a ${this.statusLabel(status)}.${comment ? ` ${comment}` : ''}`));
  }

  private validateTransition(current: RequestStatus, next: RequestStatus, reason: string): void {
    if (next === 'rechazada' && !reason.trim()) throw new Error('El rechazo requiere un motivo.');
    const allowed: Record<RequestStatus, RequestStatus[]> = {
      recibida: ['asignada', 'rechazada'],
      asignada: ['en_proceso', 'rechazada'],
      en_proceso: ['resuelta', 'rechazada'],
      resuelta: ['cerrada', 'en_proceso'],
      rechazada: [],
      cerrada: [],
    };
    if (!allowed[current].includes(next)) throw new Error(`Transición no permitida: ${current} → ${next}.`);
  }

  private requireRequest(db: DemoDatabase, id: number): CitizenRequest {
    const request = db.requests.find((item) => item.id === id);
    if (!request) throw new Error('Solicitud no encontrada.');
    return request;
  }

  private notification(db: DemoDatabase, userId: number, requestId: number, title: string, message: string): Notification {
    return { id: this.nextId(db.notifications), userId, requestId, title, message, createdAt: new Date().toISOString(), demo: true };
  }

  private auditEvent(db: DemoDatabase, userId: number | undefined, action: string, entity: string, entityId: string | undefined, detail: string): AuditEvent {
    return { id: this.nextId(db.audit), userId, action, entity, entityId, detail, createdAt: new Date().toISOString(), demo: true };
  }

  private nextId(items: Array<{ id: number }>): number { return Math.max(0, ...items.map((item) => item.id)) + 1; }
  private statusLabel(status: RequestStatus): string { return status === 'en_proceso' ? 'En proceso' : status.charAt(0).toUpperCase() + status.slice(1); }
}
