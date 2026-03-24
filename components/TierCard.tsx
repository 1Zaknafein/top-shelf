
interface TierCardProps {
  tier: string;
  className?: string;
}

export function TierCard({ tier, className = "" }: TierCardProps) {
  return (
    <div
      className={`bg-[#262626] rounded-lg w-20 sm:w-24 h-20 sm:h-24 flex items-center justify-center ${className}`}
      style={{ boxShadow: '0 8px 20px var(--tier-color-border)' }}
    >
      <span className="tier-text" >
        {tier}
      </span>
    </div>
  );
}

