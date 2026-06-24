import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const manufacturers = [
  {
    name: 'Sastrería García',
    email: 'garcia@ropa.dev',
    phone: '8888-0001',
    profile: {
      specialty: 'Sastrería formal',
      garmentTypes: 'Trajes, Camisas, Pantalones',
      description: 'Más de 20 años confeccionando ropa formal a la medida.',
      location: 'San José',
      experience: 20,
    },
  },
  {
    name: 'Confecciones Mora',
    email: 'mora@ropa.dev',
    phone: '8888-0002',
    profile: {
      specialty: 'Ropa casual y urbana',
      garmentTypes: 'Camisetas, Vestidos, Shorts',
      description: 'Especialistas en moda urbana con telas nacionales.',
      location: 'Heredia',
      experience: 8,
    },
  },
  {
    name: 'Taller Vargas',
    email: 'vargas@ropa.dev',
    phone: '8888-0003',
    profile: {
      specialty: 'Ropa deportiva',
      garmentTypes: 'Licras, Camisetas deportivas, Shorts',
      description: 'Fabricamos uniformes y ropa deportiva de alto rendimiento.',
      location: 'Cartago',
      experience: 12,
    },
  },
  {
    name: 'Modas Jiménez',
    email: 'jimenez@ropa.dev',
    phone: '8888-0004',
    profile: {
      specialty: 'Vestidos de novia y fiesta',
      garmentTypes: 'Vestidos, Trajes de novia, Damas de honor',
      description: 'Tu día especial merece la mejor confección.',
      location: 'Alajuela',
      experience: 15,
    },
  },
  {
    name: 'Costura Solano',
    email: 'solano@ropa.dev',
    phone: '8888-0005',
    profile: {
      specialty: 'Ropa infantil',
      garmentTypes: 'Uniformes escolares, Ropa casual infantil',
      description: 'Calidad y comodidad para los más pequeños.',
      location: 'Liberia',
      experience: 6,
    },
  },
  {
    name: 'Bordados Quesada',
    email: 'quesada@ropa.dev',
    phone: '8888-0006',
    profile: {
      specialty: 'Bordados y uniformes empresariales',
      garmentTypes: 'Camisas, Uniformes, Chalecos',
      description: 'Expertos en personalización corporativa con bordado de alta calidad.',
      location: 'San José',
      experience: 10,
    },
  },
  {
    name: 'Alta Costura Madrigal',
    email: 'madrigal@ropa.dev',
    phone: '8888-0007',
    profile: {
      specialty: 'Alta costura y moda exclusiva',
      garmentTypes: 'Vestidos, Blusas, Faldas, Trajes sastre',
      description: 'Diseño exclusivo y confección artesanal para cada cliente.',
      location: 'Escazú',
      experience: 18,
    },
  },
  {
    name: 'Textiles Camacho',
    email: 'camacho@ropa.dev',
    phone: '8888-0008',
    profile: {
      specialty: 'Confección en serie y lotes',
      garmentTypes: 'Camisetas, Pantalones, Uniformes',
      description: 'Producción en volumen con control de calidad riguroso.',
      location: 'Desamparados',
      experience: 9,
    },
  },
  {
    name: 'Diseños Fonseca',
    email: 'fonseca@ropa.dev',
    phone: '8888-0009',
    profile: {
      specialty: 'Ropa típica y artesanal',
      garmentTypes: 'Trajes típicos, Vestidos artesanales, Blusas bordadas',
      description: 'Preservamos la tradición costarricense en cada prenda.',
      location: 'Limón',
      experience: 14,
    },
  },
  {
    name: 'Sastrería Rojas',
    email: 'rojas@ropa.dev',
    phone: '8888-0010',
    profile: {
      specialty: 'Sastrería masculina',
      garmentTypes: 'Trajes, Pantalones, Camisas, Blazers',
      description: 'Sastrería clásica con corte preciso y atención personalizada.',
      location: 'Heredia',
      experience: 22,
    },
  },
];

async function main() {
  const password = await bcrypt.hash('password123', 10);

  // Fabricantes
  for (const m of manufacturers) {
    const user = await prisma.user.upsert({
      where: { email: m.email },
      update: {},
      create: {
        name: m.name,
        email: m.email,
        phone: m.phone,
        password,
        role: 'MANUFACTURER',
      },
    });

    await prisma.manufacturerProfile.upsert({
      where: { userId: user.id },
      update: m.profile,
      create: { userId: user.id, ...m.profile },
    });

    console.log(`✓ Fabricante: ${m.name}`);
  }

  // Cliente de prueba
  const client = await prisma.user.upsert({
    where: { email: 'cliente@ropa.dev' },
    update: {},
    create: {
      name: 'Cliente Demo',
      email: 'cliente@ropa.dev',
      phone: '8800-0001',
      password,
      role: 'CLIENT',
    },
  });

  await prisma.measurement.upsert({
    where: { userId: client.id },
    update: {},
    create: {
      userId: client.id,
      talla: 'M',
      cuello: 38,
      pecho: 96,
      cintura: 80,
      cadera: 98,
      largoManga: 62,
      largoPierna: 100,
    },
  });

  console.log(`✓ Cliente: ${client.name} (con medidas)`);

  // Administrador
  await prisma.user.upsert({
    where: { email: 'admin@ropa.dev' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@ropa.dev',
      phone: '8800-0000',
      password,
      role: 'ADMIN',
    },
  });

  console.log(`✓ Admin: admin@ropa.dev`);

  console.log('\nSeed completado — 10 fabricantes, 1 cliente, 1 administrador.');
  console.log('Contraseña de todos los usuarios: password123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
