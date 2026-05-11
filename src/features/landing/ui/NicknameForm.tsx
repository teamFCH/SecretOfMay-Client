import { useState, type FormEvent } from "react";
import { RetroButton } from "@/shared/ui/RetroButton";
import { RetroInput } from "@/shared/ui/RetroInput";

interface NicknameFormProps {
  onSubmit: (nickname: string) => void;
  defaultValue?: string;
}

export function NicknameForm({ onSubmit, defaultValue = "" }: NicknameFormProps) {
  const [nickname, setNickname] = useState(defaultValue);
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedNickname = nickname.trim();

    if (trimmedNickname.length < 2) {
      setError("코드명은 2자 이상이어야 합니다");
      return;
    }

    if (trimmedNickname.length > 10) {
      setError("코드명은 10자 이하여야 합니다");
      return;
    }

    setError("");
    onSubmit(trimmedNickname);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-in-2">
      <p className="text-center font-mono text-[10px] uppercase tracking-[0.28em] text-parchment-muted">
        복원 요원 신원 확인
      </p>

      <RetroInput
        id="nickname"
        label="코드명 입력"
        placeholder="2-10자 이내"
        value={nickname}
        onChange={(event) => {
          setNickname(event.target.value);
          if (error) {
            setError("");
          }
        }}
        error={error}
        maxLength={10}
        autoComplete="nickname"
        autoCapitalize="off"
        autoCorrect="off"
        autoFocus
        spellCheck={false}
      />

      <RetroButton type="submit" fullWidth disabled={!nickname.trim()}>
        기록 복원 시작 →
      </RetroButton>
    </form>
  );
}
