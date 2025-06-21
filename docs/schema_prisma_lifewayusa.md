// schema.prisma

// Datasource e Generator
 datasource db {
   provider = "postgresql"
   url      = env("DATABASE_URL")
 }

generator client {
   provider = "prisma-client-js"
 }

// Modelo do usuário via Supabase Auth (referência externa)
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  createdAt DateTime @default(now())
  profile   Profile?
  prospect  Prospect?
}

model Profile {
  id        String   @id
  fullName  String?
  birthDate DateTime?
  user      User     @relation(fields: [id], references: [id])
}

model Prospect {
  id                            String   @id @default(uuid())
  userId                        String   @unique
  qualify                       Boolean  @default(false)
  pro                           Boolean  @default(false)
  analiseFamilyPlanner          String?  @db.Text
  analiseVisaMatch              String?  @db.Text
  analiseGetOpportunity         String?  @db.Text
  planoProjectUSAOutput         String?  @db.Text
  simuladorEntrevistaOutput     String?  @db.Text
  user                          User     @relation(fields: [userId], references: [id])
}

model City {
  id      String @id @default(uuid())
  name    String
  state   String
  country String
}

model University {
  id   String @id @default(uuid())
  name String
  url  String?
}

model School {
  id   String @id @default(uuid())
  name String
}

model ProfessionalCourse {
  id   String @id @default(uuid())
  name String
}

model CursoDeIngles {
  id   String @id @default(uuid())
  name String
}

