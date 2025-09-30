import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import db from './lib/pgConn';
import logger from './logger';

const emailList = new Set();
function generateUniqueEmail() {
  let email;
  do {
    email = faker.internet.email();
  } while (emailList.has(email));
  emailList.add(email);
  return email;
}

const phoneSet = new Set();
function generateUniquePHPhoneNumber() {
  let phone;
  do {
    const prefixes = [
      '917',
      '918',
      '919',
      '922',
      '923',
      '924',
      '925',
      '926',
      '927',
      '928',
      '929',
    ];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = Math.floor(1000000 + Math.random() * 9000000).toString();
    phone = `0${prefix}${suffix}`;
  } while (phoneSet.has(phone));

  phoneSet.add(phone);
  return phone;
}

async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

function makePlaceholder(rowIndex: number, columnCount: number) {
  const start = rowIndex * columnCount + 1;
  return `(${Array.from(
    { length: columnCount },
    (_, i) => `$${start + i}`,
  ).join(',')})`;
}

async function seedUsers() {
  const rowCounts = 100;
  const columnCounts = 4;
  const values = [];
  const placeholder = [];

  for (let i = 0; i < rowCounts; i++) {
    const display_name = faker.person.fullName();
    const phone_no = generateUniquePHPhoneNumber();
    const email = generateUniqueEmail();
    const password_hash = await hashPassword('Tester123!');

    values.push(display_name, phone_no, email, password_hash);
    placeholder.push(makePlaceholder(i, columnCounts));
  }

  const query = `
        INSERT INTO users (display_name, phone_no, email, password_hash) 
        VALUES ${placeholder.join(',')}
    `;

  await db.query(query, values);
  logger.info(`Seeding complete - ${rowCounts} users inserted`);
}

seedUsers()
  .catch((err) => logger.error(err))
  .finally(() => db.end());
