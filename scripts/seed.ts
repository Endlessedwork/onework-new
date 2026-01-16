import { db } from '../server/db';
import { users } from '../shared/schema';
import { hashPassword } from '../server/auth';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('Checking for existing admin user...');

  const existingAdmin = await db.select().from(users).where(eq(users.username, 'admin'));

  if (existingAdmin.length > 0) {
    console.log('Admin user already exists, skipping seed.');
    return;
  }

  console.log('Creating admin user...');

  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const hashedPassword = await hashPassword(password);

  await db.insert(users).values({
    username: 'admin',
    password: hashedPassword,
  });

  console.log('Admin user created successfully!');
  console.log('Username: admin');
  console.log('Password:', password === 'admin123' ? 'admin123 (default - please change!)' : '(from ADMIN_PASSWORD env)');
}

seed()
  .then(() => {
    console.log('Seed completed.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  });
