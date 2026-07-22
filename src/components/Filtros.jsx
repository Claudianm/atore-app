function Filtros({ opciones = [], activo, onChange, iconos }) {
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
export default Filtros;