
# Plano: Atualizar Ficha de Anamnese com Campos do PDF

## Resumo

O PDF contém uma ficha de anamnese muito mais completa do que a implementação atual. Vou atualizar o sistema para incluir todos os campos do seu formulário físico, mantendo o layout organizado e intuitivo.

---

## Comparação: Campos Atuais vs PDF

| Campo | Atual | PDF | Ação |
|-------|-------|-----|------|
| Tipo de Pele | Fototipo (I-VI) | Normal/Seca/Oleosa/Mista | **Separar em 2 campos** |
| Fototipo | Não existe | I, II, III, IV, V, VI + Bronzeia ao sol? | **Adicionar** |
| Alergias de pele | Texto livre | Sim/Não | **Manter texto** |
| Medicamentos | Texto livre | Sim/Não | **Manter texto** |
| Condições de saúde | Texto livre | Várias perguntas específicas | **Expandir** |
| Bronzeamento anterior | Não existe | Sim/Não | **Adicionar** |
| Tratamento de pele | Não existe | Sim/Não + Qual | **Adicionar** |
| Ferimentos/Tatuagem | Não existe | Sim/Não | **Adicionar** |
| Hematomas | Não existe | Sim/Não | **Adicionar** |
| Transpiração forte | Não existe | Sim/Não | **Adicionar** |
| Depilação | Não existe | Mais de 24h / Menos de 24h / Não | **Adicionar** |
| Gravidez | Não existe | Sim/Não | **Adicionar** |
| Vitiligo/Psoríase/Melasma | Não existe | Sim/Não | **Adicionar** |
| Esfoliação corporal | Não existe | Sim/Não | **Adicionar** |
| Como descobriu | Não existe | Texto livre | **Adicionar** |
| Autorizações | Não existe | Orientações + Publicação fotos | **Adicionar** |
| Observações | Existe | Existe | **Manter** |

---

## O Que Será Feito

### 1. Atualizar Tipos (AnamnesisRecord)
Adicionar novos campos para cobrir todas as perguntas do PDF:
- `skinTexture`: Normal/Seca/Oleosa/Mista
- `phototype`: I a VI + bronzeia ao sol
- `previousTanning`: Já fez bronzeamento antes?
- `skinTreatment`: Tratamento de pele atual
- `openWounds`: Ferimentos/tatuagem não cicatrizada
- `bruises`: Hematomas
- `heavySweating`: Transpiração forte
- `waxing`: Depilação recente (>24h, <24h, não)
- `pregnancy`: Gravidez
- `skinDiseases`: Vitiligo, psoríase, melasma
- `exfoliation`: Esfoliação corporal
- `howDiscovered`: Como descobriu o serviço
- `orientationsAccepted`: Aceitou orientações pré/pós
- `photoAuthorization`: Autorizou publicação de fotos

### 2. Redesenhar Formulário de Anamnese
Organizar em seções visuais:

```
┌─────────────────────────────────────────┐
│ SEÇÃO 1: TIPO DE PELE                   │
├─────────────────────────────────────────┤
│ • Textura: [Normal] [Seca] [Oleosa]     │
│ • Fototipo: [I] [II] [III] [IV] [V] [VI]│
│ • Bronzeia ao sol? [Sim] [Não]          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ SEÇÃO 2: HISTÓRICO DE BRONZEAMENTO      │
├─────────────────────────────────────────┤
│ • Já fez esse tipo de bronze? [Sim][Não]│
│ • Esfoliação corporal? [Sim] [Não]      │
│ • Depilação: [>24h] [<24h] [Não]        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ SEÇÃO 3: CONDIÇÕES DE SAÚDE             │
├─────────────────────────────────────────┤
│ • Tratamento de pele? [Sim] [Não] Qual: │
│ • Alergias de pele? [Sim] [Não] Qual:   │
│ • Ferimentos/tatuagem? [Sim] [Não]      │
│ • Hematomas? [Sim] [Não]                │
│ • Medicação regular? [Sim] [Não] Qual:  │
│ • Transpiração forte? [Sim] [Não]       │
│ • Gravidez? [Sim] [Não]                 │
│ • Vitiligo/Psoríase/Melasma? [Sim][Não] │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ SEÇÃO 4: AUTORIZAÇÕES                   │
├─────────────────────────────────────────┤
│ ☑ Recebi orientações pré e pós bronze   │
│ ☑ Autorizo publicação de fotos          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ SEÇÃO 5: INFORMAÇÕES ADICIONAIS         │
├─────────────────────────────────────────┤
│ • Como descobriu o serviço?             │
│ • Observações gerais                    │
└─────────────────────────────────────────┘
```

### 3. Atualizar Visualização do Histórico
O modal de cliente mostrará os campos expandidos de forma organizada, com indicadores visuais (checkmarks verde/vermelho) para respostas Sim/Não importantes para segurança.

---

## Detalhes Técnicos

### Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `src/types/index.ts` | Expandir interface `AnamnesisRecord` com novos campos |
| `src/components/clients/AnamnesisFormModal.tsx` | Redesenhar formulário com seções e novos campos |
| `src/components/clients/ClientModal.tsx` | Atualizar visualização do histórico expandido |

### Novos Campos na Interface

```typescript
export interface AnamnesisRecord {
  id: string;
  date: string;
  // Tipo de Pele
  skinTexture: 'normal' | 'seca' | 'oleosa' | 'mista' | '';
  phototype: 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | '';
  tansSunExposure: boolean | null;
  // Histórico
  previousTanning: boolean | null;
  exfoliation: boolean | null;
  waxing: 'mais_24h' | 'menos_24h' | 'nao' | '';
  // Condições de Saúde
  skinTreatment: boolean | null;
  skinTreatmentDetails?: string;
  skinAllergies: boolean | null;
  skinAllergiesDetails?: string;
  openWounds: boolean | null;
  bruises: boolean | null;
  medications: boolean | null;
  medicationsDetails?: string;
  heavySweating: boolean | null;
  pregnancy: boolean | null;
  skinDiseases: boolean | null;
  skinDiseasesDetails?: string;
  // Autorizações
  orientationsAccepted: boolean;
  photoAuthorization: boolean;
  // Outros
  howDiscovered?: string;
  observations?: string;
  createdBy?: string;
}
```

---

## Benefícios

1. **Conformidade**: Sistema reflete exatamente a ficha física usada no estabelecimento
2. **Segurança**: Perguntas específicas sobre contraindicações (gravidez, medicação, doenças de pele)
3. **Legal**: Termos de autorização de orientações e uso de imagem
4. **Histórico Completo**: Cada sessão mantém registro detalhado para acompanhamento

---

## Observação

Os dados pessoais do cliente (nome, idade, telefone, CPF, endereço, email, Instagram) já estão no cadastro principal do cliente, não precisam ser duplicados na ficha de anamnese. A ficha focará apenas nas questões de saúde e autorizações.

