require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

// Usar una sola instancia global para evitar errores de inicialización
const prisma = new PrismaClient({
  log: ['error', 'info', 'query', 'warn'],
});

// Prueba de conexión inmediata al arrancar
prisma.$connect()
  .then(() => console.log('✅ Conexión exitosa a MongoDB con Prisma'))
  .catch((err) => console.error('❌ Error conectando a la base de datos:', err));

const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const { GoogleGenAI } = require('@google/genai');


const app = express();
app.use(cors());
app.use(express.json());

const uploadDirs = {
  docentes: path.join(__dirname, '../SitioWebCarrera/src/assets/img/Docentes'),
  egresados: path.join(__dirname, '../SitioWebCarrera/src/assets/img/Egresados'),
  proyectos: path.join(__dirname, '../SitioWebCarrera/src/assets/img/Proyectos'),
  galeria: path.join(__dirname, '../SitioWebCarrera/src/assets/img/Galeria')
};

Object.values(uploadDirs).forEach((dir) => {
  fs.mkdirSync(dir, { recursive: true });
});

function safeFileBaseName(name) {
  return path
    .basename(name, path.extname(name))
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 60) || 'archivo';
}

function createUploader(entity, acceptsFile = () => true) {
  return multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => cb(null, uploadDirs[entity]),
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const baseName = safeFileBaseName(file.originalname);
        cb(null, `${baseName}_${Date.now()}${ext}`);
      }
    }),
    fileFilter: (req, file, cb) => {
      const isValidFile = acceptsFile(file);
      cb(isValidFile ? null : new Error('Tipo de archivo no permitido para este campo'), isValidFile);
    }
  });
}

const uploadDocente = createUploader('docentes', (file) => file.mimetype.startsWith('image/'));
const uploadEgresado = createUploader('egresados', (file) => file.mimetype.startsWith('image/'));
const uploadProyecto = createUploader('proyectos', (file) => {
  if (file.fieldname === 'imagenPortada' || file.fieldname === 'image') {
    return file.mimetype.startsWith('image/');
  }

  return file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/');
});
const uploadGaleria = createUploader('galeria', (file) => file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/'));

const AUTH_SECRET = process.env.AUTH_SECRET || 'dev-secret-change-me';
const TOKEN_TTL_MS = 1000 * 60 * 60 * 8;

if (!process.env.AUTH_SECRET) {
  console.warn(
    '⚠️  Configura AUTH_SECRET en server/.env para producción.'
  );
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const knowledgeDir = path.join(
  __dirname,
  '../SitioWebCarrera/src/assets/data/knowledge'
);

function readJsonFile(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`No se pudo leer ${filePath}:`, err.message);
    return null;
  }
}

const knowledge = {
  general: readJsonFile(path.join(knowledgeDir, 'general.json')),
  objetivo: readJsonFile(path.join(knowledgeDir, 'objetivo.json')),
  perfilEgreso: readJsonFile(path.join(knowledgeDir, 'perfil_egreso.json')),
  campoLaboral: readJsonFile(path.join(knowledgeDir, 'campo_laboral.json')),
  planEstudios: readJsonFile(path.join(knowledgeDir, 'plan_estudios.json')),
  admision: readJsonFile(path.join(knowledgeDir, 'admision.json')),
  faqAdmision: readJsonFile(path.join(knowledgeDir, 'faq_admision.json')),
  contacto: readJsonFile(path.join(knowledgeDir, 'contacto.json')),
  becas: readJsonFile(path.join(knowledgeDir, 'becas.json')),
  proyectos: readJsonFile(path.join(knowledgeDir, 'proyectos.json')),
  quienesSomos: readJsonFile(path.join(knowledgeDir, 'quienes_somos.json'))
};

const systemPrompt =
  'Eres el Asistente Virtual de la Ingeniería en Desarrollo de Software y Sistemas Inteligentes de la UNISTMO. ' +
  'Responde siempre de forma amable, clara y breve. ' +
  'Cuando la información tenga varios datos, sepárala con viñetas usando "- " y resalta etiquetas importantes con **negritas**. ' +
  'No uses Markdown si la respuesta es una frase corta. ' +
  'Usa únicamente la información incluida en la base de conocimiento JSON proporcionada. ' +
  'Si la respuesta no está en los JSON, indica amablemente que no cuentas con esa información y sugiere consultar el sitio oficial o contactar a la carrera.';

