

# Plano: Sistema de Login e Permissões com Supabase

## Resumo

Vou implementar um sistema completo de autenticação onde:
- **Admin Chefe** faz login e pode adicionar outros administradores
- Senha é pedida **apenas no primeiro acesso** (depois fica logado)
- **Permissões personalizáveis** para cada admin (você escolhe o que cada um vê)

---

## Como Vai Funcionar

### Primeiro Acesso (Seu Login)
1. Ao abrir o sistema pela primeira vez, você verá uma tela de login
2. Digite seu e-mail e senha para entrar como **Admin Chefe**
3. Nas próximas vezes, o sistema já vai lembrar de você (fica logado)

### Adicionando Outros Administradores
1. Vá em **Configurações > Administradores**
2. Clique em **"Adicionar"** e preencha:
   - Nome
   - E-mail
   - Tipo: **Pleno** (acesso total) ou **Junior** (acesso limitado)
3. Se for Junior, marque as permissões desejadas
4. O novo admin receberá um e-mail para criar a senha

### Controlando o que Cada Um Vê
- **Admin Pleno**: Vê tudo igual você (exceto configurações de admins)
- **Admin Junior**: Você escolhe via checkboxes:
  - [ ] Agenda
  - [ ] Clientes  
  - [ ] Estoque
  - [ ] Lista de Espera
  - [ ] Financeiro
  - [ ] Fornecedores
  - [ ] Parcerias

---

## Fluxo Visual

```text
┌─────────────────────────────────────────────────────────────┐
│                     TELA DE LOGIN                            │
│                                                             │
│     ┌───────────────────────────────────────┐              │
│     │  E-mail: _________________________   │              │
│     │  Senha:  _________________________   │              │
│     │                                       │              │
│     │         [  ENTRAR  ]                 │              │
│     └───────────────────────────────────────┘              │
│                                                             │
│     Esqueceu a senha? Clique aqui                          │
└─────────────────────────────────────────────────────────────┘

        ↓ Após login bem-sucedido

┌─────────────────────────────────────────────────────────────┐
│  BRONZE PRO          Olá, Maria! (Admin Chefe) [Sair]       │
├─────────────────────────────────────────────────────────────┤
│  📅 Agenda                                                  │
│  👥 Clientes                                                │
│  💰 Financeiro                                              │
│  ...                                                        │
│  ⚙️ Configurações  ← Adicionar/gerenciar admins aqui        │
└─────────────────────────────────────────────────────────────┘
```

---

## Detalhes Técnicos

### 1. Integração com Supabase

Será necessário conectar o Supabase ao projeto para:
- Autenticação de usuários (login/logout)
- Armazenar perfis e roles dos administradores
- Armazenar as permissões de cada Admin Junior

### 2. Estrutura do Banco de Dados

**Tabela: profiles**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | ID do usuário (referência auth.users) |
| name | texto | Nome do administrador |
| created_at | data | Data de criação |
| updated_at | data | Última atualização |

**Tabela: user_roles**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | ID único |
| user_id | UUID | Referência ao usuário |
| role | enum | 'admin_chefe', 'admin_pleno', 'admin_junior' |

**Tabela: admin_permissions**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | ID único |
| user_id | UUID | Referência ao usuário |
| agenda | boolean | Acesso à agenda |
| clientes | boolean | Acesso a clientes |
| financeiro | boolean | Acesso ao financeiro |
| estoque | boolean | Acesso ao estoque |
| fornecedores | boolean | Acesso a fornecedores |
| parcerias | boolean | Acesso a parcerias |
| lista_espera | boolean | Acesso à lista de espera |

### 3. Segurança (RLS)

- Apenas Admin Chefe pode ver/editar outros administradores
- Cada usuário só vê dados conforme suas permissões
- Roles armazenadas em tabela separada (não no perfil)
- Funções SECURITY DEFINER para verificar permissões

### 4. Componentes a Criar

| Componente | Descrição |
|------------|-----------|
| `LoginPage.tsx` | Tela de login com e-mail/senha |
| `AuthProvider.tsx` | Contexto de autenticação global |
| `ProtectedRoute.tsx` | Proteção de rotas por role |
| `useAuth.ts` | Hook para acessar dados do usuário |
| `usePermissions.ts` | Hook para verificar permissões |

### 5. Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `App.tsx` | Adicionar AuthProvider e rotas protegidas |
| `Index.tsx` | Verificar autenticação, mostrar nome do usuário |
| `Sidebar.tsx` | Mostrar menu baseado nas permissões reais |
| `AdminSection.tsx` | Integrar com Supabase para CRUD de admins |
| `TopBar.tsx` | Adicionar botão de logout e nome do usuário |

### 6. Fluxo de Convite de Admin

1. Admin Chefe preenche nome/e-mail do novo admin
2. Sistema cria entrada no banco com role e permissões
3. Supabase envia e-mail de convite automaticamente
4. Novo admin clica no link e cria senha
5. No primeiro login, já tem as permissões definidas

---

## Ordem de Implementação

1. **Conectar Supabase** ao projeto (Lovable Cloud ou externo)
2. **Criar tabelas** no banco (profiles, user_roles, admin_permissions)
3. **Configurar RLS** para segurança
4. **Criar componentes** de autenticação (Login, AuthProvider)
5. **Integrar AdminSection** com Supabase
6. **Atualizar Sidebar/TopBar** para usar permissões reais
7. **Testar fluxo completo** de login e convite

---

## Próximo Passo Necessário

Para iniciar, preciso que você **conecte o Supabase** ao projeto. Posso fazer isso de duas formas:

**Opção 1 - Lovable Cloud (Recomendado):**
Cria um backend automático sem precisar de conta externa

**Opção 2 - Supabase Externo:**
Conecta a um projeto Supabase que você já tenha

Qual você prefere?

