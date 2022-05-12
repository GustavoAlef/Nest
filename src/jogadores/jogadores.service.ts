import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import {v4 as uuidv4} from 'uuid';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class JogadoresService {

  private jogadores: Jogador[] = [];

  constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>) {}

  private readonly logger = new Logger(JogadoresService.name)

  async criarAtualizarJogador(criaJogadorDto: CriarJogadorDto): Promise<void> {
    
    const { email } = criaJogadorDto;
    const jogadorEncontrado = await this.jogadores.find(jogador => jogador.email === email)

    if (jogadorEncontrado) {
      await this.atualizar(jogadorEncontrado, criaJogadorDto)
    }else {
      await this.criar(criaJogadorDto);
    }

  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    return await this.jogadores;
  }

  async consultarJogadorEmail( email: string ): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadores.find(jogador => jogador.email === email)
    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com email ${email} nao encontrado`);
    }
    return jogadorEncontrado;
  }

  async deletarJogador(email): Promise<void> {
    const jogadorEncontrado = await this.jogadores.find(jogador => jogador.email === email)
    this.jogadores = this.jogadores.filter(jogador => jogador.email !== jogadorEncontrado.email)
  }
  
  private criar(criaJogadorDto: CriarJogadorDto): void {
    const { nome, celular, email } = criaJogadorDto;

    const jogador: Jogador = {
      _id: uuidv4(),
      nome,
      celular,
      email,
      ranking: 'A',
      posicaoRank: 1,
      urlFotoJogador: 'url/foto.jpg',
    };
    this.logger.log(`criaJogadorDto: ${JSON.stringify(jogador)}`);
    this.jogadores.push(jogador);
  }

  private atualizar(jogadorEncontrado: Jogador, criarJogadorDto: CriarJogadorDto): void {
    const { nome } = criarJogadorDto;
    jogadorEncontrado.nome = nome;
  }

}
