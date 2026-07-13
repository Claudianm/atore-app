import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function DetalleProductoSimple({
  producto,
  onVolver,
  onActualizar
}) {
  const [form, setForm] = useState({
    precioCompra: producto.precioCompra || 0,
    precioVenta: producto.precioVenta || 0,
    stock: producto.stock || 0,
    minimo: producto.minimo || 0
  });

  const cambiar = (campo, valor) => {
  setForm({
    ...form,
    [campo]:
      producto.tipoVenta === "peso"
        ? parseFloat(valor) || 0
        : Number(valor)
  });
};

  const guardar = async () => {
    const actualizado = {
      ...producto,
      ...form
    };

    const { error } = await supabase
      .from("inventario")
      .update(form)
      .eq("id", producto.id);

    if (error) {
      alert(error.message);
      return;
    }

    onActualizar(actualizado);
    alert("Producto guardado");
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={onVolver}>← Volver</button>

      <h2>{producto.nombre}</h2>
      <p style={{ color: "#666", marginTop: -10, marginBottom: 20 }}>
  {producto.tipoVenta === "peso"
    ? "⚖️ Se vende por kilo"
    : "📦 Se vende por unidad"}
</p>

      <div>
        <label>
  {producto.tipoVenta === "peso"
    ? "Precio compra ($/kg)"
    : "Precio compra ($)"}
</label>
        <input
          type="number"
          value={form.precioCompra}
          onChange={e => cambiar("precioCompra", e.target.value)}
        />
      </div>

      <div>
        <label>
  {producto.tipoVenta === "peso"
    ? "Precio venta ($/kg)"
    : "Precio venta ($)"}
</label>
        <input
          type="number"
          value={form.precioVenta}
          onChange={e => cambiar("precioVenta", e.target.value)}
        />
      </div>

      <div>
        <label>
  {producto.tipoVenta === "peso"
    ? "Stock (kg)"
    : "Stock (unidades)"}
</label>
        <input
          type="number"
          value={form.stock}
          onChange={e => cambiar("stock", e.target.value)}
        />
      
      </div>

      <div>
        <label>
  {producto.tipoVenta === "peso"
    ? "Stock mínimo (kg)"
    : "Stock mínimo (unidades)"}
</label>
        <input
          type="number"
          value={form.minimo}
          onChange={e => cambiar("minimo", e.target.value)}
        />
      </div>

      <br />

      <button onClick={guardar}>
        Guardar
      </button>
    </div>
  );
}