# Documentação de Uso de IA - Desafio Técnico FreteMais

Este documento registra todos os prompts utilizados com ferramentas de IA (GitHub Copilot/Claude) durante o desenvolvimento do frontend Next.js para o sistema de cadastro e busca de motoristas.

## 📝 Objetivo

Conforme solicitado no desafio técnico, este arquivo documenta:
- Os prompts usados
- O que cada prompt gerou/ajudou a fazer
- Quais trechos foram adaptados manualmente

## 🎯 Estrutura do Projeto

### Prompt 1: Estrutura Inicial e Configuração
**Prompt usado:**
```
Você vai ser um desenvolvedor senior NextJS. Vamos iniciar um projeto de desafio técnico.
A FreteMais precisa de um módulo interno para cadastro e busca de motoristas.

Estrutura:
- Usar Next.js com App Router
- TypeScript
- Estrutura MVC adaptada para frontend (src/ com components, pages, services, utils, hooks, styles)
- Templates prontos: Chakra UI, Material UI ou Tailwind
- Boas práticas: Clean Code, SOLID

Requisitos:
- Rotas protegidas (autenticação)
- Axios ou fetch para requisições HTTP
- React Hook Form ou Formik para formulários
- Zod ou Yup para validação
- React Query ou SWR para estado/cache
- Jest e React Testing Library para testes

Me explique por que escolher essas ferramentas.
```

**O que foi gerado:**
- Configuração inicial do Next.js 15 com TypeScript
- Instalação de dependências: react-query, react-hook-form, zod, axios
- Estrutura de pastas em `src/` (app/, components/, hooks/, lib/, types/, context/)
- Arquivos de configuração: tsconfig.json, tailwind.config

**Adaptações manuais:**
- Escolha do Tailwind CSS ao invés de Chakra/Material UI (mais leve)
- Estrutura de tipos separada por domínio (auth.ts, motorista.ts, enums.ts)
- Configuração de interceptors no Axios para JWT tokens

---

### Prompt 2: Tela de Login com Design FreteMais
**Prompt usado:**
```
Faça a tela de login com esse exemplo de imagem e cores [imagem fornecida].
Use as cores: amarelo #FDB913, preto #1F2937, laranja #F97316.
Layout de duas colunas: ilustração + formulário.
```

**O que foi gerado:**
- Componente `app/login/page.tsx`
- Layout responsivo com ilustração SVG à esquerda
- Formulário de login com validação Zod
- Integração com AuthContext

