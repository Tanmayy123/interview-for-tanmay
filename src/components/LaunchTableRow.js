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
    <tr onClick={() => onClick(launch)} style={{ cursor: "pointer" }}>
      <td style={{ textAlign: 'center' }}>{String(index + 1).padStart(2, "0")}</td>
      <td style={{ textAlign: 'left', whiteSpace: 'nowrap' }}>{date}</td>
      <td style={{ textAlign: 'left' }}>{launch.launchpad || "-"}</td>
      <td style={{ textAlign: 'left' }}>{launch.name}</td>
      <td style={{ textAlign: 'left' }}>{orbit}</td>
      <td style={{ textAlign: 'center' }}>
        <StatusBadge status={status} />
      </td>
      <td style={{ textAlign: 'left' }}>{launch.rocket || "-"}</td>
    </tr>
  );
}

export default LaunchTableRow;
