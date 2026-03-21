export function HashTicker() {
  const hashes = [
    "0xa3f8e2c1d4b5...7f9e",
    "0x1b2c3d4e5f6a...8b7c",
    "0xd9e8f7a6b5c4...3d2e",
    "0x4f5e6d7c8b9a...0f1e",
    "0x7a8b9c0d1e2f...4a5b",
    "0xc3d4e5f6a7b8...9c0d",
    "0xe1f2a3b4c5d6...7e8f",
    "0x2b3c4d5e6f7a...1b2c",
  ];

  const doubled = [...hashes, ...hashes];

  return (
    <div className="overflow-hidden border-y border-border bg-muted/50 py-2">
      <div className="flex animate-hash-scroll whitespace-nowrap">
        {doubled.map((hash, i) => (
          <span
            key={i}
            className="mx-6 font-mono text-xs text-muted-foreground/60"
          >
            {hash}
          </span>
        ))}
      </div>
    </div>
  );
}
