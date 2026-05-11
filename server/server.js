require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

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
const { GoogleGenAI } = require('@google/genai');


const app = express();
app.use(cors());
app.use(express.json());

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

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
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

app.post('/api/noticias', async (req, res) => {
  try {
    const { titulo, contenido, descripcion, imagenUrl, fecha, fechaTexto } = req.body;
    const nuevaNoticia = await prisma.noticia.create({
      data: {
        titulo,
        contenido: contenido || descripcion || '',
        descripcion: descripcion || contenido || '',
        imagenUrl,
        fechaTexto,
        fecha: parseApiDate(fecha) || new Date()
      }
    });
    res.json(nuevaNoticia);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear noticia' });
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

app.post('/api/eventos', async (req, res) => {
  try {
    const { titulo, nombre, fecha, lugar, descripcion, hora, dia, mes } = req.body;
    const nuevoEvento = await prisma.evento.create({
      data: {
        titulo: titulo || nombre,
        fecha: parseApiDate(fecha),
        lugar,
        descripcion,
        hora,
        dia,
        mes
      }
    });
    res.json(nuevoEvento);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear evento' });
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
      },
      orderBy: { nombre: 'asc' }
    });
    res.json(docentes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener docentes' });
  }
});

app.post('/api/docentes', async (req, res) => {
  try {
    const {
      nombre,
      especialidad,
      cargo,
      imagen,
      descripcion,
      email,
      publicaciones = []
    } = req.body;

    const docente = await prisma.docente.create({
      data: {
        nombre,
        especialidad,
        cargo,
        imagen,
        descripcion,
        email,
        publicaciones: {
          create: publicaciones.map((publicacion) => ({
            titulo: publicacion.titulo,
            anio: publicacion.anio,
            enlace: publicacion.enlace || '#'
          }))
        }
      },
      include: { publicaciones: true }
    });

    res.json(docente);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear docente' });
  }
});

// --- RUTAS DE EGRESADOS ---
app.get('/api/egresados', async (req, res) => {
  try {
    const where = req.query.modalidad
      ? { modalidad: String(req.query.modalidad) }
      : undefined;

    const egresados = await prisma.egresado.findMany({
      where,
      orderBy: [{ anio: 'asc' }, { nombre: 'asc' }]
    });

    res.json(egresados);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener egresados' });
  }
});

app.post('/api/egresados', async (req, res) => {
  try {
    const { nombre, anio, modalidad } = req.body;
    const egresado = await prisma.egresado.create({
      data: {
        nombre,
        anio,
        modalidad
      }
    });
    res.json(egresado);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear egresado' });
  }
});

// --- RUTAS DE PROYECTOS ---
app.get('/api/proyectos', async (req, res) => {
  try {
    const where = req.query.categoryKey
      ? { categoryKey: String(req.query.categoryKey) }
      : undefined;

    const proyectos = await prisma.proyecto.findMany({
      where,
      include: {
        miembros: { orderBy: { nombre: 'asc' } },
        galeria: true
      },
      orderBy: [{ categoryLabel: 'asc' }, { title: 'asc' }]
    });

    res.json(proyectos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener proyectos' });
  }
});

app.post('/api/proyectos', async (req, res) => {
  try {
    const {
      categoryKey,
      categoryLabel,
      title,
      summary,
      image,
      description,
      videoUrl,
      miembros = [],
      galeria = []
    } = req.body;

    const proyecto = await prisma.proyecto.create({
      data: {
        categoryKey,
        categoryLabel,
        title,
        summary,
        image,
        description,
        videoUrl,
        miembros: {
          create: miembros.map((miembro) => ({
            nombre: miembro.nombre || miembro
          }))
        },
        galeria: {
          create: galeria.map((item) => ({
            url: item.url || item
          }))
        }
      },
      include: {
        miembros: true,
        galeria: true
      }
    });

    res.json(proyecto);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear proyecto' });
  }
});

// --- RUTAS DE GALERIA ---
app.get('/api/galeria', async (req, res) => {
  try {
    const galeria = await prisma.galeriaItem.findMany({
      orderBy: { createdAt: 'asc' }
    });
    res.json(galeria);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener galeria' });
  }
});

app.post('/api/galeria', async (req, res) => {
  try {
    const { titulo, categoria, url, tipo } = req.body;
    const item = await prisma.galeriaItem.create({
      data: {
        titulo,
        categoria,
        url,
        tipo
      }
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear item de galeria' });
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

app.post('/api/videos', async (req, res) => {
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
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear video' });
  }
});

app.listen(3000, () => console.log('Proxy Gemini corriendo en puerto 3000'));
