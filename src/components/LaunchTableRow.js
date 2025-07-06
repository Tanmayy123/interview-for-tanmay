import React from "react";
import StatusBadge from "./StatusBadge";

function LaunchTableRow({ launch, index, payloads, onClick }) {
  let status = "Upcoming";
  if (launch.upcoming) status = "Upcoming";
  else if (launch.success) status = "Success";
  else status = "Failed";

  const date = new Date(launch.date_utc).toLocaleString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  let orbit = "-";
  if (launch.payloads && launch.payloads.length > 0) {
    const payload = payloads[launch.payloads[0]];
    if (payload && payload.orbit) {
      orbit = payload.orbit;
    }
  }

  return (
    <tr 
      onClick={() => onClick(launch)} 
      style={{ cursor: "pointer" }}
      className="table-row"
    >
      <td 
        style={{ textAlign: 'center' }} 
        data-label="No."
      >
        {String(index + 1).padStart(2, "0")}
      </td>
      <td 
        style={{ textAlign: 'left', whiteSpace: 'nowrap' }} 
        data-label="Launched (UTC)"
      >
        {date}
      </td>
      <td 
        style={{ textAlign: 'left' }} 
        data-label="Location"
      >
        {launch.launchpad || "-"}
      </td>
      <td 
        style={{ textAlign: 'left' }} 
        data-label="Mission"
      >
        {launch.name}
      </td>
      <td 
        style={{ textAlign: 'left' }} 
        data-label="Orbit"
      >
        {orbit}
      </td>
      <td 
        style={{ textAlign: 'center' }} 
        data-label="Launch Status"
      >
        <StatusBadge status={status} />
      </td>
      <td 
        style={{ textAlign: 'left' }} 
        data-label="Rocket"
      >
        {launch.rocket || "-"}
      </td>
    </tr>
  );
}

export default LaunchTableRow;
