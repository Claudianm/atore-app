import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://rstkjtuwvpdaowbqtspc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJzdGtqdHV3dnBkYW93YnF0c3BjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMzQ5NzYsImV4cCI6MjA5NDcxMDk3Nn0.qT_kQFGqkNs5i9duoVZure_fVP9XhLn54W0yRmSrYuE"
);

function AuthScreen() {
  const [modo, setModo] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombreNegocio, setNombreNegocio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleLogin = async () => {
    setLoading(true); setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError("Email o contraseña incorrectos");
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!nombreNegocio.trim()) { setError("Ingresa el nombre de tu almacén"); return; }
    setLoading(true); setError("");
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    if (data.user) {
      await supabase.from("profiles").insert({ id: data.user.id, nombre_negocio: nombreNegocio });
    }
    setMensaje("¡Cuenta creada! Revisa tu email para confirmar.");
    setLoading(false);
  };

  return (
    
    <div style={{ maxWidth: 420, margin: "0 auto", minHeight: "100vh", background: "#f5f4f0", fontFamily: "-apple-system, sans-serif" }}>
      <div style={{ background: "#1a3a2a", padding: "48px 24px 32px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 10 }}>🏪</div>
        <div style={{ color: "#e8f5ee", fontSize: 26, fontWeight: 700 }}>Mi Almacén</div>
        <div style={{ color: "#7fbb95", fontSize: 14, marginTop: 6 }}>Gestiona tu negocio desde el celular</div>
      </div>
      <div style={{ padding: "28px 20px" }}>
        <div style={{ display: "flex", background: "#e8e7e2", borderRadius: 10, padding: 4, marginBottom: 24 }}>
          {[{ k: "login", l: "Ingresar" }, { k: "register", l: "Registrarse" }].map(t => (
            <button key={t.k} onClick={() => { setModo(t.k); setError(""); setMensaje(""); }}
              style={{ flex: 1, padding: "9px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500, background: modo === t.k ? "white" : "transparent", color: modo === t.k ? "#1a3a2a" : "#888", transition: "all 0.15s" }}>
              {t.l}
            </button>
          ))}
        </div>
        {mensaje ? (
          <div style={{ background: "#eaf3de", border: "0.5px solid #b8dda0", borderRadius: 10, padding: 16, textAlign: "center", color: "#3b6d11", fontSize: 14 }}>
            ✅ {mensaje}<br /><br />
            <button onClick={() => { setModo("login"); setMensaje(""); }} style={{ background: "#1a3a2a", color: "white", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>Ir a Ingresar</button>
          </div>
        ) : (
          <>
            {modo === "register" && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>Nombre del almacén *</label>
                <input style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "0.5px solid #ccc", fontSize: 14, background: "#f8f8f6", boxSizing: "border-box" }} type="text" value={nombreNegocio} placeholder="Ej: Almacén Don Pedro" onChange={e => setNombreNegocio(e.target.value)} />
              </div>
            )}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>Email *</label>
              <input style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "0.5px solid #ccc", fontSize: 14, background: "#f8f8f6", boxSizing: "border-box" }} type="email" value={email} placeholder="tucorreo@email.com" onChange={e => setEmail(e.target.value)} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: "#888", display: "block", marginBottom: 4 }}>Contraseña *</label>
              <input style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "0.5px solid #ccc", fontSize: 14, background: "#f8f8f6", boxSizing: "border-box" }} type="password" value={password} placeholder="Mínimo 6 caracteres" onChange={e => setPassword(e.target.value)} />
            </div>
            {error && <div style={{ background: "#fcebeb", borderRadius: 8, padding: "10px 12px", marginBottom: 16, color: "#a32d2d", fontSize: 13 }}>⚠️ {error}</div>}
            <button onClick={modo === "login" ? handleLogin : handleRegister} disabled={loading}
              style={{ width: "100%", padding: "14px", background: loading ? "#ccc" : "#1a3a2a", color: "white", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? "Cargando..." : modo === "login" ? "Ingresar" : "Crear cuenta gratis"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}


// ============ CONSTANTES ============
const hoy = new Date().toISOString().slice(0, 10);
const mesActual = new Date().toISOString().slice(0, 7);

const CATEGORIAS = ["Todos", "Alimentos", "Bebidas", "Limpieza", "Lácteos", "Otros"];
const TIPOS_PAGO = ["Todos", "Venta", "Gasto", "Fiado", "Proveedor"];
const ESTADOS_PEDIDO = ["Todos", "Pendiente", "En camino", "Recibido", "Cancelado"];
const TIPOS_REC = ["Todos", "Fiado", "Pago", "Pedido", "Otro"];
const ICONOS_PAGO = { Venta: "💰", Gasto: "🧾", Fiado: "🤝", Proveedor: "🚚" };
const ICONOS_REC  = { Fiado: "🤝", Pago: "💰", Pedido: "🚚", Otro: "📌" };
const PRIORIDADES = ["Alta", "Media", "Baja"];
const ESTADO_ESTILOS = {
  Pendiente:   { background: "#faeeda", color: "#854f0b" },
  "En camino": { background: "#e6f1fb", color: "#185fa5" },
  Recibido:    { background: "#eaf3de", color: "#3b6d11" },
  Cancelado:   { background: "#f0f0f0", color: "#888" },
};
const PRIORIDAD_ESTILOS = {
  Alta:  { background: "#fcebeb", color: "#a32d2d" },
  Media: { background: "#faeeda", color: "#854f0b" },
  Baja:  { background: "#eaf3de", color: "#3b6d11" },
};

function formatPesos(n) { return "$" + Number(n).toLocaleString("es-CL"); }
function esIngreso(tipo) { return tipo === "Venta"; }
function diasRestantes(fecha) { return Math.ceil((new Date(fecha) - new Date(hoy)) / (1000 * 60 * 60 * 24)); }
function etiquetaDias(dias) {
  if (dias < 0)  return { texto: `Hace ${Math.abs(dias)}d`, color: "#a32d2d", bg: "#fcebeb" };
  if (dias === 0) return { texto: "Hoy", color: "#a32d2d", bg: "#fcebeb" };
  if (dias === 1) return { texto: "Mañana", color: "#854f0b", bg: "#faeeda" };
  if (dias <= 7)  return { texto: `En ${dias} días`, color: "#854f0b", bg: "#faeeda" };
  return { texto: `En ${dias} días`, color: "#3b6d11", bg: "#eaf3de" };
}
function margenPct(m) {
  if (!m.precioCompra || !m.precioVenta || m.precioVenta === 0) return 0;
  return Math.round(((m.precioVenta - m.precioCompra) / m.precioVenta) * 100);
}
function margenColor(pct) {
  if (pct >= 35) return "#1d9e75";
  if (pct >= 20) return "#ef9f27";
  return "#d85a30";
}
function stockTotal(p) {
  return (p.marcas || []).reduce((a, m) => a + m.stock, 0);
}
function minimoTotal(p) {
  return (p.marcas || []).reduce((a, m) => a + m.minimo, 0);
}
function estadoStock(stock, minimo) { return stock === 0 ? "sin" : stock < minimo ? "poco" : "ok"; }
const badgeStock = {
  sin:  { label: "Sin stock",  bg: "#fcebeb", color: "#a32d2d" },
  poco: { label: "Poco stock", bg: "#faeeda", color: "#854f0b" },
  ok:   { label: "Normal",     bg: "#eaf3de", color: "#3b6d11" },
};

// ============ DATOS INICIALES ============
const invInicial = [];
const pagosInicial = [];
const pedidosInicial = [];
// ============ COMPONENTES COMUNES ============
const inputStyle = { width: "100%", padding: "10px 12px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary,#ccc)", fontSize: 14, background: "var(--color-background-secondary,#f8f8f6)", boxSizing: "border-box" };

function Badge({ label, style }) { return <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 20, fontWeight: 500, ...style }}>{label}</span>; }
function Campo({ label, children }) { return <div style={{ marginBottom: 14 }}><label style={{ fontSize: 12, color: "var(--color-text-secondary,#888)", display: "block", marginBottom: 4 }}>{label}</label>{children}</div>; }
function SelectorBotones({ opciones, activo, onChange, iconos }) {
  return (
    <div
  style={{
    display: "flex",
    gap: 6,
    flexWrap: "nowrap",
    overflowX: "scroll",
    paddingBottom: 2,
    paddingRight: 10
  }}
>
      {opciones.map(o => (
        <button key={o} onClick={() => onChange(o)} style={{ padding: "5px 10px", borderRadius: 20, fontSize: 12, cursor: "pointer", border: "1px solid", boxSizing: "border-box", flexShrink: 0, transition: "all 0.15s", background: activo === o ? "#1a3a2a" : "var(--color-background-secondary,#f5f4f0)", color: activo === o ? "white" : "var(--color-text-primary,#111)", borderColor: activo === o ? "#1a3a2a" : "var(--color-border-tertiary,#ddd)" }}>
          {iconos && iconos[o] ? iconos[o] + " " : ""}{o}
        </button>
      ))}
    </div>
  );
}
function Filtros({ opciones, activo, onChange, iconos }) {
  return (
<div
  style={{
    display: "flex",
    gap: 6,
    padding: "10px 18px 10px 14px",
    overflowX: "scroll",
    scrollbarWidth: "none"
  }}
>
    {opciones.map(o => (
        <button key={o} onClick={() => onChange(o)} style={{ padding: "5px 10px", borderRadius: 20, fontSize: 12, FlexShrink: 0, cursor: "pointer", border: "1px solid", boxSizing: "border-box", flexShrink: 0, transition: "all 0.15s", background: activo === o ? "#1a3a2a" : "var(--color-background-primary,#fff)", color: activo === o ? "white" : "var(--color-text-secondary,#888)", borderColor: activo === o ? "#1a3a2a" : "var(--color-border-tertiary,#ddd)" }}>
          {iconos && o !== "Todos" ? iconos[o] + " " : ""}{o}
        </button>
      ))}
    </div>
  );
}
function FAB({ label, onClick }) {
  return (
    <div style={{ position: "fixed", bottom: 72, right: 18 }}>
      <button onClick={onClick} style={{ background: "#1a3a2a", color: "white", border: "none", borderRadius: 28, padding: "12px 18px", fontSize: 13, fontWeight: 500, cursor: "pointer", boxShadow: "0 4px 16px rgba(26,58,42,0.35)" }}>{label}</button>
    </div>
  );
}
function ModalBase({ titulo, onCerrar, children, onGuardar, valido, labelGuardar }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 100 }}>
      <div style={{ background: "var(--color-background-primary,#fff)", borderRadius: "16px 16px 0 0", padding: "24px 20px 36px", width: "100%", maxWidth: 420, maxHeight: "88vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontWeight: 500, fontSize: 16 }}>{titulo}</span>
          <button onClick={onCerrar} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer" }}>×</button>
        </div>
        {children}
        <button onClick={() => valido && onGuardar()} style={{ width: "100%", padding: "13px", background: valido ? "#1a3a2a" : "#ccc", color: "white", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 500, cursor: valido ? "pointer" : "not-allowed", marginTop: 4 }}>{labelGuardar}</button>
      </div>
    </div>
  );
}
function ConfirmarBorrar({ titulo, onConfirmar, onCancelar }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 24 }}>
      <div style={{ background: "var(--color-background-primary,#fff)", borderRadius: 14, padding: "24px 20px", width: "100%", maxWidth: 340 }}>
        <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 8 }}>¿Borrar {titulo}?</div>
        <div style={{ fontSize: 13, color: "var(--color-text-secondary,#888)", marginBottom: 20 }}>Esta acción no se puede deshacer.</div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancelar} style={{ flex: 1, padding: "11px", background: "var(--color-background-secondary,#f5f4f0)", border: "0.5px solid var(--color-border-tertiary,#ddd)", borderRadius: 8, fontSize: 14, cursor: "pointer" }}>Cancelar</button>
          <button onClick={onConfirmar} style={{ flex: 1, padding: "11px", background: "#a32d2d", color: "white", border: "none", borderRadius: 8, fontSize: 14, cursor: "pointer" }}>Sí, borrar</button>
        </div>
      </div>
    </div>
  );
}

