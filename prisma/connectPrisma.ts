import {PrismaClient} from "@prisma/client";
import "dotenv/config";

export const connectPrisma:PrismaClient = new PrismaClient();

