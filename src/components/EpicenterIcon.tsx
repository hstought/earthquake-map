interface EpicenterIconProps {
  className?: string;
  color?: string;
  bg?: string;
}

export default function EpicenterIcon({
  className,
  color = '#f97316',
  bg = 'transparent',
}: EpicenterIconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <rect width="100" height="100" rx="20" fill={bg} />
      <circle cx="50" cy="50" r="10" fill={color} />
      <circle cx="50" cy="50" r="26" fill="none" stroke={color} strokeWidth="5" />
      <circle cx="50" cy="50" r="42" fill="none" stroke={color} strokeWidth="4" opacity="0.5" />
    </svg>
  );
}
