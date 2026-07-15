"use client";

import { Tone } from "@/lib/anthropic";

type Props = {
  value: Tone;
  onChange: (tone: Tone) => void;
};

const OPTIONS: { value: Tone; label: string; description: string }[] = [
  { value: "fun", label: "재미로 보기", description: "가볍고 유쾌한 톤으로 풀이" },
  { value: "traditional", label: "전통 관상학 이론 기반", description: "삼정·오악 등 이론 용어로 풀이" },
];

export default function ToneSelector({ value, onChange }: Props) {
  return (
    <div className="tone-selector">
      {OPTIONS.map((opt) => (
        <label
          key={opt.value}
          className={`tone-selector__option ${value === opt.value ? "tone-selector__option--active" : ""}`}
        >
          <input
            type="radio"
            name="tone"
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
          />
          <span className="tone-selector__label">{opt.label}</span>
          <span className="tone-selector__description">{opt.description}</span>
        </label>
      ))}
    </div>
  );
}
