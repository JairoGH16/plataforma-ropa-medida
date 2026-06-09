import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const manufacturers = [
  { name: 'Sastrería García', email: 'garcia@ropa.dev', phone: '8888-0001' },
  { name: 'Confecciones Mora', email: 'mora@ropa.dev', phone: '8888-0002' },
  { name: 'Taller Vargas', email: 'vargas@ropa.dev', phone: '8888-0003' },
  { name: 'Modas Jiménez', email: 'jimenez@ropa.dev', phone: '8888-0004' },
  { name: 'Costura Solano', email: 'solano@ropa.dev', phone: '8888-0005' },
];

async function main() {
  const password = await bcrypt.hash('password123', 10);

  for (const m of manufacturers) {
    await prisma.user.upsert({
      where: { email: m.email },
      update: {},
      create: { ...m, password, role: 'MANUFACTURER' },
    });
    console.log(`✓ ${m.name}`);
  }

  console.log('\nSeed completado — 5 fabricantes listos.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
