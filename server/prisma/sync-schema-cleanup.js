require('dotenv').config();

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function run(command) {
  return prisma.$runCommandRaw(command);
}

async function updateMany(collection, q, u) {
  return run({
    update: collection,
    updates: [{ q, u, multi: true }]
  });
}

async function dropCollection(collection) {
  try {
    await run({ drop: collection });
    console.log(`Coleccion eliminada: ${collection}`);
  } catch (error) {
    if (error?.codeName === 'NamespaceNotFound' || String(error?.message || '').includes('ns not found')) {
      console.log(`Coleccion no existe, se omite: ${collection}`);
      return;
    }

    throw error;
  }
}

async function migrateProyectoImagenToGaleriaProyecto() {
  try {
    await run({
      aggregate: 'ProyectoImagen',
      pipeline: [
        {
          $group: {
            _id: '$proyectoId',
            galeriaProyecto: { $push: '$url' }
          }
        },
        {
          $merge: {
            into: 'Proyecto',
            on: '_id',
            whenMatched: [
              { $set: { galeriaProyecto: '$$new.galeriaProyecto' } }
            ],
            whenNotMatched: 'discard'
          }
        }
      ],
      cursor: {}
    });
  } catch (error) {
    if (error?.codeName === 'NamespaceNotFound' || String(error?.message || '').includes('ns not found')) {
      console.log('Coleccion ProyectoImagen no existe, se omite migracion de galeria.');
      return;
    }

    throw error;
  }
}

async function main() {
  console.log('Sincronizando documentos existentes con schema.prisma...');

  await updateMany(
    'Noticia',
    {},
    {
      $unset: {
        descripcionCorta: '',
        imagenUrl: '',
        urlImagen: '',
        fechaTexto: ''
      }
    }
  );

  await updateMany(
    'Evento',
    {},
    {
      $unset: {
        lugar: ''
      }
    }
  );

  await updateMany(
    'Docente',
    { apellidos: { $exists: false } },
    { $set: { apellidos: '' } }
  );

  await updateMany(
    'Egresado',
    { ano: { $exists: true } },
    [
      { $set: { anio: '$ano' } },
      { $unset: 'ano' }
    ]
  );

  await updateMany(
    'Egresado',
    { anio: null },
    { $set: { anio: new Date().getFullYear() } }
  );

  await updateMany(
    'Egresado',
    { nombre: null },
    { $set: { nombre: '' } }
  );

  await updateMany(
    'Egresado',
    { apellidos: { $exists: false } },
    { $set: { apellidos: '' } }
  );

  await updateMany(
    'Egresado',
    { apellidos: null },
    { $set: { apellidos: '' } }
  );

  await updateMany(
    'Egresado',
    { foto: { $exists: false } },
    { $set: { foto: null } }
  );

  await updateMany(
    'Proyecto',
    { image: { $exists: true } },
    [
      { $set: { imagenPortada: '$image' } },
      { $unset: 'image' }
    ]
  );

  await updateMany(
    'Proyecto',
    { categoryLabel: { $exists: true } },
    [{ $set: { categoria: '$categoryLabel' } }]
  );

  await updateMany(
    'Proyecto',
    { categoria: { $exists: false }, categoryKey: { $exists: true } },
    [{ $set: { categoria: '$categoryKey' } }]
  );

  await updateMany(
    'Proyecto',
    { categoria: { $exists: false } },
    { $set: { categoria: 'Otros' } }
  );

  await updateMany(
    'Proyecto',
    { imagenPortada: { $exists: false } },
    { $set: { imagenPortada: '' } }
  );

  await updateMany(
    'Proyecto',
    { galeriaProyecto: { $exists: false } },
    { $set: { galeriaProyecto: [] } }
  );

  await migrateProyectoImagenToGaleriaProyecto();

  await updateMany('Proyecto', {}, {
    $unset: {
      categoryKey: '',
      categoryLabel: '',
      videoUrl: '',
      urlVideo: '',
      galeria: ''
    }
  });

  await dropCollection('ProyectoImagen');

  console.log('Limpieza terminada. La base queda alineada con el schema actual.');
}

main()
  .catch((error) => {
    console.error('Error al limpiar la base de datos:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
