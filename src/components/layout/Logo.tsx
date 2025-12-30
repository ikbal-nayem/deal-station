import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 160"
      className={cn("text-foreground", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M62.3,158.1C24,146.3,0,111,0,70.3C0,31.5,31.5,0,70.3,0c12.3,0,24.1,3.2,34.4,8.9L62.3,158.1z"
        className="text-primary"
        fill="currentColor"
      />
      <path
        d="M70.3,0C109,0,140.5,31.5,140.5,70.3c0,12.3-3.2,24.1-8.9,34.4L70.3,0z"
        className="text-accent"
        fill="currentColor"
      />
      <path
        opacity="0.8"
        d="M151.1,59.3c-7.9-25.2-26.3-45.7-50.6-55.3l32.1,32.1L151.1,59.3z"
        className="text-primary"
        fill="currentColor"
      />
      <path
        d="M149.3,71.2L123,97.5l-21.7,21.7c33.5-9.1,55.3-43,48-78H149.3z"
        className="text-primary"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M136.8,124.9l-11-4.7l-29.4-38.4l-9.1-11.9c-5.8-3.4-12.3-5.2-19.1-5.2c-20.9,0-38.4,17.5-38.4,38.4c0,9.9,3.8,19.1,10.2,26l-11.5-1.9c-0.2,0.6-0.3,1.2-0.5,1.8L2,104.7c10.4,32.2,43,51,75.2,40.6s51-43,40.6-75.2L136.8,124.9z M95.8,107.5c0,13.1-10.7,23.8-23.8,23.8s-23.8-10.7-23.8-23.8s10.7-23.8,23.8-23.8c6.6,0,12.6,2.7,16.8,7.1l-10.4,13.6l13.6,10.4L95.8,107.5z"
        className="text-accent"
        fill="currentColor"
      />
    </svg>
  );
}
