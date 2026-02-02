

# Plano Completo: BRONZE PRO - Sistema de Gestão Completo

## Resumo Executivo

Este plano aborda todas as funcionalidades solicitadas para transformar o sistema BRONZE PRO em uma plataforma completa de gestão para estúdios de bronzeamento.

---

## 1. Remoção do Seletor de Administrador (Desktop)

### Problema Atual
O componente `RoleSwitcher` ainda está visível no canto superior direito da tela desktop, mostrando "Acesso: Chefe/Pleno/Junior".

### Solução
Remover completamente o componente `RoleSwitcher` de `Index.tsx` - o controle de roles será feito exclusivamente nas Configurações pelo Admin Chefe.

### Arquivos Afetados
- `src/pages/Index.tsx` - Remover importação e uso do RoleSwitcher
- `src/components/layout/RoleSwitcher.tsx` - Pode ser deletado ou mantido para uso futuro

---

## 2. Configurações Completas (Admin Chefe)

### Estrutura Reorganizada em Seções

```text
CONFIGURAÇÕES
├── Estúdio
│   ├── Nome do Estúdio
│   ├── Logo (upload)
│   └── Foto de Fundo
│
├── Pagamentos
│   ├── Chave PIX
│   └── Link Mercado Pago/PagSeguro
│
├── Administradores
│   ├── Admin Pleno (lista)
│   └── Admin Junior (lista com checkboxes de permissões)
│
├── Tags de Clientes
│   ├── VIP
│   ├── Inadimplente
│   ├── Influencer
│   ├── Fidelidade
│   └── Primeira Vez
│
├── Alertas
│   └── Limite de estoque baixo (padrão: 5)
│
└── Backup
    └── Botão "Exportar JSON"
```

### Sistema de Permissões Multinível

**Admin Chefe:** Acesso total + gerencia todos os administradores

**Admin Pleno:** Mesmos acessos (agenda, clientes, financeiro, estoque, fornecedores, parcerias, configurações básicas)

**Admin Junior:** Permissões customizáveis via checkboxes:
- [ ] Agenda
- [ ] Clientes  
- [ ] Estoque
- [ ] Lista de Espera
- [ ] Financeiro (visualização)
- [ ] Fornecedores
- [ ] Parcerias

### Tipos Atualizados

```typescript
interface AdminJuniorPermissions {
  agenda: boolean;
  clientes: boolean;
  estoque: boolean;
  listaEspera: boolean;
  financeiro: boolean;
  fornecedores: boolean;
  parcerias: boolean;
}

interface AdminUser {
  id: string;
  name: string;
  role: 'Admin Pleno' | 'Admin Junior';
  permissions?: AdminJuniorPermissions; // Apenas para Junior
}

interface ClientTag {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
}

interface SystemConfig {
  name: string;
  logo?: string;
  backgroundPhoto?: string;
  pixKey: string;
  payLink: string;
  lowStockThreshold: number;
  admins: AdminUser[];
  clientTags: ClientTag[];
}
```

### Arquivos a Criar/Modificar
- `src/components/config/ConfigView.tsx` - Reescrever completamente
- `src/components/config/AdminSection.tsx` - Novo componente
- `src/components/config/TagsSection.tsx` - Novo componente
- `src/types/index.ts` - Atualizar tipos

---

## 3. Financeiro Completo

### Cards de Resumo
```text
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   RECEITA    │ │    CARTÃO    │ │     PIX      │ │   DINHEIRO   │ │  PARCERIAS   │
│  R$ 5.500    │ │  R$ 1.200    │ │  R$ 3.800    │ │   R$ 500     │ │   R$ 450     │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

### Relatório PDF Mensal

**Interface de Geração:**
- Seletor de mês/ano
- Checkboxes para incluir/excluir:
  - [x] Sessões de Bronzeamento
  - [x] Venda de Produtos
  - [ ] Parcerias (desmarcado por padrão)
  - [x] Despesas
- Botão "Gerar PDF"

**Lógica de Relatório:**
```typescript
interface ReportConfig {
  month: number;
  year: number;
  includeSessions: boolean;
  includeProducts: boolean;
  includePartnerships: boolean;
  includeExpenses: boolean;
}
```

### Gráficos (já implementados, apenas verificar)
- Linha: Evolução 6 meses
- Pizza: Pix vs Cartão vs Dinheiro  
- Barras: Sessões vs Produtos

### Arquivos a Modificar
- `src/components/finance/FinanceView.tsx` - Adicionar cards e relatório
- `src/components/finance/ReportModal.tsx` - Novo modal para relatório
- `src/types/index.ts` - Adicionar Finance com campo 'isPartnership'

---

## 4. Clientes Completo

### Campos Expandidos
```typescript
interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;           // NOVO
  birthday?: string;
  cpf?: string;               // NOVO
  anamnesis?: AnamnesisForm;  // NOVO
  notes?: string;
  tags: string[];             // NOVO - Array de tag IDs
  isVIP: boolean;
  history: ClientHistoryItem[]; // NOVO
  createdAt: Date;
}

interface AnamnesisForm {
  skinType: string;
  allergies: string;
  medications: string;
  healthConditions: string;
  lastTanning?: string;
  observations: string;
}

