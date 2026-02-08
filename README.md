# Portal Motorista - Frontend (Next.js)

Sistema de cadastro e busca de motoristas para a FreteMais.

## 🚀 Tecnologias Utilizadas

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utility-first
- **React Query (@tanstack/react-query)** - Gerenciamento de estado e cache
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de formulários
- **Axios** - Cliente HTTP
- **jwt-decode** - Decodificação de JWT tokens

## 📋 Pré-requisitos

- **Docker** e **Docker Compose** (recomendado)
- OU
- Node.js 18+ e npm/yarn (sem Docker)
- Backend rodando em `http://localhost:8080`

## 🐳 Instalação com Docker (Recomendado)

A forma mais fácil de rodar o projeto é usando Docker Compose:

```bash
# 1. Copiar arquivo de variáveis de ambiente
cp .env.example .env

# 2. Ajustar as variáveis no arquivo .env (se necessário)
# Edite o arquivo .env e configure:
# NEXT_PUBLIC_API_URL=http://localhost:8080/api

# 3. Subir a aplicação com Docker Compose
docker-compose up

# Ou em modo detached (background)
docker-compose up -d

# 4. Acessar a aplicação em http://localhost:3000
```

### Comandos Docker Úteis

```bash
# Parar os containers
docker-compose down

# Rebuild (após mudanças no código ou dependências)
docker-compose up --build

# Ver logs
docker-compose logs -f frontend

# Entrar no container
docker-compose exec frontend sh

# Limpar tudo (containers, volumes, imagens)
docker-compose down -v
```

## 🔧 Instalação Manual (Sem Docker)

Se preferir rodar sem Docker:

```bash
# 1. Instalar dependências
npm install

# 2. Copiar arquivo de variáveis de ambiente
cp .env.example .env

# 3. Ajustar as variáveis no arquivo .env
# NEXT_PUBLIC_API_URL=http://localhost:8080/api

# 4. Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

## 🌐 Acesso

- **URL**: http://localhost:3000
- **Tela de Login**: http://localhost:3000/login
- **Dashboard**: http://localhost:3000/motoristas

## 👤 Autenticação

### Credenciais de Teste

Utilize as credenciais fornecidas pelo backend. Exemplos:

```
# Usuário com role ADMIN (acesso completo)
Email: admin@fretemais.com
Senha: 123456

# Usuário com role MOTORISTA (acesso completo)
Email: maria.santos@email.com
Senha: 123456