**Adaptações manuais:**
- SVG da ilustração customizado manualmente
- Ajuste de cores exatas (#FDB913 → #ECAA00 → ajustado de volta)
- Adicionado toggle show/hide password
- Removido botão de signup (sistema interno)

---

### Prompt 3: Sistema de Autenticação e Context
**Prompt usado:**
```
Criar AuthContext com:
- Login/logout
- Armazenamento de token JWT
- Decodificação do token para extrair user (id, nome, email, role)
- Persistência no localStorage
```

**O que foi gerado:**
- `src/context/AuthContext.tsx` com Provider
- Funções: login(), logout(), isAuthenticated
- Interface User com campos básicos

**Adaptações manuais:**
- Instalação do pacote `jwt-decode` para decodificação segura
- Extração correta dos campos do JWT:
  - `id` vem do campo `user`
  - `email` vem do campo `sub`
  - `role` vem do campo `scope` (removendo prefixo "ROLE_")
- Adicionado campo `role` opcional na interface User

---

### Prompt 4: Componente ProtectedRoute
**Prompt usado:**
```
Criar HOC ProtectedRoute que:
- Verifica se usuário está autenticado
- Redireciona para /login se não estiver
- Permite acesso à rota se autenticado
```

**O que foi gerado:**
- `src/components/ProtectedRoute.tsx`
- Verificação com useAuth()
- Redirect usando useRouter()

**Adaptações manuais:**
- Adicionado loading state durante verificação
- Melhorado para evitar flash de conteúdo não autorizado

---

### Prompt 5: CRUD de Motoristas - Listagem
**Prompt usado:**
```
Criar página de listagem de motoristas com:
- Header amarelo (#FDB913) com título e botão "+ Novo Motorista"
- Card de filtros: busca textual, UF, cidade, tipos de veículo
- Tabela com paginação
- Botões de ações (Editar, Excluir)
- Integração com React Query
```

**O que foi gerado:**
- `src/app/motoristas/page.tsx`
- Componente de filtros
- Tabela estilizada
- Botão de novo motorista

**Adaptações manuais:**
- Criado hook customizado `useMotoristas` para React Query
- Adicionado estado para filtros (busca, uf, cidade, tiposVeiculo)
- Implementado debounce na busca textual (300ms)
- Cores ajustadas para match FreteMais
- Paginação implementada com componente separado

---

### Prompt 6: MultiSelect para Tipos de Veículo
**Prompt usado:**
```
No backend tenho uma rota /vehicle-types que lista tipos de veículo.
Criar um dropdown onde quando seleciona um item mostra o nome com um X para apagar.
Assim fica mais limpo que checkboxes.
```

**O que foi gerado:**
- Componente `src/components/MultiSelect.tsx`
- Dropdown com lista de opções
- Tags amarelas (#FDB913) com botão X

**Adaptações manuais:**
- Hook `useVehicleTypes` para buscar tipos da API
- Cache de 1 hora no React Query (dados estáticos)
- Mudança de `<button>` para `<span role="button">` no X (evitar button dentro de button)
- Click outside handler com useRef
- Fecha dropdown ao selecionar item (melhor UX)
- Integração com react-hook-form via Controller

---

### Prompt 7: Controle de Acesso Baseado em Role
**Prompt usado:**
```
Adicionar regra de role:
- Se usuário for role USUARIO, não mostra botões de cadastro e coluna de ações
- Se for MOTORISTA ou ADMIN, mostra tudo
```

**O que foi gerado:**
- Conditional rendering baseado em `user?.role`
- Esconde "+ Novo Motorista" para USUARIO
- Esconde coluna "Ações" para USUARIO
- Esconde botões Editar/Excluir para USUARIO

**Adaptações manuais:**
- Verificação de role extraída do JWT token
- Lógica de permissões centralizada no AuthContext
- Testado com diferentes roles do backend

---

### Prompt 8: Ordenação da Listagem
**Prompt usado:**
```
Adicionar dropdown no card Filtros de Busca para ordenação.
Colocar só pelo nome com os nomes em português: Nome Crescente e Nome Decrescente.
```

**O que foi gerado:**
- Componente Select com opções de sort
- Estado `sort` no componente
- Opções: "nome,asc" e "nome,desc"

**Adaptações manuais:**
- Hook `useMotoristas` atualizado para aceitar parâmetro `sort`
- Query key do React Query incluindo `sort` para cache correto
- Labels em português: "Nome Crescente (A-Z)" e "Nome Decrescente (Z-A)"
- Removidas opções de ordenação por email/cidade (simplificado)

---

### Prompt 9: Modal de Detalhes do Motorista
**Prompt usado:**
```
Adicionar um popup que detalha o motorista quando clica em "Ver detalhes".
Também fazer quando clica na linha da tabela aparecer o popup.
```

**O que foi gerado:**
- Componente `src/components/Modal.tsx` (genérico reutilizável)
- Componente `src/components/MotoristaDetails.tsx` (específico)
- Estado `selectedMotorista` na listagem
- Click handler nas linhas da tabela

**Adaptações manuais:**
- Modal com header amarelo (#FDB913) FreteMais
- Overlay com blur ao invés de fundo escuro (backdrop-blur-sm)
- Fecha com ESC ou clicando fora
- Previne scroll do body quando aberto
- MotoristaDetails com seções organizadas:
  - Informações Pessoais
  - Localização
  - Veículos (tags amarelas)
  - Status (badges coloridos)
  - Informações do Sistema
- Formatação de datas em PT-BR
- stopPropagation nos botões de ação (evitar conflito)

---

### Prompt 10: Formulário de Cadastro/Edição
**Prompt usado:**
```
Criar formulário de motorista com:
- Campos: nome, email, telefone, cpf, cidade, uf, cep, endereco
- MultiSelect para tipos de veículo
- Select para role e status
- Validação com Zod
- Integração com React Hook Form
```

**O que foi gerado:**
- Componente `src/components/MotoristaForm.tsx`
- Páginas `app/motoristas/novo/page.tsx` e `app/motoristas/[id]/page.tsx`
- Schema Zod com validações (email, cpf, telefone, cep)

**Adaptações manuais:**
- Integração do MultiSelect com Controller do react-hook-form
- Campos dinâmicos de tipos de veículo consumindo API
- Máscaras para CPF, telefone, CEP (implementadas manualmente)
- Submit handler diferenciado (create vs update)
- Redirect após sucesso

---

## 🔧 Componentes Criados

### 1. Button.tsx
**Como foi criado:**
- Prompt: "Criar componente Button com variantes primary, outline, danger, secondary"
- Gerado: Estrutura básica com TypeScript e Tailwind
- Adaptado: Cores FreteMais (primary = preto #1F2937, outline = laranja #F97316)

### 2. Input.tsx
**Como foi criado:**
- Prompt: "Criar componente Input com suporte a erro, label, placeholder"
- Gerado: Input controlado com forwardRef para react-hook-form
- Adaptado: Placeholder mais escuro (gray-600), texto input gray-900, focus ring laranja

### 3. Select.tsx
**Como foi criado:**
- Prompt: "Criar Select estilizado com Tailwind"
- Gerado: Select nativo estilizado
- Adaptado: Cores FreteMais, focus ring laranja

### 4. Card.tsx
**Como foi criado:**
- Prompt: "Criar Card container genérico"
- Gerado: Div com shadow e rounded
- Adaptado: Padding e espaçamento ajustados

### 5. Pagination.tsx
**Como foi criado:**
- Prompt: "Criar componente de paginação com Anterior/Próximo e indicador de página"
- Gerado: Estrutura básica de navegação
- Adaptado: Desabilita botões nos limites, mostra "Página X de Y"

---

## 🎨 Design e Estilização

### Cores FreteMais
**Como foi definido:**
- Prompt inicial com screenshot do site FreteMais
- Extração manual das cores exatas:
  - Amarelo: #FDB913 (backgrounds, tags, headers)
  - Preto: #1F2937 (botões primários, texto)
  - Laranja: #F97316 (destaques, links, focus states)

**Sistema de Tema:**
- Tentativa inicial de criar tema customizado no Tailwind
- Removido a pedido do usuário (complexidade desnecessária)
- Mantido uso direto das cores em classes Tailwind

---

## 🔌 Integrações com Backend

### API Client (lib/api.ts)
**Como foi criado:**
- Prompt: "Criar cliente Axios com interceptors para JWT token"
- Gerado: Instância axios com baseURL
- Adaptado:
  - Interceptor de request adiciona Authorization header
  - Interceptor de response trata 401 (redirect para login)
  - Métodos específicos: authApi, motoristaApi, vehicleTypeApi

### React Query Hooks
**Como foi criado:**
- Prompt: "Criar custom hooks com React Query para busca de motoristas"
- Gerado: Estrutura básica de useQuery
- Adaptado:
  - `useMotoristas`: aceita filtros, page, size, sort
  - Query key inclui todos parâmetros (cache granular)
  - `staleTime` de 5 minutos para motoristas
  - `useVehicleTypes`: cache de 1 hora (dados estáticos)
  - Tratamento de erro e loading states

---

## 📊 Decisões Técnicas Documentadas

### 1. Next.js App Router vs Pages Router
**Decisão:** App Router
**Por quê:**
- Roteamento moderno e mais intuitivo
- Layouts aninhados nativos
- Server Components por padrão
- Melhor performance
- Future-proof (recomendação oficial Next.js)

### 2. Tailwind CSS vs Chakra/Material UI
**Decisão:** Tailwind CSS
**Por quê:**
- Mais leve (não adiciona bundle JS)
- Customização total sem overhead
- Desenvolvimento rápido com utility-first
- Sem dependência de biblioteca de componentes pesada
- Melhor para aplicar cores custom do cliente

### 3. React Query vs SWR
**Decisão:** React Query (@tanstack/react-query)
**Por quê:**
- API mais completa (mutations, cache invalidation)
- DevTools excelentes
- Melhor TypeScript support
- Comunidade maior
- Mais features out-of-the-box

### 4. React Hook Form vs Formik
**Decisão:** React Hook Form
**Por quê:**
- Performance superior (menos re-renders)
- Bundle menor
- API mais moderna
- Integração perfeita com Zod
- Melhor DX (Developer Experience)

### 5. Zod vs Yup
**Decisão:** Zod
**Por quê:**
- TypeScript-first (inferência de tipos)
- Sintaxe mais limpa
- Melhor integração com react-hook-form
- Validações mais expressivas
- Tendência atual do mercado

### 6. MultiSelect Custom vs Biblioteca
**Decisão:** Componente customizado
**Por quê:**
- Controle total sobre UX
- Sem dependências extras
- Estilização exata do design FreteMais
- Tags com X personalizadas
- Fechamento automático do dropdown

---

## 🐛 Problemas Encontrados e Soluções

### Problema 1: Button dentro de Button
**Erro:** React warning ao usar `<button>` dentro de MultiSelect tag
**Solução:** Mudado para `<span role="button">` com onClick

### Problema 2: Cache do React Query não invalida
**Erro:** Dados antigos aparecem após edição
**Solução:** Query key inclui todos parâmetros de filtro para cache granular

### Problema 3: Click na linha abre modal E aciona botões
**Erro:** stopPropagation faltando nos botões de ação
**Solução:** Adicionado `onClick={(e) => e.stopPropagation()}` na célula de ações

### Problema 4: Modal com fundo muito escuro
**Erro:** UX ruim com overlay preto opaco
**Solução:** Mudado de `bg-black bg-opacity-50` para `backdrop-blur-sm`

### Problema 5: JWT não decodificado corretamente
**Erro:** Role não aparecendo, campos errados
**Solução:** 
- Instalado `jwt-decode` (biblioteca confiável)
- Mapeamento correto: `id` = decoded.user, `role` = decoded.scope.replace('ROLE_', '')

## 📦 Pacotes Instalados via IA

Todos instalados via comandos sugeridos pelo Copilot:

```bash
npm install @tanstack/react-query axios react-hook-form zod jwt-decode
npm install -D @types/node
```

---

## 🔄 Iterações e Refinamentos

### Iteração 1: Cores do tema
- V1: Cores genéricos
- V2: Cores aproximadas do site
- V3: Cores exatas (#FDB913, #1F2937, #F97316)

### Iteração 2: Sistema de tema Tailwind
- V1: Tema customizado criado
- V2: Removido (usuário preferiu cores diretas)

### Iteração 3: Seleção de veículos
- V1: Checkboxes
- V2: Dropdown com checkboxes
- V3: MultiSelect com tags (final)

### Iteração 4: Modal overlay
- V1: Fundo preto opaco
- V2: Fundo com blur (final)

