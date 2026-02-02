
# Plano: Melhorias na Agenda, Bloqueios e Acesso ao Cliente

## Problemas Identificados

1. **Agenda** - Os botões de "Semana" e "Mês" estão funcionando visualmente, mas a view continua mostrando apenas o modo "Dia" (não há implementação real para week/month)
2. **Bloqueios** - Atualmente só permite bloquear um único dia ou horário, sem opção de intervalo de datas (ex: dia 02 a dia 10)
3. **Clique no Nome do Cliente na Agenda** - Não existe interação ao clicar no nome do cliente no TimeSlot - precisa abrir o histórico completo

---

## 1. Implementar Visualizações de Semana e Mês na Agenda

### AgendaView.tsx
Criar renderização condicional baseada no `viewMode`:

**Modo Dia (atual):** Lista de horários 08:00-22:00 para um único dia

**Modo Semana:** 
- Grid de 7 colunas (Dom-Sáb)
- Header com os 7 dias da semana selecionada
- Células mostrando resumo de agendamentos por dia
- Navegação anterior/próxima semana

**Modo Mês:**
- Calendário visual com todos os dias do mês
- Indicadores visuais de dias com agendamentos
- Navegação anterior/próximo mês

### AgendaHeader.tsx
- Ajustar navegação para respeitar o modo de visualização:
  - Dia: -1/+1 dia
  - Semana: -7/+7 dias
  - Mês: -1/+1 mês

### Novos Componentes
- `AgendaWeekView.tsx` - Grid semanal com resumo
- `AgendaMonthView.tsx` - Calendário mensal

---

## 2. Bloqueios com Intervalo de Datas

### BlockModal.tsx
Adicionar terceira opção de tipo de bloqueio:

```text
┌─────────────┬─────────────┬─────────────┐
│ Dia Inteiro │    Hora     │  Período    │
└─────────────┴─────────────┴─────────────┘
```

**Tipo "Período":**
- Campo "Data Inicial" (date picker)
- Campo "Data Final" (date picker)
- Campo "Motivo"

### Lógica de Criação
Quando tipo = 'dateRange':
- Gerar múltiplos blocos (um para cada dia do intervalo)
- Ou criar um único bloco com `startDate` e `endDate`

### Block Type (types/index.ts)
```typescript
interface Block {
  id: string;
  date: string;
  endDate?: string;        // NOVO - para intervalos
  time: string | null;
  type: 'allDay' | 'timeRange' | 'dateRange';  // NOVO tipo
  reason: string;
  createdAt: Date;
}
```

### Verificação na Agenda
Atualizar lógica de verificação de bloqueio para considerar intervalos de data.

---

## 3. Clique no Nome do Cliente na Agenda

### TimeSlot.tsx
Adicionar interação ao clicar no nome do cliente:

```typescript
interface TimeSlotProps {
  // ... props existentes
  onClientClick?: (clientName: string, phone: string) => void;  // NOVO
}
```

No componente, tornar o nome clicável:
```tsx
<button 
  onClick={() => onClientClick?.(appointment.clientName, appointment.phone)}
  className="font-black text-gray-900 text-sm hover:underline cursor-pointer"
>
  {appointment.clientName}
</button>
```

### AgendaView.tsx
- Receber lista de `clients` como prop
- Buscar cliente pelo nome/telefone
- Abrir `ClientHistoryModal` com os dados completos

### Index.tsx
- Passar `clients` para AgendaView
- Criar estado para controlar modal de histórico do cliente
- Adicionar `ClientHistoryModal` na renderização

### ClientHistoryModal.tsx
Já existe e mostra:
- Dados cadastrais (nome, telefone, email, endereço, CPF, aniversário)
- Ficha de anamnese completa
- Tags do cliente
- Histórico de sessões e compras com datas e valores
- Observações

---

## Arquivos a Criar

| Arquivo | Descrição |
|---------|-----------|
| `src/components/agenda/AgendaWeekView.tsx` | Visualização semanal com grid de 7 dias |
| `src/components/agenda/AgendaMonthView.tsx` | Visualização mensal com calendário |

---

## Arquivos a Modificar

| Arquivo | Alterações |
|---------|------------|
| `src/types/index.ts` | Adicionar `endDate` e tipo `dateRange` ao Block |
| `src/components/agenda/AgendaView.tsx` | Renderização condicional por viewMode, receber clients, callback para cliente |
| `src/components/agenda/AgendaHeader.tsx` | Ajustar navegação por semana/mês |
| `src/components/agenda/TimeSlot.tsx` | Tornar nome do cliente clicável |
| `src/components/modals/BlockModal.tsx` | Adicionar opção de período (dateRange) |
| `src/pages/Index.tsx` | Passar clients para AgendaView, gerenciar modal de histórico |

---

## Detalhes Técnicos

### Cálculo de Semana
```typescript
const getWeekDays = (date: Date) => {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay()); // Início da semana (Domingo)
  
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    return day;
  });
};
```

### Verificação de Bloqueio com Intervalo
```typescript
const isBlocked = (date: string, blocks: Block[]) => {
  return blocks.some(block => {
    if (block.type === 'dateRange' && block.endDate) {
      const checkDate = new Date(date.split('/').reverse().join('-'));
      const start = new Date(block.date.split('/').reverse().join('-'));
      const end = new Date(block.endDate.split('/').reverse().join('-'));
      return checkDate >= start && checkDate <= end;
    }
    return block.date === date;
  });
};
```

### Busca de Cliente pelo Agendamento
```typescript
const findClientByAppointment = (appointment: Appointment, clients: Client[]) => {
  // Buscar por telefone (mais preciso)
  return clients.find(c => c.phone === appointment.phone) 
    // Fallback por nome
    || clients.find(c => c.name.toLowerCase() === appointment.clientName.toLowerCase());
};
```

---

## Fluxo de Implementação

1. Atualizar tipos (Block com dateRange)
2. Modificar BlockModal para suportar intervalo de datas
3. Criar AgendaWeekView
4. Criar AgendaMonthView
5. Atualizar AgendaView com renderização condicional
6. Atualizar AgendaHeader com navegação correta
7. Tornar nome do cliente clicável no TimeSlot
8. Conectar tudo no Index.tsx
