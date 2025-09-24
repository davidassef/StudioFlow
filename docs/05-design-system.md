Proposta de Design System e Layout para o StudioFlow
Este documento define a direção visual e a stack de tecnologia para a interface do usuário (UI) do StudioFlow, com foco em criar uma experiência moderna, funcional e alinhada ao universo musical.
1. A Vibe: "Dark Mode Studio"
A inspiração vem diretamente do ambiente de um estúdio de gravação: pouca luz, foco nos equipamentos e luzes de LED dos aparelhos. Um tema escuro (Dark Mode) é a escolha ideal.
 * Profissionalismo: Interfaces escuras são o padrão em softwares de áudio (Pro Tools, Ableton, Logic) e são associadas a ferramentas "pro".
 * Foco: Reduz o cansaço visual em sessões longas de uso, permitindo que o usuário se concentre no que importa: os agendamentos e dados.
 * Estilo: É moderno, elegante e permite que cores de destaque brilhem.
2. Paleta de Cores
A base será escura, com uma cor vibrante para dar personalidade e guiar o usuário.
 * Fundo Principal: Um cinza-chumbo bem escuro, quase preto (#111827 ou slate-900 do Tailwind). Evitar o preto puro (#000000) que pode ser cansativo.
 * Fundo Secundário (Cards/Modais): Um tom de cinza um pouco mais claro (#1F2937 ou slate-800).
 * Texto Principal: Um cinza muito claro, quase branco (#F9FAFB ou slate-50).
 * Texto Secundário: Um cinza médio (#9CA3AF ou slate-400).
 * Cor de Destaque (Accent Color): Aqui está a alma do design. Escolha uma cor vibrante para botões, links, itens de calendário e destaques. Sugestões:
   * Azul Elétrico: (#3B82F6) - Moderno, tecnológico.
   * Verde Neon: (#22C55E) - Vibe de "gravando", "ativo".
   * Laranja "Válvula": (#F97316) - Remete ao brilho quente de amplificadores valvulados.
3. Tipografia
A clareza é fundamental em um sistema de gestão.
 * Fonte Principal: Inter. É uma fonte sans-serif moderna, extremamente legível em qualquer tamanho e gratuita no Google Fonts. É perfeita para dashboards.
4. Framework de UI (A Escolha Técnica)
Você está usando React e já tem experiência com Tailwind CSS. A escolha que vai te dar mais poder, flexibilidade e um resultado final único é, sem dúvida, o shadcn/ui.
 * O que é? Não é uma biblioteca de componentes tradicional como Material-UI. É uma coleção de componentes reutilizáveis que você instala diretamente no seu projeto. Você copia o código do componente para sua pasta, te dando 100% de controle sobre ele.
 * Por que é perfeito para o StudioFlow?
   * Customização Total: Como você é o dono do código do componente, estilizá-lo para combinar com a sua vibe "Dark Mode Studio" é trivial.
   * Usa Tailwind CSS: Ele é construído sobre o Tailwind, então você já está em casa.
   * Qualidade e Acessibilidade: Os componentes usam Radix UI por baixo dos panos, o que garante um nível altíssimo de acessibilidade e comportamento (menus, modais, etc.).
   * Mentalidade de "Founder": Você não fica preso a um design de terceiros. Você constrói a sua própria biblioteca de componentes, o que é perfeito para um produto que vai evoluir.
5. Estrutura do Layout (O Esqueleto)
A estrutura será um dashboard clássico, focado na funcionalidade.
 * Sidebar Fixo à Esquerda: Com os ícones e links de navegação principais:
   * Dashboard (Visão geral, calendário principal)
   * Agendamentos
   * Clientes
   * Salas
   * Financeiro (futuramente)
   * Configurações
 * Header Superior: Com o nome do usuário logado, notificações e um botão de "Novo Agendamento" como atalho principal.
 * Área de Conteúdo Principal: Onde as telas e os dados serão exibidos. A tela principal do Dashboard deve ter o componente de Calendário como a estrela do show.
Essa combinação de um layout funcional, uma paleta de cores com personalidade e a flexibilidade do shadcn/ui vai resultar em um produto com uma aparência profissional, única e perfeitamente alinhada ao seu público-alvo.