interface ClientHistoryItem {
  id: string;
  date: string;
  type: 'session' | 'purchase';
  description: string;
  value: number;
}
```

### Modal de Histórico
Ao clicar no nome do cliente, abre modal com:
- Dados cadastrais
- Ficha de anamnese
- Histórico de sessões e compras

### Arquivos a Criar/Modificar
- `src/components/clients/ClientModal.tsx` - Expandir campos
- `src/components/clients/ClientHistoryModal.tsx` - Novo componente
- `src/components/clients/AnamnesisForm.tsx` - Novo componente
- `src/types/index.ts` - Atualizar tipos

---

## 5. Agenda com Cores e Cálculo Dinâmico

### Classificação por Cor
```typescript
const statusColors = {
  'Agendado': 'border-l-emerald-500',      // Verde
  'Aguardando Sinal': 'border-l-amber-400', // Amarelo
  'VIP': 'border-l-primary',                // Dourado (já existe)
  'Confirmado': 'bg-emerald-50',            // Fundo verde claro
};
```

### Cálculo na Hora (já implementado)
O `AddAppointmentModal` já calcula sessão + produtos em tempo real.
Apenas garantir que o total atualiza visualmente.

### Arquivos a Verificar/Ajustar
- `src/components/agenda/TimeSlot.tsx` - Ajustar cores
- `src/components/modals/AddAppointmentModal.tsx` - Verificar cálculo

---

## 6. Mensagens WhatsApp Integradas

### Templates de Mensagem
```typescript
interface WhatsAppTemplate {
  id: string;
  name: string;
  content: string;
  includePixKey: boolean;
}

const defaultTemplates: WhatsAppTemplate[] = [
  {
    id: 'confirmacao',
    name: 'Confirmação 24h',
    content: 'Olá {nome}! Confirmando seu bronzeamento amanhã às {hora}. Responda SIM para confirmar! 🌞',
    includePixKey: false,
  },
  {
    id: 'sinal',
    name: 'Aguardando Sinal',
    content: 'Olá {nome}! Para confirmar seu horário, envie o sinal de R$ {valor}.\n\n💰 Chave PIX: {pix}',
    includePixKey: true,
  },
  {
    id: 'lembrete',
    name: 'Lembrete',
    content: 'Olá {nome}! Lembrete do seu bronze hoje às {hora}. Te esperamos! ✨',
    includePixKey: false,
  },
];
```

### Arquivos a Criar
- `src/components/config/MessagesSection.tsx` - Edição de templates
- `src/utils/whatsapp.ts` - Funções de formatação

---

## 7. Arquivos a Criar

| Arquivo | Descrição |
|---------|-----------|
| `src/components/config/ConfigView.tsx` | Reescrever completo |
| `src/components/config/AdminSection.tsx` | Gestão de admins |
| `src/components/config/TagsSection.tsx` | Gestão de tags |
| `src/components/config/MessagesSection.tsx` | Templates WhatsApp |
| `src/components/config/BackupSection.tsx` | Exportar JSON |
| `src/components/finance/ReportModal.tsx` | Geração de relatório |
| `src/components/finance/FinanceSummaryCards.tsx` | Cards de resumo |
| `src/components/clients/ClientHistoryModal.tsx` | Histórico do cliente |
| `src/components/clients/AnamnesisForm.tsx` | Ficha de anamnese |
| `src/utils/whatsapp.ts` | Utilitários WhatsApp |
| `src/utils/pdf.ts` | Geração de PDF |

---

## 8. Arquivos a Modificar

| Arquivo | Alterações |
|---------|------------|
| `src/pages/Index.tsx` | Remover RoleSwitcher, adicionar lógica de permissões dinâmicas |
| `src/types/index.ts` | Expandir todos os tipos conforme documentado |
| `src/data/mockData.ts` | Atualizar dados mock com novos campos |
| `src/components/layout/Sidebar.tsx` | Ocultar tabs baseado em permissões dinâmicas |
| `src/components/finance/FinanceView.tsx` | Adicionar cards e modal de relatório |
| `src/components/clients/ClientModal.tsx` | Adicionar campos CPF, endereço, anamnese |
| `src/components/clients/ClientsView.tsx` | Adicionar clique para histórico |
| `src/components/agenda/TimeSlot.tsx` | Melhorar classificação por cor |

---

## Ordem de Implementação

1. **Remover RoleSwitcher** (1 arquivo)
2. **Atualizar Types** (base para tudo)
3. **Configurações Completas** (5 componentes)
4. **Financeiro** (3 componentes)
5. **Clientes** (3 componentes)
6. **Ajustes na Agenda** (2 componentes)
7. **Testes e Verificação**

---

## Observações Técnicas

- **PDF:** Usaremos a Web API de impressão (`window.print()`) com CSS específico para gerar PDF, ou podemos integrar uma biblioteca como `jspdf` futuramente
- **Upload de Logo:** Por enquanto será armazenado como Base64 no estado local
- **Backup JSON:** Exportará todos os dados do estado para download
- **Permissões:** Serão verificadas no Sidebar e ao acessar cada view

