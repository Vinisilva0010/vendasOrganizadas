# ⚡ Gestor Simplificado

Sistema completo de gestão financeira e vendas com tema Dark Punk e detalhes em ciano neon.

## 🚀 Funcionalidades

### 📊 Dashboard Interativo
- Visualização de KPIs em tempo real
- Gráfico comparativo de receitas vs despesas (últimos 6 meses)
- Indicadores de parcelas vencidas e lucro líquido

### 👥 Gestão de Clientes
- Cadastro completo de clientes
- Listagem e visualização
- Dados: Nome, CPF, Telefone, Email, Endereço

### 💰 Controle de Vendas
- Registro de vendas
- Geração automática de parcelas
- Vencimentos mensais automáticos

### 💳 Gestão de Parcelas
- Listagem de parcelas pendentes
- Edição de valores e vencimentos
- Marcação de pagamentos
- Atualização automática do dashboard

### 📊 Controle de Despesas
- Registro de despesas
- Categorização opcional
- Cálculo automático de lucro líquido

## 🎨 Tecnologias

- **Framework:** Next.js 15 + TypeScript
- **Backend:** Appwrite (BaaS)
- **UI:** shadcn/ui + Tailwind CSS
- **Formulários:** React Hook Form + Zod
- **Gráficos:** Recharts
- **Notificações:** Sonner

## 📋 Pré-requisitos

- Node.js 18+ instalado
- Conta no Appwrite Cloud ou instância própria
- npm ou yarn

## ⚙️ Instalação

### 1. Clone o repositório
```bash
git clone <seu-repositorio>
cd organizar-vendas
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o Appwrite

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=seu_project_id
```

### 4. Configure as coleções no Appwrite

#### Database ID: `68e1db1c003b7d5c02c2` (ou o seu)

#### Coleção: `clients`
- `name` (String, required)
- `cpf` (String, required)
- `phone` (String, required)
- `email` (String, optional)
- `address` (String, optional)

#### Coleção: `sales`
- `client` (Relationship → clients)
- `description` (String, required)
- `totalValue` (Float, required)
- `saleDate` (DateTime, required)
- `numberOfInstallments` (Integer, required)

#### Coleção: `installments`
- `sale` (Relationship → sales)
- `installmentNumber` (Integer, required)
- `value` (Float, required)
- `dueDate` (DateTime, required)
- `status` (String, required) - valores: "pending" ou "paid"
- `paidDate` (DateTime, optional)

#### Coleção: `expenses`
- `description` (String, required)
- `value` (Float, required)
- `expenseDate` (DateTime, required)
- `category` (String, optional)

### 5. Configure as permissões

Para todas as coleções, adicione permissões para **Any** ou **Guests**:
- ✅ Create
- ✅ Read
- ✅ Update
- ✅ Delete

## 🎯 Como Usar

### Inicie o servidor de desenvolvimento
```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

### Fluxo de Uso

1. **Cadastre Clientes** (`/clients`)
   - Preencha os dados do cliente
   - Clique em "Salvar Cliente"

2. **Registre Vendas** (`/vendas/nova`)
   - Selecione o cliente
   - Preencha valor e parcelas
   - As parcelas são geradas automaticamente!

3. **Gerencie Parcelas** (`/parcelas`)
   - Visualize parcelas pendentes
   - Edite valores ou vencimentos
   - Marque como pago ao receber

4. **Registre Despesas** (`/despesas`)
   - Adicione seus gastos
   - Acompanhe o lucro no Dashboard

5. **Acompanhe no Dashboard** (`/`)
   - Veja KPIs atualizados
   - Analise o gráfico de 6 meses
   - Identifique parcelas vencidas

## 🎨 Tema Dark Punk

O sistema possui um tema escuro moderno com:
- Fundo preto azulado
- Detalhes em ciano neon (#00D9FF)
- Efeitos de brilho (glow) em elementos interativos
- Animações suaves e transições fluidas
- Navbar sticky com backdrop blur

## 📱 Páginas

- `/` - Dashboard com KPIs e gráficos
- `/clients` - Gestão de clientes
- `/vendas/nova` - Registro de vendas
- `/parcelas` - Controle de parcelas
- `/despesas` - Gestão de despesas
- `/guia` - Guia completo de uso

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar em produção
npm start

# Linting
npm run lint
```

## 📦 Estrutura do Projeto

```
organizar-vendas/
├── app/
│   ├── (routes)/
│   │   ├── clients/
│   │   ├── despesas/
│   │   ├── guia/
│   │   ├── parcelas/
│   │   ├── vendas/nova/
│   │   └── layout.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/ (shadcn/ui)
│   └── Navbar.tsx
├── lib/
│   ├── appwrite.ts
│   └── utils.ts
└── public/
```

## 🎯 Recursos Especiais

- ✨ Geração automática de parcelas
- 📊 Gráficos interativos
- 🔄 Atualização em tempo real
- 💾 Persistência no Appwrite
- 🎨 Interface moderna e responsiva
- ⚡ Performance otimizada
- 📱 Mobile-friendly

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📄 Licença

MIT

## 👨‍💻 Autor

Desenvolvido com ❤️ usando Next.js e Appwrite

---

**Dúvidas?** Acesse o Guia de Uso dentro do sistema: `/guia`
