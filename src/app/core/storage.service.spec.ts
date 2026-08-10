import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
  });

  it('initializes the 13 entity collections and three roles', () => {
    const db = service.db();
    expect(Object.keys(db).length).toBe(13);
    expect(db.roles.map((role) => role.name)).toEqual(['ciudadano', 'municipal', 'administrador']);
  });

  it('creates and persists a citizen request in received status', () => {
    const request = service.createRequest(1, {
      municipalityId: 1,
      categoryId: 1,
      title: 'Solicitud de prueba',
      description: 'Contenido ficticio de prueba automatizada.',
      address: 'Referencia demo',
      latitude: 18.48,
      longitude: -69.93,
    });
    expect(request.status).toBe('recibida');
    expect(request.code).toMatch(/^GSD-\d{4}-\d{4}$/);
    expect(service.db().requests.some((item) => item.id === request.id)).toBeTrue();
    expect(localStorage.getItem('itla_gestion_municipal_demo_v1')).toContain(request.code);
  });

  it('propagates assignment, status, comment and survey across the same request', () => {
    const request = service.createRequest(1, {
      municipalityId: 1,
      categoryId: 1,
      title: 'Flujo integral demo',
      description: 'Prueba del flujo entre roles.',
      address: 'Referencia demo',
      latitude: 18.48,
      longitude: -69.93,
    });
    service.assignRequest(request.id, 1, 4, 'Asignación demo', 2);
    service.updateStatus(request.id, 'en_proceso', 'Atención demo iniciada', 2);
    service.addComment(request.id, 2, 'Mensaje municipal visible.');
    service.updateStatus(request.id, 'resuelta', 'Atención demo completada', 2);
    service.submitSurvey(request.id, 1, 5, 'Valoración demo.');

    const db = service.db();
    expect(db.requests.find((item) => item.id === request.id)?.status).toBe('resuelta');
    expect(db.statusHistory.filter((item) => item.requestId === request.id).length).toBe(4);
    expect(db.comments.some((item) => item.requestId === request.id && item.visibility === 'ciudadana')).toBeTrue();
    expect(db.notifications.some((item) => item.requestId === request.id && item.userId === 1)).toBeTrue();
    expect(db.surveys.filter((item) => item.requestId === request.id).length).toBe(1);
  });

  it('requires a reason when rejecting a request', () => {
    expect(() => service.updateStatus(3, 'rechazada', '', 2)).toThrowError(/requiere un motivo/i);
  });
});
