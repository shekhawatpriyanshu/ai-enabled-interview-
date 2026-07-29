const getBackendUrl = () => {
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return "http://localhost:3000";
  }

  return "http://52.62.40.253:3000";
};