const sectionMap = [
  { key: 'plan', sections: ['planEstudios'] },
  { key: 'estudios', sections: ['planEstudios'] },
  { key: 'semestre', sections: ['planEstudios'] },
  { key: 'admis', sections: ['admision', 'faqAdmision'] },
  { key: 'ficha', sections: ['admision', 'faqAdmision'] },
  { key: 'examen', sections: ['admision', 'faqAdmision'] },
  { key: 'propedeutico', sections: ['admision'] },
  { key: 'horario', sections: ['admision'] },
  { key: 'beca', sections: ['becas'] },
  { key: 'contact', sections: ['contacto'] },
  { key: 'telefono', sections: ['contacto'] },
  { key: 'correo', sections: ['contacto'] },
  { key: 'docente', sections: ['perfilEgreso', 'general'] },
  { key: 'profesor', sections: ['perfilEgreso', 'general'] },
  { key: 'maestro', sections: ['perfilEgreso', 'general'] },
  { key: 'proyecto', sections: ['proyectos'] },
  { key: 'quienes', sections: ['quienesSomos'] },
  { key: 'mision', sections: ['quienesSomos'] },
  { key: 'vision', sections: ['quienesSomos'] },
  { key: 'perfil', sections: ['perfilEgreso'] },
  { key: 'objetivo', sections: ['objetivo'] },
  { key: 'campo', sections: ['campoLaboral'] },
  { key: 'laboral', sections: ['campoLaboral'] },
  { key: 'aspirante', sections: ['general'] },
  { key: 'duracion', sections: ['general'] },
  { key: 'modalidad', sections: ['general'] },
  { key: 'campus', sections: ['general'] }
];

function buildContext(message) {
  const msg = (message || '').toLowerCase();
  const matchedSections = new Set();

  for (const rule of sectionMap) {
    if (msg.includes(rule.key)) {
      rule.sections.forEach((section) => matchedSections.add(section));
    }
  }

  if (matchedSections.size === 0) {
    return knowledge;
  }

  const partial = {};
  matchedSections.forEach((section) => {
    if (knowledge[section]) {
      partial[section] = knowledge[section];
    }
  });

  return partial;
}

function localAnswer(message) {
  const msg = (message || '').toLowerCase();
  const matchedSections = new Set();

  for (const rule of sectionMap) {
    if (msg.includes(rule.key)) {
      rule.sections.forEach((section) => matchedSections.add(section));
    }
  }

  if (matchedSections.size === 0) {
    return (
      'No tengo información específica para esa pregunta en la base local. ' +
      'Puedes preguntar sobre: plan de estudios, admisión, becas, contacto, campo laboral, perfil de egreso o datos generales de la carrera.'
    );
  }

  const lines = [];
  const pushSection = (title) => {
    if (lines.length) lines.push('');
    lines.push(`${title}:`);
  };
  const pushList = (items) => {
    items.forEach((item) => lines.push(`- ${item}`));
  };

  if (matchedSections.has('general')) {
    const g = knowledge.general;
    pushSection('Información general');
    if (g?.nombreOficial) lines.push(`Programa: ${g.nombreOficial}`);
    if (g?.institucion) lines.push(`Institución: ${g.institucion}`);
    if (g?.campus?.length) lines.push(`Campus: ${g.campus.join(', ')}`);
    if (g?.modalidad) lines.push(`Modalidad: ${g.modalidad}`);
    if (g?.duracion?.detalle) lines.push(`Duración: ${g.duracion.detalle}`);
    if (g?.descripcionGeneral) lines.push(`Descripción: ${g.descripcionGeneral}`);
  }

  if (matchedSections.has('objetivo')) {
    const o = knowledge.objetivo;
    pushSection('Objetivo');
    if (o?.objetivoGeneral) lines.push(`Objetivo general: ${o.objetivoGeneral}`);
    if (o?.objetivosEspecificos?.length) {
      lines.push('Objetivos específicos:');
      pushList(o.objetivosEspecificos);
    }
    if (o?.enfoqueFormativo) lines.push(`Enfoque formativo: ${o.enfoqueFormativo}`);
  }

  if (matchedSections.has('perfilEgreso')) {
    const p = knowledge.perfilEgreso;
    pushSection('Perfil de egreso');
    if (p?.perfilGeneral) lines.push(p.perfilGeneral);
  }

  if (matchedSections.has('campoLaboral')) {
    const c = knowledge.campoLaboral;
    pushSection('Campo laboral');
    if (c?.ambitos) lines.push(`Ámbitos: ${c.ambitos}`);
    if (c?.puestos?.length) {
      lines.push('Puestos:');
      pushList(c.puestos);
    }
  }

  if (matchedSections.has('planEstudios')) {
    const p = knowledge.planEstudios;
    if (p?.planEstudios) {
      pushSection('Plan de estudios');
      Object.keys(p.planEstudios).forEach((sem) => {
        const materias = p.planEstudios[sem] || [];
        lines.push(`${sem}° semestre:`);
        pushList(materias);
      });
    }
    if (p?.notaGeneral) lines.push(`Nota: ${p.notaGeneral}`);
  }

  if (matchedSections.has('admision')) {
    const a = knowledge.admision;
    if (a?.fechas) {
      pushSection('Admisión');
      lines.push('Fechas importantes:');
      Object.entries(a.fechas).forEach(([k, v]) => {
        lines.push(`- ${k}: ${v}`);
      });
    }
    if (a?.documentosFicha?.length) {
      lines.push('Documentos para ficha:');
      pushList(a.documentosFicha);
    }
  }

  if (matchedSections.has('contacto')) {
    const c = knowledge.contacto;
    pushSection('Contacto');
    if (c?.sitioOficial) lines.push(`Sitio: ${c.sitioOficial}`);
    if (c?.contactosCarrera) {
      lines.push('Redes:');
      pushList([
        `Facebook: ${c.contactosCarrera.facebook}`,
        `Instagram: ${c.contactosCarrera.instagram}`,
        `YouTube: ${c.contactosCarrera.youtube}`,
        `X: ${c.contactosCarrera.x}`,
        `WhatsApp: ${c.contactosCarrera.whatsappJefatura}`
      ]);
    }
  }

  if (matchedSections.has('becas')) {
    const b = knowledge.becas;
    pushSection('Becas');
    if (b?.becasUrl) lines.push(`Más información: ${b.becasUrl}`);
  }

  if (matchedSections.has('proyectos')) {
    const p = knowledge.proyectos;
    pushSection('Proyectos');
    if (p?.nota) lines.push(p.nota);
  }

  if (matchedSections.has('quienesSomos')) {
    const q = knowledge.quienesSomos;
    pushSection('Quiénes somos');
    if (q?.nota) lines.push(q.nota);
  }

  return lines.join('\n').trim();
}

