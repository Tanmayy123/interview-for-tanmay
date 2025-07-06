import React from "react";
import StatusBadge from "./StatusBadge";

function LaunchModal({ launch, onClose }) {
  if (!launch) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img
            src={launch.links?.patch?.small}
            alt={launch.name}
            style={{ width: 60, height: 60, borderRadius: 8 }}
          />
          <div>
            <h2 style={{ margin: 0 }}>{launch.name}</h2>
            <StatusBadge
              status={
                launch.success
                  ? "Success"
                  : launch.upcoming
                  ? "Upcoming"
                  : "Failed"
              }
            />
            <div style={{ fontSize: 14, color: "#888" }}>{launch.rocket}</div>
          </div>
        </div>
        <p style={{ marginTop: 16 }}>
          {launch.details || "No details available."}{" "}
          {launch.links?.wikipedia && (
            <a
              href={launch.links.wikipedia}
              target="_blank"
              rel="noopener noreferrer"
            >
              Wikipedia
            </a>
          )}
        </p>
        <table style={{ width: "100%", marginTop: 16 }}>
          <tbody>
            <tr>
              <td>Flight Number</td>
              <td>{launch.flight_number}</td>
            </tr>
            <tr>
              <td>Mission Name</td>
              <td>{launch.name}</td>
            </tr>
            <tr>
              <td>Rocket Type</td>
              <td>{launch.rocket}</td>
            </tr>
            <tr>
              <td>Launch Date</td>
              <td>{new Date(launch.date_utc).toLocaleString()}</td>
            </tr>
            <tr>
              <td>Orbit</td>
              <td>{launch.payloads && launch.payloads[0]?.orbit}</td>
            </tr>
            <tr>
              <td>Launch Site</td>
              <td>{launch.launchpad}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LaunchModal;
