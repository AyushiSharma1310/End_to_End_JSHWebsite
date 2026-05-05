import { useEffect, useRef, useState } from "react";

const hiddenClasses = {
  up: "opacity-0 translate-y-12",
  left: "opacity-0 -translate-x-16",
  right: "opacity-0 translate-x-16",
};

export default function FadeUpSection({ children, direction = "up", delay = 0 }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out will-change-transform ${
        show
          ? "opacity-100 translate-x-0 translate-y-0"
          : hiddenClasses[direction] || hiddenClasses.up
      }`}
    >
      {children}
    </div>
  );
}