const USE_DIRECT_FALLBACK = false;

const allowedModels = [
  'gemini-2.5-flash-lite'
];

function normalizeHistory(history) {
  if (!Array.isArray(history)) {
    return [];
  }

  return history
    .filter((item) => item?.role === 'user' || item?.role === 'model')
    .map((item) => ({
      role: item.role,
      parts: Array.isArray(item.parts)
        ? item.parts
            .filter((part) => typeof part?.text === 'string' && part.text.trim())
            .map((part) => ({ text: part.text }))
        : []
    }))
    .filter((item) => item.parts.length > 0);
}

function extractResponseText(response) {
  if (typeof response?.text === 'string') {
    return response.text;
  }

  if (typeof response?.text === 'function') {
    return response.text();
  }

  if (typeof response?.response?.text === 'function') {
    return response.response.text();
  }

  return (
    response?.candidates?.[0]?.content?.parts ||
    response?.response?.candidates?.[0]?.content?.parts ||
    []
  )
    .map((part) => part.text || '')
    .join('');
}

function isQuotaError(error) {
  const msg = String(error?.message || '').toLowerCase();
  return (
    error?.status === 429 ||
    error?.code === 429 ||
    msg.includes('quota') ||
    msg.includes('resource_exhausted')
  );
}

app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, message, history, modelId } = req.body;
    const userPrompt = typeof prompt === 'string' ? prompt : message;

    if (!userPrompt || typeof userPrompt !== 'string' || !userPrompt.trim()) {
      return res.status(400).json({
        error: 'Por favor envía una pregunta válida para el asistente.'
      });
    }

    if (USE_DIRECT_FALLBACK) {
      const fallback = localAnswer(userPrompt);
      return res.json({ text: fallback, fallback: true });
    }

    const selectedModel = allowedModels.includes(modelId)
      ? modelId
      : 'gemini-2.5-flash-lite';

    const contextPrompt =
      'Base de conocimiento (JSON):\n' +
      JSON.stringify(buildContext(userPrompt), null, 2) +
      '\nFin de la base de conocimiento.\n\n' +
      'Pregunta del usuario: ' +
      userPrompt;

    const response = await ai.models.generateContent({
      model: selectedModel,
      config: {
        systemInstruction: systemPrompt
      },
      contents: [
        ...normalizeHistory(history),
        { role: 'user', parts: [{ text: contextPrompt }] }
      ]
    });

    const text =
      extractResponseText(response).trim() ||
      'Lo siento, no pude generar una respuesta con la información disponible.';

    res.json({ text });
  } catch (error) {
    console.error('Error en Gemini:', error);

    if (isQuotaError(error)) {
      const fallback = localAnswer(req.body?.prompt || req.body?.message || '');
      return res.json({ text: fallback, fallback: true });
    }

    res.status(500).json({
      error: 'Lo siento, el asistente no pudo responder en este momento. Intenta de nuevo más tarde.'
    });
  }
});

function parseApiDate(value) {
  if (!value) {
    return undefined;
  }

  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function formatSpanishDate(date) {
  if (!date) {
    return undefined;
  }

  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a || ''));
  const right = Buffer.from(String(b || ''));

  if (left.length !== right.length) {
    return false;
  }

  return crypto.timingSafeEqual(left, right);
}

function base64UrlEncode(value) {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function base64UrlDecode(value) {
  return JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));
}

function signToken(payload) {
  const encodedPayload = base64UrlEncode(payload);
  const signature = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

function verifyToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) {
    return null;
  }

  try {
    const [encodedPayload, signature] = token.split('.');
    const expectedSignature = crypto
      .createHmac('sha256', AUTH_SECRET)
      .update(encodedPayload)
      .digest('base64url');

    if (!safeEqual(signature, expectedSignature)) {
      return null;
    }

    const payload = base64UrlDecode(encodedPayload);
    if (!payload?.exp || payload.exp < Date.now()) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
}

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  req.user = payload;
  next();
}

function normalizePublicaciones(publicaciones = []) {
  return parseArrayField(publicaciones).map((publicacion) => ({
    titulo: publicacion.titulo,
    anio: Number(publicacion.anio),
    enlace: publicacion.enlace || '#'
  }));
}

