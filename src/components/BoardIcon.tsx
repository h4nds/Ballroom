const stroke = "currentColor";

export function BoardIcon({ name }: { name: string }) {
  const common = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none" as const };
  switch (name) {
    case "palette":
      return (
        <svg {...common} aria-hidden>
          <path
            d="M12 3a7 7 0 1 0 7 7c0-1.5-.8-2.8-2-3.5M12 3v4m0 8h.01M8 12h.01M16 12h.01"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "clapper":
      return (
        <svg {...common} aria-hidden>
          <path
            d="M4 10V8a2 2 0 0 1 2-2h2l2-2h4l2 2h2a2 2 0 0 1 2 2v2M4 10h16v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6Z"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "wave":
      return (
        <svg {...common} aria-hidden>
          <path
            d="M4 12c2-4 4 4 6 0s4 4 6 0 2 4 4 0M4 16c2-4 4 4 6 0s4 4 6 0 2 4 4 0"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "pen":
      return (
        <svg {...common} aria-hidden>
          <path
            d="M12 19l-3 1 1-3 9-9 2 2-9 9Zm0 0 3-3M15 5l4 4"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "gear":
      return (
        <svg {...common} aria-hidden>
          <path
            d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.94-2.08a7.99 7.99 0 0 0 .06-1.84l-2-.35a6.09 6.09 0 0 0-.55-1.32l1.18-1.62a8.02 8.02 0 0 0-2.12-2.12l-1.62 1.18a6.09 6.09 0 0 0-1.32-.55l-.35-2a7.99 7.99 0 0 0-1.84-.06 7.99 7.99 0 0 0-1.84.06l-.35 2a6.09 6.09 0 0 0-1.32.55L6.5 6.67a8.02 8.02 0 0 0-2.12 2.12l1.18 1.62a6.09 6.09 0 0 0-.55 1.32l-2 .35a7.99 7.99 0 0 0-.06 1.84c0 .62.02 1.24.06 1.84l2 .35c.13.47.32.92.55 1.32l-1.18 1.62a8.02 8.02 0 0 0 2.12 2.12l1.62-1.18c.4.23.85.42 1.32.55l.35 2c.6.04 1.22.06 1.84.06s1.24-.02 1.84-.06l.35-2c.47-.13.92-.32 1.32-.55l1.62 1.18a8.02 8.02 0 0 0 2.12-2.12l-1.18-1.62c.23-.4.42-.85.55-1.32l2-.35Z"
            stroke={stroke}
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "eye":
      return (
        <svg {...common} aria-hidden>
          <path
            d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Z"
            stroke={stroke}
            strokeWidth="1.6"
          />
          <circle cx="12" cy="12" r="3" stroke={stroke} strokeWidth="1.6" />
        </svg>
      );
    case "handshake":
      return (
        <svg {...common} aria-hidden>
          <path
            d="M11 14l-2 2-4-4 2-2m3 2l5-5 4 4-5 5M8 16l-1 3M14 9l3-3"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return (
        <svg {...common} aria-hidden>
          <rect x="4" y="4" width="16" height="16" rx="3" stroke={stroke} strokeWidth="1.6" />
        </svg>
      );
  }
}
