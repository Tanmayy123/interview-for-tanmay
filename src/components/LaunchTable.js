import React from "react";
import LaunchTableRow from "./LaunchTableRow";
import EmptyState from "./EmptyState";

function LaunchTable({ launches, payloads, page, perPage, onRowClick }) {
  const start = (page - 1) * perPage;
  const paginated = launches.slice(start, start + perPage);

  // Mobile card layout
  const isMobile = window.innerWidth <= 700;

  if (isMobile) {
    return (
      <div className="launch-cards-mobile">
        {paginated.length === 0 ? (
          <EmptyState />
        ) : (
          paginated.map((launch, idx) => {
            let status = "Upcoming";
            let statusClass = "upcoming";
            if (launch.upcoming) { status = "Upcoming"; statusClass = "upcoming"; }
            else if (launch.success) { status = "Success"; statusClass = "success"; }
            else { status = "Failed"; statusClass = "failed"; }
            const date = new Date(launch.date_utc).toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            });
            return (
              <React.Fragment key={launch.id}>
                <div
                  className="launch-card-mobile"
                  onClick={() => onRowClick(launch)}
                  tabIndex={0}
                  style={{ cursor: "pointer" }}
                >
                  <div className="launch-card-row" style={{ marginBottom: 2 }}>
                    <span className="launch-card-label">No.</span>
                    <span>{String(start + idx + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="launch-card-row" style={{ marginBottom: 2 }}>
                    <span className="launch-card-label">Date</span>
                    <span>{date}</span>
                  </div>
                  <div className="launch-card-mission">{launch.name}</div>
                  <div className="launch-card-status-row">
                    <span className={`launch-card-status-badge ${statusClass}`}>{status}</span>
                  </div>
                  <div className="launch-card-row">
                    <span className="launch-card-label">Rocket</span>
                    <span>{launch.rocket || "-"}</span>
                  </div>
                </div>
                {idx !== paginated.length - 1 && <hr className="launch-card-divider" />}
              </React.Fragment>
            );
          })
        )}
      </div>
    );
  }

  // Desktop table
  return (
    <table className="launch-table">
      <thead>
        <tr>
          <th>No.</th>
          <th>Launched (UTC)</th>
          <th>Location</th>
          <th>Mission</th>
          <th>Orbit</th>
          <th>Launch Status</th>
          <th>Rocket</th>
        </tr>
      </thead>
      <tbody>
        {paginated.length === 0 ? (
          <tr>
            <td colSpan={7}>
              <EmptyState />
            </td>
          </tr>
        ) : (
          paginated.map((launch, idx) => (
            <LaunchTableRow
              key={launch.id}
              launch={launch}
              index={start + idx}
              payloads={payloads}
              onClick={onRowClick}
            />
          ))
        )}
      </tbody>
    </table>
  );
}

export default LaunchTable;
