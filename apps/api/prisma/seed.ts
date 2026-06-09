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
      location: 'San José, Costa Rica',
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
      location: 'Heredia, Costa Rica',
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
      location: 'Cartago, Costa Rica',
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
      location: 'Alajuela, Costa Rica',
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
      location: 'Liberia, Costa Rica',
      experience: 6,
    },
  },
];

async function main() {
  const password = await bcrypt.hash('password123', 10);

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

    console.log(`✓ ${m.name}`);
  }

  console.log('\nSeed completado — 5 fabricantes con perfil listos.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
