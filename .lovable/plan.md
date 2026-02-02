
# Plano: Ícone de Troca de Administrador + Login Simplificado

## O Que Você Quer

Transformar o ícone no canto "Período Ativo" em um botão para trocar de administrador, onde:
- **Admin Chefe (você)**: É o único que precisa de senha para entrar
- **Admin Pleno e Junior**: Podem ser selecionados sem senha (você controla quem pode acessar)

```text
┌─────────────────────────────────────┐
│  🌞 BRONZE PRO                      │
│  Master                             │
│                                     │
│  ○ Agenda                           │
│  ○ Clientes                         │
│  ○ Financeiro                       │
│  ...                                │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 👤 ← Clicável               │   │
│  │ Período Ativo               │   │
│  │ Admin Chefe                 │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘

        ↓ Clica no ícone 👤

┌─────────────────────────────────────┐
│        Trocar Administrador         │
│                                     │
│  ┌────────────────────────────────┐ │
│  │ 👑 Maria (Admin Chefe)     🔒  │ │  ← Precisa senha
│  └────────────────────────────────┘ │
│  ┌────────────────────────────────┐ │
│  │ 👤 Ana (Admin Pleno)           │ │  ← Entra direto
│  └────────────────────────────────┘ │
│  ┌────────────────────────────────┐ │
│  │ 👤 Julia (Admin Junior)        │ │  ← Entra direto
│  └────────────────────────────────┘ │
│                                     │
│  [ Cancelar ]                       │
└─────────────────────────────────────┘

        ↓ Clica em Admin Chefe

┌─────────────────────────────────────┐
│        Olá, Maria!                  │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ Senha: ____________________  │  │
│  │                              │  │
│  │ ☐ Lembrar neste dispositivo  │  │
│  │                              │  │
│  │      [ ENTRAR ]              │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

## Mudanças na Interface

### 1. Ícone Clicável na Sidebar

O ícone ao lado de "Período Ativo" vira um botão que abre o modal de troca:

| Antes | Depois |
|-------|--------|
| Ícone estático | Ícone clicável com hover effect |
| Mostra apenas o role | Abre modal de seleção |

### 2. Modal de Seleção de Admin

- Lista todos os admins cadastrados
- Ícone de cadeado 🔒 apenas no Admin Chefe
- Clique em Admin Pleno/Junior → entra direto
- Clique em Admin Chefe → pede senha

### 3. Persistência Local

Se marcar "Lembrar neste dispositivo", a próxima vez que clicar no Admin Chefe entra direto (senha salva localmente).

---

## Detalhes Técnicos

### Banco de Dados (Supabase)

Criar as seguintes tabelas:

**Tabela: `profiles`**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | ID único |
| name | TEXT | Nome do admin |
| password_hash | TEXT | Senha (apenas Admin Chefe terá) |
| created_at | TIMESTAMP | Data de criação |

**Tabela: `user_roles`**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| user_id | UUID | Referência ao profile |
| role | TEXT | 'admin_chefe', 'admin_pleno', 'admin_junior' |

**Tabela: `admin_permissions`**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| user_id | UUID | Referência ao profile |
| agenda, clientes, etc | BOOLEAN | Permissões granulares |

### Arquivos a Criar

| Arquivo | Descrição |
|---------|-----------|
| `src/contexts/AuthContext.tsx` | Contexto de autenticação global |
| `src/hooks/useAuth.ts` | Hook para acessar admin logado |
| `src/components/layout/AdminSwitchModal.tsx` | Modal de troca de admin |

### Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/components/layout/Sidebar.tsx` | Ícone clicável + integração com modal |
| `src/pages/Index.tsx` | Usar AuthContext para role |
| `src/components/config/AdminSection.tsx` | CRUD de admins via Supabase |
| `src/App.tsx` | Adicionar AuthProvider |

---

## Fluxo de Autenticação

```text
1. Abrir sistema
      ↓
2. Verificar se tem admin salvo localmente
      ↓
   SIM → Carregar permissões → Entrar
      ↓
   NÃO → Mostrar modal de seleção
      ↓
3. Usuário seleciona admin
      ↓
   Admin Chefe? → Pedir senha
      ↓
   Outros? → Entrar direto
      ↓
4. Carregar permissões e entrar
```

---

## Segurança

- Senha do Admin Chefe armazenada com hash seguro no banco
- Armazenamento local usa criptografia básica
- Admin Chefe pode ver/resetar a própria senha nas configurações
- Admin Pleno/Junior não têm acesso à aba Administradores

---

## Ordem de Implementação

1. Criar tabelas no Supabase (profiles, user_roles, admin_permissions)
2. Configurar funções de hash/verificação de senha
3. Criar AuthContext e useAuth hook
4. Criar AdminSwitchModal
5. Modificar Sidebar para ícone clicável
6. Integrar AdminSection com Supabase
7. Criar Admin Chefe inicial (você define a senha)
