interface Mesa {
    id: string;
    nome: string;
    sistema: string;
    mesaAtiva: boolean;
    nivel?: number;
    personagens: Array<Personagem>;
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
    nome: string;
    tipo: string;
    ficha?: string;
    status: Status;
    statusAtuais?: Status;
}

export { Personagem, Mesa }