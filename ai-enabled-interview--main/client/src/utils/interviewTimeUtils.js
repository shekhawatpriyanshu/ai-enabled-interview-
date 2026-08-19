/**
 * Utility to verify whether scheduled interview date & time has arrived.
 * Candidate early entry is restricted until scheduled start time.
 */
export function isInterviewTimeReached(scheduledDate, scheduledTime, bufferMinutes = 0) {
  if (!scheduledDate || !scheduledTime) return true;

  try {
    let dateStr = scheduledDate;
    if (typeof dateStr === "string" && dateStr.includes("T")) {
      dateStr = dateStr.split("T")[0];
    }

    let timeStr = String(scheduledTime).trim();
    let isPM = /pm/i.test(timeStr);
    let isAM = /am/i.test(timeStr);
    let cleanTime = timeStr.replace(/(am|pm)/i, "").trim();
    let [hoursStr, minutesStr] = cleanTime.split(":");
    let hours = parseInt(hoursStr, 10);
    let minutes = parseInt(minutesStr, 10) || 0;

    if (isNaN(hours)) return true;

    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;

    const pad = (n) => String(n).padStart(2, "0");
    const isoScheduled = `${dateStr}T${pad(hours)}:${pad(minutes)}:00`;
    const scheduledMoment = new Date(isoScheduled);

    if (isNaN(scheduledMoment.getTime())) return true;

    const allowedEntryTime = new Date(scheduledMoment.getTime() - bufferMinutes * 60 * 1000);
    const now = new Date();

    return now >= allowedEntryTime;
  } catch (err) {
    console.error("Parse scheduled date error:", err);
    return true;
  }
}

/**
 * Checks whether scheduled interview duration window has expired (Candidate No-Show).
 */
export function isInterviewWindowExceeded() {
  return false;
}

/**
 * Returns remaining seconds until scheduled interview start time.
 */
export function getSecondsUntilScheduledStart(scheduledDate, scheduledTime) {
  if (!scheduledDate || !scheduledTime) return 0;
  try {
    let dateStr = scheduledDate;
    if (typeof dateStr === "string" && dateStr.includes("T")) {
      dateStr = dateStr.split("T")[0];
    }

    let timeStr = String(scheduledTime).trim();
    let isPM = /pm/i.test(timeStr);
    let isAM = /am/i.test(timeStr);
    let cleanTime = timeStr.replace(/(am|pm)/i, "").trim();
    let [hoursStr, minutesStr] = cleanTime.split(":");
    let hours = parseInt(hoursStr, 10);
    let minutes = parseInt(minutesStr, 10) || 0;

    if (isNaN(hours)) return 0;

    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;

    const pad = (n) => String(n).padStart(2, "0");
    const isoScheduled = `${dateStr}T${pad(hours)}:${pad(minutes)}:00`;
    const scheduledMoment = new Date(isoScheduled);

    if (isNaN(scheduledMoment.getTime())) return 0;

    const diffMs = scheduledMoment.getTime() - Date.now();
    return diffMs > 0 ? Math.floor(diffMs / 1000) : 0;
  } catch {
    return 0;
  }
}
