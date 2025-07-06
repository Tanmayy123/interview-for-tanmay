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
      }}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
