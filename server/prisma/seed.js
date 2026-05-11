require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { PrismaClient, ModalidadTitulacion, TipoMedia } = require('@prisma/client');

const prisma = new PrismaClient();

const projectRoot = path.join(__dirname, '..', '..');
const siteRoot = path.join(projectRoot, 'SitioWebCarrera');
const i18nRoot = path.join(siteRoot, 'src', 'assets', 'i18n');
const docentesImagesRoot = path.join(siteRoot, 'src', 'assets', 'img', 'Docentes');
const docentesImagesAssetRoot = 'assets/img/Docentes';

const docentesImageFiles = fs.existsSync(docentesImagesRoot)
  ? fs.readdirSync(docentesImagesRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
  : [];

const docenteImageNeedlesByEmail = {
  'correo@unistmo.edu.mx': ['Gerardo Rafael Alfaro Cruz'],
  'fbenitez@bianni.unistmo.edu.mx': ['FelipeBen'],
  'ldhuerth@gmail.com, luisdh2@bianni.unistmo.edu.mx': ['LuisDavidHuerta'],
  'carloscruz@bianni.unistmo.edu.mx': ['Carlos Edgardo Cruz'],
  'nayelim@bianni.unistmo.edu.mx': ['Nayeli Joaquinita'],
  'fglez@bianni.unistmo.edu.mx': ['iconoH'],
  'cosijopii@bianni.unistmo.edu.mx': ['CosijopiiGarc'],
  'odelarosa@bianni.unistmo.edu.mx': ['OscarAlonso'],
  'ie.edgarcano@gmail.com': ['iconoH']
};

const galleryImages = [
  'assets/img/Galeria/Electronica1.jpg',
  'assets/img/Galeria/Elect.jpg',
  'assets/img/Galeria/SalaRedes.jpg',
  'assets/img/Galeria/Auditorio.jpg',
  'assets/img/Galeria/Estatua.jpg',
  'assets/img/Galeria/Electronica2.jpg',
  'assets/img/Galeria/ConcursoAltar1.jpg',
  'assets/img/Galeria/ConcursoAltar2.jpg',
  'assets/img/Galeria/Viaje_EscNaval1.jpg',
  'assets/img/Galeria/Viaje_EscNaval2.jpg',
  'assets/img/Galeria/Viaje_EscNaval3.jpg',
  'assets/img/Galeria/Viaje_Supercool.jpg',
  'assets/img/Galeria/Viaje_Thyssenkrupp1.png',
  'assets/img/Galeria/Viaje_Thyssenkrupp2.png',
  'assets/img/Galeria/Viaje_Thyssenkrupp3.jpg',
  'assets/img/Galeria/Viaje_Thyssenkrupp4.jpg',
  'assets/img/Galeria/Viaje_UDLAP1.jpg',
  'assets/img/Galeria/Viaje_UDLAP2.jpg',
  'assets/img/Galeria/Viaje_UDLAP3.jpg',
  'assets/img/Galeria/Viaje_UniVeracruz.jpg',
  'assets/img/Galeria/Curso_2023.jpg'
];

const egresados = [
  { nombre: 'Candy Beltran', anio: 2020, modalidad: ModalidadTitulacion.ceneval },
  { nombre: 'Monserrat Diaz', anio: 2021, modalidad: ModalidadTitulacion.ceneval },
  { nombre: 'Ricardo Hernandez', anio: 2022, modalidad: ModalidadTitulacion.ceneval },
  { nombre: 'Mariano Cruz', anio: 2023, modalidad: ModalidadTitulacion.tesis },
  { nombre: 'Maria Vazquez', anio: 2023, modalidad: ModalidadTitulacion.tesis },
  { nombre: 'Juan Diego Ruiz', anio: 2024, modalidad: ModalidadTitulacion.tesis },
  { nombre: 'Miranda Monraz', anio: 2024, modalidad: ModalidadTitulacion.experiencia },
  { nombre: 'Blanca Soto', anio: 2024, modalidad: ModalidadTitulacion.experiencia },
  { nombre: 'Efren Gomez', anio: 2024, modalidad: ModalidadTitulacion.tesis },
  { nombre: 'Chamber Ruiz', anio: 2024, modalidad: ModalidadTitulacion.ceneval },
  { nombre: 'Clarissa Vazquez', anio: 2025, modalidad: ModalidadTitulacion.ceneval },
  { nombre: 'Kevin Ramirez', anio: 2025, modalidad: ModalidadTitulacion.experiencia },
  { nombre: 'Araceli Bautista', anio: 2025, modalidad: ModalidadTitulacion.ceneval }
];


function readJson(relativePath) {
  const absolutePath = path.join(i18nRoot, relativePath);
  // Leer el archivo
  const content = fs.readFileSync(absolutePath, 'utf8');

  // El .trim() elimina espacios y caracteres invisibles al inicio/final
  // El .replace() elimina específicamente el BOM si llegara a existir
  const cleanContent = content.trim().replace(/^\uFEFF/, '');

  return JSON.parse(cleanContent);
}

function findDocenteImageFile(docente) {
  const needles = docenteImageNeedlesByEmail[docente.email] || [];

  for (const needle of needles) {
    const imageFile = docentesImageFiles.find((fileName) => fileName.includes(needle));

    if (imageFile) {
      return imageFile;
    }
  }

  if (docente.imagen) {
    const imageFileName = path.basename(decodeURI(docente.imagen));
    const imageFile = docentesImageFiles.find((fileName) => fileName === imageFileName);

    if (imageFile) {
      return imageFile;
    }
  }

  return docentesImageFiles.find((fileName) => fileName === 'iconoH.png') || null;
}

function getDocenteImagePath(docente) {
  const imageFile = findDocenteImageFile(docente);

  if (!imageFile) {
    return docente.imagen;
  }

  return encodeURI(`${docentesImagesAssetRoot}/${imageFile}`);
}

function parseSpanishDate(dateText) {
  if (!dateText) {
    return new Date();
  }

  const monthMap = {
    enero: 0,
    febrero: 1,
    marzo: 2,
    abril: 3,
    mayo: 4,
    junio: 5,
    julio: 6,
    agosto: 7,
    septiembre: 8,
    setiembre: 8,
    octubre: 9,
    noviembre: 10,
    diciembre: 11
  };

  const normalized = dateText
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const match = normalized.match(/(\d{1,2})\s+de\s+([a-z]+),\s*(\d{4})/);
  if (!match) {
    return new Date();
  }

  const day = Number(match[1]);
  const month = monthMap[match[2]];
  const year = Number(match[3]);

  if (month === undefined) {
    return new Date();
  }

  return new Date(Date.UTC(year, month, day, 12, 0, 0));
}

async function main() {
  const docentesJson = readJson('docentes.es.json');
  const inicioJson = readJson('inicio.es.json');
  const proyectosJson = readJson('proyectos.es.json');

  await prisma.publicacion.deleteMany();
  await prisma.docente.deleteMany();
  await prisma.proyectoMiembro.deleteMany();
  await prisma.proyectoImagen.deleteMany();
  await prisma.proyecto.deleteMany();
  await prisma.videoInstitucional.deleteMany();
  await prisma.galeriaItem.deleteMany();
  await prisma.egresado.deleteMany();
  await prisma.noticia.deleteMany();
  await prisma.evento.deleteMany();

  for (const docente of docentesJson.DOCENTES_LIST) {
    await prisma.docente.create({
      data: {
        nombre: docente.nombre,
        especialidad: docente.especialidad,
        cargo: docente.cargo,
        imagen: getDocenteImagePath(docente),
        descripcion: docente.descripcion,
        email: docente.email,
        publicaciones: {
          create: (docente.publicaciones || []).map((publicacion) => ({
            titulo: publicacion.titulo,
            anio: publicacion.anio,
            enlace: publicacion.enlace || '#'
          }))
        }
      }
    });
  }

  await prisma.egresado.createMany({ data: egresados });

  for (const noticia of inicioJson.INICIO.NEWS) {
    await prisma.noticia.create({
      data: {
        titulo: noticia.TITLE,
        contenido: noticia.CONTENT,
        descripcion: noticia.CONTENT,
        fechaTexto: noticia.DATE,
        fecha: parseSpanishDate(noticia.DATE)
      }
    });
  }

  for (const evento of inicioJson.INICIO.EVENTS) {
    await prisma.evento.create({
      data: {
        titulo: evento.TITLE,
        descripcion: evento.DESC,
        hora: evento.TIME,
        dia: evento.DAY,
        mes: evento.MONTH,
        fecha: new Date(Date.UTC(2025, evento.MONTH, evento.DAY, 12, 0, 0))
      }
    });
  }

  for (const project of proyectosJson.projects) {
    await prisma.proyecto.create({
      data: {
        categoryKey: project.categoryKey,
        categoryLabel: project.categoryLabel,
        title: project.title,
        summary: project.summary,
        image: project.image,
        description: project.modal.description,
        videoUrl: project.modal.videoUrl || null,
        miembros: {
          create: (project.modal.members || []).map((nombre) => ({ nombre }))
        },
        galeria: {
          create: (project.modal.gallery || []).map((url) => ({ url }))
        }
      }
    });
  }

  await prisma.galeriaItem.createMany({
    data: galleryImages.map((url) => ({
      url,
      tipo: TipoMedia.imagen,
      categoria: 'galeria-general'
    }))
  });

  await prisma.videoInstitucional.createMany({
    data: (proyectosJson.videos || []).map((video, index) => ({
      titulo: `Video institucional ${index + 1}`,
      caption: video.caption,
      src: video.src
    }))
  });

  console.log('Datos iniciales cargados en MongoDB correctamente.');
}

main()
  .catch((error) => {
    console.error('Error durante el seed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