// ============ INVENTARIO ============
function ModalMarca({ marca, onGuardar, onCerrar, theme }) {
const [form, setForm] = useState(
  marca ?? {
    marca: "",
    precioCompra: 0,
    precioVenta: 0,
    stock: 0,
    minimo: 0,
    vendidos: 0
  }
);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valido =
  (form.marca || "").trim() && form.precioCompra !== "" && form.precioVenta !== "" && form.stock !== "" && form.minimo !== "";
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 200 }}>
      <div
  style={{
    background: theme === "light" ? "#fff" : "#1e1e1e",
    borderRadius: "16px 16px 0 0",
    padding: "24px 20px 36px",
    width: "100%",
    maxWidth: 420,
    maxHeight: "88vh",
    overflowY: "auto",
    color: theme === "light" ? "#111" : "#f5f5f5"
  }}
>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontWeight: 500, fontSize: 16 }}>{marca ? "Editar marca" : "Nueva marca"}</span>
          <button onClick={onCerrar} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer" }}>×</button>
        </div>
        {[
          { label: "Nombre", key: "marca", type: "text", placeholder: "Ej: Carozzi 500g" },
          { label: "Precio de compra ($)",   key: "precioCompra", type: "number", placeholder: "0" },
          { label: "Precio de venta ($)",    key: "precioVenta",  type: "number", placeholder: "0" },
          { label: "Stock actual",           key: "stock",        type: "number", placeholder: "0" },
          { label: "Stock mínimo",           key: "minimo",       type: "number", placeholder: "5" },
          { label: "Unidades vendidas",      key: "vendidos",     type: "number", placeholder: "0" },
        ].map(({ label, key, type, placeholder }) => (
          <div key={key} style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: "var(--color-text-secondary,#888)", display: "block", marginBottom: 4 }}>{label}</label>
            <input style={inputStyle} type={type} value={form[key]} placeholder={placeholder} onChange={e => set(key, type === "number" ? (e.target.value === "" ? "" : Number(e.target.value)) : e.target.value)} />
          </div>                 
        ))}
        {form.precioCompra !== "" && form.precioVenta !== "" && Number(form.precioVenta) > 0 && (
          <div style={{ background: "#eaf3de", borderRadius: 8, padding: "8px 12px", marginBottom: 16, fontSize: 13 }}>
            Margen estimado: <strong style={{ color: margenColor(margenPct(form)) }}>{margenPct(form)}%</strong>
          </div>
        )}
        <button onClick={() => valido && onGuardar(form)} style={{ width: "100%", padding: "13px", background: valido ? "#1a3a2a" : "#ccc", color: "white", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 500, cursor: valido ? "pointer" : "not-allowed" }}>
          {marca ? "Guardar cambios" : "Agregar marca"}
        </button>
      </div>
    </div>
  );
}

