"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteClient } from "@/lib/data";
import { isAdmin } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errors";

export type DeleteState = { error?: string };

export async function deleteClientAction(clientId: string): Promise<DeleteState> {
  if (!(await isAdmin())) {
    return { error: "Solo un admin puede eliminar clientes." };
  }

  try {
    await deleteClient(clientId);
  } catch (err) {
    return { error: `No se pudo eliminar el cliente: ${getErrorMessage(err)}` };
  }

  revalidatePath("/");
  revalidatePath("/clientes", "layout");
  redirect("/clientes");
}
