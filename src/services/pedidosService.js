import { supabase } from "../supabaseClient";

export async function recibirPedido(pedido, session) {
  console.log("Recibiendo pedido:", pedido);

  if (!session) {
    throw new Error("No hay sesión.");
  }

  const { error } = await supabase
    .from("pedidos")
    .update({ estado: "Recibido" })
    .eq("id", pedido.id)
    .eq("user_id", session.user.id);

  if (error) {
    throw error;
  }

  const { data: inventario, error: errorInventario } = await supabase
    .from("inventario")
    .select("*")
    .eq("user_id", session.user.id);

  if (errorInventario) {
    throw errorInventario;
  }

  console.log("Inventario actual:", inventario);

  return true;
}