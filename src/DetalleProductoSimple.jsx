export default function DetalleProductoSimple({
  producto,
  onVolver,
  onActualizar
}) {
  return (
    <div style={{ padding: 20 }}>
      <button
        onClick={onVolver}
        style={{
          marginBottom: 20,
          background: "none",
          border: "none",
          color: "#1a3a2a",
          cursor: "pointer"
        }}
      >
        ← Volver
      </button>

      <h2>{producto.nombre}</h2>

      <p>Producto sin marcas.</p>
    </div>
  );
}