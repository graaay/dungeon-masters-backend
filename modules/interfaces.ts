interface Mesa {
    id: string;
    idUsuario: string;
    nome: string;
    sistema: string;
    mesaAtiva: boolean;
    nivel?: number;
    personagens?: Array<Personagem>;
}

interface Status {
    vida?: number;
    mana?: number;
    sanidade?: number;
    percepcaoPassiva?: number;
    ca?: number;
    nd?: number;
}

interface Personagem {
    id: string;
    idMesa: string;
    nome: string;
    tipo: string;
    ficha?: string;
    status: Status;
    statusAtuais?: Status;
}

interface Usuario {
    id?: string;
    name: string;
    email: string;
    password?: string;
    token?: string;
    socialId?: string;
}

export { Personagem, Mesa, Usuario }