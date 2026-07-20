import { useState } from "react";
import { supabase } from "./supabaseClient";
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
  const recuperarClave = async () => {
  if (!email) {
    setError("Escribe tu correo primero");
    return;
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    setError(error.message);
    return;
  }

  alert("Revisa tu correo para recuperar la contraseña");
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
            <button on
            Click={() => { setModo("login"); setMensaje(""); }} style={{ background: "#1a3a2a", color: "white", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>Ir a Ingresar</button>
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
            {modo === "login" && (
  <button
    onClick={recuperarClave}
    style={{
      marginTop: 12,
      background: "none",
      border: "none",
      color: "#1a3a2a",
      cursor: "pointer",
      fontSize: 13
    }}
  >
    ¿No recuerdas tu clave?
  </button>
)}
          </>
        )}
      </div>
    </div>
  );
}
export default AuthScreen;