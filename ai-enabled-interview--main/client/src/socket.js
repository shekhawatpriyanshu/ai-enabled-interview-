import io from "socket.io-client";
import { getBackendUrl } from "./api/config";

const socketUrl = getBackendUrl();
const socket = io(socketUrl);

export default socket;
