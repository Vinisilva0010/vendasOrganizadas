"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ID } from "appwrite";
import { databases } from "@/lib/appwrite";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";

// Schema de validação do formulário
// Schema de validação do formulário (versão corrigida)
const saleSchema = z.object({
    clientId: z.string().min(1, "Selecione um cliente"),
    description: z.string().min(3, "A descrição deve ter no mínimo 3 caracteres"),
    totalValue: z.number().min(0.01, "O valor deve ser maior que zero"),
    saleDate: z.date(), // <-- AQUI ESTÁ A CORREÇÃO
    numberOfInstallments: z.number().min(1, "Deve ter pelo menos 1 parcela"),
  });

type SaleFormValues = z.infer<typeof saleSchema>;

interface Client {
  $id: string;
  name: string;
  cpf: string;
  phone: string;
  email: string;
  address: string;
}

export default function NovaVendaPage() {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [openClientCombobox, setOpenClientCombobox] = useState(false);

  // Configuração do formulário com react-hook-form e zod
  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      clientId: "",
      description: "",
      totalValue: 0,
      // <-- CORREÇÃO 2: Renomeado de 'installments' para 'numberOfInstallments'
      numberOfInstallments: 1,
    },
  });

  // Função para buscar clientes do Appwrite
  const fetchClients = async () => {
    try {
      const response = await databases.listDocuments(
        "68e1db1c003b7d5c02c2", // SEU DATABASE ID
        "clients" // SEU COLLECTION ID DE CLIENTES
      );
      setClients(response.documents as unknown as Client[]);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      toast.error("Erro ao carregar clientes");
    } finally {
      setIsLoadingClients(false);
    }
  };

  // Carregar clientes ao montar o componente
  useEffect(() => {
    fetchClients();
  }, []);

  // Função para submeter o formulário
  const onSubmit = async (data: SaleFormValues) => {
    setLoading(true);

    try {
      // PASSO A: Salvar a Venda
      const saleResponse = await databases.createDocument(
        "68e1db1c003b7d5c02c2", // SEU DATABASE ID
        "sales", // SEU COLLECTION ID DE VENDAS
        ID.unique(),
        {
          // <-- CORREÇÃO 3: Renomeado de 'clientId' para 'client' para corresponder ao relacionamento
          client: data.clientId,
          description: data.description,
          totalValue: data.totalValue,
          saleDate: data.saleDate.toISOString(),
          // <-- CORREÇÃO 4: Usando o nome correto 'numberOfInstallments'
          numberOfInstallments: data.numberOfInstallments,
        }
      );

      const saleId = saleResponse.$id;

      // PASSO B: Calcular e Salvar as Parcelas
      const installmentValue = data.totalValue / data.numberOfInstallments;

      for (let i = 1; i <= data.numberOfInstallments; i++) {
        const dueDate = new Date(data.saleDate);
        dueDate.setMonth(dueDate.getMonth() + i);

        const installmentData = {
          installmentNumber: i,
          value: installmentValue,
          dueDate: dueDate.toISOString(),
          status: "pending",
          sale: saleId,
        };

        await databases.createDocument(
          "68e1db1c003b7d5c02c2", // SEU DATABASE ID
          "installments", // SEU COLLECTION ID DE PARCELAS
          ID.unique(),
          installmentData
        );
      }

      // PASSO C: Mostrar sucesso
      toast.success("Venda registrada com sucesso!");
      form.reset();
    } catch (error: any) {
      console.error("Erro ao registrar venda:", error);
      // Mostra uma mensagem de erro mais detalhada
      toast.error(`Erro: ${error.message || "Não foi possível registrar a venda."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 md:py-10 px-4">
      <Card className="max-w-2xl mx-auto card-glow animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            🛒 Registrar Nova Venda
          </CardTitle>
          <CardDescription>
            Preencha os dados abaixo para registrar uma nova venda e gerar as
            parcelas automaticamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingClients ? (
            <p className="text-center text-muted-foreground py-8">
              Carregando clientes...
            </p>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Campo Cliente - Combobox */}
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Cliente</FormLabel>
                      <Popover
                        open={openClientCombobox}
                        onOpenChange={setOpenClientCombobox}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                              disabled={loading}
                            >
                              {field.value
                                ? clients.find(
                                    (client) => client.$id === field.value
                                  )?.name
                                : "Selecione um cliente"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[400px] p-0">
                          <Command>
                            <CommandInput placeholder="Buscar cliente..." />
                            <CommandList>
                              <CommandEmpty>
                                Nenhum cliente encontrado.
                              </CommandEmpty>
                              <CommandGroup>
                                {clients.map((client) => (
                                  <CommandItem
                                    value={client.name}
                                    key={client.$id}
                                    onSelect={() => {
                                      form.setValue("clientId", client.$id);
                                      setOpenClientCombobox(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        client.$id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {client.name} - {client.cpf}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Campo Descrição */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição da Venda</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Venda de produtos"
                          {...field}
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Campo Valor Total */}
                <FormField
                  control={form.control}
                  name="totalValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Total (R$)</FormLabel>
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

                {/* Campo Data da Venda - Date Picker */}
                <FormField
                  control={form.control}
                  name="saleDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data da Venda</FormLabel>
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

                {/* Campo Número de Parcelas */}
                <FormField
                  control={form.control}
                  // <-- CORREÇÃO 5: Renomeado de 'installments' para 'numberOfInstallments'
                  name="numberOfInstallments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Parcelas</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 1)
                          }
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Registrando..." : "Registrar Venda"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}