function normalizeMiembros(miembros = []) {
  return parseArrayField(miembros).map((miembro, index) => ({
    nombre: typeof miembro === 'string' ? miembro : miembro.nombre
  })).filter((miembro) => miembro.nombre).map((miembro, index) => ({
    ...miembro,
    orden: index
  }));
}

async function syncMiembrosCatalogo(miembros = []) {
  if (!prisma.miembroProyectoCatalogo) {
    return;
  }

  const names = [...new Set(normalizeMiembros(miembros).map((miembro) => miembro.nombre.trim()).filter(Boolean))];

  for (const nombre of names) {
    await prisma.miembroProyectoCatalogo.upsert({
      where: { nombre },
      update: {},
      create: { nombre }
    });
  }
}

function sortByManualThenText(items, textSelector) {
  const hasManualOrder = items.some((item) => Number.isFinite(item?.orden));

  return [...items].sort((a, b) => {
    if (hasManualOrder) {
      const aOrden = Number.isFinite(a?.orden) ? a.orden : Number.MAX_SAFE_INTEGER;
      const bOrden = Number.isFinite(b?.orden) ? b.orden : Number.MAX_SAFE_INTEGER;
      if (aOrden !== bOrden) {
        return aOrden - bOrden;
      }
    }

    return String(textSelector(a) || '').localeCompare(String(textSelector(b) || ''), 'es', {
      sensitivity: 'base'
    });
  });
}

async function normalizeLegacyEgresados() {
  const emptyStringFields = ['nombre', 'apellidos', 'modalidad'];

  for (const field of emptyStringFields) {
    await prisma.$runCommandRaw({
      update: 'Egresado',
      updates: [
        {
          q: { [field]: null },
          u: { $set: { [field]: '' } },
          multi: true
        }
      ]
    });
  }

  await prisma.$runCommandRaw({
    update: 'Egresado',
    updates: [
      {
        q: { ano: null },
        u: { $set: { ano: new Date().getFullYear() } },
        multi: true
      }
    ]
  });
}

function assetPath(folder, value) {
  if (!value) {
    return '';
  }

  const text = String(value);
  if (/^(https?:)?\/\//i.test(text) || text.startsWith('data:') || text.startsWith('assets/')) {
    return text;
  }

  return `assets/img/${folder}/${text}`;
}

async function reorderRecords(model, ids = []) {
  const validIds = Array.isArray(ids) ? ids.filter(Boolean) : [];

  await Promise.all(
    validIds.map((id, index) =>
      model.update({
        where: { id },
        data: { orden: index }
      })
    )
  );
}

async function miembrosProyectoCatalogo() {
  const [catalogo, miembrosUsados] = await Promise.all([
    prisma.miembroProyectoCatalogo
      ? prisma.miembroProyectoCatalogo.findMany().catch(() => [])
      : Promise.resolve([]),
    prisma.proyectoMiembro.findMany().catch(() => [])
  ]);
  const byName = new Map();

  [...catalogo, ...miembrosUsados].forEach((miembro) => {
    const nombre = String(miembro?.nombre || '').trim();
    if (!nombre || byName.has(nombre.toLowerCase())) {
      return;
    }

    byName.set(nombre.toLowerCase(), {
      id: miembro.id || nombre,
      nombre,
      orden: miembro.orden
    });
  });

  return sortByManualThenText([...byName.values()], (miembro) => miembro.nombre);
}

function normalizeProjectGalleryValue(value = '') {
  const text = String(value || '').trim();

  return text.replace(/^assets\/img\/Proyectos\//i, '');
}

function parseArrayField(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (value === undefined || value === null || value === '') {
    return [];
  }

  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return value
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
}

function firstUploadedFile(req, ...fieldNames) {
  if (req.file) {
    return req.file;
  }

  for (const fieldName of fieldNames) {
    const files = req.files?.[fieldName];
    if (Array.isArray(files) && files.length > 0) {
      return files[0];
    }
  }

  return null;
}

function uploadedFileNames(req, ...fieldNames) {
  return fieldNames.flatMap((fieldName) => {
    const files = req.files?.[fieldName];
    return Array.isArray(files) ? files.map((file) => file.filename) : [];
  });
}

function cleanData(data) {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  );
}

function splitFullName(nombreCompleto = '') {
  const parts = String(nombreCompleto).trim().split(/\s+/).filter(Boolean);

  if (parts.length <= 1) {
    return { nombre: parts[0] || '', apellidos: '' };
  }

  return {
    nombre: parts.slice(0, -2).join(' ') || parts[0],
    apellidos: parts.slice(-2).join(' ')
  };
}

function resolveNombreApellidos(body) {
  if (body.nombre && body.apellidos !== undefined) {
    return {
      nombre: body.nombre,
      apellidos: body.apellidos
    };
  }

  if (!body.nombre) {
    return { nombre: undefined, apellidos: undefined };
  }

  return splitFullName(body.nombre);
}

