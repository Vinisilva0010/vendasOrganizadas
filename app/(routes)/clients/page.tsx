"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ID } from "appwrite";
import { databases } from "@/lib/appwrite";
import { toast } from "sonner";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Schema de validação do formulário
const clientSchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
  cpf: z.string().min(11, "O CPF deve ter no mínimo 11 caracteres"),
  phone: z.string().min(10, "O telefone deve ter no mínimo 10 caracteres"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
});

type ClientFormValues = z.infer<typeof clientSchema>;

interface Client {
  $id: string;
  name: string;
  cpf: string;
  phone: string;
  email: string;
  address: string;
}

export default function ClientsPage() {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [isTableLoading, setIsTableLoading] = useState(true);

  // Configuração do formulário com react-hook-form e zod
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      cpf: "",
      phone: "",
      email: "",
      address: "",
    },
  });

  // Função para buscar clientes do Appwrite
  const fetchClients = async () => {
    try {
      const response = await databases.listDocuments(
        "68e1db1c003b7d5c02c2",
        "clients"
      );
      setClients(response.documents as unknown as Client[]);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    } finally {
      setIsTableLoading(false);
    }
  };

  // Carregar clientes ao montar o componente
  useEffect(() => {
    fetchClients();
  }, []);

  // Função para submeter o formulário
  const onSubmit = async (data: ClientFormValues) => {
    setLoading(true);

    try {
      // Salvar no Appwrite
      await databases.createDocument(
        "68e1db1c003b7d5c02c2",
        "clients",
        ID.unique(),
        {
          name: data.name,
          cpf: data.cpf,
          phone: data.phone,
          email: data.email || "",
          address: data.address || "",
        }
      );

      toast.success("Cliente salvo com sucesso!");
      form.reset();
      fetchClients(); // Atualizar a lista de clientes
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      toast.error("Erro ao salvar cliente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 md:py-10 px-4">
      <Card className="max-w-2xl mx-auto card-glow animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            👥 Cadastrar Novo Cliente
          </CardTitle>
          <CardDescription>
            Preencha os dados abaixo para adicionar um novo cliente ao sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o nome completo"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o CPF"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o telefone"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Digite o email"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o endereço"
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Salvando..." : "Salvar Cliente"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Seção da Tabela de Clientes */}
      <Card className="max-w-6xl mx-auto mt-10 card-glow animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            📋 Clientes Cadastrados
          </CardTitle>
          <CardDescription>
            Visualize todos os clientes cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isTableLoading ? (
            <p className="text-center text-muted-foreground py-8">
              Carregando clientes...
            </p>
          ) : clients.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum cliente cadastrado.
            </p>
          ) : (
            <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Telefone</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.$id}>
                    <TableCell>{client.name}</TableCell>
                    <TableCell>{client.cpf}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

