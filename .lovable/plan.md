

# Voltar Tema para Branco

## O que sera feito
Reverter o tema do sistema para o modo claro (fundo branco com texto preto), trocando de `theme-chefe` para `theme-standard` no `ThemeContext.tsx`.

## Detalhes tecnicos

### Arquivo: `src/contexts/ThemeContext.tsx`
- Alterar `themeMode` de `'chefe'` para `'standard'`
- Alterar `isChefe` de `true` para `false`
- Trocar a classe do wrapper de `theme-chefe` para `theme-standard`

Isso desativara as variaveis CSS do `.theme-chefe` e usara as variaveis padrão do `:root`, restaurando:
- Fundo branco
- Texto preto
- Cards claros
- Sidebar clara
- Bordas e inputs no tema claro