function resolveYear(body) {
  const value = body.ano ?? body.anio ?? body.anioText;
  return value === undefined || value === '' ? undefined : Number(value);
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.get('/api/miembros-proyecto', async (req, res) => {
  try {
    res.json(await miembrosProyectoCatalogo());
  } catch (error) {
    console.error('Error al obtener miembros de proyecto:', error);
    res.status(500).json({ error: 'Error al obtener miembros de proyecto' });
  }
});

app.post('/api/miembros-proyecto', requireAuth, async (req, res) => {
  try {
    const nombre = String(req.body.nombre || '').trim();

    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }

    const miembro = prisma.miembroProyectoCatalogo
      ? await prisma.miembroProyectoCatalogo.upsert({
          where: { nombre },
          update: {},
          create: { nombre }
        })
      : { id: nombre, nombre };

    res.status(201).json(miembro);
  } catch (error) {
    console.error('Error al guardar miembro de proyecto:', error);
    res.status(500).json({ error: 'Error al guardar miembro de proyecto' });
  }
});

const reorderModels = {
  docentes: prisma.docente,
  egresados: prisma.egresado,
  proyectos: prisma.proyecto,
  galeria: prisma.galeriaItem,
  noticias: prisma.noticia,
  eventos: prisma.evento
};

app.put('/api/:section/reordenar', requireAuth, async (req, res) => {
  try {
    const model = reorderModels[req.params.section];

    if (!model) {
      return res.status(404).json({ error: 'Seccion no encontrada' });
    }

    await reorderRecords(model, req.body.ids);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al reordenar registros' });
  }
});

