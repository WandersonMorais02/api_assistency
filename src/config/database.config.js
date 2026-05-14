import mongoose from "mongoose";
import { env } from "./env.config.js";

export async function connectDatabase() {
  try {
    await mongoose.connect(env.mongoUri);

    console.log("MongoDB conectado com sucesso");
  } catch (error) {
    console.error("Erro ao conectar no MongoDB:", error.message);
    process.exit(1);
  }
}
