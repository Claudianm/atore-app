import FAB from "./components/FAB";
import { CATEGORIAS } from "./constants";
import Filtros from "./components/Filtros";
import { inputStyle } from "./styles";
import { useState } from "react";
function Inventario({ data, setData, session }) {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todos");
  const [modal, setModal] = useState(null);
  const [borrar, setBorrar] = useState(null);
  const [detalle, setDetalle] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevaCategoria, setNuevaCategoria] = useState("Alimentos");
  const [tieneMarcas, setTieneMarcas] = useState(true);
  const [tipoVenta, setTipoVenta] = useState("unidad");

const guardar = async (form) => {
  if (form.id) {

  const datosActualizar = {
  nombre: form.nombre,
  categoria: form.categoria,
  tieneMarcas: form.tieneMarcas,
  tipoVenta: form.tipoVenta
};

const { data: productoActualizado, error } = await supabase
  .from("inventario")
  .update(datosActualizar)
  .eq("id", form.id)
  .eq("user_id", session.user.id)
  .select()
  .single();

  if (error) {
    console.error(error);
    alert(error.message);
    return;
  }

  setData(ps =>
    ps.map(p =>
      p.id === productoActualizado.id ? productoActualizado : p
    )
  );

  setModal(null);
  return;
}

  const nuevoProducto = {
    user_id: session.user.id,
    nombre: form.nombre,
    categoria: form.categoria, 
    tieneMarcas: form.tieneMarcas,
    tipoVenta: form.tipoVenta,
    marcas: []
  };

  const { data: productoGuardado, error } = await supabase
    .from("inventario")
    .insert([nuevoProducto])
    .select()
    .single();

  if (error) {
    console.error(error);
    alert("Error al guardar producto");
    return;
  }

  setData(ps => [...ps, productoGuardado]);
  setModal(null);
};
  const actualizar = (prod) => { setData(ps => ps.map(p => p.id === prod.id ? prod : p)); setDetalle(prod); };

  if (detalle) {
  const prod = data.find(p => p.id === detalle.id);

  if (!prod.tieneMarcas) {
    return (
      <DetalleProductoSimple
        producto={prod}
        onVolver={() => setDetalle(null)}
        onActualizar={actualizar}
      />
    );
  }

  return (
    <DetalleProducto
      producto={prod}
      onVolver={() => setDetalle(null)}
      onActualizar={actualizar}
    />
  );
}


