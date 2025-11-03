## 🙋‍♂️ Autor

<div align="center">
  <img src="https://avatars.githubusercontent.com/ninomiquelino" width="100" height="100" style="border-radius: 50%">
  <br>
  <strong>Onivaldo Miquelino</strong>
  <br>
  <a href="https://github.com/ninomiquelino">@ninomiquelino</a>
  <br><br>
  <span>Desenvolvido com foco na experiência do usuário brasileiro.</span>
</div>

---

# 📅 Smart Date Picker

![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Responsive](https://img.shields.io/badge/Design-Responsive-FF6B6B.svg?style=for-the-badge)
![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-27AE60.svg?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)
![Version 1.0.0](https://img.shields.io/badge/Version-1.0.0-blue)
![GitHub stars](https://img.shields.io/github/stars/NinoMiquelino/smart-date-picker?style=social)
![GitHub forks](https://img.shields.io/github/forks/NinoMiquelino/smart-date-picker?style=social)
![GitHub issues](https://img.shields.io/github/issues/NinoMiquelino/smart-date-picker)

Um componente de data inteligente que resolve o problema comum de selecionar datas antigas (como nascimento) sem precisar scrollar infinitamente. Oferece duas formas de entrada: digitação rápida com validação ou seleção visual otimizada.

## ✨ Por que este componente é diferente?

### 🎯 **Problema Resolvido**
Selecionar datas antigas em date pickers tradicionais é frustrante:
- Scroll infinito para voltar aos anos
- Navegação lenta e ineficiente
- UX pobre para datas como nascimento

### 💡 **Solução Inteligente**
- **Fluxo otimizado**: Começa pela seleção do ano
- **Digitação rápida**: Formato DD/MM/AAAA com validação em tempo real
- **Validação rigorosa**: Dias do mês, anos bissextos, limites personalizáveis
- **100% em português**: Desenvolvido para o usuário brasileiro

## 🚀 Funcionalidades

### ⌨️ **Duas Formas de Entrada**
1. **Digitação Rápida**
   - Formato DD/MM/AAAA com validação em tempo real
   - Formatação automática
   - Backspace livre sem travar nas barras
   - Validação rigorosa de dias/meses/anos

2. **Seleção Visual Otimizada**
   - Fluxo inteligente: Ano → Mês → Dia
   - Navegação rápida por blocos de anos
   - Visualização clara dos meses em português
   - Destaque para data atual e selecionada

### 🛡️ **Validações Avançadas**
- **Dias do mês**: Respeita fevereiro/anos bissextos
- **Meses válidos**: 01-12
- **Anos válidos**: 1900-2100
- **Limites personalizáveis**: Datas mínima/máxima
- **Formato correto**: DD/MM/AAAA obrigatório

### 📱 **UX Melhorada**
- **Feedback visual**: Erros claros e específicos
- **Navegação por teclado**: Setas, Enter, Escape
- **Design responsivo**: Mobile-first
- **Dark mode**: Suporte nativo
- **Acessibilidade**: ARIA labels e screen reader friendly

## 🎯 Casos de Uso Ideais

### 👶 **Data de Nascimento**
```javascript
const birthDatePicker = new SmartDatePicker({
    container: '#birthDate',
    placeholder: 'DD/MM/AAAA',
    minDate: new Date(1900, 0, 1),
    maxDate: new Date(),
    onSelect: (date) => {
        console.log('Data de nascimento:', date);
    }
});

```

📅 Datas com Restrições

```javascript
// Data futura (mínimo hoje)
const futureDatePicker = new SmartDatePicker({
    container: '#futureDate',
    minDate: new Date()
});

// Data passada (máximo hoje)
const pastDatePicker = new SmartDatePicker({
    container: '#pastDate', 
    maxDate: new Date()
});
```

🏢 Formulários Corporativos

```javascript
// Período específico
const contractDatePicker = new SmartDatePicker({
    container: '#contractDate',
    minDate: new Date(2020, 0, 1),
    maxDate: new Date(2030, 11, 31),
    placeholder: 'Data do contrato...'
});
```

🛠️ Instalação e Uso

Método 1: Uso Imediato (Recomendado)

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meu Projeto</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div id="myDatePicker"></div>

    <script>
        // Cole aqui a classe SmartDatePicker completa
        
        // Inicialize o componente
        const datePicker = new SmartDatePicker({
            container: '#myDatePicker',
            placeholder: 'DD/MM/AAAA',
            onSelect: (date) => {
                console.log('Data selecionada:', date);
            }
        });
    </script>
</body>
</html>
```

Método 2: Como Módulo

```javascript
// smart-date-picker.js
class SmartDatePicker {
    // ... código completo da classe
}

// Uso em sua aplicação
const picker = new SmartDatePicker({
    container: '#dateField',
    // ... configurações
});
```

⚙️ Configuração

Opções do Construtor

```javascript
const config = {
    // Obrigatório: Onde o componente será renderizado
    container: '#elemento', // Seletor CSS ou elemento DOM
    
    // Opcional: Valor inicial
    value: new Date('1990-08-15'), // Data JavaScript
    
    // Opcional: Placeholder do input
    placeholder: 'DD/MM/AAAA',
    
    // Opcional: Restrições de data
    minDate: new Date(1900, 0, 1), // Data mínima
    maxDate: new Date(2100, 11, 31), // Data máxima
    
    // Opcional: Estado inicial
    disabled: false,
    
    // Opcional: Callback quando a data é selecionada
    onSelect: (date) => {
        // date é um objeto Date ou null se limpar
        console.log('Data selecionada:', date);
    }
};
```

🎯 API Pública

Métodos Disponíveis

```javascript
const picker = new SmartDatePicker(config);

// Obter data selecionada
const selectedDate = picker.getValue();
// Retorno: Date object ou null

// Definir data programaticamente
picker.setValue(new Date('2024-01-15'));

// Limpar seleção
picker.clear();

// Habilitar/Desabilitar
picker.enable();
picker.disable();

// Obter elemento input
const inputElement = picker.elements.input;
```

Eventos

```javascript
// onSelect - disparado quando a data muda
onSelect: (date) => {
    if (date) {
        console.log('Nova data:', date.toLocaleDateString('pt-BR'));
    } else {
        console.log('Data limpa');
    }
}
```

🎨 Personalização

Cores e Estilos

O componente usa Tailwind CSS e pode ser customizado:

```css
/* Customizar cores principais */
.date-input {
    border-color: #3B82F6; /* Azul personalizado */
}

.picker-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.option-selected {
    background-color: #10B981; /* Verde ao invés de azul */
}
```

Modo Escuro

Funciona automaticamente com as classes dark do Tailwind:

```html
<body class="dark:bg-gray-900">
    <!-- O componente se adapta automaticamente -->
</body>
```

🧪 Validações Implementadas

✅ Validações de Formato

· Padrão DD/MM/AAAA exato
· Apenas números e barras
· Comprimento correto (10 caracteres)

✅ Validações de Conteúdo

· Dias: 01-31 (respeitando o mês)
· Meses: 01-12
· Anos: 1900-2100
· Fevereiro: 28/29 dias (anos bissextos)
· Meses 30/31 dias: Respeitados corretamente

✅ Validações de Lógica

· Datas inexistentes: 31/04/2024 → Erro
· Anos bissextos: 29/02/2024 → Válido
· Limites: Respeita minDate e maxDate

📱 Responsividade

Mobile-First Design

· Touch targets grandes (44px mínimo)
· Teclado numérico em dispositivos móveis
· Layout adaptativo para diferentes telas
· Gestos touch otimizados

Breakpoints

Dispositivo Experiência
Mobile (<768px) Dropdown em tela cheia
Tablet (768px-1024px) Layout adaptativo
Desktop (>1024px) Dropdown flutuante

🔧 Solução de Problemas

Problemas Comuns

O componente não aparece:

```javascript
// Verifique o container
const container = document.querySelector('#myDatePicker');
console.log('Container encontrado:', container);

// Verifique erros no console
const picker = new SmartDatePicker({
    container: '#myDatePicker'
});
```

Validação não funciona:

```javascript
// Teste com datas específicas
picker.setValue(new Date(2024, 1, 31)); // 31 de fevereiro → deve dar erro
```

Backspace não funciona:

· ✅ Corrigido na versão atual
· Funciona livremente através das barras

Debug

```javascript
// Ative o modo debug
const picker = new SmartDatePicker({
    container: '#debugDate',
    onSelect: (date) => {
        console.log('Debug - Data selecionada:', date);
        console.log('Debug - Valor do input:', picker.elements.input.value);
    }
});
```

🌐 Compatibilidade

Navegadores Suportados

· Chrome 60+
· Firefox 55+
· Safari 12+
· Edge 79+
· Mobile Safari 12+
· Chrome Mobile 60+

Funcionalidades Modernas

· ES6 Classes
· CSS Grid
· Flexbox
· CSS Custom Properties
· Arrow Functions

📦 Estrutura do Projeto

```
smart-date-picker/
├── index.html              # Demonstração e documentação
├── smart-date-picker.js    # Componente principal
└── README.md               # Este arquivo
```

🤝 Contribuindo

Contribuições são bem-vindas! Areas para melhorias:

1. Internacionalização (i18n)
2. Mais temas de cores
3. Suporte a timezones
4. Integração com frameworks (React, Vue, etc.)
5. Testes automatizados

Setup de Desenvolvimento

```bash
# 1. Clone ou fork o projeto
# 2. Abra index.html em um servidor local
python -m http.server 8000
# 3. Faça suas modificações
# 4. Teste em múltiplos navegadores
```

---

<div align="center">
Desenvolvido com ❤️ usando JavaScript vanilla e Tailwind CSS.
</div>

---

## 🤝 Contribuições
Contribuições são sempre bem-vindas!  
Sinta-se à vontade para abrir uma [*issue*](https://github.com/NinoMiquelino/smart-date-picker/issues) com sugestões ou enviar um [*pull request*](https://github.com/NinoMiquelino/smart-date-picker/pulls) com melhorias.

---

## 💬 Contato
📧 [Entre em contato pelo LinkedIn](https://www.linkedin.com/in/onivaldomiquelino/)  
💻 Desenvolvido por **Onivaldo Miquelino**

---
