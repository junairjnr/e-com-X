"use client";



export const C = {
    primary: "#0075BB",
    primaryDark: "#005A8F",
    secondary: "#0F172A",
    accent: "#10B981",
    accentDark: "#059669",
    bg: "#F8FAFC",
    surface: "#FFFFFF",
    muted: "#F1F5F9",
    border: "#E2E8F0",
    text: "#0F172A",
    subtle: "#64748B",
    error: "#EF4444",
    warning: "#F59E0B",
};

export const ORDERS = [
    { id: "SK-2025-001", date: "2025-05-15", status: "Delivered", total: 7200, items: 2 },
    { id: "SK-2025-002", date: "2025-05-28", status: "Shipped", total: 4500, items: 1 },
    { id: "SK-2025-003", date: "2025-06-10", status: "Processing", total: 6800, items: 3 },
];
export const formatPrice = (p: number) => `QAR ${p.toLocaleString("en-QA")}`;

const OrdersPage = ({ onBack }: { onBack: () => void }) => {
    const statusColors: Record<string, string> = { Delivered: C.accent, Shipped: "#6366F1", Processing: C.warning };

    return (
        <div className="container-narrow " style={{ maxWidth: 900, margin: "0 auto", padding: "150px 24px", minHeight: "80vh" }}>
            <h1 className="page-title" style={{ fontFamily: "Rubik", fontWeight: 800, fontSize: 28, color: C.text, margin: "0 0 8px" }}>📦 My Orders</h1>
            <p style={{ color: C.subtle, fontSize: 14, marginBottom: 32 }}>{ORDERS.length} orders placed</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {ORDERS.map(order => (
                    <div key={order.id} className="animate-fadeIn order-card" style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: "20px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
                        <div>
                            <div style={{ fontFamily: "Rubik", fontWeight: 700, fontSize: 16, color: C.text, marginBottom: 4 }}>{order.id}</div>
                            <div style={{ fontSize: 13, color: C.subtle }}>Placed on {new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                            <div style={{ fontSize: 13, color: C.subtle }}>{order.items} item{order.items > 1 ? "s" : ""}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                            <span style={{ fontFamily: "Rubik", fontWeight: 800, fontSize: 18, color: C.primary }}>{formatPrice(order.total)}</span>
                            <span style={{ background: `${statusColors[order.status]}20`, color: statusColors[order.status], padding: "6px 14px", borderRadius: 20, fontFamily: "Rubik", fontWeight: 600, fontSize: 13 }}>
                                {order.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrdersPage;