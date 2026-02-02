

# Plano: Sistema de Seleção de Admin com Senha Persistente

## Resumo do Funcionamento

### Como Vai Funcionar na Prática

1. **Ao abrir o sistema**: Aparece uma tela perguntando "Quem está entrando?" com uma lista de admins cadastrados
2. **Primeiro acesso de cada admin**: Digita a senha uma única vez
3. **Próximos acessos**: O sistema já lembra a senha (salva localmente no dispositivo)
4. **Admin Chefe**: Pode ver/editar todas as senhas na aba "Administradores" das configurações

```text
┌──────────────────────────────────────────────────────────────┐
│                    🌞 BRONZE PRO                              │
│                                                               │
│                   Quem está entrando?                         │
│                                                               │
│    ┌─────────────────────────────────────────────────┐       │
│    │  👑  Maria (Admin Chefe)                        │       │
│    └─────────────────────────────────────────────────┘       │
│    ┌─────────────────────────────────────────────────┐       │
│    │  👤  Ana (Admin Pleno)                          │       │
│    └─────────────────────────────────────────────────┘       │
│    ┌─────────────────────────────────────────────────┐       │
│    │  👤  Julia (Admin Junior)                       │       │
│    └─────────────────────────────────────────────────┘       │
│                                                               │
└──────────────────────────────────────────────────────────────┘

        ↓ Clica em um admin

┌──────────────────────────────────────────────────────────────┐
│                    🌞 BRONZE PRO                              │
│                                                               │
│                   Olá, Maria!                                 │
│                                                               │
│    ┌───────────────────────────────────────┐                 │
│    │  Senha: ___________________________  │                 │
│    │                                       │                 │
│    │  ☐ Lembrar neste dispositivo         │                 │
│    │                                       │                 │
│    │         [  ENTRAR  ]                 │                 │
│    └───────────────────────────────────────┘                 │
│                                                               │
└──────────────────────────────────────────────────────────────┘

        ↓ Senha correta + "Lembrar" marcado = Próxima vez entra direto
```

---

## O Que Será Criado

### 1. Tela de Seleção de Admin (`AdminLoginPage.tsx`)

- Lista todos os admins cadastrados (cards clicáveis)
- Ao clicar, pede a senha
- Opção "Lembrar neste dispositivo" salva a senha localmente
- Se já tem senha salva, entra automaticamente

### 2. Banco de Dados (Supabase)

**Tabela: `profiles`**
| Campo | Descrição |
|-------|-----------|
| id | ID único |
| name | Nome do admin |
| password_hash | Senha criptografada |
| role | 'admin_chefe', 'admin_pleno' ou 'admin_junior' |
| created_at | Data de criação |

**Tabela: `user_roles`** (segurança)
| Campo | Descrição |
|-------|-----------|
| user_id | Referência ao profile |
| role | Tipo de admin |

**Tabela: `admin_permissions`**
| Campo | Descrição |
|-------|-----------|
| user_id | Referência ao profile |
| agenda | Acesso à agenda |
| clientes | Acesso a clientes |
| financeiro | Acesso ao financeiro |
| estoque | Acesso ao estoque |
| fornecedores | Acesso a fornecedores |
| parcerias | Acesso a parcerias |
| lista_espera | Acesso à lista de espera |

### 3. Modificações na Aba Administradores

O Admin Chefe verá:
- Lista de todos os admins
- **Campo de senha visível** para cada admin
- Botão para redefinir senha
- Permissões customizáveis para cada Junior

### 4. Bloqueios na Agenda

O sistema **já suporta** bloqueio de múltiplos dias através da opção "Período" no modal de bloqueio. Você pode:
- Selecionar data inicial e data final
- Todos os dias no intervalo serão bloqueados

---

## Detalhes Técnicos

### Armazenamento de Senha Local

Para que o admin não precise digitar a senha toda vez:

```typescript
// Ao marcar "Lembrar neste dispositivo"
localStorage.setItem(`admin_${adminId}_auth`, encryptedPassword);

// Ao abrir o sistema
const savedAuth = localStorage.getItem(`admin_${adminId}_auth`);
if (savedAuth && validateAuth(savedAuth)) {
  // Entra automaticamente
}
```

### Segurança das Senhas no Banco

As senhas são armazenadas com hash seguro usando função do Supabase:

```sql
-- Função para hash de senha
CREATE OR REPLACE FUNCTION hash_password(password TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN crypt(password, gen_salt('bf'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para verificar senha
CREATE OR REPLACE FUNCTION verify_password(password TEXT, hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN hash = crypt(password, hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Verificação de Role (Evita Escalação de Privilégios)

```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$ LANGUAGE SQL SECURITY DEFINER;
```

### Fluxo de Autenticação

```text
1. Abrir App
      ↓
2. Verificar se tem sessão salva localmente
      ↓
   SIM → Validar com banco → Entrar
      ↓
   NÃO → Mostrar lista de admins
      ↓
3. Usuário clica em admin
      ↓
4. Pedir senha
      ↓
5. Validar com banco
      ↓
6. Se "Lembrar" → Salvar localmente
      ↓
7. Carregar permissões e entrar
```

---

## Arquivos a Criar

| Arquivo | Descrição |
|---------|-----------|
| `src/pages/AdminLoginPage.tsx` | Tela de seleção e login de admin |
| `src/contexts/AuthContext.tsx` | Contexto global de autenticação |
| `src/hooks/useAuth.ts` | Hook para acessar dados do admin logado |
| `src/hooks/usePermissions.ts` | Hook para verificar permissões |

---

## Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/App.tsx` | Adicionar rota de login e proteção |
| `src/pages/Index.tsx` | Verificar autenticação antes de mostrar |
| `src/components/layout/Sidebar.tsx` | Mostrar menu baseado nas permissões reais |
| `src/components/layout/TopBar.tsx` | Adicionar nome do admin e botão sair |
| `src/components/config/AdminSection.tsx` | Campo de senha visível + CRUD com Supabase |
| `src/components/config/ConfigView.tsx` | Esconder aba Administradores para não-chefes |

---

## Ordem de Implementação

1. Criar tabelas no Supabase (profiles, user_roles, admin_permissions)
2. Configurar funções de hash/verificação de senha
3. Configurar RLS (segurança)
4. Criar contexto de autenticação
5. Criar página de login/seleção de admin
6. Modificar AdminSection para mostrar/editar senhas
7. Integrar permissões na Sidebar
8. Adicionar botão de logout e nome no TopBar
9. Criar Admin Chefe inicial (você!)

---

## Cadastro Inicial

Ao implementar, criarei o primeiro Admin Chefe para você poder entrar:

- **Nome**: Admin Chefe
- **Senha**: Você definirá na primeira execução
- **Role**: admin_chefe (acesso total)

