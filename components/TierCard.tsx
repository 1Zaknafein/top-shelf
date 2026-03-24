
interface TierCardProps {
  tier: string;
  className?: string;
}

export function TierCard({ tier, className = "" }: TierCardProps) {
  return (
    <div
      className={`bg-[#262626] rounded-lg w-16 sm:w-20 h-full flex items-center justify-center ${className}`}
      style={{ boxShadow: '0 8px 20px var(--tier-color-border)' }}
      aria-hidden
    >
      <span className="tier-letter">{tier}</span>
    </div>
  );
}

export default TierCard;
