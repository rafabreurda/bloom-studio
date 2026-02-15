
# Mudar Tela para Preto

## O que sera feito
Ativar o tema escuro (preto com dourado) que ja esta definido no sistema, trocando a classe `theme-standard` para `theme-chefe` no `ThemeContext.tsx`.

## Detalhes tecnicos

### Arquivo: `src/contexts/ThemeContext.tsx`
- Alterar `themeMode` de `'standard'` para `'chefe'`
- Alterar `isChefe` de `false` para `true`
- Trocar a classe do wrapper de `theme-standard` para `theme-chefe`

Isso ativara todas as variaveis CSS ja definidas em `index.css` sob `.theme-chefe`, incluindo:
- Fundo preto
- Texto dourado
- Cards escuros
- Sidebar escura com dourado
- Bordas e inputs no tema dark/gold
