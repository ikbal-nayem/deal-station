export function QrCodePlaceholder({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 0H40V10H10V40H0V0ZM10 10H30V30H10V10Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M60 0H100V40H90V10H60V0ZM70 10H90V30H70V10Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M40 100H0V60H10V90H40V100ZM10 70H30V90H10V70Z"
        fill="currentColor"
      />
      <path
        d="M90 60H100V70H90V60ZM60 90H70V100H60V90ZM70 90H80V100H70V90ZM90 80H100V90H90V80ZM90 90H100V100H90V90ZM80 90H90V100H80V90ZM60 60H70V70H60V60ZM70 60H80V70H70V60ZM80 60H90V70H80V60ZM90 50H100V60H90V50Z"
        fill="currentColor"
        fillOpacity="0.8"
      />
      <path
        d="M50 50H60V60H50V50ZM50 70H60V80H50V70ZM40 50H50V60H40V50ZM40 60H50V70H40V60ZM50 80H60V90H50V80ZM50 90H60V100H50V90ZM60 80H70V90H60V80ZM50 60H60V70H50V60Z"
        fill="currentColor"
        fillOpacity="0.6"
      />
    </svg>
  );
}
