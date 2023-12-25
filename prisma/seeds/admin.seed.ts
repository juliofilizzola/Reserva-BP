import { TypeRole } from '@prisma/client';
import { formatDocument } from '../../src/utils/format/format-document';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../src/prisma/prisma.service';

const prisma = new PrismaService();
export const adminUser = async () => {
  // console.log(prisma);
  const newUser = {
    name: 'Julio Filizzola',
    document: '123.432.456-76',
    password: 'Abc@123',
    email: 'juliofilizzola@hotmail.com',
    phone: '319990999323',
  };
  const verifyUser = await prisma.user.findFirst({
    where: {
      email: newUser.email,
    },
  });

  if (verifyUser) {
    return;
  }

  return prisma.user
    .create({
      data: {
        email: newUser.email,
        type: TypeRole.admin,
        document: formatDocument(newUser.document),
        phone: newUser.phone,
        name: newUser.name,
        auth: {
          create: {
            password: bcrypt.hashSync(newUser.password, 10),
          },
        },
      },
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
};
