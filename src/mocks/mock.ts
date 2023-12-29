import { Auth, Reserve, User } from '@prisma/client';

const fakeUser = [
  {
    email: 'john@example.com',
    document: '123.123.123-12',
    phone: '1234567890',
    name: 'John Doe',
    password: 'password123',
  },
];

const fakeUser2: User[] = [
  {
    id: '14087e68-e669-482b-b908-bc336223sds36d',
    name: 'Fulano de Tal',
    email: 'test@test.com',
    phone: '3198314323',
    type: 'admin',
    document: '123.123.123-12',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },

  {
    id: '14087e68-e669-482b-b908-bc336223sds36d',
    name: 'Fulano de Tal',
    email: 'test@test.com',
    phone: '3198314323',
    type: 'brokers',
    document: '123.123.123-12',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
  {
    id: '14087e68-e669-482b-b908-bc33623a036d',
    name: 'Fulano de Tal',
    email: 'test@test.com',
    phone: '3198314323',
    type: 'client',
    document: '123.123.123-12',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
];
const AuthUser: User & { auth: Auth } = {
  id: '14087e68-e669-482b-b908-bc33623a036d',
  name: 'Fulano de Tal',
  email: 'test@test.com',
  phone: '3198314323',
  type: 'client',
  document: '123.123.123-12',
  auth: {
    userId: '14087e68-e669-482b-b908-bc33623a036d',
    id: '14087e68-e669-482b-b908-gds33231dsf',
    password: 'dfgkekljeiokj',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

const reserves: Reserve[] = [
  {
    id: '14087e68-e669-482b-b908-bc33623a036d',
    title: 'reunião inicial',
    date: new Date('2024-01-01T19:55:36.437Z'),
    duration: 30,
    description: '',
    brokerId: '14087e68-e669-482b-b908-bc33623a036d',
    clientId: '14087e68-e669-482b-b908-bc33623a036d',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  },
];

const reserveError: Reserve = {
  id: '14087e68-e669-482b-b908-bc33623a036d',
  title: 'reunião inicial',
  date: new Date('2024-01-01T19:30:00.000Z'),
  duration: 30,
  description: '',
  brokerId: '14087e68-e669-482b-b908-bc33623a036d',
  clientId: '14087e68-e669-482b-b908-bc33623a036d',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};
const prismaMock = {
  user: {
    create: jest.fn().mockReturnValue(fakeUser2[1]),
    findMany: jest.fn().mockResolvedValue(fakeUser2),
    findFirst: jest.fn().mockResolvedValue(AuthUser),
    update: jest.fn().mockResolvedValue(fakeUser2[0]),
  },
  reserve: {
    create: jest.fn().mockReturnValue(fakeUser2[1]),
    findMany: jest.fn().mockResolvedValue(reserves),
    findFirst: jest.fn().mockResolvedValue(AuthUser),
    update: jest.fn().mockResolvedValue(fakeUser2[0]),
  },
};

export { fakeUser, fakeUser2, AuthUser, prismaMock, reserves, reserveError };