# Usuário com role USUARIO (apenas visualização)
Email: juliana.lima@email.com
Senha: 123456
```

### Fluxo de Autenticação

1. Acesse a tela de login
2. Digite email e senha
3. Sistema decodifica JWT e extrai:
   - `id` do usuário (campo "user" do token)
   - `nome` completo
   - `email` (campo "sub" do token)
   - `role` (campo "scope" do token, removendo prefixo "ROLE_")
4. Token armazenado no `localStorage`
5. Rotas protegidas verificam autenticação automaticamente

### Controle de Acesso por Role

**ADMIN/MOTORISTA:**
- ✅ Visualizar lista de motoristas
- ✅ Cadastrar novo motorista
- ✅ Editar motorista existente
- ✅ Excluir motorista
- ✅ Ver detalhes completos

**USUARIO:**
- ✅ Visualizar lista de motoristas
- ✅ Ver detalhes completos
- ❌ Não pode criar/editar/excluir

## 🔍 Funcionalidades - Busca e Filtros

### Filtros Disponíveis

1. **Busca Textual**
   - Pesquisa por: Nome, Email ou Telefone
   - Busca parcial (case-insensitive)
   - Exemplo: Digite "Silva" para buscar todos com sobrenome Silva

2. **Estado (UF)**
   - Dropdown com todos os estados brasileiros
   - Filtra motoristas por estado de residência

3. **Cidade**
   - Campo de texto livre
   - Filtra por cidade exata ou parcial

4. **Tipos de Veículo**
   - MultiSelect com tags amarelas
   - Permite selecionar múltiplos tipos simultaneamente
   - Tipos disponíveis: VAN, TOCO, BAU, SIDER, TRUCK, BITRUCK
   - Clique para abrir dropdown, selecione os tipos desejados
   - Tags amarelas (#FDB913) com botão X para remover

5. **Ordenação**
   - Nome Crescente (A-Z)
   - Nome Decrescente (Z-A)

### Como Usar os Filtros

**Exemplo 1: Buscar motoristas em São Paulo com caminhão tipo VAN**
```
1. Digite "São Paulo" no campo Cidade
2. Selecione "SP" no dropdown Estado
3. Clique no MultiSelect "Tipos de Veículo" e escolha "Van"
4. Clique em "Aplicar Filtros"
```

**Exemplo 2: Buscar por nome ou email**
```
1. Digite "João" ou "joao@email.com" no campo Buscar
2. Clique em "Aplicar Filtros"
```

**Exemplo 3: Combinar múltiplos filtros**
```
1. Digite "Silva" no campo Buscar
2. Selecione "RJ" no dropdown Estado
3. Selecione "Toco" e "Truck" nos Tipos de Veículo
4. Escolha "Nome Decrescente" na Ordenação
5. Clique em "Aplicar Filtros"
```

### Paginação

- **Itens por página**: 10 motoristas
- **Navegação**: Botões Anterior/Próximo
- **Indicador**: Mostra "Página X de Y"
- **Total**: Exibe "Mostrando X de Y motorista(s)"

### Modal de Detalhes

- Clique em qualquer linha da tabela para ver detalhes completos
- Botão "Ver detalhes" em cada linha
- Modal com informações organizadas:
  - Dados pessoais (nome, email, telefone, CPF)
  - Localização (endereço, cidade, UF, CEP)
  - Veículos (tags amarelas)
  - Status (badge colorido)
  - Datas de criação e atualização
- Fechar com: ESC, X ou clicando fora do modal

## 📁 Estrutura do Projeto

```
src/
├── app/                      # Páginas Next.js (App Router)
│   ├── login/               # Tela de login
│   ├── motoristas/          # CRUD de motoristas
│   │   ├── page.tsx        # Listagem com filtros
│   │   ├── novo/           # Cadastro
│   │   └── [id]/           # Edição
│   ├── layout.tsx          # Layout global
│   └── globals.css         # Estilos globais
├── components/              # Componentes reutilizáveis
│   ├── Button.tsx          # Botão com variantes (primary, outline, danger)
│   ├── Card.tsx            # Container de card
│   ├── Input.tsx           # Campo de texto estilizado
│   ├── Select.tsx          # Dropdown simples
│   ├── MultiSelect.tsx     # Dropdown múltiplo com tags
│   ├── Modal.tsx           # Modal genérico reutilizável
│   ├── MotoristaDetails.tsx # Detalhes do motorista para modal
│   ├── MotoristaForm.tsx   # Formulário de motorista
│   ├── Pagination.tsx      # Componente de paginação
│   └── ProtectedRoute.tsx  # HOC para rotas protegidas
├── context/                 # Context API
│   └── AuthContext.tsx     # Autenticação global
├── hooks/                   # Custom hooks React Query
│   ├── useMotoristas.ts    # Hook de busca de motoristas
│   └── useVehicleTypes.ts  # Hook de tipos de veículo
├── lib/                     # Configurações e utilitários
│   └── api.ts              # Cliente Axios com interceptors
└── types/                   # TypeScript types e interfaces
    ├── auth.ts             # Tipos de autenticação
    ├── enums.ts            # Enums do sistema
    └── motorista.ts        # Tipos de motorista
