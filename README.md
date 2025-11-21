# 🚀 Trainee CRUD Application

Aplicação CRUD completa desenvolvida para o programa de trainee, utilizando as tecnologias mais modernas do Angular e NestJS.

## 📋 Requisitos Atendidos

- ✅ **Angular 19+** com Bootstrap para layout
- ✅ **ZoneLess** (sem zone.js) 
- ✅ **Signals** para gerenciamento de estado
- ✅ **inject()** para injeção de dependências
- ✅ **CRUD Completo** - Criar, Listar, Editar, Excluir
- ✅ **Formulários Reativos** com validações Bootstrap
- ✅ **Campos Requeridos**: texto, data, checkbox, select

## 🏗️ Estrutura do Projeto

```
trainee/
├── crud-api/              # Backend NestJS
│   ├── src/
│   │   ├── tarefas/       # Módulo de tarefas
│   │   ├── app.module.ts  # Configuração principal
│   │   └── main.ts        # Entry point
│   └── database.sqlite    # Banco SQLite
│
└── trainee-crud-app/      # Frontend Angular
    ├── src/
    │   ├── app/
    │   │   ├── components/  # Componentes
    │   │   ├── services/    # Serviços
    │   │   ├── models/      # Modelos
    │   │   └── environments/ # Configurações
    │   └── styles.scss      # Estilos globais
```

## 🚀 Como Executar

### Backend (NestJS)
```bash
cd crud-api
npm install
npm run start:dev
# Servidor rodando em http://localhost:3000
```

### Frontend (Angular)
```bash
cd trainee-crud-app
npm install
ng serve --port 4201
# Aplicação rodando em http://localhost:4201
```

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Angular 19** - Framework principal
- **Bootstrap 5** - Estilização e layout
- **Signals** - Gerenciamento de estado reativo
- **ZoneLess** - Change detection otimizada
- **TypeScript** - Linguagem tipada

### Backend
- **NestJS 11** - Framework Node.js
- **TypeORM** - ORM para banco de dados
- **SQLite** - Banco de dados local
- **Class Validator** - Validação de DTOs

## 📱 Funcionalidades

- 📋 **Listar Tarefas** com filtros (Todas/Pendentes/Concluídas)
- ➕ **Criar Tarefa** com formulário completo
- ✏️ **Editar Tarefa** com dados pré-preenchidos
- 🗑️ **Excluir Tarefa** com confirmação
- 🔍 **Filtros Dinâmicos** com contadores
- 📱 **Interface Responsiva** com Bootstrap
- ⚡ **Performance Otimizada** com ZoneLess e Signals

## 🎯 Campos da Tarefa

- **Título** (texto obrigatório, mín. 3 caracteres)
- **Descrição** (texto opcional)
- **Data de Vencimento** (data obrigatória)
- **Prioridade** (select: Baixa/Média/Alta)
- **Concluída** (checkbox)

## 🏆 Diferenciais Implementados

- ✨ **UX Contextual** - Mensagens diferentes para lista vazia vs filtro vazio
- 🎨 **Design Consistente** - Paleta de cores unificada em tons de azul
- 🔧 **Validações Centralizadas** - Lógica de validação no component, não no template
- 🌍 **Environment Config** - Configurações por ambiente (dev/prod)
- ⚡ **Otimizações** - Bundle mínimo, código limpo e performático

## 👨‍💻 Desenvolvido por

**[Seu Nome]** - Programa de Trainee 2025

---
*Projeto desenvolvido seguindo as melhores práticas do Angular e NestJS*
