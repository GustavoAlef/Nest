import * as mongoose from 'mongoose';

export const jogadorSchema = new mongoose.Schema(
  {
    celular: { type: String, unique: true },
    email: { type: String, unique: true },
    nome: String,
    ranking: String,
    posicaoRank: Number,
    urlFotoJogador: String,
  },
  { timestamps: true, collection: 'jogadores' }
);