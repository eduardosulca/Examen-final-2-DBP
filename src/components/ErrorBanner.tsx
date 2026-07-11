import type { AppError } from "../api/errors";

const KIND_STYLES: Record<AppError["kind"], string> = {
  network: "border-warn/40 bg-warn/10 text-warn",
  auth: "border-warn/40 bg-warn/10 text-warn",
  notFound: "border-edge bg-white/5 text-white/70",
  validation: "border-danger/40 bg-danger/10 text-danger",
  conflict: "border-danger/40 bg-danger/10 text-danger",
  server: "border-danger/40 bg-danger/10 text-danger",
  unknown: "border-danger/40 bg-danger/10 text-danger",
};

export default function ErrorBanner({ error }: { error: AppError }) {
  return (
    <div className={`rounded-lg border px-4 py-3 font-body text-sm ${KIND_STYLES[error.kind]}`} role="alert">
      <p>{error.message}</p>
      {error.fieldErrors && error.fieldErrors.length > 0 && (
        <ul className="mt-2 list-disc list-inside space-y-0.5 opacity-90">
          {error.fieldErrors.map((fe, i) => (
            <li key={i}>
              <span className="font-medium">{fe.field}:</span> {fe.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
