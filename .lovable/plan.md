
# Plano: Busca de Clientes no Agendamento

## O Que Você Quer

1. No modal de **Novo Bronze** (agendamento), poder buscar e selecionar um cliente já cadastrado em **Clientes** ou **Parcerias**
2. Manter o visual da **Agenda com fundo branco e letras pretas** (que já existe no CSS)

---

## Situação Atual

O modal `AddAppointmentModal` atualmente tem apenas campos de texto livre para "Nome" e "WhatsApp", sem conexão com os clientes cadastrados.

A agenda já possui variáveis CSS para tema branco:
```css
--agenda-background: 0 0% 100%;    /* Branco */
--agenda-foreground: 0 0% 10%;     /* Preto */
```

---

## Mudanças Planejadas

### 1. AddAppointmentModal - Busca de Clientes

Substituir o campo de texto "Nome" por um **Combobox de busca** que permite:
- Digitar para buscar clientes cadastrados
- Ver resultados separados por categoria: **Clientes** e **Parcerias**
- Selecionar um cliente existente (preenche nome e telefone automaticamente)
- OU digitar um nome novo (cliente avulso)

```text
┌─────────────────────────────────────────────────────┐
│  NOVO BRONZE                                    [X] │
├─────────────────────────────────────────────────────┤
│                                                     │
│  🔍 [ Buscar cliente...              ▼ ]            │
│  ┌─────────────────────────────────────────────┐   │
│  │ CLIENTES                                    │   │
│  │ ○ Maria Silva - (11) 99999-1111      ⭐ VIP │   │
│  │ ○ Ana Costa - (11) 98877-6655              │   │
│  │ ○ Julia Santos - (11) 97766-5544           │   │
│  │                                             │   │
│  │ PARCERIAS                                   │   │
│  │ ○ Salão Bella Hair - (11) 94567-8901       │   │
│  │ ○ Gym Fitness Center - (11) 95678-9012     │   │
│  │                                             │   │
│  │ ─────────────────────────────────────────  │   │
│  │ ➕ Usar "Maria" como cliente avulso        │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  📱 [ (11) 99999-1111              ]  ← Preenchido │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 2. Props do Modal

O modal precisará receber:
- `clients: Client[]` - Lista de clientes cadastrados
- `partnerships: Partnership[]` - Lista de parcerias

### 3. Comportamento ao Selecionar

| Ação | Resultado |
|------|-----------|
| Seleciona cliente | Nome e telefone preenchidos automaticamente, marca VIP se aplicável |
| Seleciona parceria | Nome e telefone da parceria preenchidos |
| Digita nome novo | Campo telefone fica editável para informar |

---

## Detalhes Técnicos

### Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/components/modals/AddAppointmentModal.tsx` | Adicionar combobox de busca com clientes e parcerias, receber novas props |
| `src/pages/Index.tsx` | Passar `clients` e `partnerships` para o modal |

### Componentes Utilizados

O projeto já possui os componentes necessários:
- `Command` (cmdk) - Para busca com filtro
- `Popover` - Para dropdown
- Ícones do Lucide: `Search`, `User`, `Users`, `Star`

### Estrutura do Combobox

```typescript
// Estado
const [open, setOpen] = useState(false);
const [searchValue, setSearchValue] = useState('');
const [selectedClient, setSelectedClient] = useState<Client | null>(null);
const [selectedPartnership, setSelectedPartnership] = useState<Partnership | null>(null);

// Ao selecionar cliente
const handleSelectClient = (client: Client) => {
  setSelectedClient(client);
  setClientName(client.name);
  setClientPhone(client.phone);
  setIsVIP(client.isVIP);
  setOpen(false);
};

// Ao selecionar parceria
const handleSelectPartnership = (partnership: Partnership) => {
  setSelectedPartnership(partnership);
  setClientName(partnership.name);
  setClientPhone(partnership.contact);
  setOpen(false);
};
```

---

## Sobre o Tema Branco da Agenda

O CSS já define o tema branco para a agenda através das classes:
- `.agenda-container` - Container principal
- `.agenda-card` - Cards internos
- `.agenda-slot` - Slots de horário

Essas classes já aplicam:
- Fundo branco (`--agenda-background`)
- Texto preto (`--agenda-foreground`)
- Bordas cinza claro (`--agenda-border`)

Se algo não estiver aparecendo branco, verificarei se as classes corretas estão aplicadas nos componentes.

---

## Ordem de Implementação

1. Modificar `AddAppointmentModal.tsx`:
   - Adicionar novas props (clients, partnerships)
   - Criar estado para busca e seleção
   - Implementar Combobox com Command + Popover
   - Grupos separados para Clientes e Parcerias
   - Auto-preenchimento ao selecionar

2. Atualizar `Index.tsx`:
   - Passar clients e partnerships para o modal

3. Verificar tema branco da agenda:
   - Confirmar que classes agenda-* estão aplicadas corretamente