function DetalleProducto({ producto, onVolver, onActualizar, theme }) {
const [modalMarca, setModalMarca] = useState(null);
  const [borrarMarca, setBorrarMarca] = useState(null);
  const [vista, setVista] = useState("stock");

  const guardarMarca = async (form) => {
  const marcas = form.id
    ? producto.marcas.map(m => m.id === form.id ? form : m)
    : [...producto.marcas, { ...form, id: Date.now() }];

  const { error } = await supabase
    .from("inventario")
    .update({ marcas })
    .eq("id", producto.id);

  if (error) {
    console.error(error);
    alert("Error al guardar marca");
    return;
  }

  onActualizar({ ...producto, marcas });
  setModalMarca(null);
};

const totalVendidos = (producto.marcas || []).reduce(
  (a, m) => a + (m.vendidos || 0),
  0
);
const marcas = producto.marcas || [];

const margenProm = marcas.length > 0
  ? Math.round(
      marcas.reduce((a, m) => a + margenPct(m), 0) / marcas.length
    )
  : 0;
const mejorMarca  = [...producto.marcas].sort((a, b) => (b.vendidos || 0) - (a.vendidos || 0))[0];
  const mayorMargen = [...producto.marcas].sort((a, b) => margenPct(b) - margenPct(a))[0];

  return (
    <div>
      <div style={{ background: "#1a3a2a", padding: "16px 16px 14px" }}>
        <button onClick={onVolver} style={{ background: "none", border: "none", color: "#7fbb95", fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 8 }}>← Volver</button>
        <div style={{ color: "#e8f5ee", fontSize: 20, fontWeight: 500 }}>{producto.nombre}</div>
        <div style={{ color: "#7fbb95", fontSize: 12, marginBottom: 12 }}>{producto.categoria} · {producto.marcas.length} marcas</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[{ v: stockTotal(producto), c: "#e8f5ee", l: "Stock total" }, { v: totalVendidos, c: "#7febb8", l: "Vendidos" }, { v: margenProm + "%", c: margenColor(margenProm), l: "Margen prom." }].map(x => (
            <div key={x.l} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 10px" }}><div style={{ fontSize: 15, fontWeight: 500, color: x.c }}>{x.v}</div><div style={{ fontSize: 10, color: "#7fbb95" }}>{x.l}</div></div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", background: "var(--color-background-primary,#fff)", borderBottom: "0.5px solid var(--color-border-tertiary,#ddd)" }}>
        {[{ k: "stock", l: "Stock por marca" }, { k: "analisis", l: "Análisis" }].map(t => (
          <button key={t.k} onClick={() => setVista(t.k)} style={{ flex: 1, padding: "10px", fontSize: 13, background: "none", border: "none", cursor: "pointer", color: vista === t.k ? "#1a3a2a" : "var(--color-text-secondary,#888)", borderBottom: vista === t.k ? "2px solid #1a3a2a" : "2px solid transparent", fontWeight: vista === t.k ? 500 : 400 }}>{t.l}</button>
        ))}
      </div>

      <div style={{ padding: "14px", paddingBottom: 80 }}>
        {vista === "stock" && (
          <>
            {producto.marcas.length === 0 && <div style={{ textAlign: "center", padding: "32px 0", color: "var(--color-text-secondary,#888)", fontSize: 14 }}>Sin marcas. Agrega la primera.</div>}
            {producto.marcas.map(m => {
              const est = estadoStock(m.stock, m.minimo);
              const b = badgeStock[est];
              const mg = margenPct(m);
              const pct = m.minimo > 0 ? Math.min(100, Math.round((m.stock / (m.minimo * 4)) * 100)) : 0;
              const barColor = est === "sin" ? "#e24b4a" : est === "poco" ? "#ef9f27" : "#1d9e75";
              return (
                <div key={m.id} style={{ background: "var(--color-background-primary,#fff)", border: "0.5px solid var(--color-border-tertiary,#ddd)", borderRadius: 12, padding: "12px 14px", marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}><div style={{ fontWeight: 500, fontSize: 14 }}>{m.marca}</div><div style={{ fontSize: 12, color: "var(--color-text-secondary,#888)", marginTop: 2 }}>Compra: {formatPesos(m.precioCompra)} · Venta: {formatPesos(m.precioVenta)}</div></div>
                    <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 20, fontWeight: 500, background: b.bg, color: b.color }}>{b.label}</span>
                  </div>
                  <div style={{ height: 4, background: "var(--color-background-secondary,#f1f0ea)", borderRadius: 10, marginTop: 8, overflow: "hidden" }}><div style={{ width: `${pct}%`, height: "100%", background: barColor, borderRadius: 10 }} /></div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12 }}>
                    <span style={{ color: "var(--color-text-secondary,#888)" }}>Stock: <strong style={{ color: "var(--color-text-primary,#111)" }}>{m.stock}</strong> · mín {m.minimo}</span>
                    <span style={{ color: margenColor(mg), fontWeight: 500 }}>Margen: {mg}%</span>
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 10, justifyContent: "flex-end" }}>
                    <button onClick={() => setModalMarca(m)} style={{ background: "var(--color-background-secondary,#f5f4f0)", border: "0.5px solid var(--color-border-tertiary,#ddd)", borderRadius: 6, padding: "5px 10px", fontSize: 12, cursor: "pointer" }}>Editar</button>
                    <button onClick={() => setBorrarMarca(m)} style={{ background: "#fcebeb", border: "0.5px solid #f7c1c1", borderRadius: 6, padding: "5px 10px", fontSize: 12, cursor: "pointer", color: "#a32d2d" }}>Borrar</button>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {vista === "analisis" && (
          <>
            {producto.marcas.length === 0 && <div style={{ textAlign: "center", padding: "32px 0", color: "var(--color-text-secondary,#888)", fontSize: 14 }}>Sin marcas para analizar.</div>}
            {producto.marcas.length > 0 && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                  <div style={{ background: "var(--color-background-primary,#fff)", border: "0.5px solid #b8dda0", borderLeft: "3px solid #1d9e75", borderRadius: 10, padding: "10px 12px" }}>
                    <div style={{ fontSize: 11, color: "var(--color-text-secondary,#888)" }}>Más vendida</div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{mejorMarca?.marca}</div>
                    <div style={{ fontSize: 12, color: "#1d9e75" }}>{mejorMarca?.vendidos || 0} unidades</div>
                  </div>
                  <div style={{ background: "var(--color-background-primary,#fff)", border: "0.5px solid #b3d0f0", borderLeft: "3px solid #185fa5", borderRadius: 10, padding: "10px 12px" }}>
                    <div style={{ fontSize: 11, color: "var(--color-text-secondary,#888)" }}>Mayor margen</div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{mayorMargen?.marca}</div>
                    <div style={{ fontSize: 12, color: "#185fa5" }}>{margenPct(mayorMargen || {})}%</div>
                  </div>
                </div>

                <div style={{ background: "var(--color-background-primary,#fff)", border: "0.5px solid var(--color-border-tertiary,#ddd)", borderRadius: 12, padding: "14px", marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-secondary,#888)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Ranking de ventas</div>
                  {[...producto.marcas].sort((a, b) => (b.vendidos || 0) - (a.vendidos || 0)).map((m, i) => {
                    const maxV = Math.max(...producto.marcas.map(x => x.vendidos || 0));
                    const pct = maxV > 0 ? Math.round(((m.vendidos || 0) / maxV) * 100) : 0;
                    return (
                      <div key={m.id} style={{ marginBottom: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}><span style={{ fontSize: 13 }}>{i + 1}. {m.marca}</span><span style={{ fontSize: 13, fontWeight: 500 }}>{m.vendidos || 0} uds</span></div>
                        <div style={{ height: 6, background: "var(--color-background-secondary,#f1f0ea)", borderRadius: 10, overflow: "hidden" }}><div style={{ width: `${pct}%`, height: "100%", background: i === 0 ? "#1d9e75" : i === 1 ? "#4db87a" : "#8fd4aa", borderRadius: 10 }} /></div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ background: "var(--color-background-primary,#fff)", border: "0.5px solid var(--color-border-tertiary,#ddd)", borderRadius: 12, padding: "14px" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-secondary,#888)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>Margen por marca</div>
                  {[...producto.marcas].sort((a, b) => margenPct(b) - margenPct(a)).map(m => {
                    const mg = margenPct(m);
                    return (
                      <div key={m.id} style={{ marginBottom: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}><span style={{ fontSize: 13 }}>{m.marca}</span><span style={{ fontSize: 13, fontWeight: 600, color: margenColor(mg) }}>{mg}%</span></div>
                        <div style={{ height: 6, background: "var(--color-background-secondary,#f1f0ea)", borderRadius: 10, overflow: "hidden" }}><div style={{ width: `${mg}%`, height: "100%", background: margenColor(mg), borderRadius: 10 }} /></div>
                        <div style={{ fontSize: 11, color: "var(--color-text-secondary,#888)", marginTop: 2 }}>Compra {formatPesos(m.precioCompra)} → Venta {formatPesos(m.precioVenta)} · Ganancia {formatPesos(m.precioVenta - m.precioCompra)} c/u</div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </div>

      <div style={{ position: "fixed", bottom: 72, right: 18 }}>
        <button onClick={() => setModalMarca("nuevo")} style={{ background: "#1a3a2a", color: "white", border: "none", borderRadius: 28, padding: "12px 18px", fontSize: 13, fontWeight: 500, cursor: "pointer", boxShadow: "0 4px 16px rgba(26,58,42,0.35)" }}>+ Agregar marca</button>
      </div>

    {modalMarca && (
  <ModalMarca
    marca={modalMarca === "nuevo" ? null : modalMarca}
    onGuardar={guardarMarca}
    onCerrar={() => setModalMarca(null)}
    theme={theme}
  />
)}
      {borrarMarca && <ConfirmarBorrar titulo="marca" onConfirmar={() => { onActualizar({ ...producto, marcas: producto.marcas.filter(m => m.id !== borrarMarca.id) }); setBorrarMarca(null); }} onCancelar={() => setBorrarMarca(null)} />}
    </div>
  );
}

function Inventario({ data, setData, session }) {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todos");
  const [modal, setModal] = useState(null);
  const [borrar, setBorrar] = useState(null);
  const [detalle, setDetalle] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevaCategoria, setNuevaCategoria] = useState("Alimentos");

const guardar = async (form) => {
  if (form.id) {
    setData(ps =>
      ps.map(p => p.id === form.id ? { ...p, ...form } : p)
    );
    setModal(null);
    return;
  }

  const nuevoProducto = {
    user_id: session.user.id,
    nombre: form.nombre,
    categoria: form.categoria,
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
    return <DetalleProducto producto={prod} onVolver={() => setDetalle(null)} onActualizar={actualizar} />;
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
                  <button onClick={() => setModal(p)} style={{ background: "var(--color-background-secondary,#f5f4f0)", border: "0.5px solid var(--color-border-tertiary,#ddd)", borderRadius: 6, padding: "5px 10px", fontSize: 12, cursor: "pointer" }}>Editar</button>
                  <button onClick={() => setBorrar(p)} style={{ background: "#fcebeb", border: "0.5px solid #f7c1c1", borderRadius: 6, padding: "5px 10px", fontSize: 12, cursor: "pointer", color: "#a32d2d" }}>Borrar</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <FAB label="+ Nuevo producto" onClick={() => setModal("nuevo")} />
      {modal && (
        <ModalBase titulo={modal === "nuevo" ? "Nuevo producto" : "Editar producto"} onCerrar={() => setModal(null)} onGuardar={() => guardar(modal === "nuevo" ? { nombre: nuevoNombre, categoria: nuevaCategoria } : modal)} valido={true} labelGuardar={modal === "nuevo" ? "Crear producto" : "Guardar"}>
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
                <div style={{ fontSize: 12, color: "var(--color-text-secondary,#888)", marginBottom: 4 }}>Las marcas se agregan desde el detalle del producto.</div>
                <button onClick={() => { guardar(modal === "nuevo" ? { nombre: n, categoria: c } : { ...modal, nombre: n, categoria: c }); }} style={{ display: "none" }} />
              </>
            );
          })()}
        </ModalBase>
      )}
      {borrar && <ConfirmarBorrar titulo="producto" onConfirmar={() => { setData(ps => ps.filter(p => p.id !== borrar.id)); setBorrar(null); }} onCancelar={() => setBorrar(null)} />}
    </>
  );
}

// ============ PAGOS ============
function ModalPago({ pago, onGuardar, onCerrar }) {
  const [form, setForm] = useState(pago || { tipo: "Venta", descripcion: "", monto: "", fecha: hoy, pagado: true });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valido = form.descripcion.trim() && form.monto !== "";
  return (
    <ModalBase titulo={pago ? "Editar registro" : "Nuevo registro"} onCerrar={onCerrar} onGuardar={() => onGuardar(form)} valido={valido} labelGuardar={pago ? "Guardar cambios" : "Agregar registro"}>
      <Campo label="Tipo"><SelectorBotones opciones={TIPOS_PAGO.filter(t => t !== "Todos")} activo={form.tipo} onChange={v => set("tipo", v)} iconos={ICONOS_PAGO} /></Campo>
      <Campo label="Descripción"><input style={inputStyle} type="text" value={form.descripcion} placeholder="Ej: Venta del día, Juan..." onChange={e => set("descripcion", e.target.value)} /></Campo>
      <Campo label="Monto ($)"><input style={inputStyle} type="number" value={form.monto} placeholder="0" onChange={e => set("monto", e.target.value === "" ? "" : Number(e.target.value))} /></Campo>
      <Campo label="Fecha"><input style={inputStyle} type="date" value={form.fecha} onChange={e => set("fecha", e.target.value)} /></Campo>
      {form.tipo === "Fiado" && (<div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}><input type="checkbox" id="pagado" checked={form.pagado} onChange={e => set("pagado", e.target.checked)} style={{ width: 18, height: 18 }} /><label htmlFor="pagado" style={{ fontSize: 14 }}>Ya fue pagado</label></div>)}
    </ModalBase>
  );
}
function Pagos({ data, setData, session }) {
  const [filtro, setFiltro] = useState("Todos");
  const [tab, setTab] = useState("lista");
  const [modal, setModal] = useState(null);
  const [borrar, setBorrar] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const guardar = async (form) => {
  if (form.id) {
    setData(ps =>
      ps.map(p => p.id === form.id ? form : p)
    );
    setModal(null);
    return;
  }

  const nuevoPago = {
  user_id: session.user.id,
  tipo: form.tipo,
  descripcion: form.descripcion,
  monto: form.monto,
  fecha: form.fecha,
  pagado: form.pagado || false
};
  const { data: pagoGuardado, error } = await supabase
    .from("pagos")
    .insert([nuevoPago])
    .select()
    .single();

  if (error) {
    console.error(error);
    alert(error.message);
    return;
  }

  setData(ps => [pagoGuardado, ...ps]);
  setModal(null);
};
  const filtrados = data.filter(p => {
  const nombre = (p.descripcion || "").toLowerCase();
  const texto = (busqueda || "").toLowerCase();

  return (
    (filtro === "Todos" || p.tipo === filtro) &&
    nombre.includes(texto)
  );
});
  const totalIngresos = data.filter(p => esIngreso(p.tipo)).reduce((a, p) => a + p.monto, 0);
  const totalGastos = data.filter(p => !esIngreso(p.tipo) && p.tipo !== "Fiado").reduce((a, p) => a + p.monto, 0);
  const fiados = data.filter(p => p.tipo === "Fiado" && !p.pagado);
  const totalFiado = fiados.reduce((a, p) => a + p.monto, 0);
  const balance = totalIngresos - totalGastos;
  return (
    <>
      <div style={{ background: "#1a3a2a", padding: "16px 16px 14px" }}>
        <div style={{ color: "#7fbb95", fontSize: 11, marginBottom: 2 }}>Pagos </div>
        <div style={{ color: "#e8f5ee", fontSize: 20, fontWeight: 500, marginBottom: 12 }}>Balance: <span style={{ color: balance >= 0 ? "#7febb8" : "#f28b7a" }}>{formatPesos(balance)}</span></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[{ v: formatPesos(totalIngresos), c: "#7febb8", l: "Ingresos" }, { v: formatPesos(totalGastos), c: "#f28b7a", l: "Gastos" }, { v: formatPesos(totalFiado), c: "#ef9f27", l: "Fiado" }].map(x => (
            <div key={x.l} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 10px" }}><div style={{ fontSize: 13, fontWeight: 500, color: x.c }}>{x.v}</div><div style={{ fontSize: 10, color: "#7fbb95" }}>{x.l}</div></div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", background: "var(--color-background-primary,#fff)", borderBottom: "0.5px solid var(--color-border-tertiary,#ddd)" }}>
        {[{ k: "lista", l: "Registros" }, { k: "fiados", l: `Fiados (${fiados.length})` }].map(t => (
          <button key={t.k} onClick={() => setTab(t.k)} style={{ flex: 1, padding: "10px", fontSize: 13, background: "none", border: "none", cursor: "pointer", color: tab === t.k ? "#1a3a2a" : "var(--color-text-secondary,#888)", borderBottom: tab === t.k ? "2px solid #1a3a2a" : "2px solid transparent", fontWeight: tab === t.k ? 500 : 400 }}>{t.l}</button>
        ))}
      </div>
      {tab === "lista" && (
        <>
          <Filtros opciones={TIPOS_PAGO} activo={filtro} onChange={setFiltro} iconos={ICONOS_PAGO} />
          <div style={{ padding: "0 14px", paddingBottom: 8 }}>
            {filtrados.length === 0 && <div style={{ textAlign: "center", padding: "32px 0", color: "var(--color-text-secondary,#888)", fontSize: 14 }}>Aún no tienes registros.
          Pulsa “+ Registrar” para comenzar.</div>}
            {filtrados.map(p => (
              <div key={p.id} style={{ background: "var(--color-background-primary,#fff)", border: "0.5px solid var(--color-border-tertiary,#ddd)", borderRadius: 12, padding: "12px 14px", marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div><div style={{ fontWeight: 500, fontSize: 14 }}>{ICONOS_PAGO[p.tipo]} {p.descripcion}</div><div style={{ fontSize: 12, color: "var(--color-text-secondary,#888)", marginTop: 2 }}>{p.tipo} · {p.fecha}{p.tipo === "Fiado" && <span style={{ marginLeft: 6, ...(p.pagado ? { background: "#eaf3de", color: "#3b6d11" } : { background: "#faeeda", color: "#854f0b" }), padding: "1px 7px", borderRadius: 10, fontSize: 11 }}>{p.pagado ? "Pagado" : "Pendiente"}</span>}</div></div>
                  <span style={{ fontWeight: 500, fontSize: 14, color: esIngreso(p.tipo) ? "#1d9e75" : "#d85a30" }}>{esIngreso(p.tipo) ? "+" : "-"}{formatPesos(p.monto)}</span>
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 10, justifyContent: "flex-end" }}>
                  <button onClick={() => setModal(p)} style={{ background: "var(--color-background-secondary,#f5f4f0)", border: "0.5px solid var(--color-border-tertiary,#ddd)", borderRadius: 6, padding: "5px 10px", fontSize: 12, cursor: "pointer" }}>Editar</button>
                  <button onClick={() => setBorrar(p)} style={{ background: "#fcebeb", border: "0.5px solid #f7c1c1", borderRadius: 6, padding: "5px 10px", fontSize: 12, cursor: "pointer", color: "#a32d2d" }}>Borrar</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {tab === "fiados" && (
        <div style={{ padding: "14px" }}>
          {fiados.length === 0 && <div style={{ textAlign: "center", padding: "32px 0", color: "var(--color-text-secondary,#888)", fontSize: 14 }}>🎉 Sin fiados pendientes</div>}
          {fiados.map(p => (
            <div key={p.id} style={{ background: "var(--color-background-primary,#fff)", border: "0.5px solid #f7c1c1", borderLeft: "3px solid #ef9f27", borderRadius: 12, padding: "12px 14px", marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><div><div style={{ fontWeight: 500, fontSize: 14 }}>🤝 {p.descripcion}</div><div style={{ fontSize: 12, color: "var(--color-text-secondary,#888)", marginTop: 2 }}>Desde {p.fecha}</div></div><span style={{ fontWeight: 500, color: "#d85a30" }}>{formatPesos(p.monto)}</span></div>
              <button onClick={() => setData(ps => ps.map(x => x.id === p.id ? { ...x, pagado: true } : x))} style={{ width: "100%", marginTop: 10, padding: "8px", background: "#1a3a2a", color: "white", border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>✓ Marcar como pagado</button>
            </div>
          ))}
          {fiados.length > 0 && <div style={{ padding: "10px 14px", background: "var(--color-background-secondary,#f5f4f0)", borderRadius: 10, textAlign: "center", fontSize: 13 }}>Total pendiente: <strong style={{ color: "#d85a30" }}>{formatPesos(totalFiado)}</strong></div>}
        </div>
      )}
      <FAB label="+ Registrar" onClick={() => setModal("nuevo")} />
      {modal && <ModalPago pago={modal === "nuevo" ? null : modal} onGuardar={guardar} onCerrar={() => setModal(null)} />}
      {borrar && <ConfirmarBorrar titulo="registro" onConfirmar={() => { setData(ps => ps.filter(p => p.id !== borrar.id)); setBorrar(null); }} onCancelar={() => setBorrar(null)} />}
    </>
  );
}

// ============ PEDIDOS ============
function ModalPedido({ pedido, onGuardar, onCerrar }) {
  const [form, setForm] = useState(pedido || { proveedor: "", fecha: hoy, estado: "Pendiente", productos: [], monto: "" });
  const [prodInput, setProdInput] = useState("");
  const [theme, setTheme] = useState("light")
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const agregar = () => { const p = prodInput.trim(); if (p && !form.productos.includes(p)) { set("productos", [...form.productos, p]); setProdInput(""); } };
  const valido = form.proveedor.trim() && form.productos.length > 0 && form.monto !== "";
  return (
    <ModalBase titulo={pedido ? "Editar pedido" : "Nuevo pedido"} onCerrar={onCerrar} onGuardar={() => onGuardar(form)} valido={valido} labelGuardar={pedido ? "Guardar cambios" : "Crear pedido"}>
      <Campo label="Proveedor"><input style={inputStyle} type="text" value={form.proveedor} placeholder="Ej: Distribuidora Norte" onChange={e => set("proveedor", e.target.value)} /></Campo>
      <Campo label="Monto total ($)"><input style={inputStyle} type="number" value={form.monto} placeholder="0" onChange={e => set("monto", e.target.value === "" ? "" : Number(e.target.value))} /></Campo>
      <Campo label="Fecha"><input style={inputStyle} type="date" value={form.fecha} onChange={e => set("fecha", e.target.value)} /></Campo>
      <Campo label="Estado"><SelectorBotones opciones={ESTADOS_PEDIDO.filter(e => e !== "Todos")} activo={form.estado} onChange={v => set("estado", v)} /></Campo>
      <Campo label="Productos">
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}><input style={{ ...inputStyle, flex: 1 }} type="text" value={prodInput} placeholder="Ej: Arroz 1kg" onChange={e => setProdInput(e.target.value)} onKeyDown={e => e.key === "Enter" && agregar()} /><button onClick={agregar} style={{ background: "#1a3a2a", color: "white", border: "none", borderRadius: 8, padding: "0 14px", fontSize: 16, cursor: "pointer" }}>+</button></div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {form.productos.map(p => (<span key={p} onClick={() => set("productos", form.productos.filter(x => x !== p))} style={{ background: "#eaf3de", color: "#3b6d11", border: "0.5px solid #b8dda0", borderRadius: 6, padding: "3px 8px", fontSize: 12, cursor: "pointer" }}>{p} <span style={{ opacity: 0.6 }}>×</span></span>))}
          {form.productos.length === 0 && <span style={{ fontSize: 12, color: "var(--color-text-secondary,#aaa)" }}>Aún no tienes productos agregados</span>}
        </div>
      </Campo>
    </ModalBase>
  );
}
function Pedidos({ data, setData, session }) {
  const [filtro, setFiltro] = useState("Todos");
  const [modal, setModal] = useState(null);
  const [borrar, setBorrar] = useState(null);
  const [expandido, setExpandido] = useState(null);
const guardar = async (form) => {
  if (form.id) {
    setData(ps =>
      ps.map(p => p.id === form.id ? form : p)
    );
    setModal(null);
    return;
  }

  const nuevoPedido = {
    user_id: session.user.id,
    proveedor: form.proveedor,
    fecha: form.fecha,
    estado: form.estado,
    productos: form.productos || [],
    monto: form.monto
  };

  const { data: pedidoGuardado, error } = await supabase
    .from("pedidos")
    .insert([nuevoPedido])
    .select()
    .single();

  if (error) {
    console.error(error);
    alert("Error al guardar pedido");
    return;
  }

  setData(ps => [pedidoGuardado, ...ps]);
  setModal(null);
};
  const filtrados = data.filter(p => filtro === "Todos" || p.estado === filtro);
  const enCamino = data.filter(p => p.estado === "En camino").length;
  const pendientes = data.filter(p => p.estado === "Pendiente").length;
  const total = data.filter(p => p.estado !== "Cancelado").reduce((a, p) => a + p.monto, 0);
  return (
    <>
<div
  style={{
    background: "#1a3a2a", 
    padding: "16px 16px 14px"
  }}
>        
        <div style={{ color: "#7fbb95", fontSize: 11, marginBottom: 2 }}>Pedidos</div>
        <div style={{ color: "#e8f5ee", fontSize: 20, fontWeight: 500, marginBottom: 12 }}>Proveedores</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[{ v: enCamino, c: "#e8f5ee", l: "En camino" }, { v: pendientes, c: "#ef9f27", l: "Pendientes" }, { v: formatPesos(total), c: "#7febb8", l: "Total" }].map(x => (
            <div key={x.l} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 10px" }}><div style={{ fontSize: 13, fontWeight: 500, color: x.c }}>{x.v}</div><div style={{ fontSize: 10, color: "#7fbb95" }}>{x.l}</div></div>
          ))}
        </div>
      </div>
      <Filtros opciones={ESTADOS_PEDIDO} activo={filtro} onChange={setFiltro} />
      <div style={{ padding: "0 14px", paddingBottom: 8 }}>
        {filtrados.length === 0 && <div style={{ textAlign: "center", padding: "32px 0", color: "var(--color-text-secondary,#888)", fontSize: 14 }}>Aún no tienes pedidos.
       Pulsa “+ Nuevo pedido” para comenzar.</div>}
        {filtrados.map(p => (
          <div key={p.id} style={{ background: "var(--color-background-primary,#fff)", border: "0.5px solid var(--color-border-tertiary,#ddd)", borderRadius: 12, padding: "12px 14px", marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div><div style={{ fontWeight: 500, fontSize: 14 }}>🚚 {p.proveedor}</div><div style={{ fontSize: 12, color: "var(--color-text-secondary,#888)", marginTop: 2 }}>{p.fecha} · {p.productos.length} productos · {formatPesos(p.monto)}</div></div>
              <Badge label={p.estado} style={ESTADO_ESTILOS[p.estado] || {}} />
            </div>
            <button onClick={() => setExpandido(expandido === p.id ? null : p.id)} style={{ background: "none", border: "none", fontSize: 12, color: "var(--color-text-secondary,#888)", cursor: "pointer", padding: "6px 0 0", display: "block" }}>{expandido === p.id ? "▲ Ocultar" : "▼ Ver productos"}</button>
            {expandido === p.id && <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 6 }}>{p.productos.map(prod => <span key={prod} style={{ background: "var(--color-background-secondary,#f5f4f0)", border: "0.5px solid var(--color-border-tertiary,#ddd)", borderRadius: 6, padding: "3px 8px", fontSize: 11, color: "var(--color-text-secondary,#666)" }}>{prod}</span>)}</div>}
            {p.estado !== "Recibido" && p.estado !== "Cancelado" && (
              <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                {p.estado === "Pendiente" && <button onClick={() => setData(ps => ps.map(x => x.id === p.id ? { ...x, estado: "En camino" } : x))} style={{ flex: 1, padding: "7px", background: "#e6f1fb", color: "#185fa5", border: "0.5px solid #b3d0f0", borderRadius: 8, fontSize: 12, cursor: "pointer" }}>🚚 En camino</button>}
                {p.estado === "En camino" && <button onClick={() => setData(ps => ps.map(x => x.id === p.id ? { ...x, estado: "Recibido" } : x))} style={{ flex: 1, padding: "7px", background: "#eaf3de", color: "#3b6d11", border: "0.5px solid #b8dda0", borderRadius: 8, fontSize: 12, cursor: "pointer" }}>✓ Recibido</button>}
                <button onClick={() => setData(ps => ps.map(x => x.id === p.id ? { ...x, estado: "Cancelado" } : x))} style={{ padding: "7px 10px", background: "#f0f0f0", color: "#888", border: "0.5px solid #ddd", borderRadius: 8, fontSize: 12, cursor: "pointer" }}>Cancelar</button>
              </div>
            )}
            <div style={{ display: "flex", gap: 6, marginTop: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setModal(p)} style={{ background: "var(--color-background-secondary,#f5f4f0)", border: "0.5px solid var(--color-border-tertiary,#ddd)", borderRadius: 6, padding: "5px 10px", fontSize: 12, cursor: "pointer" }}>Editar</button>
              <button onClick={() => setBorrar(p)} style={{ background: "#fcebeb", border: "0.5px solid #f7c1c1", borderRadius: 6, padding: "5px 10px", fontSize: 12, cursor: "pointer", color: "#a32d2d" }}>Borrar</button>
            </div>
          </div>
        ))}
      </div>
      <FAB label="+ Nuevo pedido" onClick={() => setModal("nuevo")} />
      {modal && <ModalPedido pedido={modal === "nuevo" ? null : modal} onGuardar={guardar} onCerrar={() => setModal(null)} />}
      {borrar && <ConfirmarBorrar titulo="pedido" onConfirmar={() => { setData(ps => ps.filter(p => p.id !== borrar.id)); setBorrar(null); }} onCancelar={() => setBorrar(null)} />}
    </>
  );
}

// ============ RECORDATORIOS ============
function ModalRecordatorio({ rec, onGuardar, onCerrar }) {
  const [form, setForm] = useState(rec || { tipo: "Fiado", titulo: "", descripcion: "", fecha: hoy, prioridad: "Media", completado: false });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valido = form.titulo.trim() && form.fecha;
  return (
    <ModalBase titulo={rec ? "Editar recordatorio" : "Nuevo recordatorio"} onCerrar={onCerrar} onGuardar={() => onGuardar(form)} valido={valido} labelGuardar={rec ? "Guardar cambios" : "Crear recordatorio"}>
      <Campo label="Tipo"><SelectorBotones opciones={TIPOS_REC.filter(t => t !== "Todos")} activo={form.tipo} onChange={v => set("tipo", v)} iconos={ICONOS_REC} /></Campo>
      <Campo label="Título"><input style={inputStyle} type="text" value={form.titulo} placeholder="Ej: Cobrar a Juan, Pagar luz..." onChange={e => set("titulo", e.target.value)} /></Campo>
      <Campo label="Nota (opcional)"><textarea style={{ ...inputStyle, resize: "none", fontFamily: "inherit" }} rows={2} value={form.descripcion} placeholder="Detalles..." onChange={e => set("descripcion", e.target.value)} /></Campo>
      <Campo label="Fecha límite"><input style={inputStyle} type="date" value={form.fecha} onChange={e => set("fecha", e.target.value)} /></Campo>
      <Campo label="Prioridad"><div style={{ display: "flex", gap: 6 }}>{PRIORIDADES.map(p => (<button key={p} onClick={() => set("prioridad", p)} style={{ flex: 1, padding: "7px", borderRadius: 8, fontSize: 13, cursor: "pointer", border: "1px solid", background: form.prioridad === p ? "#1a3a2a" : "var(--color-background-secondary,#f5f4f0)", color: form.prioridad === p ? "white" : "var(--color-text-primary,#111)", borderColor: form.prioridad === p ? "#1a3a2a" : "var(--color-border-tertiary,#ddd)" }}>{p}</button>))}</div></Campo>
    </ModalBase>
  );
}
function Recordatorios({ data, setData }) {
  const [filtro, setFiltro] = useState("Todos");
  const [verCompletados, setVerCompletados] = useState(false);
  const [modal, setModal] = useState(null);
  const [borrar, setBorrar] = useState(null);
  const guardar = (form) => { setData(rs => form.id ? rs.map(r => r.id === form.id ? form : r) : [{ ...form, id: Date.now() }, ...rs]); setModal(null); };
  const pendientes = data.filter(r => !r.completado).filter(r => filtro === "Todos" || r.tipo === filtro).sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  const completados = data.filter(r => r.completado);
  const urgentes = data.filter(r => !r.completado && diasRestantes(r.fecha) <= 2).length;
  return (
    <>
      <div style={{ background: "#1a3a2a", padding: "16px 16px 14px" }}>
        <div style={{ color: "#7fbb95", fontSize: 11, marginBottom: 2 }}>Avisos</div>
        <div style={{ color: "#e8f5ee", fontSize: 20, fontWeight: 500, marginBottom: 12 }}>{data.filter(r => !r.completado).length} pendientes</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[{ v: urgentes, c: urgentes > 0 ? "#f28b7a" : "#e8f5ee", l: "Urgentes" }, { v: data.filter(r => !r.completado && r.tipo === "Fiado").length, c: "#e8f5ee", l: "Fiados" }, { v: completados.length, c: "#7febb8", l: "Hechos" }].map(x => (
            <div key={x.l} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 8, padding: "8px 10px" }}><div style={{ fontSize: 15, fontWeight: 500, color: x.c }}>{x.v}</div><div style={{ fontSize: 10, color: "#7fbb95" }}>{x.l}</div></div>
          ))}
        </div>
      </div>
      <Filtros opciones={TIPOS_REC} activo={filtro} onChange={setFiltro} iconos={ICONOS_REC} />
      <div style={{ padding: "0 14px", paddingBottom: 8 }}>
        {pendientes.length === 0 && <div style={{ textAlign: "center", padding: "32px 0", color: "var(--color-text-secondary,#888)", fontSize: 14 }}>🎉 Aún no tienes avisos.
      Pulsa “+ Avisos” para comenzar.</div>}
        {pendientes.map(r => {
          const dias = diasRestantes(r.fecha); const etiq = etiquetaDias(dias);
          return (
            <div key={r.id} style={{ background: "var(--color-background-primary,#fff)", border: "0.5px solid var(--color-border-tertiary,#ddd)", borderLeft: `3px solid ${dias <= 0 ? "#e24b4a" : dias <= 3 ? "#ef9f27" : "#1a3a2a"}`, borderRadius: 12, padding: "12px 14px", marginBottom: 8 }}>
              <div style={{ fontWeight: 500, fontSize: 14 }}>{ICONOS_REC[r.tipo]} {r.titulo}</div>
              {r.descripcion && <div style={{ fontSize: 12, color: "var(--color-text-secondary,#888)", marginTop: 2 }}>{r.descripcion}</div>}
              <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                <Badge label={r.prioridad} style={PRIORIDAD_ESTILOS[r.prioridad]} />
                <Badge label={etiq.texto} style={{ background: etiq.bg, color: etiq.color }} />
                <span style={{ fontSize: 11, color: "var(--color-text-secondary,#aaa)", alignSelf: "center" }}>{r.fecha}</span>
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                <button onClick={() => setData(rs => rs.map(x => x.id === r.id ? { ...x, completado: true } : x))} style={{ flex: 1, padding: "7px", background: "#eaf3de", color: "#3b6d11", border: "0.5px solid #b8dda0", borderRadius: 8, fontSize: 12, cursor: "pointer" }}>✓ Listo</button>
                <button onClick={() => setModal(r)} style={{ padding: "7px 10px", background: "var(--color-background-secondary,#f5f4f0)", border: "0.5px solid var(--color-border-tertiary,#ddd)", borderRadius: 8, fontSize: 12, cursor: "pointer" }}>Editar</button>
                <button onClick={() => setBorrar(r)} style={{ padding: "7px 10px", background: "#fcebeb", border: "0.5px solid #f7c1c1", borderRadius: 8, fontSize: 12, cursor: "pointer", color: "#a32d2d" }}>Borrar</button>
              </div>
            </div>
          );
        })}
        {completados.length > 0 && (
          <div style={{ marginTop: 4 }}>
            <button onClick={() => setVerCompletados(!verCompletados)} style={{ background: "none", border: "none", fontSize: 13, color: "var(--color-text-secondary,#888)", cursor: "pointer", padding: "4px 0" }}>{verCompletados ? "▲" : "▼"} Completados ({completados.length})</button>
            {verCompletados && completados.map(r => (
              <div key={r.id} style={{ background: "var(--color-background-secondary,#f5f4f0)", border: "0.5px solid var(--color-border-tertiary,#ddd)", borderRadius: 12, padding: "10px 14px", marginTop: 6, opacity: 0.7 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ textDecoration: "line-through", fontSize: 13, color: "var(--color-text-secondary,#888)" }}>{ICONOS_REC[r.tipo]} {r.titulo}</span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => setData(rs => rs.map(x => x.id === r.id ? { ...x, completado: false } : x))} style={{ background: "none", border: "0.5px solid var(--color-border-tertiary,#ddd)", borderRadius: 6, padding: "4px 8px", fontSize: 11, cursor: "pointer", color: "var(--color-text-secondary,#888)" }}>Reabrir</button>
                    <button onClick={() => setBorrar(r)} style={{ background: "#fcebeb", border: "0.5px solid #f7c1c1", borderRadius: 6, padding: "4px 8px", fontSize: 11, cursor: "pointer", color: "#a32d2d" }}>Borrar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <FAB label="+ Avisos " onClick={() => setModal("nuevo")} />
      {modal && <ModalRecordatorio rec={modal === "nuevo" ? null : modal} onGuardar={guardar} onCerrar={() => setModal(null)} />}
      {borrar && <ConfirmarBorrar titulo="recordatorio" onConfirmar={() => { setData(rs => rs.filter(r => r.id !== borrar.id)); setBorrar(null); }} onCancelar={() => setBorrar(null)} />}
    </>
  );
}

// ============ ESTADO DE RESULTADOS ============
function ModalAjuste({ ajuste, onGuardar, onCerrar }) {
  const [form, setForm] = useState(ajuste || { categoria: "ingreso", descripcion: "", monto: "" });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valido = form.descripcion.trim() && form.monto !== "";
  return (
    <ModalBase titulo={ajuste ? "Editar ajuste" : "Nuevo ajuste manual"} onCerrar={onCerrar} onGuardar={() => onGuardar(form)} valido={valido} labelGuardar={ajuste ? "Guardar cambios" : "Agregar ajuste"}>
      <Campo label="Tipo">
        <div style={{ display: "flex", gap: 8 }}>
          {["ingreso", "gasto"].map(c => (<button key={c} onClick={() => set("categoria", c)} style={{ flex: 1, padding: "9px", borderRadius: 8, fontSize: 13, cursor: "pointer", border: "1px solid", background: form.categoria === c ? (c === "ingreso" ? "#1d9e75" : "#a32d2d") : "var(--color-background-secondary,#f5f4f0)", color: form.categoria === c ? "white" : "var(--color-text-primary,#111)", borderColor: form.categoria === c ? "transparent" : "var(--color-border-tertiary,#ddd)" }}>{c === "ingreso" ? "➕ Ingreso" : "➖ Gasto"}</button>))}
        </div>
      </Campo>
      <Campo label="Descripción"><input style={inputStyle} type="text" value={form.descripcion} placeholder="Ej: Arriendo, sueldo, cobro fiado..." onChange={e => set("descripcion", e.target.value)} /></Campo>
      <Campo label="Monto ($)"><input style={inputStyle} type="number" value={form.monto} placeholder="0" onChange={e => set("monto", e.target.value === "" ? "" : Number(e.target.value))} /></Campo>
    </ModalBase>
  );
}
function LineaER({ label, monto, color, bold, indent, separador }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: indent ? "5px 0 5px 12px" : "6px 0", borderBottom: separador ? "1.5px solid var(--color-border-secondary,#ccc)" : "none" }}>
      <span style={{ fontSize: separador ? 14 : 13, fontWeight: bold ? 600 : 400, color: bold ? "var(--color-text-primary,#111)" : "var(--color-text-secondary,#555)" }}>{label}</span>
      <span style={{ fontSize: separador ? 15 : 13, fontWeight: bold ? 600 : 500, color: color || "var(--color-text-primary,#111)" }}>{monto}</span>
    </div>
  );
}
function EstadoResultados({ inventario,pagos, ajustes, setAjustes }) {
  const [modal, setModal] = useState(null);
  const [borrar, setBorrar] = useState(null);
  const guardar = (form) => { setAjustes(as => form.id ? as.map(a => a.id === form.id ? form : a) : [...as, { ...form, id: Date.now() }]); setModal(null); };
  const pagosMes = pagos.filter(p => p.fecha?.startsWith(mesActual));
  const ventasReg  = pagosMes.filter(p => p.tipo === "Venta").reduce((a, p) => a + p.monto, 0);
  const costosReg  = pagosMes.filter(p => p.tipo === "Proveedor").reduce((a, p) => a + p.monto, 0);
  const gastosReg  = pagosMes.filter(p => p.tipo === "Gasto").reduce((a, p) => a + p.monto, 0);
  const ingresosAj = ajustes.filter(a => a.categoria === "ingreso").reduce((a, x) => a + x.monto, 0);
  const gastosAj   = ajustes.filter(a => a.categoria === "gasto").reduce((a, x) => a + x.monto, 0);
  const ventasInventario = inventario.reduce((total, producto) => {
  return total + (producto.marcas || []).reduce((suma, marca) => {
    return suma + ((marca.precioVenta || 0) * (marca.vendidos || 0));
  }, 0);
}, 0);

const costosInventario = inventario.reduce((total, producto) => {
  return total + (producto.marcas || []).reduce((suma, marca) => {
    return suma + ((marca.precioCompra || 0) * (marca.vendidos || 0));
  }, 0);
}, 0);
  const totalIngresos = ventasReg + ventasInventario + ingresosAj;
  const utilidadBruta = totalIngresos - costosReg - costosInventario;
  const totalGastos   = gastosReg + gastosAj;
  const utilidadNeta  = utilidadBruta - totalGastos;
  const margen = totalIngresos > 0 ? Math.round((utilidadNeta / totalIngresos) * 100) : 0;
  const mesNombre = new Date(mesActual + "-01").toLocaleString("es-CL", { month: "long", year: "numeric" });
  return (
    <>
    
      <div style={{ background: "#1a3a2a", padding: "16px 16px 18px" }}>
        <div style={{ color: "#7fbb95", fontSize: 11, marginBottom: 2 }}>Estado de Resultados</div>
        <div style={{ color: "#e8f5ee", fontSize: 17, fontWeight: 500, marginBottom: 10, textTransform: "capitalize" }}>{mesNombre}</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
          <div><div style={{ color: "#7fbb95", fontSize: 11 }}>Resultado del mes</div><div style={{ fontSize: 26, fontWeight: 700, color: utilidadNeta >= 0 ? "#7febb8" : "#f28b7a", marginTop: 2 }}>{utilidadNeta >= 0 ? "+" : ""}{formatPesos(utilidadNeta)}</div></div>
          <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 8, padding: "5px 10px", marginBottom: 2 }}><div style={{ fontSize: 10, color: "#7fbb95" }}>Margen</div><div style={{ fontSize: 18, fontWeight: 700, color: utilidadNeta >= 0 ? "#7febb8" : "#f28b7a" }}>{margen}%</div></div>
        </div>
        <div style={{ marginTop: 12, height: 5, background: "rgba(255,255,255,0.1)", borderRadius: 10, overflow: "hidden" }}><div style={{ width: `${Math.min(100, Math.max(0, margen))}%`, height: "100%", background: utilidadNeta >= 0 ? "#7febb8" : "#f28b7a", borderRadius: 10 }} /></div>
      </div>
      <div style={{ padding: "14px 16px", paddingBottom: 80 }}>
        <div style={{ background: "var(--color-background-primary,#fff)", border: "0.5px solid var(--color-border-tertiary,#ddd)", borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-secondary,#888)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Ingresos</div>
          <LineaER label="Ventas del mes" monto={formatPesos(ventasReg)} indent />
          {ajustes.filter(a => a.categoria === "ingreso").map(a => <LineaER key={a.id} label={a.descripcion} monto={formatPesos(a.monto)} indent />)}
          <LineaER label="Total ingresos" monto={formatPesos(totalIngresos)} bold color="#1d9e75" separador />
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-secondary,#888)", textTransform: "uppercase", letterSpacing: 1, marginTop: 12, marginBottom: 6 }}>Costo de mercadería</div>
          <LineaER label="Compras a proveedores" monto={`-${formatPesos(costosReg)}`} indent color="#d85a30" />
          <LineaER label="Utilidad bruta" monto={formatPesos(utilidadBruta)} bold color={utilidadBruta >= 0 ? "#1d9e75" : "#d85a30"} separador />
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-secondary,#888)", textTransform: "uppercase", letterSpacing: 1, marginTop: 12, marginBottom: 6 }}>Gastos operacionales</div>
          {pagosMes.filter(p => p.tipo === "Gasto").map(p => <LineaER key={p.id} label={p.descripcion} monto={`-${formatPesos(p.monto)}`} indent color="#d85a30" />)}
          {ajustes.filter(a => a.categoria === "gasto").map(a => <LineaER key={a.id} label={a.descripcion} monto={`-${formatPesos(a.monto)}`} indent color="#d85a30" />)}
          <LineaER label="Total gastos" monto={`-${formatPesos(totalGastos)}`} bold color="#d85a30" separador />
          <div style={{ marginTop: 14, background: utilidadNeta >= 0 ? "#eaf3de" : "#fcebeb", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>{utilidadNeta >= 0 ? "✅ Ganancia neta" : "❌ Pérdida neta"}</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: utilidadNeta >= 0 ? "#1d9e75" : "#a32d2d" }}>{utilidadNeta >= 0 ? "+" : ""}{formatPesos(utilidadNeta)}</span>
            </div>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary,#888)", marginTop: 4 }}>Por cada $100 vendidos, {utilidadNeta >= 0 ? `ganas $${margen}` : `pierdes $${Math.abs(margen)}`}</div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 500 }}>Ajustes manuales</span>
          <button onClick={() => setModal("nuevo")} style={{ background: "#1a3a2a", color: "white", border: "none", borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer" }}>+ Agregar</button>
        </div>
        <div style={{ fontSize: 12, color: "var(--color-text-secondary,#888)", marginBottom: 10 }}>Arriendo, sueldos, cobros de fiado y otros no registrados en Pagos.</div>
        {ajustes.length === 0 && <div style={{ textAlign: "center", padding: "20px 0", color: "var(--color-text-secondary,#888)", fontSize: 13 }}>Sin ajustes manuales</div>}
        {ajustes.map(a => (
          <div key={a.id} style={{ background: "var(--color-background-primary,#fff)", border: `0.5px solid ${a.categoria === "ingreso" ? "#b8dda0" : "#f7c1c1"}`, borderLeft: `3px solid ${a.categoria === "ingreso" ? "#1d9e75" : "#d85a30"}`, borderRadius: 10, padding: "10px 14px", marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontSize: 13, fontWeight: 500 }}>{a.descripcion}</div><div style={{ fontSize: 11, color: "var(--color-text-secondary,#888)", marginTop: 2 }}>{a.categoria === "ingreso" ? "Ingreso adicional" : "Gasto adicional"}</div></div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 14, color: a.categoria === "ingreso" ? "#1d9e75" : "#d85a30" }}>{a.categoria === "ingreso" ? "+" : "-"}{formatPesos(a.monto)}</span>
                <button onClick={() => setModal(a)} style={{ background: "var(--color-background-secondary,#f5f4f0)", border: "0.5px solid var(--color-border-tertiary,#ddd)", borderRadius: 5, padding: "4px 8px", fontSize: 11, cursor: "pointer" }}>Editar</button>
                <button onClick={() => setBorrar(a)} style={{ background: "#fcebeb", border: "0.5px solid #f7c1c1", borderRadius: 5, padding: "4px 8px", fontSize: 11, cursor: "pointer", color: "#a32d2d" }}>Borrar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {modal && <ModalAjuste ajuste={modal === "nuevo" ? null : modal} onGuardar={guardar} onCerrar={() => setModal(null)} />}
      {borrar && <ConfirmarBorrar titulo="ajuste" onConfirmar={() => { setAjustes(as => as.filter(a => a.id !== borrar.id)); setBorrar(null); }} onCancelar={() => setBorrar(null)} />}
    </>
  );
}

// ============ APP PRINCIPAL ============
function AlmacenAppInner({ session }) {
const [tab, setTab] = useState("inventario");
  const [inventario, setInventario] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [recs, setRecs] = useState([]);
  const [ajustes, setAjustes] = useState([]);
  const cargarInventario = async () => {
  const { data, error } = await supabase
    .from("inventario")
    .select("*")
    .eq("user_id", session.user.id);

  if (error) {
    console.error("Error cargando inventario:", error);
    return;
  }

  setInventario(data || []);
};
const cargarPagos = async () => {
  const { data, error } = await supabase
    .from("pagos")
    .select("*")
    .eq("user_id", session.user.id);

  if (error) {
    console.error("Error cargando pagos:", error);
    return;
  }

  setPagos(data || []);
};
const cargarPedidos = async () => {
  const { data, error } = await supabase
    .from("pedidos")
    .select("*")
    .eq("user_id", session.user.id);

  if (error) {
    console.error("Error cargando pedidos:", error);
    return;
  }

  setPedidos(data || []);
};
useEffect(() => {
  cargarInventario();
  cargarPagos();
  cargarPedidos();
}, []);
  useEffect(() => { try { localStorage.setItem("inv_v4", JSON.stringify(inventario)); } catch {} }, [inventario]);
  useEffect(() => { try { localStorage.setItem("pag_v4", JSON.stringify(pagos)); } catch {} }, [pagos]);
  useEffect(() => { try { localStorage.setItem("ped_v4", JSON.stringify(pedidos)); } catch {} }, [pedidos]);
  useEffect(() => { try { localStorage.setItem("rec_v4", JSON.stringify(recs)); } catch {} }, [recs]);
  useEffect(() => { try { localStorage.setItem("aj_v4",  JSON.stringify(ajustes)); } catch {} }, [ajustes]);

  const alertas = inventario.filter(p => p.marcas.some(m => m.stock < m.minimo)).length + recs.filter(r => !r.completado && diasRestantes(r.fecha) <= 2).length;

  const tabs = [
    { key: "inventario", label: "Stock",   icon: "📦" },
    { key: "pagos",      label: "Pagos",   icon: "💰" },
    { key: "pedidos",    label: "Pedidos", icon: "🚚" },
    { key: "avisos",     label: "Avisos",  icon: "🔔", badge: alertas > 0 ? alertas : null },
    { key: "resultados", label: "Result.", icon: "📊" },
  ];
const cerrarSesion = async () => {
  await supabase.auth.signOut();
};
  return (
    
    
    <div style={{ maxWidth: 420, margin: "0 auto", fontFamily: "var(--font-sans,system-ui)", background: "var(--color-background-tertiary,#f5f4f0)", minHeight: "100vh" }}>
      <button onClick={cerrarSesion}>
  Cerrar sesión
</button>
      <div style={{ paddingBottom: 62 }}>
<Inventario
  data={inventario}
  setData={setInventario}
  session={session}
/>
{tab === "pagos"      && <Pagos      data={pagos}      setData={setPagos} session={session} />}
{tab === "pedidos" && (
  <Pedidos
    data={pedidos}
    setData={setPedidos}
    session={session}
  />
)}
        {tab === "avisos"     && <Recordatorios data={recs}    setData={setRecs}       />}
{tab === "resultados" &&
  <EstadoResultados
    inventario={inventario}
    pagos={pagos}
    ajustes={ajustes}
    setAjustes={setAjustes}
  />
}
      </div>
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 420, background: "var(--color-background-primary,#fff)", borderTop: "0.5px solid var(--color-border-tertiary,#ddd)", display: "flex", zIndex: 50 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ flex: 1, padding: "9px 2px 7px", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, position: "relative" }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <span style={{ fontSize: 18 }}>{t.icon}</span>
              {t.badge && <span style={{ position: "absolute", top: -4, right: -6, background: "#e24b4a", color: "white", borderRadius: 10, fontSize: 9, padding: "1px 4px", fontWeight: 700 }}>{t.badge}</span>}
            </div>
            <span style={{ fontSize: 9, color: tab === t.key ? "#1a3a2a" : "var(--color-text-secondary,#888)", fontWeight: tab === t.key ? 600 : 400 }}>{t.label}</span>
            {tab === t.key && <div style={{ position: "absolute", bottom: 0, left: "15%", right: "15%", height: 2, background: "#1a3a2a", borderRadius: 2 }} />}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function AlmacenApp() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });
    
    return () => subscription.unsubscribe();
  }, []);
const cerrarSesion = async () => {
  await supabase.auth.signOut();
  alert("Sesión cerrada");
};
  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#f5f4f0" }}>
      <div style={{ width: 36, height: 36, border: "3px solid #e8e7e2", borderTop: "3px solid #1a3a2a", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!session) return <AuthScreen />;

  return <AlmacenAppInner session={session} />;
}
