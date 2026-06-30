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
  ];

  return (
    <footer className="bg-footer pt-16 text-white/90">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-1.5 font-display text-[32px] font-bold tracking-wide text-white">
              Skynet<span className="text-xl text-accent">™</span>
            </div>
            <div className="mb-5 font-eyebrow text-[11px] tracking-[0.12em] text-accent">
              POS Solutions Qatar
            </div>
            <p className="mb-7 max-w-[280px] text-[13px] leading-relaxed text-white/55">
              Qatar&apos;s leading POS hardware, ERP software, and IT solutions provider. Trusted by 1,300+ businesses in Doha since 2012.
            </p>
            <div className="mb-6 flex flex-col gap-2">
              <a href="tel:+97444311525" className="text-[13px] text-white/70 no-underline hover:text-white">
                📞 +974 4431 1525
              </a>
              <a href="mailto:info@skynetqatar.com" className="text-[13px] text-white/70 no-underline hover:text-white">
                ✉️ info@skynetqatar.com
              </a>
              <span className="text-[13px] text-white/50">📍 Doha, Qatar</span>
            </div>
            <div className="flex gap-2.5">
              {["LI", "TW", "FB", "YT"].map(s => (
                <a
                  key={s}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 font-label text-[11px] font-bold text-white/60 no-underline transition-colors hover:border-accent hover:text-accent"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {cols.map(col => (
            <div key={col.title}>
              <div className="mb-5 font-eyebrow text-[11px] tracking-[0.12em] text-white/40">
                {col.title}
              </div>
              {col.links.map(link => (
                <a key={link} href="#" className="block py-1.5 text-[13px] text-white/60 no-underline transition-colors hover:text-white">
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-6 border-b border-white/10 pb-7">
          {["🏆 Qatar VAT Certified", "✅ ISO 9001:2015", "🔒 PCI-DSS Compliant", "🌐 atACC Authorized Reseller"].map(cert => (
            <span key={cert} className="flex items-center gap-1.5 text-xs text-white/45">
              {cert}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 py-5">
          <div className="text-xs text-white/35">
            © {new Date().getFullYear()} Skynet Solution Qatar. All rights reserved. Powered by atACC ERP.
          </div>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Warranty Policy"].map(link => (
              <a key={link} href="#" className="text-xs text-white/35 no-underline transition-colors hover:text-white">
                {link}
              </a>
            ))}
          </div>
          <div className="flex gap-2">
            {["💳", "🏦", "📱"].map((icon, i) => (
              <div key={i} className="rounded-md border border-white/10 px-2.5 py-1 text-sm">{icon}</div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
