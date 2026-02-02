
# Plano: Histórico de Fichas de Anamnese

## O Que Você Quer

Poder adicionar **múltiplas fichas de anamnese** para cada cliente, criando um histórico de avaliações ao longo do tempo. Isso permite:
- Acompanhar a evolução da saúde do cliente
- Comparar alterações em medicamentos, alergias, etc.
- Ter registro de cada avaliação feita antes das sessões

```text
┌─────────────────────────────────────────────────────┐
│  👤 Maria Silva                                      │
│                                                     │
│  📋 FICHAS DE ANAMNESE (3)                          │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ 📅 15/01/2024 (mais recente)                │   │
│  │ Pele: Tipo II - Clara                       │   │
│  │ Alergias: Nenhuma                           │   │
│  │ Medicamentos: Vitamina D                    │   │
│  │                            [Ver Detalhes]   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ 📅 08/12/2023                               │   │
│  │ Pele: Tipo II - Clara                       │   │
│  │ Alergias: Nenhuma                           │   │
│  │ Medicamentos: Nenhum                        │   │
│  │                            [Ver Detalhes]   │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│           [ + Nova Ficha de Anamnese ]              │
└─────────────────────────────────────────────────────┘
```

---

## Mudanças na Interface

### 1. Modal de Cliente (ClientModal)

A aba "Ficha de Anamnese" terá duas opções:

| Cenário | Comportamento |
|---------|---------------|
| Novo Cliente | Formulário em branco para primeira ficha |
| Cliente Existente | Lista das fichas anteriores + botão "Nova Ficha" |

### 2. Modal de Histórico (ClientHistoryModal)

A seção de anamnese mostrará:
- Accordion/lista expansível com todas as fichas
- Data de cada ficha destacada
- Botão para criar nova ficha diretamente

### 3. Nova Ficha

Ao clicar "Nova Ficha":
- Abre formulário pré-preenchido com dados da última ficha
- Usuário atualiza o que mudou
- Salva como novo registro com data atual

---

## Detalhes Técnicos

### Mudança nas Interfaces (src/types/index.ts)

**Antes:**
```typescript
interface Client {
  anamnesis?: AnamnesisForm;  // Uma única ficha
}
```

**Depois:**
```typescript
interface AnamnesisRecord {
  id: string;
  date: string;               // Data da avaliação
  skinType: string;
  allergies: string;
  medications: string;
  healthConditions: string;
  lastTanning?: string;
  observations: string;
  createdBy?: string;         // Nome do admin que criou
}

interface Client {
  anamnesisHistory: AnamnesisRecord[];  // Histórico de fichas
}
```

### Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/types/index.ts` | Adicionar `AnamnesisRecord` e mudar `anamnesis` para `anamnesisHistory` |
| `src/components/clients/ClientModal.tsx` | Modificar aba anamnese para criar nova ficha e listar anteriores |
| `src/components/clients/ClientHistoryModal.tsx` | Mostrar todas as fichas com accordion expansível |
| `src/data/mockData.ts` | Atualizar mock clients com array de anamneses |

### Novo Componente (Opcional)

| Arquivo | Descrição |
|---------|-----------|
| `src/components/clients/AnamnesisFormModal.tsx` | Modal separado para criar/editar ficha de anamnese |

---

## Fluxo de Uso

```text
1. Abrir ficha do cliente
       ↓
2. Ver histórico de anamneses (lista com datas)
       ↓
3. Clicar "Nova Ficha"
       ↓
4. Formulário abre pré-preenchido com última ficha
       ↓
5. Atualizar campos necessários
       ↓
6. Salvar → nova ficha adicionada ao histórico
```

---

## Visualização no Histórico do Cliente

A seção "Ficha de Anamnese" será transformada em "Histórico de Anamnese":

- Cada ficha aparece como um item com data
- Clicando expande para ver detalhes completos
- Ficha mais recente aparece aberta por padrão
- Badge indica quantas fichas existem

---

## Ordem de Implementação

1. Atualizar tipos em `src/types/index.ts` (adicionar `AnamnesisRecord`, mudar `Client`)
2. Atualizar dados de exemplo em `src/data/mockData.ts`
3. Criar componente `AnamnesisFormModal.tsx` para formulário isolado
4. Modificar `ClientModal.tsx` para gerenciar múltiplas fichas
5. Modificar `ClientHistoryModal.tsx` com accordion de fichas
6. Atualizar `ClientsView.tsx` para trabalhar com o novo formato
