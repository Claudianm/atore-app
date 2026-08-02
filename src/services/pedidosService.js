import { supabase } from "../supabaseClient";

export async function recibirPedido(pedido, session) {
  console.log("Recibiendo pedido:", pedido);

  if (!session) {
    throw new Error("No hay sesión.");
  }

  // 1. Marcar pedido como recibido
  const { error } = await supabase
    .from("pedidos")
    .update({ estado: "Recibido" })
    .eq("id", pedido.id)
    .eq("user_id", session.user.id);

  if (error) throw error;

  // 2. Obtener inventario actual
  const { data: inventario, error: errorInventario } = await supabase
    .from("inventario")
    .select("*")
    .eq("user_id", session.user.id);

  if (errorInventario) throw errorInventario;

  // 3. Recorrer productos del pedido
  for (const prod of (pedido.productos || [])) {

    const existente = inventario.find(
      p =>
        p.producto === prod.producto &&
        p.marca === prod.marca
    );

    if (existente) {
      // Aumentar stock
      await supabase
        .from("inventario")
        .update({
          stock: Number(existente.stock) + Number(prod.cantidad)
        })
        .eq("id", existente.id);

    } else {
      // Crear producto nuevo
      await supabase
        .from("inventario")
        .insert({
          user_id: session.user.id,
          categoria: prod.categoria,
          producto: prod.producto,
          marca: prod.marca,
          caracteristicas: prod.caracteristicas,
          stock: prod.cantidad,
          precioCompra: prod.precioCompra,
          precioVenta: prod.precioVenta
        });
    }
  }

  return true;
}