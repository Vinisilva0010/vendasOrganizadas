"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ID, Query } from "appwrite";
import { databases } from "@/lib/appwrite";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Schema de validação do formulário
const expenseSchema = z.object({
  description: z.string().min(3, "A descrição deve ter no mínimo 3 caracteres"),
  value: z.number().min(0.01, "O valor deve ser maior que zero"),
  expenseDate: z.date(),
  category: z.string().optional().or(z.literal("")),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

interface Expense {
  $id: string;
  description: string;
  value: number;
  expenseDate: string;
  category?: string;
}

export default function DespesasPage() {
  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(true);

  // Configuração do formulário com react-hook-form e zod
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: "",
      value: 0,
      category: "",
    },
  });

  // Função para buscar despesas do Appwrite
  const fetchExpenses = async () => {
    setIsLoadingExpenses(true);
    try {
      const response = await databases.listDocuments(
        "68e1db1c003b7d5c02c2",
        "expenses",
        [Query.orderDesc("expenseDate")]
      );
      setExpenses(response.documents as unknown as Expense[]);
    } catch (error) {
      console.error("Erro ao buscar despesas:", error);
      toast.error("Erro ao carregar despesas");
    } finally {
      setIsLoadingExpenses(false);
    }
  };

  // Carregar despesas ao montar o componente
  useEffect(() => {
    fetchExpenses();
  }, []);

  // Função para submeter o formulário
  const onSubmit = async (data: ExpenseFormValues) => {
    setLoading(true);

    try {
      // Salvar no Appwrite
      await databases.createDocument(
        "68e1db1c003b7d5c02c2",
        "expenses",
        ID.unique(),
        {
          description: data.description,
          value: data.value,
          expenseDate: data.expenseDate.toISOString(),
          category: data.category || "",
        }
      );

      toast.success("Despesa registrada com sucesso!");
      form.reset();
      fetchExpenses(); // Atualizar lista de despesas
    } catch (error) {
      console.error("Erro ao registrar despesa:", error);
      toast.error("Erro ao registrar despesa.");
    } finally {
      setLoading(false);
    }
  };

  // Formatar valor para moeda brasileira
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      {/* Card: Formulário de Nova Despesa */}
      <Card className="max-w-2xl mx-auto card-glow animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            💸 Adicionar Nova Despesa
          </CardTitle>
          <CardDescription>
            Registre uma nova despesa para controle financeiro
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Campo Descrição */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Conta de luz, aluguel..."
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo Valor */}
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo Data da Despesa - Date Picker */}
              <FormField
                control={form.control}
                name="expenseDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data da Despesa</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={loading}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo Categoria (Opcional) */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Contas, Salários, Estoque..."
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Registrando..." : "Registrar Despesa"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Card: Tabela de Despesas Recentes */}
      <Card className="max-w-6xl mx-auto card-glow animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            📊 Despesas Recentes
          </CardTitle>
          <CardDescription>
            Visualize todas as despesas registradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingExpenses ? (
            <p className="text-center text-muted-foreground py-8">
              Carregando despesas...
            </p>
          ) : expenses.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma despesa registrada.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.map((expense) => (
                  <TableRow key={expense.$id}>
                    <TableCell className="font-medium">
                      {expense.description}
                    </TableCell>
                    <TableCell>
                      {expense.category || (
                        <span className="text-muted-foreground">
                          Sem categoria
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(expense.value)}
                    </TableCell>
                    <TableCell>
                      {format(new Date(expense.expenseDate), "dd/MM/yyyy")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