app.post('/api/auth/register-admin', async (req, res) => {
  try {
    const { usuario, username, password, role = 'admin' } = req.body;
    const adminUser = String(usuario || username || '').trim();

    if (!adminUser || !password || typeof password !== 'string') {
      return res.status(400).json({
        error: 'usuario y password son obligatorios'
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const admin = await prisma.usuarioAdmin.create({
      data: {
        usuario: adminUser,
        password: passwordHash,
        role: String(role || 'admin')
      },
      select: {
        id: true,
        usuario: true,
        role: true
      }
    });

    res.status(201).json(admin);
  } catch (error) {
    if (error?.code === 'P2002') {
      return res.status(409).json({ error: 'El usuario admin ya existe' });
    }

    console.error('Error al registrar admin:', error);
    res.status(500).json({ error: 'Error al registrar administrador' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { usuario, username, password } = req.body;
    const adminUser = String(usuario || username || '').trim();

    if (!adminUser || !password || typeof password !== 'string') {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    const admin = await prisma.usuarioAdmin.findUnique({
      where: { usuario: adminUser }
    });

    if (!admin) {
      return res.status(401).json({ error: 'Usuario incorrecto' });
    }

    const passwordMatches = admin
      ? await bcrypt.compare(password, admin.password)
      : false;

    if (!passwordMatches) {
      return res.status(401).json({ error: 'Contrasena incorrecta' });
    }

    const token = signToken({
      sub: admin.id,
      usuario: admin.usuario,
      role: admin.role,
      exp: Date.now() + TOKEN_TTL_MS
    });

    res.json({
      token,
      tokenType: 'Bearer',
      expiresIn: TOKEN_TTL_MS / 1000,
      user: {
        id: admin.id,
        usuario: admin.usuario,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.clearCookie('authToken');
  res.clearCookie('Authorization');

  res.json({
    ok: true,
    message: 'Sesión cerrada correctamente. Limpia el token del cliente.'
  });
});

// --- RUTAS DE USUARIOS ADMIN ---
app.get('/api/usuarios', requireAuth, async (req, res) => {
  try {
    const usuarios = await prisma.usuarioAdmin.findMany({
      select: {
        id: true,
        usuario: true,
        role: true
      },
      orderBy: {
        usuario: 'asc'
      }
    });

    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios admin:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

app.post('/api/usuarios', requireAuth, async (req, res) => {
  try {
    const usuario = String(req.body.usuario || '').trim();
    const password = String(req.body.password || '');
    const role = String(req.body.role || 'editor').trim() || 'editor';

    if (!usuario || !password) {
      return res.status(400).json({ error: 'usuario y password son obligatorios' });
    }

    const creado = await prisma.usuarioAdmin.create({
      data: {
        usuario,
        password: await bcrypt.hash(password, 10),
        role
      },
      select: {
        id: true,
        usuario: true,
        role: true
      }
    });

    res.status(201).json(creado);
  } catch (error) {
    if (error?.code === 'P2002') {
      return res.status(409).json({ error: 'El usuario ya existe' });
    }

    console.error('Error al crear usuario admin:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

app.put('/api/usuarios/:id', requireAuth, async (req, res) => {
  try {
    const usuario = String(req.body.usuario || '').trim();
    const role = String(req.body.role || '').trim();
    const password = String(req.body.password || '').trim();
    const data = cleanData({
      usuario: usuario || undefined,
      role: role || undefined,
      ...(password ? { password: await bcrypt.hash(password, 10) } : {})
    });

    const actualizado = await prisma.usuarioAdmin.update({
      where: { id: req.params.id },
      data,
      select: {
        id: true,
        usuario: true,
        role: true
      }
    });

    res.json(actualizado);
  } catch (error) {
    if (error?.code === 'P2002') {
      return res.status(409).json({ error: 'El usuario ya existe' });
    }

    console.error('Error al actualizar usuario admin:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

app.delete('/api/usuarios/:id', requireAuth, async (req, res) => {
  try {
    if (req.user?.sub === req.params.id) {
      return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta desde esta sesion' });
    }

    await prisma.usuarioAdmin.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (error) {
    console.error('Error al eliminar usuario admin:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

// --- RUTAS DE NOTICIAS ---
app.get('/api/noticias', async (req, res) => {
  try {
    const noticias = await prisma.noticia.findMany({
      orderBy: { fecha: 'desc' }
    });
    res.json(noticias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener noticias' });
  }
});

app.post('/api/noticias', requireAuth, async (req, res) => {
  try {
    const { titulo, contenido, descripcion, fecha } = req.body;
    const parsedDate = parseApiDate(fecha) || new Date();
    const nuevaNoticia = await prisma.noticia.create({
      data: {
        titulo,
        contenido: contenido || descripcion || '',
        fecha: parsedDate
      }
    });
    res.status(201).json(nuevaNoticia);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear noticia' });
  }
});

app.put('/api/noticias/:id', requireAuth, async (req, res) => {
  try {
    const { titulo, contenido, descripcion, fecha } = req.body;
    const parsedDate = parseApiDate(fecha);
    const noticia = await prisma.noticia.update({
      where: { id: req.params.id },
      data: cleanData({
        titulo,
        contenido: contenido || descripcion,
        fecha: parsedDate
      })
    });
    res.json(noticia);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar noticia' });
  }
});

app.delete('/api/noticias/:id', requireAuth, async (req, res) => {
  try {
    await prisma.noticia.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar noticia' });
  }
});

// --- RUTAS DE EVENTOS ---
app.get('/api/eventos', async (req, res) => {
  try {
    const eventos = await prisma.evento.findMany({
      orderBy: [{ mes: 'asc' }, { dia: 'asc' }]
    });
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
});

app.post('/api/eventos', requireAuth, async (req, res) => {
  try {
    const { titulo, nombre, fecha, descripcion, hora } = req.body;
    const parsedDate = parseApiDate(fecha);
    const nuevoEvento = await prisma.evento.create({
      data: {
        titulo: titulo || nombre,
        fecha: parsedDate,
        descripcion,
        hora
      }
    });
    res.status(201).json(nuevoEvento);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear evento' });
  }
});

app.put('/api/eventos/:id', requireAuth, async (req, res) => {
  try {
    const { titulo, nombre, fecha, descripcion, hora } = req.body;
    const parsedDate = parseApiDate(fecha);
    const evento = await prisma.evento.update({
      where: { id: req.params.id },
      data: cleanData({
        titulo: titulo || nombre,
        fecha: parsedDate,
        descripcion,
        hora
      })
    });
    res.json(evento);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar evento' });
  }
});

app.delete('/api/eventos/:id', requireAuth, async (req, res) => {
  try {
    await prisma.evento.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar evento' });
  }
});

// --- RUTAS DE DOCENTES ---
app.get('/api/docentes', async (req, res) => {
  try {
    const docentes = await prisma.docente.findMany({
      include: {
        publicaciones: {
          orderBy: [{ anio: 'desc' }, { titulo: 'asc' }]
        }
      }
    });
    res.json(sortByManualThenText(docentes, (docente) => `${docente.nombre} ${docente.apellidos}`));
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener docentes' });
  }
});

app.post('/api/docentes', requireAuth, uploadDocente.single('imagen'), async (req, res) => {
  try {
    const {
      especialidad,
      cargo,
      descripcion,
      email,
      publicaciones = []
    } = req.body;
    const { nombre, apellidos } = resolveNombreApellidos(req.body);
    const imagen = req.file?.filename || req.body.imagen;

    const docente = await prisma.docente.create({
      data: {
        nombre,
        apellidos,
        especialidad,
        cargo,
        imagen,
        descripcion,
        email,
        publicaciones: {
          create: normalizePublicaciones(publicaciones)
        }
      },
      include: { publicaciones: true }
    });

    res.status(201).json(docente);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear docente' });
  }
});

app.put('/api/docentes/:id', requireAuth, uploadDocente.single('imagen'), async (req, res) => {
  try {
    const {
      especialidad,
      cargo,
      descripcion,
      email,
      publicaciones
    } = req.body;
    const { nombre, apellidos } = resolveNombreApellidos(req.body);
    const imagen = req.file?.filename || req.body.imagen;

    const docente = await prisma.docente.update({
      where: { id: req.params.id },
      data: cleanData({
        nombre,
        apellidos,
        especialidad,
        cargo,
        imagen,
        descripcion,
        email,
        ...(publicaciones !== undefined
          ? {
              publicaciones: {
                deleteMany: {},
                create: normalizePublicaciones(publicaciones)
              }
            }
          : {})
      }),
      include: { publicaciones: true }
    });

    res.json(docente);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar docente' });
  }
});

app.delete('/api/docentes/:id', requireAuth, async (req, res) => {
  try {
    await prisma.publicacion.deleteMany({ where: { docenteId: req.params.id } });
    await prisma.docente.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar docente' });
  }
});

// --- RUTAS DE EGRESADOS ---
app.get('/api/egresados', async (req, res) => {
  try {
    await normalizeLegacyEgresados();
    const where = req.query.modalidad
      ? { modalidad: String(req.query.modalidad) }
      : undefined;

    const egresados = await prisma.egresado.findMany({
      where,
      orderBy: [{ anio: 'asc' }, { nombre: 'asc' }]
    });

    res.json(egresados);
  } catch (error) {
    console.error('Error al obtener egresados:', error);
    res.status(500).json({ error: 'Error al obtener egresados' });
  }
});

app.post('/api/egresados', requireAuth, uploadEgresado.single('foto'), async (req, res) => {
  try {
    const { modalidad } = req.body;
    const { nombre, apellidos } = resolveNombreApellidos(req.body);
    const egresado = await prisma.egresado.create({
      data: {
        nombre,
        apellidos,
        ano: resolveYear(req.body),
        modalidad,
        foto: req.file?.filename || req.body.foto
      }
    });
    res.status(201).json(egresado);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear egresado' });
  }
});

app.put('/api/egresados/:id', requireAuth, uploadEgresado.single('foto'), async (req, res) => {
  try {
    const { modalidad } = req.body;
    const { nombre, apellidos } = resolveNombreApellidos(req.body);
    const egresado = await prisma.egresado.update({
      where: { id: req.params.id },
      data: cleanData({
        nombre,
        apellidos,
        ano: resolveYear(req.body),
        modalidad,
        foto: req.file?.filename || req.body.foto
      })
    });
    res.json(egresado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar egresado' });
  }
});

app.delete('/api/egresados/:id', requireAuth, async (req, res) => {
  try {
    await prisma.egresado.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar egresado' });
  }
});

// --- RUTAS DE PROYECTOS ---
app.get('/api/proyectos', async (req, res) => {
  try {
    const where = req.query.categoria || req.query.categoryKey
      ? { categoria: String(req.query.categoria || req.query.categoryKey) }
      : undefined;

    const proyectos = await prisma.proyecto.findMany({
      where,
      include: {
        miembros: true
      }
    });

    const sortedProjects = sortByManualThenText(proyectos, (proyecto) => proyecto.title).map((proyecto) => ({
      ...proyecto,
      categoryKey: proyecto.categoria === 'Sistemas Inteligentes' ? 'sistemas' : 'software',
      categoryLabel: proyecto.categoria,
      image: assetPath('Proyectos', proyecto.imagenPortada),
      galeria: (proyecto.galeriaProyecto || []).map((url) => ({
        url: assetPath('Proyectos', url),
        tipo: /\.(mp4|webm|ogg|mov)$/i.test(String(url)) ? 'video' : 'imagen'
      })),
      miembros: sortByManualThenText(proyecto.miembros || [], (miembro) => miembro.nombre)
    }));

    res.json(sortedProjects);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener proyectos' });
  }
});

app.post(
  '/api/proyectos',
  requireAuth,
  uploadProyecto.fields([
    { name: 'imagenPortada', maxCount: 1 },
    { name: 'image', maxCount: 1 },
    { name: 'galeriaProyecto', maxCount: 30 },
    { name: 'galeria', maxCount: 30 }
  ]),
  async (req, res) => {
  try {
    const {
      categoria,
      categoryKey,
      categoryLabel,
      title,
      summary,
      imagenPortada,
      description,
      miembros = []
    } = req.body;
    const portada = firstUploadedFile(req, 'imagenPortada', 'image')?.filename || imagenPortada || req.body.image;
    const galeriaProyecto = [
      ...parseArrayField(req.body.galeriaProyecto || req.body.galeria).map((item) =>
        normalizeProjectGalleryValue(typeof item === 'string' ? item : item.url)
      ),
      ...uploadedFileNames(req, 'galeriaProyecto', 'galeria')
    ].filter(Boolean);
    const normalizedMiembros = normalizeMiembros(miembros);
    await syncMiembrosCatalogo(normalizedMiembros);

    const proyecto = await prisma.proyecto.create({
      data: {
        categoria: categoria || categoryLabel || categoryKey || 'Otros',
        title,
        summary,
        imagenPortada: portada,
        description,
        galeriaProyecto,
        miembros: {
          create: normalizedMiembros
        }
      },
      include: {
        miembros: true
      }
    });

    res.status(201).json(proyecto);
  } catch (error) {
    console.error('Error al crear proyecto:', error);
    res.status(500).json({ error: 'Error al crear proyecto' });
  }
  }
);

app.put(
  '/api/proyectos/:id',
  requireAuth,
  uploadProyecto.fields([
    { name: 'imagenPortada', maxCount: 1 },
    { name: 'image', maxCount: 1 },
    { name: 'galeriaProyecto', maxCount: 30 },
    { name: 'galeria', maxCount: 30 }
  ]),
  async (req, res) => {
  try {
    const {
      categoria,
      categoryKey,
      categoryLabel,
      title,
      summary,
      imagenPortada,
      description,
      miembros,
      galeriaProyecto
    } = req.body;
    const portada = firstUploadedFile(req, 'imagenPortada', 'image')?.filename || imagenPortada || req.body.image;
    const uploadedGaleria = uploadedFileNames(req, 'galeriaProyecto', 'galeria');
    const bodyGaleria = req.body.galeriaProyecto !== undefined || req.body.galeria !== undefined
      ? parseArrayField(galeriaProyecto || req.body.galeria).map((item) =>
          normalizeProjectGalleryValue(typeof item === 'string' ? item : item.url)
        )
      : undefined;
    const normalizedMiembros = miembros !== undefined ? normalizeMiembros(miembros) : undefined;

    if (normalizedMiembros) {
      await syncMiembrosCatalogo(normalizedMiembros);
    }

    const proyecto = await prisma.proyecto.update({
      where: { id: req.params.id },
      data: cleanData({
        categoria: categoria || categoryLabel || categoryKey,
        title,
        summary,
        imagenPortada: portada,
        description,
        galeriaProyecto: bodyGaleria !== undefined || uploadedGaleria.length > 0
          ? [...(bodyGaleria || []), ...uploadedGaleria].filter(Boolean)
          : undefined,
        ...(miembros !== undefined
          ? {
              miembros: {
                deleteMany: {},
                create: normalizedMiembros
              }
            }
          : {}),
      }),
      include: {
        miembros: true
      }
    });

    res.json(proyecto);
  } catch (error) {
    console.error('Error al actualizar proyecto:', error);
    res.status(500).json({ error: 'Error al actualizar proyecto' });
  }
  }
);

app.delete('/api/proyectos/:id', requireAuth, async (req, res) => {
  try {
    await prisma.proyectoMiembro.deleteMany({ where: { proyectoId: req.params.id } });
    await prisma.proyecto.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar proyecto' });
  }
});

// --- RUTAS DE GALERIA ---
app.get('/api/galeria', async (req, res) => {
  try {
    const galeria = await prisma.galeriaItem.findMany();
    res.json(sortByManualThenText(galeria, (item) => item.titulo || item.url).map((item) => ({
      ...item,
      url: assetPath('Galeria', item.url)
    })));
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener galeria' });
  }
});

app.post(
  '/api/galeria',
  requireAuth,
  uploadGaleria.fields([
    { name: 'archivo', maxCount: 1 },
    { name: 'url', maxCount: 1 }
  ]),
  async (req, res) => {
  try {
    const { titulo, categoria, url, tipo } = req.body;
    const archivo = firstUploadedFile(req, 'archivo', 'url')?.filename || url;
    const item = await prisma.galeriaItem.create({
      data: {
        titulo,
        categoria,
        url: archivo,
        tipo: tipo || (firstUploadedFile(req, 'archivo', 'url')?.mimetype.startsWith('video/') ? 'video' : 'imagen')
      }
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear item de galeria' });
  }
  }
);

app.put(
  '/api/galeria/:id',
  requireAuth,
  uploadGaleria.fields([
    { name: 'archivo', maxCount: 1 },
    { name: 'url', maxCount: 1 }
  ]),
  async (req, res) => {
  try {
    const { titulo, categoria, url, tipo } = req.body;
    const uploadedFile = firstUploadedFile(req, 'archivo', 'url');
    const item = await prisma.galeriaItem.update({
      where: { id: req.params.id },
      data: cleanData({
        titulo,
        categoria,
        url: uploadedFile?.filename || url,
        tipo: tipo || (uploadedFile?.mimetype.startsWith('video/') ? 'video' : undefined)
      })
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar item de galeria' });
  }
  }
);

app.delete('/api/galeria/:id', requireAuth, async (req, res) => {
  try {
    await prisma.galeriaItem.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar item de galeria' });
  }
});

// --- RUTAS DE VIDEOS ---
app.get('/api/videos', async (req, res) => {
  try {
    const videos = await prisma.videoInstitucional.findMany({
      orderBy: { createdAt: 'asc' }
    });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener videos' });
  }
});

app.post('/api/videos', requireAuth, async (req, res) => {
  try {
    const { titulo, caption, src, thumbnailUrl } = req.body;
    const video = await prisma.videoInstitucional.create({
      data: {
        titulo,
        caption,
        src,
        thumbnailUrl
      }
    });
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear video' });
  }
});

app.put('/api/videos/:id', requireAuth, async (req, res) => {
  try {
    const { titulo, caption, src, thumbnailUrl } = req.body;
    const video = await prisma.videoInstitucional.update({
      where: { id: req.params.id },
      data: {
        titulo,
        caption,
        src,
        thumbnailUrl
      }
    });
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar video' });
  }
});

app.delete('/api/videos/:id', requireAuth, async (req, res) => {
  try {
    await prisma.videoInstitucional.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar video' });
  }
});

const frontendDistPath = path.join(
  __dirname,
  '../dist/SitioWebCarrera/browser'
);

if (fs.existsSync(path.join(frontendDistPath, 'index.html'))) {
  app.use(express.static(frontendDistPath));
  app.get(/^\/(?!api(?:\/|$)).*/, (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.json({
      ok: true,
      message: 'Servidor API funcionando. Abre el frontend en http://localhost:4200 o ejecuta npm run build para servirlo desde este puerto.',
      health: '/api/health'
    });
  });
}

app.listen(3000, () => console.log('Proxy Gemini corriendo en puerto 3000'));
