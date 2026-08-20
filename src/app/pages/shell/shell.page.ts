import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  effect,
  inject,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../core/auth.service';
import { addIcons } from 'ionicons';
import {
  add,
  addCircleOutline,
  alertCircleOutline,
  analyticsOutline,
  arrowBack,
  arrowForward,
  barChartOutline,
  business,
  checkmark,
  checkmarkCircle,
  checkmarkCircleOutline,
  checkmarkDone,
  checkmarkDoneOutline,
  chevronBack,
  chevronForward,
  chevronForwardOutline,
  close,
  closeCircle,
  cloudUploadOutline,
  construct,
  constructOutline,
  documentTextOutline,
  documents,
  documentsOutline,
  download,
  ellipse,
  fileTrayFullOutline,
  gitBranch,
  gitNetwork,
  gridOutline,
  helpBuoyOutline,
  homeOutline,
  imageOutline,
  informationCircle,
  informationCircleOutline,
  locationOutline,
  lockClosed,
  logOut,
  logOutOutline,
  mailUnread,
  mailUnreadOutline,
  navigateCircleOutline,
  notificationsOutline,
  optionsOutline,
  people,
  personAdd,
  personOutline,
  pricetags,
  print,
  printOutline,
  receiptOutline,
  refresh,
  refreshOutline,
  ribbonOutline,
  search,
  searchOutline,
  send,
  sendOutline,
  shieldCheckmark,
  shieldCheckmarkOutline,
  star,
  starOutline,
  swapHorizontal,
  timeOutline,
  warning,
  warningOutline,
} from 'ionicons/icons';
import {
  Category, CitizenRequest, Department, NewRequestInput, RequestStatus,
  STATUS_LABEL, STATUS_ORDER, User,
} from '../../core/models';
import { StorageService } from '../../core/storage.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  templateUrl: './shell.page.html',
  styleUrls: ['./shell.page.scss'],
})
export class ShellPage implements OnInit {
  @ViewChild('pageContent', { static: false })
pageContent?: ElementRef<HTMLDivElement>;
  readonly storage = inject(StorageService);
  readonly auth = inject(AuthService);
  readonly statusLabel = STATUS_LABEL;
  readonly statusOrder = STATUS_ORDER;
  readonly dashboardStatuses: RequestStatus[] = ['recibida', 'asignada', 'en_proceso', 'resuelta', 'cerrada', 'rechazada'];
  activeView = '';
  selectedRequestId?: number;
  toast = '';
  error = '';

  requestStep: 1 | 2 = 1;
  requestForm: NewRequestInput = { municipalityId: 0, categoryId: 0, title: '', description: '', address: '' };
  evidence?: { name: string; type: string; size: number };
  locationLoading = false;

  citizenSearch = '';
  citizenStatus = '';
  citizenComment = '';
  surveyRating = 0;
  surveyComment = '';

  municipalSearch = '';
  municipalCitizen = '';
  municipalStatus = '';
  municipalDepartment = 0;
  municipalDate = '';
  municipalPage = 1;
  readonly pageSize = 6;
  assignmentDepartment = 0;
  assignmentEmployee = 0;
  assignmentNote = '';
  nextStatus = '' as RequestStatus | '';
  statusReason = '';
  municipalComment = '';
  commentVisibility: 'ciudadana' | 'interna' = 'ciudadana';

  adminSection: 'usuarios' | 'municipios' | 'departamentos' | 'categorias' = 'usuarios';
  staffForm = { firstName: '', lastName: '', email: '', phone: '', roleId: 2, municipalityId: 0, status: 'activo' as User['status'] };
  reportMunicipality = 0;
  reportDepartment = 0;
  reportCategory = 0;
  reportStatus = '';
  reportFrom = '';
  reportTo = '';

  

