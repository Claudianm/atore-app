function FAB({ label, onClick }) {
  return (
    <div style={{ position: "fixed", bottom: 72, right: 18 }}>
      <button
        onClick={onClick}
        style={{
          background: "#1a3a2a",
          color: "white",
          border: "none",
          borderRadius: 28,
          padding: "12px 18px",
          fontSize: 13,
          fontWeight: 500,
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(26,58,42,0.35)"
        }}
      >
        {label}
      </button>
    </div>
  );
}

export default FAB;