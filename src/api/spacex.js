const BASE_URL = "https://api.spacexdata.com/v5/launches";

export async function fetchAllLaunches() {
  const res = await fetch(BASE_URL);
  return res.json();
}

export async function fetchPastLaunches() {
  const res = await fetch(`${BASE_URL}/past`);
  return res.json();
}

export async function fetchUpcomingLaunches() {
  const res = await fetch(`${BASE_URL}/upcoming`);
  return res.json();
}
