import { Hub, ResidencyStatus } from "./types";

// Get hub status color based on residency statuses
export function getHubStatusColor(hub: Hub): "green" | "accent1" | "purple" {
  const hasOpenSubmissions = hub.residencies.some(
    (r) => r.status === "SUBMISSIONS_OPEN"
  );
  
  if (hasOpenSubmissions) return "green";
  
  const hasRunning = hub.residencies.some((r) => r.status === "RUNNING");
  
  if (hasRunning) return "accent1";
  
  return "purple";
}

export function getStatusLabel(status: ResidencyStatus): string {
  switch (status) {
    case "SUBMISSIONS_OPEN":
      return "Open";
    case "RUNNING":
      return "Running";
    case "CLOSED":
      return "Closed";
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + "...";
}
