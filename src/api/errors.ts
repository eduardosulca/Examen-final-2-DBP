import { AxiosError } from "axios";
import type { ApiErrorBody } from "../types";

/**
 * El backend no expone un schema de error fijo en el Swagger, así que este
 * parser es defensivo: intenta leer el formato típico de Spring
 * ({timestamp, status, error, message, path} o {message, errors: [...]})
 * y si no encuentra nada usable, cae en un mensaje genérico según el
 * código HTTP.
 */
export interface AppError {
  kind: "network" | "auth" | "notFound" | "validation" | "conflict" | "server" | "unknown";
  message: string;
  fieldErrors?: { field: string; message: string }[];
}

export function parseApiError(err: unknown): AppError {
  const axiosErr = err as AxiosError<ApiErrorBody>;

  // No hubo respuesta del servidor: caída de red, servidor no disponible o timeout
  if (!axiosErr.response) {
    if (axiosErr.code === "ECONNABORTED") {
      return {
        kind: "network",
        message: "La solicitud tardó demasiado en responder. Verifica tu conexión e inténtalo de nuevo.",
      };
    }
    return {
      kind: "network",
      message: "No se pudo contactar al servidor. Verifica tu conexión o intenta más tarde.",
    };
  }

  const status = axiosErr.response.status;
  const body = axiosErr.response.data;
  const backendMessage = body?.message;

  switch (status) {
    case 400:
      return {
        kind: "validation",
        message: backendMessage ?? "Los datos ingresados no son válidos. Revisa el formulario.",
        fieldErrors: body?.errors,
      };
    case 401:
      return {
        kind: "auth",
        message: "Tu sesión expiró o no es válida. Vuelve a iniciar sesión.",
      };
    case 404:
      return {
        kind: "notFound",
        message: backendMessage ?? "El recurso solicitado no existe.",
      };
    case 409:
      return {
        kind: "conflict",
        message: backendMessage ?? "Ya existe un registro con esos datos (usuario o correo duplicado).",
      };
    case 500:
      return {
        kind: "server",
        message: "Ocurrió un error interno en el servidor. Intenta nuevamente más tarde.",
      };
    default:
      return {
        kind: "unknown",
        message: backendMessage ?? `Ocurrió un error inesperado (código ${status}).`,
      };
  }
}