const filtrados = data.filter(
  p =>
    (p.nombre || "").toLowerCase().includes((busqueda || "").toLowerCase()) &&
    (categoria === "Todos" || p.categoria === categoria)
);
  const sinStock = data.filter(p => p.marcas.some(m => m.stock === 0)).length;
  const pocoStock = data.filter(p => p.marcas.some(m => m.stock > 0 && m.stock < m.minimo)).length;

  return (
    <>
      <div style={{ background: "#1a3a2a", padding: "16px 16px 14px" }}>
        <div style={{ color: "#7fbb95", fontSize: 11, marginBottom: 2 }}>Stock</div>
        <div style={{ color: "#e8f5ee", fontSize: 20, fontWeight: 500, marginBottom: 12 }}>{data.length} productos</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 12px" }}><div style={{ fontSize: 17, fontWeight: 500, color: "#e24b4a" }}>{sinStock}</div><div style={{ fontSize: 10, color: "#7fbb95" }}>Con sin stock</div></div>
          <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 12px" }}><div style={{ fontSize: 17, fontWeight: 500, color: "#ef9f27" }}>{pocoStock}</div><div style={{ fontSize: 10, color: "#7fbb95" }}>Poco stock</div></div>
        </div>
      </div>
      <div style={{ padding: "10px 14px 0" }}><input style={{ ...inputStyle, background: "var(--color-background-primary,#fff)" }} type="text" placeholder="Buscar producto..." value={busqueda} onChange={e => setBusqueda(e.target.value)} style={{
      width: "100%",
      padding: "10px 12px",
      borderRadius: 10,
      border: "1px solid #ddd",
      fontSize: 14,
      boxSizing: "border-box"
    }} /></div>
      <Filtros opciones={CATEGORIAS} activo={categoria} onChange={setCategoria} />
      <div style={{ padding: "0 14px", paddingBottom: 8 }}>
        {filtrados.length === 0 && <div style={{ textAlign: "center", padding: "32px 0", color: "var(--color-text-secondary,#888)", fontSize: 14 }}>Aún no tienes productos.
        Pulsa “+ Nuevo producto” para comenzar.</div>}
        {filtrados.map(p => {
          const st = stockTotal(p); const mn = minimoTotal(p);
          const est = estadoStock(st, mn); const b = badgeStock[est];
          const pct = mn > 0 ? Math.min(100, Math.round((st / (mn * 4)) * 100)) : 0;
          const barColor = est === "sin" ? "#e24b4a" : est === "poco" ? "#ef9f27" : "#1d9e75";
const marcas = p.marcas || [];

        const mp =
  marcas.length > 0
    ? Math.round(
        marcas.reduce((a, m) => a + margenPct(m), 0) / marcas.length
      )
    : null;
          const tv = p.marcas.reduce((a, m) => a + (m.vendidos || 0), 0);
          return (
            <div key={p.id} onClick={() => setDetalle(p)} style={{ background: "var(--color-background-primary,#fff)", border: "0.5px solid var(--color-border-tertiary,#ddd)", borderRadius: 12, padding: "12px 14px", marginBottom: 8, cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
  <div style={{ fontWeight: 500, fontSize: 14 }}>
    {p.nombre}
  </div>

  <div style={{ fontSize: 12, color: "var(--color-text-secondary,#888)", marginTop: 2 }}>
    {p.categoria} · {(p.marcas || []).length} marca{(p.marcas || []).length !== 1 ? "s" : ""}
    {tv > 0 && ` · ${tv} vendidos`}
  </div>
</div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                  <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 20, fontWeight: 500, background: b.bg, color: b.color }}>{b.label}</span>
                  {mp !== null && <span style={{ fontSize: 11, color: margenColor(mp), fontWeight: 500 }}>≈{mp}% margen</span>}
                </div>
              </div>
              <div style={{ height: 4, background: "var(--color-background-secondary,#f1f0ea)", borderRadius: 10, marginTop: 8, overflow: "hidden" }}><div style={{ width: `${pct}%`, height: "100%", background: barColor, borderRadius: 10 }} /></div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <span style={{ fontSize: 12, color: "var(--color-text-secondary,#888)" }}>Stock total: <strong style={{ color: "var(--color-text-primary,#111)" }}>{st}</strong></span>
                <div style={{ display: "flex", gap: 6 }} onClick={e => e.stopPropagation()}>
                  <button
  onClick={() => {
    setModal(p);
    setNuevoNombre(p.nombre);
    setNuevaCategoria(p.categoria);
    setTieneMarcas(p.tieneMarcas);
    setTipoVenta(p.tipoVenta || "unidad");
  }}
  style={{
    background: "var(--color-background-secondary,#f5f4f0)",
    border: "0.5px solid var(--color-border-tertiary,#ddd)",
    borderRadius: 6,
    padding: "5px 10px",
    fontSize: 12,
    cursor: "pointer"
  }}
>
  Editar
</button>
                  <button onClick={() => setBorrar(p)} style={{ background: "#fcebeb", border: "0.5px solid #f7c1c1", borderRadius: 6, padding: "5px 10px", fontSize: 12, cursor: "pointer", color: "#a32d2d" }}>Borrar</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <FAB label="+ Nuevo producto" onClick={() => setModal("nuevo")} />
      {modal && (
        <ModalBase titulo={modal === "nuevo" ? "Nuevo producto" : "Editar producto"} onCerrar={() => setModal(null)} onGuardar={() =>
  guardar(
    modal === "nuevo"
      ? {
          nombre: nuevoNombre,
  categoria: nuevaCategoria,
  tieneMarcas,
  tipoVenta,
  user_id: session.user.id
        }
      : {
          ...modal,
          nombre: nuevoNombre,
          categoria: nuevaCategoria,
          tieneMarcas,
          tipoVenta,
          user_id: session.user.id
        }
  )
} valido={true} labelGuardar={modal === "nuevo" ? "Crear producto" : "Guardar"}>
          {(() => {
            
            return (
              <>
                <Campo label="Nombre del producto">
  <input
    style={inputStyle}
    type="text"
    value={nuevoNombre}
    placeholder="Ej: Fideos, Arroz, Aceite..."
    onChange={(e) => setNuevoNombre(e.target.value)}
  />
</Campo>
                <Campo label="Categoría"><select style={inputStyle} value={nuevaCategoria} onChange={e => setNuevaCategoria(e.target.value)}>{CATEGORIAS.filter(x => x !== "Todos").map(x => <option key={x}>{x}</option>)}</select></Campo>
                <Campo label="¿Tiene marcas o variedades?">
  <select
    style={inputStyle}
    value={tieneMarcas ? "si" : "no"}
    onChange={(e) => setTieneMarcas(e.target.value === "si")}
  >
    <option value="si">Sí</option>
    <option value="no">No</option>
  </select>
</Campo>
<Campo label="¿Cómo se vende?">
  <select
    style={inputStyle}
    value={tipoVenta}
    onChange={(e) => setTipoVenta(e.target.value)}
  >
    <option value="unidad">Por unidad</option>
    <option value="peso">Por kilo</option>
  </select>
</Campo>

<div
  style={{
    fontSize: 12,
    color: "#888",
    marginBottom: 4
  }}
>
  {tieneMarcas
    ? "Las marcas se agregan desde el detalle del producto."
    : "Este producto no utilizará marcas ni variedades."}
</div>
<button
  onClick={() => {
    guardar(
      modal === "nuevo"
        ? {
            nombre: nuevoNombre,
            categoria: nuevaCategoria,
            tieneMarcas: tieneMarcas,
            tipoVenta: tipoVenta
          }
        : {
            ...modal,
            nombre: nuevoNombre,
            categoria: nuevaCategoria,
            tieneMarcas: tieneMarcas,
            tipoVenta: tipoVenta
          }
    );
  }}
  style={{ display: "none" }}
/>
              </>
            );
          })()}
        </ModalBase>
      )}
{borrar && (
  <ConfirmarBorrar
    titulo="producto"
    onConfirmar={async () => {
      if (!session) return;
      const { error } = await supabase
  .from("inventario")
  .delete()
  .eq("id", borrar.id)
  .eq("user_id", session.user.id);

      if (error) {
        alert(error.message);
        return;
      }

      setData(ps => ps.filter(p => p.id !== borrar.id));
      setBorrar(null);
    }}
    onCancelar={() => setBorrar(null)}
  />
)}
    </>
  );
}
export default Inventario;