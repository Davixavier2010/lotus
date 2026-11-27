export interface ConceptHighlight {
  name: string;
  subtitle: string;
  chapterNumber: number;
  chapterSlug: string;
  summary: string;
}

export interface ReflectionBlock {
  type: 'paragraph' | 'concept';
  conceptName?: string;
  text: string;
}

export interface ChapterIllustration {
  src: string;
  alt: string;
  fullBleed?: boolean;
}

export interface ChapterData {
  number: number;
  slug: string;
  title: string;
  pagesLabel: string;
  originNote: string;
  concepts: string[];
  openingIllustration: ChapterIllustration;
  closingIllustration?: ChapterIllustration;
  storyParagraphs: string[];
  reflectionBlocks: ReflectionBlock[];
}

export const BOOK_PREFACE = {
  title: 'Prefácio',
  lead: 'Nem todos os grandes confrontos acontecem nos campos de batalha, mas sim dentro das nossas mentes.',
  paragraphs: [
    'Nem todos os grandes confrontos acontecem nos campos de batalha, mas sim dentro das nossas mentes. É sobre isso que o Lótus fala. Aqui você verá contos épicos com uma ótica voltada para o intrapessoal.',
  ],
  endingSymbol: '終わり',
};

export const CHAPTERS: ChapterData[] = [
  {
    number: 1,
    slug: 'capitulo-1',
    title: 'O Mestre de Chá e o Samurai',
    pagesLabel: 'Páginas: 1 a 10',
    originNote: 'Parábola oral do Japão do período Edo, registrada em Bushido: A Alma do Japão (1900), de Inazo Nitobe.',
    concepts: ['Bushido', 'Chado', 'Wabi-sabi', 'Zanshin', 'Zen'],
    openingIllustration: {
      src: '/ilustracoes/cap1-cha.jpg',
      alt: 'Ilustração em nanquim e aquarela de uma xícara de chá japonesa fumegante com pétalas de cerejeira.',
    },
    closingIllustration: {
      src: '/ilustracoes/cap1-samurai.jpg',
      alt: 'Ilustração em nanquim e aquarela de um samurai com armadura vermelha segurando sua katana sob um galho de cerejeira.',
    },
    storyParagraphs: [
      'O som do vapor saía da chaleira enquanto o mestre de chá se concentrava em organizar seus utensílios. De repente, seu daimyo o convocou para uma viagem importante rumo a Edo. Após dias de jornada e do trote dos cavalos, eles finalmente chegaram ao destino.',
      'Para comprar ervas, o mestre precisou sair às ruas. A fim de se proteger e ganhar uma postura importante na cidade, ele vestiu os trajes de samurai e empunhou suas katanas.',
      'Entretanto, no caminho da terra úmida, ele, já tenso por estar com uma espada que não sabia manejar, escutou o barulho de metal pesado rangendo. Ao se virar para ver quem era, deparou-se com um samurai ronin.',
      'O guerreiro observou o mestre, percebeu que ele não tinha prática alguma com a espada nem com o traje e o desafiou para um duelo.',
      'O mestre de chá sabia que, se recusasse, sofreria desonra; se aceitasse, morreria. Por isso, decidiu pedir apenas um tempo para terminar seus deveres antes do confronto. A fim de não perder a honra, ele procurou uma escola de esgrima para aprender a morrer com dignidade.',
      'O sensei da escola perguntou ao mestre qual era o seu ofício e pediu que ele preparasse um chá antes do treino. Ao observar a técnica e a paz utilizada, cheia de presença e coordenação, o mestre de esgrima disse: "Você não precisa aprender a morrer. Enfrente o samurai com a mesma mente com que prepara o chá".',
      'No momento do duelo, o mestre de chá assumiu sua base, manteve o foco no presente e ergueu a espada com tranquilidade, como se estivesse servindo um chá. Ao ver a total confiança do mestre, o ronin percebeu que qualquer deslize seria fatal. Impressionado, o guerreiro pediu desculpas e desistiu da luta.',
      '"O Mestre de Chá e o Samurai" surgiu como uma parábola oral no Japão do período Edo, criada no meio cultural do Zen e do Bushido.',
      'Ganhou o mundo no livro Bushido: A Alma do Japão (1900), escrito por Inazo Nitobe.',
    ],
    reflectionBlocks: [
      {
        type: 'paragraph',
        text: 'O conto quer mostrar dois conceitos principais: o Zen e o Bushido. Porém, no Lótus iremos mais a fundo, observando detalhadamente cada conceito inserido na obra.',
      },
      {
        type: 'concept',
        conceptName: 'Bushido',
        text: 'conhecido como "O Caminho do Guerreiro", é o código de conduta dos samurais. Aparece no senso de honra, no dever do mestre de chá para com seu daimyo e na busca por enfrentar a morte com dignidade.',
      },
      {
        type: 'paragraph',
        text: 'Conseguimos trazer esses conceitos para os dias de hoje. Esse compromisso que o mestre de chá tem com seu daimyo é o mesmo compromisso que precisamos ter até mesmo nos pequenos detalhes diários, focar no processo das coisas que fazemos, não apenas nos resultados finais. Isso faz gancho com outro conceito, o Chado.',
      },
      {
        type: 'concept',
        conceptName: 'Chado',
        text: 'conhecido como "O Caminho do Chá", envolve o princípio de que o ritual não é apenas servir uma bebida, mas uma disciplina de vida baseada na simplicidade, respeito, pureza e tranquilidade.',
      },
      {
        type: 'paragraph',
        text: 'Com o Chado, conseguimos observar que o processo das coisas que fazemos é tão importante quanto o resultado. Você estudar para uma prova da sua escola é tão importante quanto você tirar uma nota 10. Você sair de casa e correr 5 km é tão fundamental quanto você perder peso, pois é o foco e o esforço que você faz que traz o sentido de recompensa final.',
      },
      {
        type: 'concept',
        conceptName: 'Wabi-sabi',
        text: 'a filosofia que valoriza a simplicidade, a modéstia e a aceitação da impermanência e da transitoriedade da vida.',
      },
      {
        type: 'paragraph',
        text: 'Essa filosofia encoraja a aceitação das próprias falhas de maneira saudável, se adaptar a imprevistos e mudanças naturais da vida, promovendo a autocompaixão e o desapego do perfeccionismo. Se adaptar ou aceitar o luto, a dor de perder algo ou alguém que não vai mais voltar.',
      },
      {
        type: 'concept',
        conceptName: 'Zanshin',
        text: 'conhecido como o "estado de alerta relaxado", a mente totalmente desperta e conectada com o ambiente, sem tensão muscular ou ansiedade, que é o que o mestre de esgrima reconhece no mestre de chá e o que assusta o ronin.',
      },
      {
        type: 'paragraph',
        text: 'Sobre o Zen, ele aparecerá posteriormente em Lótus, pois é um conceito complexo, que aborda sobre a experiência direta da realidade, algo que já observamos nesse capítulo, e que agora chega ao fim.',
      },
      {
        type: 'paragraph',
        text: 'Nesse capítulo vimos sobre estar no momento presente, em corpo e mente. O mestre de chá nos ensinou indiretamente sobre Bushido, Chado, Wabi-sabi, Zanshin e até um pouco sobre o Zen.',
      },
    ],
  },
  {
    number: 2,
    slug: 'capitulo-2',
    title: 'A Balsa de Tsukahara Bokuden',
    pagesLabel: 'Páginas: 11 a 20',
    originNote: 'Japão do período Sengoku (século XVI), registrado na crônica histórica e militar Kōyō Gunkan.',
    concepts: ['Sei-chō-dō', 'Musha Shugyō', 'Gokui', 'Mushin', 'Budō', 'Zen'],
    openingIllustration: {
      src: '/ilustracoes/cap2-ilha.jpg',
      alt: 'Ilustração em aquarela e nanquim da pequena ilha com três cerejeiras em flor no Lago Biwa.',
    },
    closingIllustration: {
      src: '/ilustracoes/cap2-balsa.jpg',
      alt: 'Ilustração em aquarela vista de cima de Tsukahara Bokuden remando em um pequeno barco entre vitórias-régias e flores de lótus.',
      fullBleed: true,
    },
    storyParagraphs: [
      'Tsukahara Bokuden foi um dos maiores mestres da espada no Japão.',
      'Bokuden estava numa balsa com vários passageiros barulhentos e arrogantes. Ele já estava cansado com o movimento das ondas e o chacoalhar das águas.',
      'De repente, eles escutaram um homem desafiando todos, até que o Bokuden vê que o homem era um samurai. O mesmo vê Bokuden e o desafia para um duelo.',
      'Bokuden, para defender sua honra, aceitou o convite para o duelo; porém, pediu que o confronto fosse fora da balsa, a fim de manter a ordem e as pessoas seguras. Então, pegaram um pequeno barco e remaram em direção à ilha mais próxima no Lago Biwa.',
      'Entretanto, quando o jovem samurai desceu do barco para a ilha, o Tsukahara Bokuden usou o remo para empurrar o barco de volta para a água, deixando o jovem arrogante para trás e mostrando que a verdadeira força está em evitar o confronto.',
      'O conto sobre Tsukahara Bokuden, também conhecido como "Arte da Vitória sem Espadas" ou Mutekatsu-ryu, vem do Japão do período Sengoku, no século XVI.',
      'Os detalhes dessa história foram registrados no Kōyō Gunkan, uma crônica histórica e militar atribuída ao clã Takeda.',
    ],
    reflectionBlocks: [
      {
        type: 'paragraph',
        text: 'No conto "Arte da Vitória sem Espadas", o Tsukahara Bokuden não luta, não desembainha suas espadas, mal move um único músculo, apenas usa a mente, e um conceito chamado de Sei-chō-dō.',
      },
      {
        type: 'concept',
        conceptName: 'Sei-chō-dō',
        text: 'conhecido como "Harmonia no Movimento", ideia de redirecionar a força ou a intenção do oponente em vez de colidir contra ela. Em vez de aceitar a provocação no terreno do outro, o estrategista muda as regras do jogo.',
      },
      {
        type: 'paragraph',
        text: 'Conseguimos trazer o Sei-chō-dō para as relações interpessoais. Por exemplo, quando alguém vem com agressividade ou provocação à força direta, a tendência natural é reagir na mesma moeda, o que gera escalada e desgaste. A aplicação prática consiste em não absorver o golpe nem rebater com raiva. Em vez disso, escute, mantenha o tom calmo e faça perguntas que desarmem a emoção do outro, redirecionando o foco para a solução do problema. E, indo para a sabedoria interpessoal e na prevenção de conflitos, falaremos sobre o Musha Shugyō.',
      },
      {
        type: 'concept',
        conceptName: 'Musha Shugyō',
        text: 'conhecido como "A Busca da Sabedoria do Guerreiro", conceito que descreve a evolução de um praticante: a fase inicial foca no combate físico, mas o estágio mais elevado foca na inteligência interpessoal, na prevenção de conflitos e na maestria mental. E falando de sabedoria, podes ir para a estratégia, e o melhor conceito que se encaixa nisso é o Gokui.',
      },
      {
        type: 'concept',
        conceptName: 'Gokui',
        text: 'conhecido como "A Essência Secreta" ou Koryū, ou ensinamento secreto de um estilo, raramente era uma técnica mortal de esgrima, mas sim o princípio filosófico de como evitar ter que desembainhar a espada. Esses conceitos mostram que a verdadeira estratégia não é sobre ganhar um duelo, mas sobre dissolver o combate antes mesmo que ele aconteça. Para ser estratégico, o ideal é controlar seus sentimentos, e um conceito ligado a isso é o Mushin.',
      },
      {
        type: 'concept',
        conceptName: 'Mushin',
        text: 'conhecido como "mente sem mente", um estado de clareza mental isento de raiva, medo ou orgulho, permitindo responder às situações de forma iminente, fluida e intuitiva. O Mushin é um dos conceitos fundamentais da filosofia Zen, filosofia que ainda iremos abordar ainda neste capítulo. O Mushin não se trata de deixar a mente em branco, mas sim de alcançar um estado de presença absoluta onde a mente está livre de distrações.',
      },
      {
        type: 'paragraph',
        text: 'Nesse capítulo, a gente viu sobre lidar com problemas. Como observar eles antes mesmo de acontecer, com o Musha Shugyō, e a lidar com ele antes mesmo de se tornar um problema com o Gokui, a estratégia de acabar antes mesmo de começar. E até mesmo se o problema já é real, com o Sei-chō-dō buscando a solução do problema, redirecionando a intenção dos oponentes. E, para conseguir lidar com os problemas, você precisa de uma mente sã e alcançar um estado de presença absoluta; como vimos no Capítulo I, o nome desse conceito é o Mushin.',
      },
      {
        type: 'paragraph',
        text: 'Bokuden utiliza do Budō, o caminho das artes marciais japonesas, que tem como filosofia central o Zen. Como já apontei, o Zen é uma filosofia muito complexa, e nesse capítulo só abordaremos apenas um dos seus pilares: o desapego da dualidade. No Zen, o conceito de "ganhar" ou "perder" é uma ilusão que gera cegueira e sofrimento.',
      },
      {
        type: 'paragraph',
        text: 'Como vimos no conto, o jovem samurai estava preso ao desejo de provar superioridade. Já Bokuden, moldado pela mentalidade Zen, apenas via o evento como algo que poderia ser dissolvido com serenidade.',
      },
    ],
  },
  {
    number: 3,
    slug: 'capitulo-3',
    title: 'A Alegria dos Peixes, Yin Yang',
    pagesLabel: 'Páginas: 21 a (em aberto)',
    originNote: 'China Antiga (século IV a.C.), registrado no Zhuangzi (Chuang-Tsu), texto fundacional do taoismo.',
    concepts: ['Ziran', 'Yin Yang', 'Wei'],
    openingIllustration: {
      src: '/ilustracoes/cap3-peixes.jpg',
      alt: 'Ilustração em sumi-ê de dois peixes koi, um preto e um prata, nadando em harmonia Yin-Yang cercados por gotas de água.',
    },
    storyParagraphs: [
      'Clima úmido nas margens do rio Hao, caminhando sobre a ponte de madeira envelhecida e contemplando as águas serenas, estavam Zhuangzi e seu amigo Huizi.',
      'Quando Zhuangzi observou dois peixes deslizando suavemente pela correnteza e comentou como eles pareciam felizes em sua liberdade nativa, Huizi, sempre apegado à lógica rigorosa, questionou imediatamente como Zhuangzi, sendo um homem e não um peixe, poderia realmente conhecer os sentimentos de uma criatura aquática. Então, Zhuangzi disse calmamente:',
      '— Você não é eu. Como sabe que eu não sei o que é a alegria dos peixes? (Disse Zhuangzi com uma postura serena.)',
      '— Eu não sou você, portanto, certamente não sei o que você sabe. Mas você não é um peixe, e isso prova perfeitamente que você não pode saber o que é a alegria deles! (Diz Huizi de maneira agressiva.)',
      '— Voltemos ao início. Quando você me perguntou: "Como você sabe o que é a alegria dos peixes?", sua própria pergunta já admitia que eu sabia, pois você queria entender o meu meio de saber. E como eu sei? Eu sei pela minha própria alegria, aqui mesmo, de pé sobre o rio Hao.',
      'Os dois personificam com perfeição a dualidade do Yin e Yang; as diferenças que eles estão a demonstrar nos ensinam que a verdadeira compreensão só existe quando essas duas forças opostas se encontram em equilíbrio.',
      'O conto do "Diálogo sobre a Alegria dos Peixes" vem da China Antiga e foi registrado no Zhuangzi ou Chuang-Tsu, um dos textos fundacionais do taoismo, escrito por volta do século IV a.C. (período de auge de Platão e Aristóteles).',
    ],
    reflectionBlocks: [
      {
        type: 'paragraph',
        text: 'No conto, conseguimos ter acesso a um diálogo que retrata perfeitamente o dualismo chinês, como a visão de Zhuangzi, que defende a ideia do Ziran.',
      },
      {
        type: 'concept',
        conceptName: 'Ziran',
        text: 'o Ziran, ou o fluxo natural, é a ideia de viver em harmonia com a natureza, sem impor julgamentos rígidos, permitindo-se sentir e integrar-se ao ambiente ao invés de apenas tentar dominá-lo ou explicá-lo.',
      },
      {
        type: 'paragraph',
        text: 'O Ziran pode ser visto de diversas maneiras, levando para os dias atuais, como em relações interpessoais, no sentido de reduzir a necessidade de manter aparências ou papéis sociais rígidos. O Ziran também pode ser aplicado aos ofícios do homem, questionando a aceleração artificial da rotina, assim como a natureza não se apressa, mas tudo realiza.',
      },
      {
        type: 'paragraph',
        text: 'Outro quesito que o Ziran pode ajudar a combater é o controle excessivo. Em vez de tentar gerenciar cada detalhe do futuro ou microgerenciar pessoas, o Ziran propõe agir com flexibilidade, adaptando-se às mudanças de cenário sem reatividade impulsiva.',
      },
      {
        type: 'paragraph',
        text: 'O Ziran é a ideia de Zhuangzi sobre a natureza, e eles dialogam sobre ter ideias diferentes, um dualismo entre eles, entre a razão e a intuição, o Yin e Yang.',
      },
      {
        type: 'concept',
        conceptName: 'Yin Yang',
        text: 'o Yin Yang, o equilíbrio entre razão e intuição, revela que a verdadeira sabedoria não nasce da escolha de um único caminho, mas da harmonia entre forças que se completam.',
      },
      {
        type: 'paragraph',
        text: 'De um lado, a razão representa o Yang: a mente analítica que questiona, organiza e busca respostas concretas para compreender o mundo. Do outro lado, a intuição personifica o Yin: a sensibilidade silenciosa que percebe o instante presente e se conecta com a vida sem precisar de explicações rígidas.',
      },
      {
        type: 'paragraph',
        text: 'Isoladas, essas forças se enfraquecem: a lógica pura torna-se fria e distante, enquanto a intuição sem discernimento perde sua direção. Assim como os dois amigos que caminham lado a lado sobre a ponte, razão e intuição precisam andar juntas. No coração da lógica há espaço para o mistério, e dentro da intuição existe uma ordem natural, lembrando-nos de que compreender a realidade exige tanto a clareza de quem analisa quanto a entrega de quem apenas sente, e o conceito que tem essa linha de pensamento é o Wei, linha de pensamento contrária ao Ziran.',
      },
      {
        type: 'concept',
        conceptName: 'Wei',
        text: 'em contrapartida ao fluxo leve da natureza, surge o Wei: a força do artifício, da rigidez e da intervenção humana excessiva. É o impulso incessante de tentar moldar o mundo à nossa própria régua, impondo regras, rótulos e controle onde deveria haver apenas entrega. Quando nos deixamos dominar pelo Wei, afastamo-nos da essência das coisas; em vez de simplesmente observar o rio correr, queremos medi-lo e explicá-lo, e até justificar sua existência.',
      },
      {
        type: 'paragraph',
        text: 'Nesse capítulo vimos que a travessia sobre a ponte do rio Hao nos lembra de que a sabedoria está em equilibrar o Yin e o Yang: a razão de Huizi, que estrutura e questiona, e a intuição de Zhuangzi, que sente e conecta. Hoje, cercados por telas e prazos, vivemos facilmente presos ao Wei, o esforço artificial de controlar cada detalhe da rotina, e esquecemos o Ziran, a espontaneidade de apenas estar presente e aceitar o fluxo natural da vida. Buscar excesso de controle revela falta de fluidez. Se a rigidez lhe atrai, é porque lhe falta o natural. A busca por um sempre denuncia a ausência do oposto.',
      },
    ],
  },
];

