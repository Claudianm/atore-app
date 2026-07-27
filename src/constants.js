export const CATEGORIAS = ["Todos", "Alimentos", "Bebidas", "Limpieza", "Lácteos", "Otros"];

export const TIPOS_PAGO = ["Todos", "Venta", "Gasto", "Fiado", "Proveedor"];

export const ESTADOS_PEDIDO = ["Todos", "Pendiente", "En camino", "Recibido", "Cancelado"];

export const TIPOS_REC = ["Todos", "Fiado", "Pago", "Pedido", "Otro"];

export const ICONOS_PAGO = {
  Venta: "💰",
  Gasto: "🧾",
  Fiado: "🤝",
  Proveedor: "🚚"
};

export const ICONOS_REC = {
  Fiado: "🤝",
  Pago: "💰",
  Pedido: "🚚",
  Otro: "📌"
};

export const PRIORIDADES = ["Alta", "Media", "Baja"];

export const ESTADO_ESTILOS = {
  Pendiente: { background: "#faeeda", color: "#854f0b" },
  "En camino": { background: "#e6f1fb", color: "#185fa5" },
  Recibido: { background: "#eaf3de", color: "#3b6d11" },
  Cancelado: { background: "#f0f0f0", color: "#888" }
};

export const PRIORIDAD_ESTILOS = {
  Alta: { background: "#fcebeb", color: "#a32d2d" },
  Media: { background: "#faeeda", color: "#854f0b" },
  Baja: { background: "#eaf3de", color: "#3b6d11" }
};
console.log("constants cargado");
console.log(ICONOS_PAGO);
console.log(ESTADO_ESTILOS);
console.log(PRIORIDAD_ESTILOS);