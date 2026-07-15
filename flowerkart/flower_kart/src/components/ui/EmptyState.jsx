import { ShoppingBagIcon } from "@heroicons/react/24/outline";

export default function EmptyState({
  icon: Icon = ShoppingBagIcon,
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-3xl border border-dashed border-rose-100 bg-white px-6 py-14 text-center shadow-sm">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
        <Icon className="h-8 w-8" aria-hidden="true" />
      </div>
      <h2 className="text-xl font-black tracking-tight text-gray-950">{title}</h2>
      {description && <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>}
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 rounded-2xl bg-gray-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-gray-200 transition hover:-translate-y-0.5 hover:bg-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-200"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
