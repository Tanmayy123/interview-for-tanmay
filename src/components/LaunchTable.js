import React from "react";
import LaunchTableRow from "./LaunchTableRow";
import EmptyState from "./EmptyState";

function LaunchTable({ launches, payloads, page, perPage, onRowClick }) {
  const start = (page - 1) * perPage;
  const paginated = launches.slice(start, start + perPage);

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
