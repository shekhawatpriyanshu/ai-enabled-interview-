export const getBackendUrl = () => {
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return "http://localhost:3000";
  }

  // Production: use same origin through Nginx proxy
  return "";
};