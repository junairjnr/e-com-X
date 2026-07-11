"use client";

export default function Footer() {
  const cols = [
    {
      title: "Products",
      links: ["POS Systems", "Printers", "Scanners", "Cash Drawers", "Displays", "Software"],
    },
    {
      title: "Solutions",
      links: ["Retail POS", "Restaurant POS", "Pharmacy POS", "Supermarket ERP", "Cloud ERP", "HR Software"],
    },
    {
      title: "Support",
      links: ["Help Center", "Installation Guide", "Warranty Claims", "Track Order", "Contact Us", "Book Demo"],
    },
    {
      title: "Connect",
      links: ["+974 4431 1525", "info@skynetqatar.com", "Doha, Qatar", "Mon–Sat 8AM–6PM"],
    },
  ];

  return (
    <footer style={{ background: "#111827" }} className="text-white">
      {/* Top colored bar */}
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #111827, #374151, #9CA3AF)" }} />

      <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-6">
        {/* Grid */}
        <div className="mb-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="mb-1 font-display text-[28px] font-bold text-white">
              Skynet<span className="text-lg text-slate-300">™</span>
            </div>
            <div className="mb-4 font-eyebrow text-[10px] tracking-[0.14em] text-slate-400">
              POS Solutions Qatar
            </div>
            <p className="mb-5 max-w-[240px] text-[12px] leading-relaxed text-white/50">
              Qatar's leading POS hardware, ERP software, and IT solutions provider. Trusted by 1,300+ businesses in Doha since 2012.
            </p>
            {/* Socials */}
            <div className="flex gap-2">
              {["LI", "TW", "FB", "YT"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 font-label text-[10px] font-bold text-white/50 no-underline transition-colors hover:border-slate-400 hover:text-slate-200"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <div className="mb-4 font-eyebrow text-[10px] tracking-[0.14em] text-white/35 uppercase">
                {col.title}
              </div>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="block text-[12px] text-white/55 no-underline transition-colors hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center gap-4 border-t border-white/10 py-5">
          {["🏆 Qatar VAT Certified", "✅ ISO 9001:2015", "🔒 PCI-DSS Compliant", "🌐 atACC Authorized"].map((cert) => (
            <span key={cert} className="font-label text-[11px] text-white/35">
              {cert}
            </span>
          ))}
          <div className="ml-auto flex gap-2">
            {["💳", "🏦", "📱"].map((icon, i) => (
              <div key={i} className="rounded-md border border-white/10 px-2.5 py-1 text-sm">
                {icon}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
          <div className="font-label text-[11px] text-white/30">
            © {new Date().getFullYear()} Skynet Solution Qatar. All rights reserved.
          </div>
          <div className="flex gap-4">
            {["Privacy Policy", "Terms", "Warranty"].map((link) => (
              <a key={link} href="#" className="font-label text-[11px] text-white/30 no-underline hover:text-white">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
