import express from "express";
import client from "prom-client";

const app = express();
const port = 3000;

// Registro de métricas
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Métrica personalizada: duración de solicitudes HTTP
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duración de solicitudes HTTP",
  labelNames: ["route", "method", "status_code"],
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 2],
});
register.registerMetric(httpRequestDuration);

// Endpoint de ejemplo
app.get("/api/reservas", async (req, res) => {
  const end = httpRequestDuration.startTimer();
  await new Promise((r) => setTimeout(r, Math.random() * 500)); // Simula retardo
  end({ route: "/api/reservas", method: "GET", status_code: 200 });
  res.status(200).send("Reservas listadas correctamente");
});

// Endpoint de salud
app.get("/health", (req, res) => res.status(200).send("OK"));

// Endpoint de métricas
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.listen(port, () => console.log(`Servidor escuchando en puerto ${port}`));
