"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GuiaPage() {
  return (
    <div className="container mx-auto py-6 md:py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl font-bold text-primary flex items-center justify-center gap-3">
            📚 Guia de Uso
          </h1>
          <p className="text-xl text-muted-foreground">
            Aprenda a usar todas as funcionalidades do Gestor Simplificado
          </p>
        </div>

        {/* Passo 1: Dashboard */}
        <Card className="card-glow animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <span className="text-3xl">1️⃣</span>
              Dashboard - Visão Geral
            </CardTitle>
            <CardDescription>
              Acompanhe seus indicadores financeiros em tempo real
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              O Dashboard é a página inicial onde você visualiza os principais
              indicadores do seu negócio:
            </p>
            <ul className="space-y-2 ml-6 list-disc text-muted-foreground">
              <li>
                <strong className="text-foreground">Total a Receber:</strong>{" "}
                Soma de todas as parcelas pendentes
              </li>
              <li>
                <strong className="text-foreground">Parcelas Vencidas:</strong>{" "}
                Quantidade de parcelas atrasadas
              </li>
              <li>
                <strong className="text-foreground">Recebido no Mês:</strong>{" "}
                Total já recebido no mês atual
              </li>
              <li>
                <strong className="text-foreground">Despesas no Mês:</strong>{" "}
                Total de gastos no período
              </li>
              <li>
                <strong className="text-foreground">Lucro Líquido:</strong>{" "}
                Receitas menos despesas do mês
              </li>
            </ul>
            <div className="pt-4">
              <Button asChild className="glow-cyan-hover">
                <Link href="/">Ver Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Passo 2: Cadastrar Clientes */}
        <Card className="card-glow animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <span className="text-3xl">2️⃣</span>
              Cadastrar Clientes
            </CardTitle>
            <CardDescription>
              Adicione e gerencie seus clientes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Para cadastrar um novo cliente:</p>
            <ol className="space-y-3 ml-6 list-decimal text-muted-foreground">
              <li>Acesse o menu <strong className="text-foreground">Clientes</strong></li>
              <li>Preencha o formulário com os dados:
                <ul className="ml-6 mt-2 list-disc">
                  <li>Nome completo (obrigatório)</li>
                  <li>CPF (obrigatório)</li>
                  <li>Telefone (obrigatório)</li>
                  <li>Email (opcional)</li>
                  <li>Endereço (opcional)</li>
                </ul>
              </li>
              <li>Clique em <strong className="text-foreground">Salvar Cliente</strong></li>
              <li>O cliente aparecerá automaticamente na tabela abaixo</li>
            </ol>
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-4">
              <p className="text-sm text-primary font-medium">
                💡 Dica: Todos os clientes cadastrados ficam salvos e podem ser
                selecionados ao criar uma nova venda!
              </p>
            </div>
            <div className="pt-4">
              <Button asChild className="glow-cyan-hover">
                <Link href="/clients">Cadastrar Cliente</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Passo 3: Registrar Vendas */}
        <Card className="card-glow animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <span className="text-3xl">3️⃣</span>
              Registrar Nova Venda
            </CardTitle>
            <CardDescription>
              Crie vendas e gere parcelas automaticamente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Para registrar uma venda:</p>
            <ol className="space-y-3 ml-6 list-decimal text-muted-foreground">
              <li>Clique em <strong className="text-foreground">+ Nova Venda</strong> no topo da página</li>
              <li>Selecione o cliente no campo de busca</li>
              <li>Preencha os dados da venda:
                <ul className="ml-6 mt-2 list-disc">
                  <li>Descrição (ex: "Venda de produtos")</li>
                  <li>Valor total da venda</li>
                  <li>Data da venda</li>
                  <li>Número de parcelas</li>
                </ul>
              </li>
              <li>Clique em <strong className="text-foreground">Registrar Venda</strong></li>
            </ol>
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mt-4">
              <p className="text-sm text-green-500 font-medium">
                ✨ Mágica: As parcelas são geradas automaticamente com
                vencimentos mensais! Você não precisa criar uma por uma.
              </p>
            </div>
            <div className="pt-4">
              <Button asChild className="glow-cyan-hover">
                <Link href="/vendas/nova">Registrar Venda</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Passo 4: Gerenciar Parcelas */}
        <Card className="card-glow animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <span className="text-3xl">4️⃣</span>
              Gerenciar Parcelas
            </CardTitle>
            <CardDescription>
              Controle recebimentos e atualize informações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Na página de Parcelas você pode:</p>
            <ul className="space-y-3 ml-6 list-disc text-muted-foreground">
              <li>
                <strong className="text-foreground">Visualizar todas as parcelas pendentes</strong> 
                <br />
                <span className="text-sm">Ordenadas por data de vencimento</span>
              </li>
              <li>
                <strong className="text-foreground">Editar parcelas</strong> 
                <br />
                <span className="text-sm">Clique no ícone de lápis (✏️) para alterar valor ou vencimento</span>
              </li>
              <li>
                <strong className="text-foreground">Marcar como pago</strong> 
                <br />
                <span className="text-sm">Clique em "Marcar como Pago" quando receber o pagamento</span>
              </li>
            </ul>
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mt-4">
              <p className="text-sm text-orange-500 font-medium">
                ⚠️ Atenção: Parcelas vencidas aparecem destacadas no Dashboard.
                Acompanhe regularmente!
              </p>
            </div>
            <div className="pt-4">
              <Button asChild className="glow-cyan-hover">
                <Link href="/parcelas">Ver Parcelas</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Passo 5: Registrar Despesas */}
        <Card className="card-glow animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <span className="text-3xl">5️⃣</span>
              Registrar Despesas
            </CardTitle>
            <CardDescription>
              Controle seus gastos e calcule lucro real
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Para registrar uma despesa:</p>
            <ol className="space-y-3 ml-6 list-decimal text-muted-foreground">
              <li>Acesse o menu <strong className="text-foreground">Despesas</strong></li>
              <li>Preencha os dados:
                <ul className="ml-6 mt-2 list-disc">
                  <li>Descrição (ex: "Conta de luz", "Aluguel")</li>
                  <li>Valor</li>
                  <li>Data da despesa</li>
                  <li>Categoria (opcional)</li>
                </ul>
              </li>
              <li>Clique em <strong className="text-foreground">Registrar Despesa</strong></li>
              <li>A despesa aparecerá na tabela e será contabilizada no lucro</li>
            </ol>
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-4">
              <p className="text-sm text-primary font-medium">
                💡 Importante: As despesas são descontadas automaticamente no
                cálculo do Lucro Líquido mostrado no Dashboard!
              </p>
            </div>
            <div className="pt-4">
              <Button asChild className="glow-cyan-hover">
                <Link href="/despesas">Registrar Despesa</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dicas Extras */}
        <Card className="card-glow gradient-card animate-fade-in border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-primary">
              💎 Dicas de Uso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  🎯 Melhor Fluxo
                </h3>
                <p className="text-sm text-muted-foreground">
                  1. Cadastre clientes → 2. Registre vendas → 3. Acompanhe
                  parcelas → 4. Registre despesas → 5. Veja lucro no Dashboard
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  📊 Análise Financeira
                </h3>
                <p className="text-sm text-muted-foreground">
                  Use o gráfico de 6 meses no Dashboard para identificar
                  tendências e planejar melhor seu negócio.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  ⚡ Ações Rápidas
                </h3>
                <p className="text-sm text-muted-foreground">
                  Use os botões "+ Nova Venda" e "+ Nova Despesa" no Dashboard
                  para acessos rápidos às funcionalidades mais usadas.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  🔔 Fique Atento
                </h3>
                <p className="text-sm text-muted-foreground">
                  Verifique diariamente o indicador de "Parcelas Vencidas" para
                  manter seu fluxo de caixa em dia.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer com botão voltar */}
        <div className="text-center pt-6 pb-10">
          <Button asChild size="lg" className="glow-cyan-hover">
            <Link href="/">🏠 Voltar ao Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

