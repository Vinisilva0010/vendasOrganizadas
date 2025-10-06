"use client";

import React, { useState, useEffect } from "react";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";
import { toast } from "sonner";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Pencil, Calendar as CalendarIcon } from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

// Schema de validação para edição de parcela
const editInstallmentSchema = z.object({
  value: z.number().min(0.01, "O valor deve ser maior que zero"),
  dueDate: z.date(),
});

type EditInstallmentFormValues = z.infer<typeof editInstallmentSchema>;

export default function ParcelasPage() {
  const [installments, setInstallments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingInstallment, setEditingInstallment] = useState<any>(null);

  // Formulário de edição
  const editForm = useForm<EditInstallmentFormValues>({
    resolver: zodResolver(editInstallmentSchema),
    defaultValues: {
      value: 0,
    },
  });

  // --- NOVA FUNÇÃO OTIMIZADA PARA BUSCAR DADOS RELACIONADOS ---
  const fetchInstallments = async () => {
    setIsLoading(true);
    try {
      // 1. Buscar todas as parcelas pendentes
      const installmentsResponse = await databases.listDocuments(
        "68e1db1c003b7d5c02c2", // Database ID
        "installments", // Collection ID
        [Query.equal("status", "pending"), Query.orderAsc("dueDate")]
      );
      const pendingInstallments = installmentsResponse.documents;

      if (pendingInstallments.length === 0) {
        setInstallments([]);
        return;
      }

      // 2. Extrair os IDs únicos das vendas
      const saleIds = [...new Set(pendingInstallments.map((inst) => inst.sale))];

      // 3. Buscar todas as vendas relacionadas de uma só vez
      const salesResponse = await databases.listDocuments(
        "68e1db1c003b7d5c02c2", // Database ID
        "sales", // Collection ID
        [Query.equal("$id", saleIds)]
      );
      const relatedSales = salesResponse.documents;

      // 4. Extrair os IDs únicos dos clientes
      const clientIds = [...new Set(relatedSales.map((sale) => sale.client))];

      // 5. Buscar todos os clientes relacionados de uma só vez
      const clientsResponse = await databases.listDocuments(
        "68e1db1c003b7d5c02c2", // Database ID
        "clients", // Collection ID
        [Query.equal("$id", clientIds)]
      );
      const relatedClients = clientsResponse.documents;

      // 6. Juntar tudo! Criar mapas para busca rápida
      const salesMap = new Map(relatedSales.map((sale) => [sale.$id, sale]));
      const clientsMap = new Map(
        relatedClients.map((client) => [client.$id, client])
      );

      // 7. Combinar os dados para a tabela
      const combinedData = pendingInstallments.map((installment) => {
        const sale = salesMap.get(installment.sale);
        const client = sale ? clientsMap.get(sale.client) : null;
        return {
          ...installment,
          sale: {
            ...sale,
            client: client,
          },
        };
      });

      setInstallments(combinedData);
    } catch (error) {
      console.error("Erro ao buscar dados completos:", error);
      toast.error("Erro ao carregar dados das parcelas.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // O restante do código permanece o mesmo...

  useEffect(() => {
    fetchInstallments();
  }, []);

  const handleMarkAsPaid = async (installmentId: string) => {
    try {
      await databases.updateDocument(
        "68e1db1c003b7d5c02c2",
        "installments",
        installmentId,
        {
          status: "paid",
          paidDate: new Date().toISOString(),
        }
      );
      toast.success("Parcela marcada como paga!");
      fetchInstallments();
    } catch (error) {
      console.error("Erro ao atualizar parcela:", error);
      toast.error("Erro ao marcar parcela como paga.");
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Função para abrir o dialog de edição
  const handleOpenEditDialog = (installment: any) => {
    setEditingInstallment(installment);
    editForm.reset({
      value: installment.value,
      dueDate: new Date(installment.dueDate),
    });
    setIsEditDialogOpen(true);
  };

  // Função para atualizar a parcela
  const handleUpdateInstallment = async (data: EditInstallmentFormValues) => {
    if (!editingInstallment) return;

    try {
      await databases.updateDocument(
        "68e1db1c003b7d5c02c2",
        "installments",
        editingInstallment.$id,
        {
          value: data.value,
          dueDate: data.dueDate.toISOString(),
        }
      );

      toast.success("Parcela atualizada com sucesso!");
      setIsEditDialogOpen(false);
      fetchInstallments();
    } catch (error) {
      console.error("Erro ao atualizar parcela:", error);
      toast.error("Erro ao atualizar parcela.");
    }
  };

  return (
    <div className="container mx-auto py-6 md:py-10 px-4">
      <Card className="max-w-6xl mx-auto card-glow animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            💳 Parcelas a Receber
          </CardTitle>
          <CardDescription>
            Gerencie as parcelas pendentes e marque como pagas quando receber o
            pagamento
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">
              Carregando parcelas...
            </p>
          ) : installments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma parcela pendente.
            </p>
          ) : (
            <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Descrição da Venda</TableHead>
                  <TableHead className="text-center">Nº da Parcela</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead className="text-center">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {installments.map((installment) => (
                  <TableRow key={installment.$id}>
                    <TableCell className="font-medium">
                      {installment.sale?.client?.name || "N/A"}
                    </TableCell>
                    <TableCell>
                      {installment.sale?.description || "N/A"}
                    </TableCell>
                    <TableCell className="text-center">
                      {installment.installmentNumber}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(installment.value)}
                    </TableCell>
                    <TableCell>
                      {format(new Date(installment.dueDate), "dd/MM/yyyy")}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-1 md:gap-2 justify-center flex-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEditDialog(installment)}
                          className="px-2"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleMarkAsPaid(installment.$id)}
                          className="text-xs md:text-sm whitespace-nowrap"
                        >
                          Pagar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de Edição de Parcela */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Parcela</DialogTitle>
            <DialogDescription>
              Altere o valor ou a data de vencimento da parcela
            </DialogDescription>
          </DialogHeader>

          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(handleUpdateInstallment)}
              className="space-y-6"
            >
              {/* Campo Valor */}
              <FormField
                control={editForm.control}
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campo Data de Vencimento */}
              <FormField
                control={editForm.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Vencimento</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
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
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Salvar Alterações</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}