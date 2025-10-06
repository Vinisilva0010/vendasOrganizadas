"use client";

import React, { useState, useEffect } from "react";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [totalAReceber, setTotalAReceber] = useState(0);
  const [parcelasVencidas, setParcelasVencidas] = useState(0);
  const [recebidoNoMes, setRecebidoNoMes] = useState(0);
  const [despesasNoMes, setDespesasNoMes] = useState(0);
  const [lucroLiquido, setLucroLiquido] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);

  // Função para formatar valor em moeda brasileira
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);

      try {
        // Calcular primeiro e último dia do mês atual
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59
        );

        // Fazer todas as buscas em paralelo para melhor performance
        const [
          pendingInstallments,
          overdueInstallments,
          paidThisMonthInstallments,
          expensesThisMonth,
        ] = await Promise.all([
          // 1. Buscar todas as parcelas pendentes
          databases.listDocuments("68e1db1c003b7d5c02c2", "installments", [
            Query.equal("status", "pending"),
          ]),

          // 2. Buscar parcelas vencidas (pendentes com data < hoje)
          databases.listDocuments("68e1db1c003b7d5c02c2", "installments", [
            Query.equal("status", "pending"),
            Query.lessThan("dueDate", new Date().toISOString()),
          ]),

          // 3. Buscar parcelas pagas no mês atual
          databases.listDocuments("68e1db1c003b7d5c02c2", "installments", [
            Query.equal("status", "paid"),
            Query.greaterThanEqual("paidDate", firstDayOfMonth.toISOString()),
            Query.lessThanEqual("paidDate", lastDayOfMonth.toISOString()),
          ]),

          // 4. Buscar despesas do mês atual
          databases.listDocuments("68e1db1c003b7d5c02c2", "expenses", [
            Query.greaterThanEqual("expenseDate", firstDayOfMonth.toISOString()),
            Query.lessThanEqual("expenseDate", lastDayOfMonth.toISOString()),
          ]),
        ]);

        // Calcular total a receber (soma de todas as parcelas pendentes)
        const totalPendente = pendingInstallments.documents.reduce(
          (sum, doc: any) => sum + (doc.value || 0),
          0
        );
        setTotalAReceber(totalPendente);

        // Contar parcelas vencidas
        setParcelasVencidas(overdueInstallments.total);

        // Calcular total recebido no mês
        const totalRecebido = paidThisMonthInstallments.documents.reduce(
          (sum, doc: any) => sum + (doc.value || 0),
          0
        );
        setRecebidoNoMes(totalRecebido);

        // Calcular total de despesas no mês
        const totalDespesas = expensesThisMonth.documents.reduce(
          (sum, doc: any) => sum + (doc.value || 0),
          0
        );
        setDespesasNoMes(totalDespesas);

        // Calcular lucro líquido (receitas - despesas)
        const lucro = totalRecebido - totalDespesas;
        setLucroLiquido(lucro);

        // Buscar dados dos últimos 6 meses para o gráfico
        const chartDataArray = [];
        const monthNames = [
          "Jan",
          "Fev",
          "Mar",
          "Abr",
          "Mai",
          "Jun",
          "Jul",
          "Ago",
          "Set",
          "Out",
          "Nov",
          "Dez",
        ];

        for (let i = 5; i >= 0; i--) {
          // Calcular o mês
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
          const lastDay = new Date(
            date.getFullYear(),
            date.getMonth() + 1,
            0,
            23,
            59,
            59
          );

          // Nome do mês
          const monthName = `${monthNames[date.getMonth()]}/${date
            .getFullYear()
            .toString()
            .slice(-2)}`;

          try {
            // Buscar receitas e despesas do mês em paralelo
            const [revenuesResponse, expensesResponse] = await Promise.all([
              databases.listDocuments("68e1db1c003b7d5c02c2", "installments", [
                Query.equal("status", "paid"),
                Query.greaterThanEqual("paidDate", firstDay.toISOString()),
                Query.lessThanEqual("paidDate", lastDay.toISOString()),
              ]),
              databases.listDocuments("68e1db1c003b7d5c02c2", "expenses", [
                Query.greaterThanEqual("expenseDate", firstDay.toISOString()),
                Query.lessThanEqual("expenseDate", lastDay.toISOString()),
              ]),
            ]);

            // Calcular totais
            const totalReceitas = revenuesResponse.documents.reduce(
              (sum, doc: any) => sum + (doc.value || 0),
              0
            );

            const totalDespesasMes = expensesResponse.documents.reduce(
              (sum, doc: any) => sum + (doc.value || 0),
              0
            );

            chartDataArray.push({
              name: monthName,
              receita: totalReceitas,
              despesa: totalDespesasMes,
            });
          } catch (err) {
            console.error(`Erro ao buscar dados do mês ${monthName}:`, err);
            chartDataArray.push({
              name: monthName,
              receita: 0,
              despesa: 0,
            });
          }
        }

        setChartData(chartDataArray);
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="container mx-auto py-6 md:py-10 px-4">
      <div className="mb-6 md:mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Visão geral do seu sistema de gestão de vendas
          </p>
        </div>
        
        {/* Botões de Ação Rápida */}
        <div className="flex flex-wrap gap-2 md:gap-3">
          <Button asChild className="glow-cyan-hover flex-1 md:flex-none" size="sm">
            <a href="/vendas/nova">💫 Nova Venda</a>
          </Button>
          <Button variant="outline" asChild className="hover:border-primary hover:text-primary transition-all flex-1 md:flex-none" size="sm">
            <a href="/despesas">📝 Despesa</a>
          </Button>
          <Button variant="secondary" asChild className="hover:bg-primary hover:text-primary-foreground transition-all w-full md:w-auto" size="sm">
            <a href="/guia">📚 Guia</a>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      ) : (
        <>
          {/* Primeira linha: KPIs principais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
            {/* Card: Total a Receber */}
            <Card className="card-glow gradient-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  💰 Total a Receber
                </CardTitle>
                <CardDescription>
                  Soma de todas as parcelas pendentes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {formatCurrency(totalAReceber)}
                </div>
              </CardContent>
            </Card>

            {/* Card: Parcelas Vencidas */}
            <Card className="card-glow gradient-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  ⚠️ Parcelas Vencidas
                </CardTitle>
                <CardDescription>
                  Parcelas pendentes com vencimento atrasado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-500">
                  {parcelasVencidas}
                </div>
              </CardContent>
            </Card>

            {/* Card: Recebido no Mês */}
            <Card className="card-glow gradient-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  ✅ Recebido no Mês
                </CardTitle>
                <CardDescription>
                  Total recebido no mês atual
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">
                  {formatCurrency(recebidoNoMes)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Segunda linha: Despesas e Lucro */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 animate-fade-in">
            {/* Card: Despesas no Mês */}
            <Card className="card-glow gradient-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  📊 Despesas no Mês
                </CardTitle>
                <CardDescription>
                  Total de despesas no mês atual
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-500">
                  {formatCurrency(despesasNoMes)}
                </div>
              </CardContent>
            </Card>

            {/* Card: Lucro Líquido */}
            <Card className="card-glow gradient-card">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  💵 Lucro Líquido do Mês
                </CardTitle>
                <CardDescription>
                  Receitas menos despesas do mês atual
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-3xl font-bold ${
                    lucroLiquido >= 0 ? "text-green-500 glow-cyan" : "text-red-500"
                  }`}
                >
                  {formatCurrency(lucroLiquido)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de Receitas vs Despesas */}
          <Card className="mt-6 card-glow animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📈 Receitas vs. Despesas (Últimos 6 Meses)
              </CardTitle>
              <CardDescription>
                Comparativo mensal de receitas e despesas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Bar dataKey="receita" fill="#22c55e" name="Receitas" />
                  <Bar dataKey="despesa" fill="#ef4444" name="Despesas" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
