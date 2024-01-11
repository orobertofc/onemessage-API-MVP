import {connectPrisma} from "./connectPrisma";
import {PrismaClient} from "@prisma/client";

export class Prisma_controller {
  protected client: PrismaClient;
  constructor() {
    this.client = connectPrisma
  }
}