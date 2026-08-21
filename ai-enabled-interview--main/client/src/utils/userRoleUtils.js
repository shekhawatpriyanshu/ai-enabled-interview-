/**
 * Utility to determine if current logged-in user is Host / Interviewer vs Candidate.
 * Checks candidate email, host email, user type ("working professional"), role, and interviewer name.
 */
export function checkIsHostUser(user, room) {
  if (!user) return false;

  const uEmail = (user.email || "").trim().toLowerCase();
  const uName = (user.name || "").trim().toLowerCase();
  const cEmail = (room?.candidateEmail || "").trim().toLowerCase();
  const hEmail = (room?.hostEmail || room?.creatorEmail || "").trim().toLowerCase();
  const userType = (user.userType || user.profile?.userType || "").trim().toLowerCase();
  const userRole = (user.role || "").trim().toLowerCase();

  // If explicitly matching candidate email, return candidate (false)
  if (cEmail && uEmail && uEmail === cEmail) {
    return false;
  }

  // If matching host/creator email, return host (true)
  if (hEmail && uEmail && uEmail === hEmail) {
    return true;
  }

  // If user role or userType is working professional/admin/interviewer, return host (true)
  if (userType === "working professional" || userRole === "admin" || userRole === "interviewer") {
    return true;
  }

  // If interviewer name matches user display name, return host (true)
  if (room?.interviewerName && uName && room.interviewerName.toLowerCase().includes(uName)) {
    return true;
  }

  return false;
}
