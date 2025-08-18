import React, { useRef, useEffect } from "react";
import type { CSSProperties } from "react";

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string | ((t: number) => number);
  splitType?: "chars" | "words" | "lines" | "words, chars";
  from?: any;
  to?: any;
  threshold?: number;
  rootMargin?: string;
  textAlign?: CSSProperties["textAlign"];
  onLetterAnimationComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = "",
  delay = 100,
  duration = 0.6,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  onLetterAnimationComplete,
}) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const scrollTriggerRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !ref.current || !text) return;

    let gsap: any, ScrollTrigger: any, SplitTextPlugin: any;
    let splitter: any;

    const init = async () => {
      const gsapModule = await import("gsap");
      const scrollTriggerModule = await import("gsap/ScrollTrigger");
      const splitTextModule = await import("gsap/SplitText");

      gsap = gsapModule.gsap || gsapModule.default;
      ScrollTrigger =
        scrollTriggerModule.ScrollTrigger || scrollTriggerModule.default;
      SplitTextPlugin = splitTextModule.SplitText || splitTextModule.default;
      gsap.registerPlugin(ScrollTrigger, SplitTextPlugin);

      const el = ref.current;
      if (!el) return;
      const absoluteLines = splitType === "lines";
      if (absoluteLines) el.style.position = "relative";

      splitter = new SplitTextPlugin(el, {
        type: splitType,
        absolute: absoluteLines,
        linesClass: "split-line",
      });

      let targets: Element[] = splitter[splitType] || splitter.chars;
      targets.forEach((t: any) => (t.style.willChange = "transform, opacity"));

      const startPct = (1 - threshold) * 100;
      const start = `top ${startPct}%${rootMargin}`;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none none",
          once: true,
          onToggle: (self: any) => (scrollTriggerRef.current = self),
        },
        smoothChildTiming: true,
        onComplete: () => {
          gsap.set(targets, {
            ...to,
            clearProps: "willChange",
            immediateRender: true,
          });
          onLetterAnimationComplete?.();
        },
      });

      tl.set(targets, { ...from, immediateRender: false, force3D: true });
      tl.to(targets, {
        ...to,
        duration,
        ease,
        stagger: delay / 1000,
        force3D: true,
      });
    };

    init();

    return () => {
      if (scrollTriggerRef.current) scrollTriggerRef.current.kill();
      if (splitter) splitter.revert();
    };
  }, [
    text,
    delay,
    duration,
    ease,
    splitType,
    from,
    to,
    threshold,
    rootMargin,
    onLetterAnimationComplete,
  ]);

  return (
    <p
      ref={ref}
      className={`split-parent ${className}`}
      style={{
        textAlign,
        overflow: "hidden",
        display: "inline-block",
        whiteSpace: "normal",
        wordWrap: "break-word",
      }}
    >
      {text}
    </p>
  );
};

export default SplitText;
