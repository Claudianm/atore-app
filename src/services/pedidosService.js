import { supabase } from "../supabaseClient";

export async function recibirPedido(pedido, session) {
  console.log("Recibiendo pedido:", pedido);

  if (!session) {
    throw new Error("No hay sesión.");
  }

  // =====================================================
  // 1. MARCAR PEDIDO COMO RECIBIDO
  // =====================================================
  const { error: errorPedido } = await supabase
    .from("pedidos")
    .update({ estado: "Recibido" })
    .eq("id", pedido.id)
    .eq("user_id", session.user.id);

  if (errorPedido) throw errorPedido;

  // =====================================================
  // 2. OBTENER INVENTARIO ACTUAL
  // =====================================================
  const { data: inventario, error: errorInventario } = await supabase
    .from("inventario")
    .select("*")
    .eq("user_id", session.user.id);

  if (errorInventario) throw errorInventario;

  // =====================================================
  // 3. PROCESAR CADA PRODUCTO DEL PEDIDO
  // =====================================================
  for (const prod of pedido.productos || []) {
    const nombreProducto = (prod.producto || "").trim();
    const nombreMarca = (prod.marca || "").trim();

    if (!nombreProducto || !nombreMarca) {
      console.warn("Producto o marca incompletos:", prod);
      continue;
    }

    // ===================================================
    // BUSCAR PRODUCTO
    // ===================================================
    let productoExistente = inventario.find(
      p =>
        (p.nombre || "").trim().toLowerCase() ===
        nombreProducto.toLowerCase()
    );

    let inventarioId;

    // ===================================================
    // CREAR PRODUCTO SI NO EXISTE
    // ===================================================
    if (!productoExistente) {
      const { data: nuevoProducto, error: errorNuevoProducto } =
        await supabase
          .from("inventario")
          .insert({
            user_id: session.user.id,
            nombre: nombreProducto,
            categoria: prod.categoria || "",
            tieneMarcas: true
          })
          .select()
          .single();

      if (errorNuevoProducto) throw errorNuevoProducto;

      inventarioId = nuevoProducto.id;

      // Lo agregamos al array para que otros productos del
      // mismo pedido puedan encontrarlo.
      inventario.push(nuevoProducto);

      productoExistente = nuevoProducto;
    } else {
      inventarioId = productoExistente.id;
    }

    // ===================================================
    // BUSCAR MARCA
    // ===================================================
    const { data: marcas, error: errorMarcas } = await supabase
      .from("inventario_marcas")
      .select("*")
      .eq("inventario_id", inventarioId)
      .eq("user_id", session.user.id);

    if (errorMarcas) throw errorMarcas;

    const marcaExistente = (marcas || []).find(
      m =>
        (m.marca || "").trim().toLowerCase() ===
        nombreMarca.toLowerCase()
    );

    let marca;

    // ===================================================
    // CREAR MARCA SI NO EXISTE
    // ===================================================
    if (!marcaExistente) {
      const { data: nuevaMarca, error: errorNuevaMarca } =
        await supabase
          .from("inventario_marcas")
          .insert({
            inventario_id: inventarioId,
            user_id: session.user.id,
            marca: nombreMarca,

            // Inicialmente la marca tendrá la cantidad
            // de la variante que estamos recibiendo.
            stock: 0,

            minimo: 0,
            precioCompra: Number(prod.precioCompra || 0),
            precioVenta: Number(prod.precioVenta || 0),
            tipoVenta: "Unidad",
            caracteristicas: ""
          })
          .select()
          .single();

      if (errorNuevaMarca) throw errorNuevaMarca;

      marca = nuevaMarca;
    } else {
      marca = marcaExistente;
    }// ===================================================
    // 4. BUSCAR VARIANTE
    // ===================================================
    const nombreVariante = (prod.caracteristicas || "").trim();

    const { data: variantes, error: errorVariantes } = await supabase
      .from("inventario_variantes")
      .select("*")
      .eq("inventario_id", inventarioId)
      .eq("marca_id", marca.id)
      .eq("user_id", session.user.id);

    if (errorVariantes) throw errorVariantes;

    const varianteExistente = (variantes || []).find(
      v =>
        (v.nombre || "").trim().toLowerCase() ===
        nombreVariante.toLowerCase()
    );

    let variante;

    // ===================================================
    // 5. AUMENTAR VARIANTE EXISTENTE
    // ===================================================
    if (varianteExistente) {
      const nuevoStock =
        Number(varianteExistente.stock || 0) +
        Number(prod.cantidad || 0);

      const { data: varianteActualizada, error: errorActualizarVariante } =
        await supabase
          .from("inventario_variantes")
          .update({
            stock: nuevoStock,
            precioCompra: Number(prod.precioCompra || 0),
            precioVenta: Number(prod.precioVenta || 0),
            tipoVenta: prod.tipoVenta || "Unidad"
          })
          .eq("id", varianteExistente.id)
          .eq("user_id", session.user.id)
          .select()
          .single();

      if (errorActualizarVariante) throw errorActualizarVariante;

      variante = varianteActualizada;

      console.log(
        "Variante existente actualizada:",
        variante.nombre,
        "→ stock:",
        nuevoStock
      );
    }

    // ===================================================
    // 6. CREAR VARIANTE NUEVA
    // ===================================================
    else {
      const { data: nuevaVariante, error: errorNuevaVariante } =
        await supabase
          .from("inventario_variantes")
          .insert({
            inventario_id: inventarioId,
            marca_id: marca.id,
            user_id: session.user.id,
            nombre: nombreVariante || "Sin descripción",
            stock: Number(prod.cantidad || 0),
            minimo: 0,
            precioCompra: Number(prod.precioCompra || 0),
            precioVenta: Number(prod.precioVenta || 0),
            tipoVenta: prod.tipoVenta || "Unidad"
          })
          .select()
          .single();

      if (errorNuevaVariante) throw errorNuevaVariante;

      variante = nuevaVariante;

      console.log(
        "Nueva variante creada:",
        variante.nombre,
        "→ stock:",
        variante.stock
      );
    }

    // ===================================================
    // 7. RECALCULAR STOCK TOTAL DE LA MARCA
    // ===================================================
    const { data: todasLasVariantes, error: errorTodasVariantes } =
      await supabase
        .from("inventario_variantes")
        .select("stock")
        .eq("marca_id", marca.id)
        .eq("user_id", session.user.id);

    if (errorTodasVariantes) throw errorTodasVariantes;

    const stockTotalMarca = (todasLasVariantes || []).reduce(
      (total, v) => total + Number(v.stock || 0),
      0
    );

    const { error: errorActualizarMarca } = await supabase
      .from("inventario_marcas")
      .update({
        stock: stockTotalMarca
      })
      .eq("id", marca.id)
      .eq("user_id", session.user.id);

    if (errorActualizarMarca) throw errorActualizarMarca;

    console.log(
      `Marca ${nombreMarca}: stock total = ${stockTotalMarca}`
    );
  }

  console.log("Pedido recibido correctamente.");
  return true;
}