import { DemoDatabase } from './models';

export const DEMO_PASSWORD = '121212';

export function createDemoDatabase(): DemoDatabase {
  return {
    roles: [
      { id: 1, name: 'ciudadano', label: 'Ciudadano', description: 'Registra y consulta sus solicitudes.', active: true },
      { id: 2, name: 'municipal', label: 'Personal municipal', description: 'Gestiona solicitudes de su ayuntamiento.', active: true },
      { id: 3, name: 'administrador', label: 'Administrador', description: 'Configura catálogos, reportes y auditoría.', active: true },
    ],
    municipalities: [
      { id: 1, code: 'DN-DEMO', name: 'Distrito Nacional', province: 'Distrito Nacional', active: true },
      { id: 2, code: 'SDE-DEMO', name: 'Santo Domingo Este', province: 'Santo Domingo', active: true },
      { id: 3, code: 'SDN-DEMO', name: 'Santo Domingo Norte', province: 'Santo Domingo', active: true },
      { id: 4, code: 'SDO-DEMO', name: 'Santo Domingo Oeste', province: 'Santo Domingo', active: true },
    ],
    departments: [
      { id: 1, municipalityId: 1, name: 'Aseo Urbano', description: 'Limpieza, residuos y espacios públicos.', active: true },
      { id: 2, municipalityId: 1, name: 'Infraestructura Urbana', description: 'Vías, aceras, drenaje y señalización.', active: true },
      { id: 3, municipalityId: 2, name: 'Servicios Comunitarios', description: 'Atención de incidencias comunitarias.', active: true },
      { id: 4, municipalityId: 3, name: 'Obras Municipales', description: 'Mantenimiento de infraestructura local.', active: true },
      { id: 5, municipalityId: 4, name: 'Gestión Ambiental', description: 'Residuos y protección ambiental.', active: true },
    ],
    users: [
      { id: 1, roleId: 1, firstName: 'Laura', lastName: 'Pérez Demo', email: 'ciudadano@demo.local', phone: '809-555-0101', status: 'activo', demo: true },
      { id: 2, roleId: 2, municipalityId: 1, firstName: 'Miguel', lastName: 'Santos Demo', email: 'municipal@demo.local', phone: '809-555-0202', status: 'activo', demo: true },
      { id: 3, roleId: 3, firstName: 'Ana', lastName: 'Torres Demo', email: 'admin@demo.local', phone: '809-555-0303', status: 'activo', demo: true },
      { id: 4, roleId: 2, municipalityId: 1, firstName: 'Carlos', lastName: 'Méndez Demo', email: 'empleado@demo.local', status: 'activo', demo: true },
      { id: 5, roleId: 1, firstName: 'José', lastName: 'Ramírez Demo', email: 'jose.demo@example.invalid', status: 'activo', demo: true },
      { id: 6, roleId: 2, municipalityId: 2, firstName: 'María', lastName: 'Gómez Demo', email: 'municipal.sde@demo.local', status: 'activo', demo: true },
    ],
    categories: [
      { id: 1, departmentId: 1, name: 'Acumulación de residuos', description: 'Residuos sólidos en espacios públicos.', defaultPriority: 'media', targetHours: 72, requiresLocation: true, active: true },
      { id: 2, departmentId: 2, name: 'Deterioro de acera o calle', description: 'Daños que dificultan el tránsito.', defaultPriority: 'alta', targetHours: 120, requiresLocation: true, active: true },
      { id: 3, departmentId: 2, name: 'Señalización vial', description: 'Señales ausentes o deterioradas.', defaultPriority: 'media', targetHours: 96, requiresLocation: true, active: true },
      { id: 4, departmentId: 3, name: 'Limpieza de espacio público', description: 'Solicitud de saneamiento comunitario.', defaultPriority: 'media', targetHours: 72, requiresLocation: true, active: true },
      { id: 5, departmentId: 4, name: 'Drenaje pluvial', description: 'Obstrucciones y acumulación de agua.', defaultPriority: 'alta', targetHours: 48, requiresLocation: true, active: true },
      { id: 6, departmentId: 5, name: 'Retiro de escombros', description: 'Escombros en vía o área pública.', defaultPriority: 'media', targetHours: 96, requiresLocation: true, active: true },
    ],
    requests: [
      { id: 1, code: 'GSD-2026-0001', citizenId: 1, municipalityId: 1, categoryId: 1, departmentId: 1, title: 'Residuos junto al parque', description: 'Acumulación de fundas en la entrada lateral del parque. Registro ficticio de demostración.', address: 'Referencia demo: parque del sector', latitude: 18.4768, longitude: -69.8933, priority: 'media', status: 'en_proceso', registeredAt: '2026-08-05T13:20:00.000Z', dueAt: '2026-08-08T13:20:00.000Z', updatedAt: '2026-08-07T15:10:00.000Z', demo: true },
      { id: 2, code: 'GSD-2026-0002', citizenId: 1, municipalityId: 1, categoryId: 2, departmentId: 2, title: 'Acera deteriorada', description: 'Tramo con desnivel que dificulta el paso peatonal. Registro ficticio.', address: 'Referencia demo: avenida principal', latitude: 18.4784, longitude: -69.901, priority: 'alta', status: 'resuelta', registeredAt: '2026-08-01T14:00:00.000Z', dueAt: '2026-08-06T14:00:00.000Z', resolvedAt: '2026-08-06T18:35:00.000Z', updatedAt: '2026-08-06T18:35:00.000Z', demo: true },
      { id: 3, code: 'GSD-2026-0003', citizenId: 5, municipalityId: 1, categoryId: 3, title: 'Señal caída', description: 'Señal de tránsito desprendida. Registro ficticio.', address: 'Referencia demo: calle secundaria', priority: 'alta', status: 'recibida', registeredAt: '2026-08-09T10:10:00.000Z', dueAt: '2026-08-13T10:10:00.000Z', updatedAt: '2026-08-09T10:10:00.000Z', demo: true },
      { id: 4, code: 'GSD-2026-0004', citizenId: 5, municipalityId: 1, categoryId: 1, departmentId: 1, title: 'Contenedor lleno', description: 'Solicitud ficticia para demostrar estado rechazado.', address: 'Referencia demo', priority: 'baja', status: 'rechazada', registeredAt: '2026-07-29T09:00:00.000Z', updatedAt: '2026-07-30T11:00:00.000Z', demo: true },
      { id: 5, code: 'GSD-2026-0005', citizenId: 1, municipalityId: 2, categoryId: 4, departmentId: 3, title: 'Limpieza de plazoleta', description: 'Caso ficticio cerrado para demostrar historial.', address: 'Referencia demo: plazoleta comunitaria', priority: 'media', status: 'cerrada', registeredAt: '2026-07-20T12:00:00.000Z', resolvedAt: '2026-07-24T16:00:00.000Z', closedAt: '2026-07-27T16:00:00.000Z', updatedAt: '2026-07-27T16:00:00.000Z', demo: true },
    ],
    attachments: [
      { id: 1, requestId: 1, userId: 1, originalName: 'evidencia-demo-parque.jpg', mime: 'image/jpeg', size: 183400, createdAt: '2026-08-05T13:20:00.000Z', demo: true },
      { id: 2, requestId: 2, userId: 1, originalName: 'acera-demo.jpg', mime: 'image/jpeg', size: 215120, createdAt: '2026-08-01T14:00:00.000Z', demo: true },
    ],
    assignments: [
      { id: 1, requestId: 1, departmentId: 1, employeeId: 4, assignedBy: 2, assignedAt: '2026-08-05T16:00:00.000Z', note: 'Verificación en ruta demo.', active: true, demo: true },
      { id: 2, requestId: 2, departmentId: 2, employeeId: 2, assignedBy: 2, assignedAt: '2026-08-02T09:00:00.000Z', active: false, demo: true },
    ],
    statusHistory: [
      { id: 1, requestId: 1, current: 'recibida', comment: 'Solicitud recibida por el sistema.', changedBy: 1, changedAt: '2026-08-05T13:20:00.000Z', demo: true },
      { id: 2, requestId: 1, previous: 'recibida', current: 'asignada', comment: 'Asignada a Aseo Urbano.', changedBy: 2, changedAt: '2026-08-05T16:00:00.000Z', demo: true },
      { id: 3, requestId: 1, previous: 'asignada', current: 'en_proceso', comment: 'Brigada demo en verificación.', changedBy: 2, changedAt: '2026-08-07T15:10:00.000Z', demo: true },
      { id: 4, requestId: 2, current: 'recibida', changedBy: 1, changedAt: '2026-08-01T14:00:00.000Z', demo: true },
      { id: 5, requestId: 2, previous: 'recibida', current: 'asignada', changedBy: 2, changedAt: '2026-08-02T09:00:00.000Z', demo: true },
      { id: 6, requestId: 2, previous: 'asignada', current: 'en_proceso', changedBy: 2, changedAt: '2026-08-04T13:00:00.000Z', demo: true },
      { id: 7, requestId: 2, previous: 'en_proceso', current: 'resuelta', comment: 'Intervención finalizada en escenario demo.', changedBy: 2, changedAt: '2026-08-06T18:35:00.000Z', demo: true },
      { id: 8, requestId: 3, current: 'recibida', changedBy: 5, changedAt: '2026-08-09T10:10:00.000Z', demo: true },
      { id: 9, requestId: 4, current: 'recibida', changedBy: 5, changedAt: '2026-07-29T09:00:00.000Z', demo: true },
      { id: 10, requestId: 4, previous: 'recibida', current: 'rechazada', comment: 'Motivo demo: ubicación fuera del ámbito indicado.', changedBy: 2, changedAt: '2026-07-30T11:00:00.000Z', demo: true },
      { id: 11, requestId: 5, current: 'recibida', changedBy: 1, changedAt: '2026-07-20T12:00:00.000Z', demo: true },
      { id: 12, requestId: 5, previous: 'recibida', current: 'asignada', changedBy: 2, changedAt: '2026-07-21T09:00:00.000Z', demo: true },
      { id: 13, requestId: 5, previous: 'asignada', current: 'en_proceso', changedBy: 2, changedAt: '2026-07-22T09:30:00.000Z', demo: true },
      { id: 14, requestId: 5, previous: 'en_proceso', current: 'resuelta', changedBy: 2, changedAt: '2026-07-24T16:00:00.000Z', demo: true },
      { id: 15, requestId: 5, previous: 'resuelta', current: 'cerrada', changedBy: 2, changedAt: '2026-07-27T16:00:00.000Z', demo: true },
    ],
    comments: [
      { id: 1, requestId: 1, authorId: 2, message: 'La brigada municipal demo validará el punto reportado.', visibility: 'ciudadana', createdAt: '2026-08-06T12:00:00.000Z', demo: true },
      { id: 2, requestId: 1, authorId: 1, message: 'Gracias. El acceso se encuentra por el lateral norte.', visibility: 'ciudadana', createdAt: '2026-08-06T13:18:00.000Z', demo: true },
      { id: 3, requestId: 2, authorId: 2, message: 'Trabajo completado. Este mensaje corresponde a datos de demostración.', visibility: 'ciudadana', createdAt: '2026-08-06T18:35:00.000Z', demo: true },
    ],
    notifications: [
      { id: 1, userId: 1, requestId: 1, title: 'Solicitud en proceso', message: 'GSD-2026-0001 pasó a En proceso.', createdAt: '2026-08-07T15:10:00.000Z', demo: true },
      { id: 2, userId: 1, requestId: 2, title: 'Solicitud resuelta', message: 'GSD-2026-0002 fue marcada como Resuelta. Ya puede valorarla.', createdAt: '2026-08-06T18:35:00.000Z', demo: true },
      { id: 3, userId: 1, requestId: 1, title: 'Nuevo comentario', message: 'El ayuntamiento agregó información a su solicitud.', readAt: '2026-08-06T13:00:00.000Z', createdAt: '2026-08-06T12:00:00.000Z', demo: true },
    ],
    surveys: [
      { id: 1, requestId: 5, citizenId: 1, rating: 4, comment: 'Valoración ficticia para la demostración.', answeredAt: '2026-07-28T10:00:00.000Z', demo: true },
    ],
    audit: [
      { id: 1, userId: 3, action: 'DATOS_DEMO_INICIALIZADOS', entity: 'sistema', detail: 'Conjunto ficticio de demostración cargado.', createdAt: '2026-08-09T08:00:00.000Z', demo: true },
      { id: 2, userId: 2, action: 'ESTADO_ACTUALIZADO', entity: 'solicitudes', entityId: '1', detail: 'Solicitud demo GSD-2026-0001 actualizada a en_proceso.', createdAt: '2026-08-07T15:10:00.000Z', demo: true },
    ],
  };
}
