import morgan from "morgan";

function getStatusColor(status) {
  if (status >= 500) return "\x1b[31m"; // vermelho
  if (status >= 400) return "\x1b[33m"; // amarelo
  if (status >= 300) return "\x1b[36m"; // cyan
  if (status >= 200) return "\x1b[32m"; // verde

  return "\x1b[0m";
}

morgan.token("colored-status", (req, res) => {
  const status = res.statusCode;
  const color = getStatusColor(status);

  return `${color}${status}\x1b[0m`;
});

morgan.token("real-ip", req => {
  return (
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress ||
    req.ip
  );
});

morgan.token("user-id", req => {
  return req.user?.id || "guest";
});

morgan.token("user-role", req => {
  return req.user?.role || "public";
});

export const loggerMiddleware = morgan(
  [
    "\n\x1b[35m[API]\x1b[0m",
    ":method",
    ":url",
    ":colored-status",
    "-",
    ":response-time ms",
    "\nIP:",
    ":real-ip",
    "\nUSER:",
    ":user-id",
    "\nROLE:",
    ":user-role",
    "\nUSER-AGENT:",
    ":user-agent",
    "\n",
  ].join(" ")
);