```

## 🎨 Design System (Cores FreteMais)

```css
Amarelo Principal: #FDB913
Preto/Cinza Escuro: #1F2937
Laranja Destaque: #F97316
```

**Aplicação das Cores:**
- **Headers**: Fundo amarelo (#FDB913)
- **Botões primários**: Preto (#1F2937)
- **Botões outline/links**: Laranja (#F97316)
- **Tags de veículo**: Amarelo (#FDB913)
- **Estados selecionados**: Laranja (#F97316)
- **Focus rings**: Laranja (#F97316)

## 📱 Componentes Principais

### MultiSelect
Dropdown com seleção múltipla e tags:
- Clique para abrir dropdown
- Seleciona/deseleciona itens (toggle)
- Tags amarelas com X para remover
- Fecha automaticamente após seleção
- Click outside fecha o dropdown
- Visual limpo e organizado

### Modal
Popup de detalhes do motorista:
- Header amarelo FreteMais
- Fecha com ESC ou clicando fora
- Backdrop com blur (backdrop-blur-sm)
- Previne scroll do body quando aberto
- Tamanhos: sm, md, lg, xl
- Exibe todas informações do motorista organizadas por seções

### MotoristaForm
Formulário de cadastro/edição:
- Validação com Zod (email, CPF, telefone, CEP)
- React Hook Form para gerenciamento de estado
- MultiSelect integrado para tipos de veículo
- Campos organizados em seções lógicas
- Feedback visual de erros

## 🔐 Segurança

1. **Token JWT**: Armazenado no localStorage
2. **Interceptor Axios**: Adiciona token automaticamente em todas requisições
3. **Redirect automático**: 401 → redireciona para /login
4. **Role-based access**: UI adapta conforme permissões do usuário
5. **Rotas protegidas**: ProtectedRoute valida autenticação antes de renderizar

## ⚙️ Decisões Técnicas

### Por que Next.js App Router?
- Roteamento moderno baseado em arquivos
- Server Components por padrão (melhor performance)
- Layouts aninhados nativos
- Future-proof (recomendação oficial Next.js)

### Por que React Query?
- Cache automático inteligente de requisições
- Sincronização de estado entre componentes
- Loading/error states gerenciados automaticamente
- Invalidação de cache inteligente
- DevTools excelentes para debugging

### Por que Tailwind CSS?
- Desenvolvimento extremamente rápido
- Consistência visual garantida
- Sem necessidade de CSS customizado
- Utility-first approach facilita manutenção
- Bundle otimizado (apenas classes usadas)

### Por que React Hook Form + Zod?
- **Performance**: Sem re-renders desnecessários
- **Validação tipada**: Inferência de tipos automática
- **Integração perfeita**: Zod + TypeScript + RHF
- **DX excelente**: API limpa e intuitiva

### Por que MultiSelect customizado?
- **UX superior**: Melhor que checkboxes múltiplos
- **Visual limpo**: Tags organizadas com remoção fácil
- **Controle total**: Estilização exata do design FreteMais
- **Sem dependências**: Não adiciona peso ao bundle

## 🐛 Troubleshooting

### Erro de CORS
```bash
# Certifique-se que o backend aceita origin http://localhost:3000
# Configuração no backend: @CrossOrigin ou WebMvcConfigurer
```

### Token expirado
```bash
# Faça login novamente
# Token JWT tem validade configurada no backend
# Logout automático em caso de 401
```

### Tipos de veículo não carregam
```bash
# Verifique se backend está rodando
# Endpoint: GET http://localhost:8080/api/vehicle-types
# Deve retornar array com { value, label }
```

### Filtros não aplicam
```bash
# Verifique console do navegador (F12)
# Endpoint: POST http://localhost:8080/api/usuarios/search
# Query params: ?page=0&size=10&sort=nome,asc
```

## 📊 Performance

- **React Query Cache**: 
  - Motoristas: 5 minutos de staleTime
  - Tipos de veículo: 1 hora (dados estáticos)
- **Paginação**: 10 itens por página (configurável)
- **Lazy Loading**: Componentes carregados sob demanda
- **Bundle Size**: ~200kb (gzipped, estimado)

## 📝 Scripts Disponíveis

```bash
# Com Docker
docker-compose up              # Subir aplicação
docker-compose down            # Parar aplicação
docker-compose logs -f         # Ver logs em tempo real

# Sem Docker
npm run dev          # Desenvolvimento (localhost:3000)
npm run build        # Build para produção
npm start            # Servidor de produção
npm run lint         # ESLint
```

## 🐳 Docker - Detalhes Técnicos

### Arquivos Docker

- **Dockerfile** - Build para desenvolvimento com hot reload
- **docker-compose.yml** - Orquestração dos serviços
- **.dockerignore** - Arquivos ignorados no build

### Volumes

O Docker Compose monta o código fonte como volume para permitir **hot reload**:
- Alterações no código são refletidas automaticamente
- Não precisa rebuild para mudanças no código
- `node_modules` e `.next` são volumes isolados (performance)

### Rede

O container usa a rede `fretemais-network`:
- Permite comunicação com outros containers (ex: backend)
- Porta 3000 exposta para o host

## 🤝 Integração com Backend

### Endpoints Consumidos

```
POST   /api/autenticacao/autenticar    # Login (retorna JWT)
GET    /api/vehicle-types               # Listar tipos de veículo
POST   /api/usuarios/search             # Busca com filtros + paginação
GET    /api/usuarios/:id                # Buscar motorista por ID
POST   /api/usuarios                    # Criar motorista
PUT    /api/usuarios/:id                # Atualizar motorista
DELETE /api/usuarios/:id                # Excluir motorista (soft delete)
```

### Formato de Filtros (POST /usuarios/search)

**Request Body:**
```json
{
  "texto": "João",
  "uf": "SP",
  "cidade": "São Paulo",
  "tiposVeiculo": ["VAN", "TOCO"]
}
```

**Query Params:**
```
?page=0&size=10&sort=nome,asc
```

**Response:**
```json
{
  "content": [...],
  "totalElements": 50,
  "totalPages": 5,
  "number": 0,
  "size": 10
}
```
