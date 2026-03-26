"use client";

import React from "react";

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export function Slider({
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  className = "",
  ...props
}: SliderProps) {
  return (
    <input
      type="range"
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      step={step}
      onChange={onChange}
      className={`w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer ${className}`}
      {...props}
    />
  );
}
