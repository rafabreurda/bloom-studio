

# Plano de Implementação: Sistema Completo BRONZE PRO

## Resumo do que será feito

Vou criar todos os módulos que estão faltando no sistema e remover o ícone de administrador conforme solicitado.

---

## 1. Remover Ícone de Administrador

### TopBar (Mobile)
- Remover o ícone `UserCheck` do canto direito da barra superior no mobile
- Substituir por um espaço vazio ou remover completamente o elemento

### RoleSwitcher
- O seletor de "Acesso" no desktop será mantido (é funcional para trocar roles)
- Apenas removeremos o ícone visual do UserCheck

---

## 2. Criar Módulo de Clientes

Nova view completa para gerenciamento de clientes com:
- Lista de clientes com busca
- Indicador VIP (estrela dourada)
- Botões para WhatsApp e edição
- Modal para adicionar novo cliente
- Modal para editar cliente existente
- Informações: nome, telefone, email, aniversário, notas, status VIP

---

## 3. Criar Módulo de Estoque

Nova view para controle de produtos:
- Lista de produtos com quantidade atual
- Alerta visual para estoque baixo (vermelho)
- Preço de venda
- Estoque mínimo configurável
- Modal para adicionar/editar produtos
- Botões de ação rápida (+1 / -1 quantidade)

---

## 4. Criar Módulo de Fornecedores

Nova view para gestão de fornecedores:
- Lista de fornecedores cadastrados
- Contato (telefone/WhatsApp)
- Produtos que fornecem
- Modal para adicionar/editar
- Botão de contato direto via WhatsApp

---

## 5. Criar Módulo de Parcerias

Nova view para gerenciar parcerias comerciais:
- Lista de parceiros
- Percentual de desconto
- Contato
- Modal para adicionar/editar
- Ação de contato via WhatsApp

---

## Arquivos a Criar

```text
src/components/clients/
├── ClientsView.tsx        # View principal de clientes
└── ClientModal.tsx        # Modal para add/edit cliente

src/components/stock/
├── StockView.tsx          # View principal de estoque
└── StockModal.tsx         # Modal para add/edit produto

src/components/suppliers/
├── SuppliersView.tsx      # View principal de fornecedores
└── SupplierModal.tsx      # Modal para add/edit fornecedor

src/components/partnerships/
├── PartnershipsView.tsx   # View principal de parcerias
└── PartnershipModal.tsx   # Modal para add/edit parceria
```

---

## Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/pages/Index.tsx` | Importar novos componentes e adicionar gerenciamento de estado para clients, stock, suppliers, partnerships |
| `src/components/layout/TopBar.tsx` | Remover ícone UserCheck do mobile |

---

## Detalhes Técnicos

### Estrutura de Estado no Index.tsx

```typescript
// Novos states para os módulos
const [clients, setClients] = useState(mockClients);
const [stock, setStock] = useState(mockStock);
const [suppliers, setSuppliers] = useState(mockSuppliers);
const [partnerships, setPartnerships] = useState(mockPartnerships);

// Modals
const [showClientModal, setShowClientModal] = useState(false);
const [showStockModal, setShowStockModal] = useState(false);
const [showSupplierModal, setShowSupplierModal] = useState(false);
const [showPartnershipModal, setShowPartnershipModal] = useState(false);

// Item sendo editado
const [editingClient, setEditingClient] = useState<Client | null>(null);
const [editingStock, setEditingStock] = useState<StockItem | null>(null);
const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
const [editingPartnership, setEditingPartnership] = useState<Partnership | null>(null);
```

### Handlers CRUD para cada módulo

```typescript
// Clientes
const handleAddClient = (client) => {...};
const handleEditClient = (client) => {...};
const handleDeleteClient = (id) => {...};

// Estoque
const handleAddStock = (item) => {...};
const handleEditStock = (item) => {...};
const handleDeleteStock = (id) => {...};
const handleAdjustQuantity = (id, delta) => {...};

// Fornecedores
const handleAddSupplier = (supplier) => {...};
const handleEditSupplier = (supplier) => {...};
const handleDeleteSupplier = (id) => {...};

// Parcerias
const handleAddPartnership = (partnership) => {...};
const handleEditPartnership = (partnership) => {...};
const handleDeletePartnership = (id) => {...};
```

### Design Consistente

Todos os módulos seguirão o padrão visual existente:
- Header com título e botão "gold" para adicionar
- Cards com `BronzeCard` component
- Inputs usando classe `input-bronze`
- Botões usando `BronzeButton`
- Cores: âmbar/dourado como primário, fundo preto

---

## Fluxo de Implementação

1. Remover ícone de admin do TopBar
2. Criar ClientsView e ClientModal
3. Criar StockView e StockModal
4. Criar SuppliersView e SupplierModal
5. Criar PartnershipsView e PartnershipModal
6. Atualizar Index.tsx com todos os novos imports, states e handlers
7. Testar navegação entre todas as abas

