import {PrismaClient} from "@prisma/client";
import "dotenv/config";

const prismaClient:PrismaClient = new PrismaClient();
export default prismaClient;
