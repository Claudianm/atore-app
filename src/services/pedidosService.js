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
  p => p.nombre === prod.producto
);

    let inventarioId;

if (existente) {

  inventarioId = existente.id;

} else {

  const { data: nuevoProducto, error } = await supabase
    .from("inventario")
    .insert({
      user_id: session.user.id,
      nombre: prod.producto,
      categoria: prod.categoria,
      tieneMarcas: !!prod.marca
    })
    .select()
    .single();

  if (error) throw error;

  inventarioId = nuevoProducto.id;
const { error: errorMarca } = await supabase
  .from("inventario_marcas")
  .insert({
    inventario_id: inventarioId,
    user_id: session.user.id,
    marca: prod.marca,
    stock: Number(prod.cantidad),
    minimo: 0,
    precioCompra: Number(prod.precioCompra),
    precioVenta: Number(prod.precioVenta),
    tipoVenta: "Unidad",
    caracteristicas: prod.caracteristicas || ""
  });

if (errorMarca) throw errorMarca;
}
// Buscar si ya existe la marca
const { data: marcas, error } = await supabase
  .from("inventario_marcas")
  .select("*")
  .eq("inventario_id", inventarioId)
  .eq("marca", prod.marca);

if (error) throw error;

const marcaExistente = marcas.length > 0 ? marcas[0] : null;

if (marcaExistente) {

  const { error } = await supabase
    .from("inventario_marcas")
    .update({
      stock: Number(marcaExistente.stock) + Number(prod.cantidad),
      precioCompra: prod.precioCompra,
      precioVenta: prod.precioVenta
    })
    .eq("id", marcaExistente.id);

  if (error) throw error;

} else {

  const { error } = await supabase
    .from("inventario_marcas")
    .insert({
  user_id: session.user.id,
  nombre: prod.producto,
  categoria: prod.categoria,
  tieneMarcas: true
})
.select()
.single();

  if (error) throw error;
} 
}
  

  return true;
}