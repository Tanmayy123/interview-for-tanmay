import React from "react";

const statusColors = {
  Success: { bg: "#d4f5e9", color: "#1a7f37" },
  Failed: { bg: "#ffd6d6", color: "#d32f2f" },
  Upcoming: { bg: "#fff7d6", color: "#b8860b" },
};

function StatusBadge({ status }) {
  return (
    <span
      style={{
        background: statusColors[status].bg,
        color: statusColors[status].color,
        borderRadius: 8,
        padding: "2px 12px",
        fontWeight: 600,
        fontSize: "0.9em",
        display: "inline-block",
        minWidth: 70,
        textAlign: "center",
        transition: "all 0.2s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = "scale(1.05)";
        e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "scale(1)";
        e.target.style.boxShadow = "none";
      }}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