  constructor() {
    this.activeView = this.role === 'ciudadano' ? 'inicio' : this.role === 'municipal' ? 'dashboard' : 'resumen';
    effect(() => {
      const role = this.storage.currentRole();
      const allowed = role === 'ciudadano'
        ? ['inicio', 'nueva', 'solicitudes', 'detalle', 'notificaciones', 'perfil']
        : role === 'municipal'
          ? ['dashboard', 'bandeja', 'gestion', 'reportes']
          : ['resumen', 'catalogos', 'reportes', 'auditoria'];
      if (role && !allowed.includes(this.activeView)) this.activeView = role === 'ciudadano' ? 'inicio' : role === 'municipal' ? 'dashboard' : 'resumen';
    });
      addIcons({
  add,
  'add-circle-outline': addCircleOutline,
  'alert-circle-outline': alertCircleOutline,
  'analytics-outline': analyticsOutline,
  'arrow-back': arrowBack,
  'arrow-forward': arrowForward,
  'bar-chart-outline': barChartOutline,
  business,
  checkmark,
  'checkmark-circle': checkmarkCircle,
  'checkmark-circle-outline': checkmarkCircleOutline,
  'checkmark-done': checkmarkDone,
  'checkmark-done-outline': checkmarkDoneOutline,
  'chevron-back': chevronBack,
  'chevron-forward': chevronForward,
  'chevron-forward-outline': chevronForwardOutline,
  close,
  'close-circle': closeCircle,
  'cloud-upload-outline': cloudUploadOutline,
  construct,
  'construct-outline': constructOutline,
  'document-text-outline': documentTextOutline,
  documents,
  'documents-outline': documentsOutline,
  download,
  ellipse,
  'file-tray-full-outline': fileTrayFullOutline,
  'git-branch': gitBranch,
  'git-network': gitNetwork,
  'grid-outline': gridOutline,
  'help-buoy-outline': helpBuoyOutline,
  'home-outline': homeOutline,
  'image-outline': imageOutline,
  'information-circle': informationCircle,
  'information-circle-outline': informationCircleOutline,
  'location-outline': locationOutline,
  'lock-closed': lockClosed,
  'log-out': logOut,
  'log-out-outline': logOutOutline,
  'mail-unread': mailUnread,
  'mail-unread-outline': mailUnreadOutline,
  'navigate-circle-outline': navigateCircleOutline,
  'notifications-outline': notificationsOutline,
  'options-outline': optionsOutline,
  people,
  'person-add': personAdd,
  'person-outline': personOutline,
  pricetags,
  print,
  'print-outline': printOutline,
  'receipt-outline': receiptOutline,
  refresh,
  'refresh-outline': refreshOutline,
  'ribbon-outline': ribbonOutline,
  search,
  'search-outline': searchOutline,
  send,
  'send-outline': sendOutline,
  'shield-checkmark': shieldCheckmark,
  'shield-checkmark-outline': shieldCheckmarkOutline,
  star,
  'star-outline': starOutline,
  'swap-horizontal': swapHorizontal,
  'time-outline': timeOutline,
  warning,
  'warning-outline': warningOutline,
});
  }

  ngOnInit(): void {
    this.activeView = this.role === 'ciudadano' ? 'inicio' : this.role === 'municipal' ? 'dashboard' : 'resumen';
  }

  get user(): User { return this.storage.currentUser() as User; }
  get role() { return this.storage.currentRole(); }
  get db() { return this.storage.db(); }
  get municipalityName(): string { return this.db.municipalities.find((item) => item.id === this.user.municipalityId)?.name ?? 'Cobertura general'; }

