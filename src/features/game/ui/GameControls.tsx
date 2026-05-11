import { RetroButton } from "@/shared/ui/RetroButton";

interface GameControlsProps {
  onQuit: () => void;
  disabled?: boolean;
}

export function GameControls({ onQuit, disabled = false }: GameControlsProps) {
  return (
    <div className="flex items-center justify-end border-t border-wire pt-4">
      <RetroButton
        onClick={onQuit}
        disabled={disabled}
        variant="secondary"
        className="px-4 py-2"
        aria-label="게임 중단"
      >
        복원 중단
      </RetroButton>
    </div>
  );
}
