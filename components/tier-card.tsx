interface TierCardProps {
  tier: string;
  className?: string;
}

export function TierCard({ tier, className = "" }: TierCardProps) {
  return (
    <div
      className={`glass-bg w-20 h-20 flex items-center justify-center rounded-lg ${className}`}
      style={{ boxShadow: "0 8px 20px var(--tier-color-border)" }}
    >
      <span className="tier-text">{tier}</span>
    </div>
  );
}