  get citizenRequests(): CitizenRequest[] {
    const search = this.citizenSearch.trim().toLowerCase();
    return this.db.requests
      .filter((item) => item.citizenId === this.user.id)
      .filter((item) => !this.citizenStatus || item.status === this.citizenStatus)
      .filter((item) => !search || `${item.code} ${item.title} ${this.categoryName(item.categoryId)}`.toLowerCase().includes(search))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  get recentCitizenRequests(): CitizenRequest[] { return this.citizenRequests.slice(0, 3); }
  citizenCount(status: RequestStatus): number { return this.db.requests.filter((item) => item.citizenId === this.user.id && item.status === status).length; }

  get selectedRequest(): CitizenRequest | undefined {
    const request = this.db.requests.find((item) => item.id === this.selectedRequestId);
    if (!request) return undefined;
    if (this.role === 'ciudadano' && request.citizenId !== this.user.id) return undefined;
    if (this.role === 'municipal' && request.municipalityId !== this.user.municipalityId) return undefined;
    return request;
  }

  get filteredMunicipalRequests(): CitizenRequest[] {
    const search = this.municipalSearch.trim().toLowerCase();
    const citizenSearch = this.municipalCitizen.trim().toLowerCase();
    return this.db.requests
      .filter((item) => item.municipalityId === this.user.municipalityId)
      .filter((item) => !search || item.code.toLowerCase().includes(search))
      .filter((item) => !citizenSearch || this.citizenName(item.citizenId).toLowerCase().includes(citizenSearch))
      .filter((item) => !this.municipalStatus || item.status === this.municipalStatus)
      .filter((item) => !this.municipalDepartment || item.departmentId === this.municipalDepartment)
      .filter((item) => !this.municipalDate || item.registeredAt.slice(0, 10) === this.municipalDate)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  get pagedMunicipalRequests(): CitizenRequest[] {
    const start = (this.municipalPage - 1) * this.pageSize;
    return this.filteredMunicipalRequests.slice(start, start + this.pageSize);
  }
  get municipalPages(): number { return Math.max(1, Math.ceil(this.filteredMunicipalRequests.length / this.pageSize)); }
  municipalCount(status?: RequestStatus): number {
    return this.db.requests.filter((item) => item.municipalityId === this.user.municipalityId && (!status || item.status === status)).length;
  }
  get priorityCases(): CitizenRequest[] {
    return this.db.requests.filter((item) => item.municipalityId === this.user.municipalityId && (item.priority === 'alta' || this.isOverdue(item))).slice(0, 5);
  }

  get activeMunicipalDepartments(): Department[] { return this.db.departments.filter((item) => item.municipalityId === this.user.municipalityId && item.active); }
  get municipalEmployees(): User[] { return this.db.users.filter((item) => item.roleId === 2 && item.municipalityId === this.user.municipalityId && item.status === 'activo'); }
  get availableCategories(): Category[] {
    const departmentIds = this.db.departments.filter((item) => item.municipalityId === Number(this.requestForm.municipalityId)).map((item) => item.id);
    return this.db.categories.filter((item) => departmentIds.includes(item.departmentId) && item.active);
  }
  get selectedCategoryPriority(): string { return this.db.categories.find((item) => item.id === Number(this.requestForm.categoryId))?.defaultPriority ?? 'media'; }

  get userNotifications() { return this.db.notifications.filter((item) => item.userId === this.user.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)); }
  get unreadNotifications(): number { return this.userNotifications.filter((item) => !item.readAt).length; }

  get reportRequests(): CitizenRequest[] {
    return this.db.requests
      .filter((item) => !this.reportMunicipality || item.municipalityId === Number(this.reportMunicipality))
      .filter((item) => !this.reportDepartment || item.departmentId === Number(this.reportDepartment))
      .filter((item) => !this.reportCategory || item.categoryId === Number(this.reportCategory))
      .filter((item) => !this.reportStatus || item.status === this.reportStatus)
      .filter((item) => !this.reportFrom || item.registeredAt.slice(0, 10) >= this.reportFrom)
      .filter((item) => !this.reportTo || item.registeredAt.slice(0, 10) <= this.reportTo);
  }
  get resolvedReportCount(): number { return this.reportRequests.filter((item) => ['resuelta', 'cerrada'].includes(item.status)).length; }

navigate(view: string): void {
  this.activeView = view;
  this.selectedRequestId = undefined;
  this.clearMessages();

setTimeout(() => {
  this.pageContent?.nativeElement.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}, 0);
}

openRequest(request: CitizenRequest, view?: string): void {
  this.selectedRequestId = request.id;
  if (view) this.activeView = view;
  this.assignmentDepartment = request.departmentId ?? 0;

  const activeAssignment = this.db.assignments.find(
    (item) => item.requestId === request.id && item.active
  );

  this.assignmentEmployee = activeAssignment?.employeeId ?? 0;
  this.assignmentNote = activeAssignment?.note ?? '';
  this.nextStatus = '';
  this.statusReason = '';
  this.clearMessages();

  setTimeout(() => {
  this.pageContent?.nativeElement.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}, 0);
}

  validateRequest(): void {
    this.clearMessages();
    const form = this.requestForm;
    if (!form.municipalityId || !form.categoryId || !form.title.trim() || !form.description.trim() || !form.address.trim()) {
      this.error = 'Complete municipio, categoría, título, descripción y dirección o referencia.';
      return;
    }
    const category = this.db.categories.find((item) => item.id === Number(form.categoryId));
    if (category?.requiresLocation && (form.latitude === undefined || form.longitude === undefined)) {
      this.error = 'La categoría seleccionada requiere confirmar una ubicación.';
      return;
    }
    this.requestStep = 2;
  }

  submitRequest(): void {
    this.clearMessages();
    try {
      const request = this.storage.createRequest(this.user.id, { ...this.requestForm, municipalityId: Number(this.requestForm.municipalityId), categoryId: Number(this.requestForm.categoryId), evidence: this.evidence });
      this.toast = `Solicitud ${request.code} registrada y persistida en este navegador.`;
      this.requestForm = { municipalityId: 0, categoryId: 0, title: '', description: '', address: '' };
      this.evidence = undefined;
      this.requestStep = 1;
      this.openRequest(request, 'detalle');
    } catch (error) { this.error = this.errorText(error); }
  }

  selectEvidence(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.evidence = file ? { name: file.name, type: file.type, size: file.size } : undefined;
  }

  captureLocation(): void {
    this.clearMessages();
    if (!navigator.geolocation) { this.error = 'La geolocalización no está disponible en este navegador.'; return; }
    this.locationLoading = true;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        this.requestForm.latitude = Number(coords.latitude.toFixed(7));
        this.requestForm.longitude = Number(coords.longitude.toFixed(7));
        this.locationLoading = false;
        this.toast = 'Ubicación del dispositivo capturada para la demostración.';
      },
      () => { this.locationLoading = false; this.error = 'No fue posible obtener permiso de ubicación. Puede usar el punto demo.'; },
      { enableHighAccuracy: true, timeout: 7000 },
    );
  }

  useDemoLocation(): void {
    this.requestForm.latitude = 18.4861;
    this.requestForm.longitude = -69.9312;
    this.toast = 'Coordenadas ficticias de demostración aplicadas.';
  }

  addCitizenComment(): void {
    if (!this.selectedRequest || !this.citizenComment.trim()) return;
    this.storage.addComment(this.selectedRequest.id, this.user.id, this.citizenComment);
    this.citizenComment = '';
    this.toast = 'Comentario ciudadano agregado.';
  }

  submitSurvey(): void {
    if (!this.selectedRequest) return;
    try {
      this.storage.submitSurvey(this.selectedRequest.id, this.user.id, this.surveyRating, this.surveyComment);
      this.surveyRating = 0;
      this.surveyComment = '';
      this.toast = 'Valoración registrada una sola vez en los datos demo.';
    } catch (error) { this.error = this.errorText(error); }
  }

  assign(): void {
    if (!this.selectedRequest || !this.assignmentDepartment) { this.error = 'Seleccione un departamento.'; return; }
    try {
      this.storage.assignRequest(this.selectedRequest.id, Number(this.assignmentDepartment), this.assignmentEmployee ? Number(this.assignmentEmployee) : undefined, this.assignmentNote, this.user.id);
      this.toast = 'Asignación guardada y notificada al ciudadano.';
      this.clearOperationFields();
    } catch (error) { this.error = this.errorText(error); }
  }

  changeStatus(): void {
    if (!this.selectedRequest || !this.nextStatus) { this.error = 'Seleccione el nuevo estado.'; return; }
    try {
      this.storage.updateStatus(this.selectedRequest.id, this.nextStatus, this.statusReason, this.user.id);
      this.toast = 'Estado actualizado; historial y notificación generados.';
      this.nextStatus = '';
      this.statusReason = '';
    } catch (error) { this.error = this.errorText(error); }
  }

  addMunicipalComment(): void {
    if (!this.selectedRequest || !this.municipalComment.trim()) { this.error = 'Escriba un comentario.'; return; }
    this.storage.addComment(this.selectedRequest.id, this.user.id, this.municipalComment, this.commentVisibility);
    this.municipalComment = '';
    this.toast = this.commentVisibility === 'ciudadana' ? 'Comentario publicado y notificado.' : 'Nota interna registrada.';
  }

  nextStatuses(request: CitizenRequest): RequestStatus[] {
    const map: Record<RequestStatus, RequestStatus[]> = {
      recibida: ['asignada', 'rechazada'], asignada: ['en_proceso', 'rechazada'], en_proceso: ['resuelta', 'rechazada'], resuelta: ['cerrada', 'en_proceso'], rechazada: [], cerrada: [],
    };
    return map[request.status];
  }

  timeline(requestId: number) { return this.db.statusHistory.filter((item) => item.requestId === requestId).sort((a, b) => b.changedAt.localeCompare(a.changedAt)); }
  comments(requestId: number) { return this.db.comments.filter((item) => item.requestId === requestId && (this.role !== 'ciudadano' || item.visibility === 'ciudadana')).sort((a, b) => a.createdAt.localeCompare(b.createdAt)); }
  attachments(requestId: number) { return this.db.attachments.filter((item) => item.requestId === requestId); }
  assignment(requestId: number) { return this.db.assignments.find((item) => item.requestId === requestId && item.active); }
  survey(requestId: number) { return this.db.surveys.find((item) => item.requestId === requestId); }

  canSurvey(request: CitizenRequest): boolean { return ['resuelta', 'cerrada'].includes(request.status) && !this.survey(request.id); }
  isOverdue(request: CitizenRequest): boolean { return !!request.dueAt && !['resuelta', 'rechazada', 'cerrada'].includes(request.status) && new Date(request.dueAt).getTime() < Date.now(); }
  municipality(id: number) { return this.db.municipalities.find((item) => item.id === id); }
  municipalityByDepartment(departmentId: number): number | undefined { return this.db.departments.find((item) => item.id === departmentId)?.municipalityId; }
  municipalityNameById(id: number): string { return this.municipality(id)?.name ?? 'Sin municipio'; }
  departmentName(id?: number): string { return this.db.departments.find((item) => item.id === id)?.name ?? 'Pendiente'; }
  categoryName(id: number): string { return this.db.categories.find((item) => item.id === id)?.name ?? 'Sin categoría'; }
  citizenName(id: number): string { const user = this.db.users.find((item) => item.id === id); return user ? `${user.firstName} ${user.lastName}` : 'Usuario demo'; }
  authorName(id: number): string { return this.citizenName(id); }
  employeeName(id?: number): string { return id ? this.citizenName(id) : 'Sin responsable individual'; }

  formatDate(value?: string): string {
    return value ? new Intl.DateTimeFormat('es-DO', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }).format(new Date(value)) : 'No disponible';
  }

  roleLabel(roleId: number): string { return this.db.roles.find((item) => item.id === roleId)?.label ?? 'Sin rol'; }

  openNotification(notificationId: number, requestId?: number): void {
    this.storage.markNotificationRead(notificationId);
    const request = requestId ? this.db.requests.find((item) => item.id === requestId) : undefined;
    if (request) this.openRequest(request, 'detalle');
  }

  printCurrent(title: string): void {
    document.body.dataset['printTitle'] = title;
    window.print();
  }

  exportCsv(kind: 'operativo' | 'satisfaccion' | 'auditoria'): void {
    let rows: Array<Array<string | number | undefined>> = [];
    let filename = '';
    if (kind === 'operativo') {
      rows = [['Código', 'Municipio', 'Categoría', 'Departamento', 'Estado', 'Prioridad', 'Fecha'], ...this.reportRequests.map((item) => [item.code, this.municipalityNameById(item.municipalityId), this.categoryName(item.categoryId), this.departmentName(item.departmentId), STATUS_LABEL[item.status], item.priority, item.registeredAt])];
      filename = 'reporte-operativo-demo.csv';
    } else if (kind === 'satisfaccion') {
      rows = [['Código', 'Puntuación', 'Comentario', 'Fecha'], ...this.db.surveys.map((item) => [this.db.requests.find((request) => request.id === item.requestId)?.code, item.rating, item.comment, item.answeredAt])];
      filename = 'reporte-satisfaccion-demo.csv';
    } else {
      rows = [['Acción', 'Entidad', 'Identificador', 'Detalle', 'Fecha'], ...this.db.audit.map((item) => [item.action, item.entity, item.entityId, item.detail, item.createdAt])];
      filename = 'bitacora-auditoria-demo.csv';
    }
    const csv = rows.map((row) => row.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8' }));
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
    this.toast = `Archivo ${filename} generado con datos ficticios.`;
  }

  toggle(entity: 'users' | 'municipalities' | 'departments' | 'categories', id: number): void {
    this.storage.toggleActive(entity, id, this.user.id);
    this.toast = 'Estado actualizado y registrado en auditoría.';
  }

  createMunicipalStaff(): void {
    this.clearMessages();
    const form = this.staffForm;
    if (!form.firstName.trim() || !form.lastName.trim() || !/^\S+@\S+\.\S+$/.test(form.email) || !form.municipalityId) {
      this.error = 'Complete nombres, apellidos, correo y municipio del personal.';
      return;
    }
    try {
      this.storage.createMunicipalUser({ firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone, municipalityId: Number(form.municipalityId), status: form.status }, this.user.id);
      this.staffForm = { firstName: '', lastName: '', email: '', phone: '', roleId: 2, municipalityId: 0, status: 'activo' };
      this.toast = 'Cuenta de personal municipal creada y asociada a su ayuntamiento demo.';
    } catch (error) { this.error = this.errorText(error); }
  }

  resetDemo(): void {
    if (window.confirm('¿Restablecer todos los datos ficticios y cerrar la sesión?')) this.storage.resetDemo();
    if (!this.storage.currentUser()) window.location.assign('/acceso');
  }

  logout(): void { this.auth.logout(); }
  clearMessages(): void { this.toast = ''; this.error = ''; }
  clearOperationFields(): void { this.error = ''; this.nextStatus = ''; this.statusReason = ''; }
  private errorText(error: unknown): string { return error instanceof Error ? error.message : 'Ocurrió un error en la operación demo.'; }
}
