require('dotenv').config();
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
  'Eres el asistente oficial de la carrera de Ingeniería en Desarrollo de Software y Sistemas Inteligentes. ' +
  'Responde solo con la información disponible en la base de conocimiento proporcionada. ' +
  'Si no hay información suficiente, indica que no está disponible y sugiere consultar el sitio oficial.';

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

const USE_DIRECT_FALLBACK = true;

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
    const { message, history, modelId } = req.body;

    if (USE_DIRECT_FALLBACK) {
      const fallback = localAnswer(message || '');
      return res.json({ text: fallback, fallback: true });
    }

    const allowedModels = [
      'gemini-2.0-flash',
      'gemini-2.5-flash',
      'gemini-2.0-flash-lite'
    ];

    const selectedModel = allowedModels.includes(modelId)
      ? modelId
      : 'gemini-2.5-flash';

    const contextText = buildContext(message);

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: [
        {
          role: 'user',
          parts: [
            { text: systemPrompt },
            {
              text:
                'Base de conocimiento (JSON):\n' +
                JSON.stringify(contextText, null, 2) +
                '\nFin de la base de conocimiento.'
            }
          ]
        },
        ...(history || []),
        { role: 'user', parts: [{ text: message }] }
      ]
    });

    const text =
      (typeof response?.text === 'function' && response.text()) ||
      (typeof response?.response?.text === 'function' &&
        response.response.text()) ||
      response?.response?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || '')
        .join('') ||
      '';

    res.json({ text });
  } catch (error) {
    console.error('Error en Gemini:', error);

    if (isQuotaError(error)) {
      const fallback = localAnswer(req.body?.message || '');
      return res.json({ text: fallback, fallback: true });
    }

    res.status(500).json({ error: 'Error procesando la solicitud' });
  }
});

app.listen(3000, () => console.log('Proxy Gemini corriendo en puerto 3000'));
