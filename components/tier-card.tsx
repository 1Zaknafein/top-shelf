interface TierCardProps {
  tier: string;
  className?: string;
}

export function TierCard({ tier, className = "" }: TierCardProps) {
  return (
    <div
      className={`bg-tier-card rounded-lg w-20 h-20 flex items-center justify-center ${className}`}
      style={{ boxShadow: "0 8px 20px var(--tier-color-border)" }}
    >
      <span className="tier-text">{tier}</span>
    </div>
  );
}