export const PHILOSOPHICAL_PILLARS: ConceptHighlight[] = [
  {
    name: 'Bushido',
    subtitle: 'O Caminho do Guerreiro',
    chapterNumber: 1,
    chapterSlug: 'capitulo-1',
    summary: 'Código de conduta, senso de honra, dever nos pequenos detalhes diários e dignidade diante da adversidade.',
  },
  {
    name: 'Chado',
    subtitle: 'O Caminho do Chá',
    chapterNumber: 1,
    chapterSlug: 'capitulo-1',
    summary: 'Disciplina de vida baseada em simplicidade, respeito, pureza e tranquilidade — valorizando o processo tanto quanto o resultado.',
  },
  {
    name: 'Wabi-sabi',
    subtitle: 'Beleza da Impermanência',
    chapterNumber: 1,
    chapterSlug: 'capitulo-1',
    summary: 'Aceitação saudável das próprias falhas, da transitoriedade da vida, promovendo autocompaixão e desapego do perfeccionismo.',
  },
  {
    name: 'Zanshin',
    subtitle: 'Estado de Alerta Relaxado',
    chapterNumber: 1,
    chapterSlug: 'capitulo-1',
    summary: 'Mente totalmente desperta e conectada com o ambiente, sem tensão muscular ou ansiedade.',
  },
  {
    name: 'Sei-chō-dō',
    subtitle: 'Harmonia no Movimento',
    chapterNumber: 2,
    chapterSlug: 'capitulo-2',
    summary: 'Redirecionar a força ou a intenção do oponente em vez de colidir contra ela, mudando as regras do jogo.',
  },
  {
    name: 'Musha Shugyō',
    subtitle: 'Busca da Sabedoria do Guerreiro',
    chapterNumber: 2,
    chapterSlug: 'capitulo-2',
    summary: 'Evolução do combate físico para a inteligência interpessoal, prevenção de conflitos e maestria mental.',
  },
  {
    name: 'Gokui',
    subtitle: 'A Essência Secreta',
    chapterNumber: 2,
    chapterSlug: 'capitulo-2',
    summary: 'O princípio estratégico de dissolver o combate antes mesmo que ele aconteça, evitando desembainhar a espada.',
  },
  {
    name: 'Mushin',
    subtitle: 'Mente sem Mente',
    chapterNumber: 2,
    chapterSlug: 'capitulo-2',
    summary: 'Estado de presença absoluta e clareza mental livre de raiva, medo ou orgulho, respondendo com fluidez.',
  },
  {
    name: 'Budō',
    subtitle: 'Caminho das Artes Marciais',
    chapterNumber: 2,
    chapterSlug: 'capitulo-2',
    summary: 'Tradição marcial japonesa que tem como filosofia central o Zen e a dissolução serena do ego.',
  },
  {
    name: 'Zen',
    subtitle: 'Desapego da Dualidade',
    chapterNumber: 2,
    chapterSlug: 'capitulo-2',
    summary: 'Experiência direta da realidade onde a ilusão de "ganhar" ou "perder" cede lugar à serenidade.',
  },
  {
    name: 'Ziran',
    subtitle: 'O Fluxo Natural',
    chapterNumber: 3,
    chapterSlug: 'capitulo-3',
    summary: 'Viver em harmonia com a natureza sem julgamentos rígidos ou controle excessivo, agindo com flexibilidade.',
  },
  {
    name: 'Yin Yang',
    subtitle: 'Razão e Intuição em Equilíbrio',
    chapterNumber: 3,
    chapterSlug: 'capitulo-3',
    summary: 'A verdadeira sabedoria nasce da harmonia entre a mente analítica (Yang) e a sensibilidade silenciosa (Yin).',
  },
  {
    name: 'Wei',
    subtitle: 'A Força do Artifício',
    chapterNumber: 3,
    chapterSlug: 'capitulo-3',
    summary: 'A rigidez e intervenção humana excessiva que tenta moldar o mundo à própria régua, afastando-nos da essência.',
  },
];
