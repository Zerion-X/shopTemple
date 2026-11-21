import type { OrderStatus } from "../Entities/Order";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-[#F8EFE5] text-[#9A5B2E]",
  processing: "bg-[#FCE1E5] text-[#C93663]",
  shipped: "bg-[#E8EEF9] text-[#3B5BA5]",
  delivered: "bg-[#E4F3EA] text-[#2F7A4D]",
  cancelled: "bg-[#EFEAEA] text-[#8A7A7A]",
};

const StatusBadge = ({ status }: { status: OrderStatus }) => (
  <span
    className={`inline-block px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] ${STATUS_STYLES[status]}`}
  >
    {status}
  </span>
);

export default StatusBadge;
