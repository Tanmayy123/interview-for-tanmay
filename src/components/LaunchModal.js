import React from "react";
import StatusBadge from "./StatusBadge";

function LaunchModal({ launch, onClose }) {
  if (!launch) return null;

  // Status badge logic
  let status = launch.success ? "Success" : launch.upcoming ? "Upcoming" : "Failed";

  // Patch image
  const patchImg = launch.links?.patch?.small;

  // Details for table
  const details = [
    { label: "Flight Number", value: launch.flight_number },
    { label: "Mission Name", value: launch.name },
    { label: "Rocket Type", value: launch.rocket || "rocket" },
    { label: "Rocket Name", value: launch.rocket_name || "Falcon 9" },
    { label: "Manufacturer", value: launch.manufacturer || "SpaceX" },
    { label: "Nationality", value: launch.nationality || "Florida" },
    { label: "Launch Date", value: new Date(launch.date_utc).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) + " at " + new Date(launch.date_utc).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) },
    { label: "Payload Type", value: (launch.payloads && launch.payloads[0]) ? launch.payloads[0].type : "-" },
    { label: "Orbit", value: (launch.payloads && launch.payloads[0]) ? launch.payloads[0].orbit : "-" },
    { label: "Launch Site", value: launch.launchpad || "CCSFS SLC 40" },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 540, padding: 32, borderRadius: 16 }}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 18 }}>
          {patchImg && (
            <img src={patchImg} alt={launch.name} style={{ width: 80, height: 80, borderRadius: 12, background: "#f5f6fa", objectFit: "contain" }} />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, lineHeight: 1.2 }}>{launch.name}</h2>
              <StatusBadge status={status} />
            </div>
            <div style={{ fontSize: 17, color: "#444", fontWeight: 500, marginTop: 2 }}>{launch.rocket_name || "Falcon 9"}</div>
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 18, fontSize: 16 }}>
          <tbody>
            {details.map((row, i) => (
              <tr key={row.label} style={{ background: i % 2 === 1 ? "#fafbfc" : "#fff" }}>
                <td style={{ fontWeight: 500, color: "#444", padding: "10px 12px", width: 180 }}>{row.label}</td>
                <td style={{ color: "#222", padding: "10px 12px", fontWeight: 400 }}>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LaunchModal;
