import { useEffect, useRef } from "react";

/**
 * 磁吸悬停：指针靠近时元素被轻轻吸向指针。
 * 返回 ref，挂到需要磁吸的元素（或其包装层）上，
 * 配合 CSS：transform: translate(var(--magnet-x, 0), var(--magnet-y, 0))。
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.22) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const handleMove = (event: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      el.style.setProperty("--magnet-x", `${(x * strength).toFixed(1)}px`);
      el.style.setProperty("--magnet-y", `${(y * strength).toFixed(1)}px`);
    };
    const handleLeave = () => {
      el.style.setProperty("--magnet-x", "0px");
      el.style.setProperty("--magnet-y", "0px");
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [strength]);

  return ref;
}
