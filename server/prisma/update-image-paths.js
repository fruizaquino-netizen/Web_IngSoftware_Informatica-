require('dotenv').config();
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const PROJECTS_PREFIX = 'assets/img/Proyectos/';
const GALLERY_PREFIX = 'assets/img/Galeria/';

function moveToFolder(value, targetPrefix) {
  if (!value) {
    return value;
  }

  if (value.startsWith(targetPrefix)) {
    return value;
  }

  if (!value.startsWith('assets/img/')) {
    return value;
  }

  return `${targetPrefix}${path.posix.basename(value)}`;
}

async function updateProjects() {
  const projects = await prisma.proyecto.findMany({
    select: {
      id: true,
      title: true,
      image: true,
      galeria: {
        select: {
          id: true,
          url: true
        }
      }
    }
  });

  for (const project of projects) {
    const image = moveToFolder(project.image, PROJECTS_PREFIX);

    if (image !== project.image) {
      await prisma.proyecto.update({
        where: { id: project.id },
        data: { image }
      });
      console.log(`Proyecto: ${project.title}: ${project.image} -> ${image}`);
    }

    for (const item of project.galeria) {
      const url = moveToFolder(item.url, PROJECTS_PREFIX);

      if (url !== item.url) {
        await prisma.proyectoImagen.update({
          where: { id: item.id },
          data: { url }
        });
        console.log(`Proyecto galeria: ${project.title}: ${item.url} -> ${url}`);
      }
    }
  }
}

async function updateGallery() {
  const items = await prisma.galeriaItem.findMany({
    select: {
      id: true,
      url: true
    }
  });

  for (const item of items) {
    const url = moveToFolder(item.url, GALLERY_PREFIX);

    if (url !== item.url) {
      await prisma.galeriaItem.update({
        where: { id: item.id },
        data: { url }
      });
      console.log(`Galeria: ${item.url} -> ${url}`);
    }
  }
}

async function main() {
  await updateProjects();
  await updateGallery();
  console.log('Rutas de imagenes actualizadas correctamente.');
}

main()
  .catch((error) => {
    console.error('Error al actualizar rutas de imagenes:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
