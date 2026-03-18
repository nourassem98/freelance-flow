"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Monitor, LayoutDashboard, Users } from "lucide-react";
import Image from "next/image";

// Avoid SSR hydration issues by loading react-countup on the client.
const CountUp = dynamic(() => import("react-countup"), { ssr: false });

/** Hook: respects user's motion preferences */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    setReduced(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

/** Utility: parse a metric like "98%", "3.8x", "$1,200+", "1.5M", "€23.4k" */
function parseMetricValue(raw: string) {
  const value = (raw ?? "").toString().trim();
  const m = value.match(
    /^([^\d\-+]*?)\s*([\-+]?\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*([^\d\s]*)$/
  );
  if (!m) {
    return { prefix: "", end: 0, suffix: value, decimals: 0 };
  }
  const [, prefix, num, suffix] = m;
  const normalized = num.replace(/,/g, "");
  const end = parseFloat(normalized);
  const decimals = (normalized.split(".")[1]?.length ?? 0);
  return {
    prefix: prefix ?? "",
    end: isNaN(end) ? 0 : end,
    suffix: suffix ?? "",
    decimals,
  };
}

/** Small component: one animated metric */
function MetricStat({
  value,
  label,
  sub,
  duration = 1.6,
}: {
  value: string;
  label: string;
  sub?: string;
  duration?: number;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const { prefix, end, suffix, decimals } = parseMetricValue(value);

  return (
    <div className="flex flex-col gap-2 text-left p-6">
      <p
        className="text-2xl font-medium text-white sm:text-4xl"
        aria-label={`${label} ${value}`}
      >
        {prefix}
        {reduceMotion ? (
          <span>
            {end.toLocaleString(undefined, {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })}
          </span>
        ) : (
          <CountUp
            end={end}
            decimals={decimals}
            duration={duration}
            separator=","
            enableScrollSpy
            scrollSpyOnce
          />
        )}
        {suffix}
      </p>
      <p className="font-medium text-white text-left">
        {label}
      </p>
      {sub ? (
        <p className="text-gray-400 text-left">{sub}</p>
      ) : null}
    </div>
  );
}

export default function Casestudies() {
  const caseStudies = [
    {
      id: 1,
      quote:
        "With Freelance Flow, I finally have all my clients in one place. The dashboard is intuitive and I've increased my productivity by 40% since switching.",
      name: "Sarah Johnson",
      role: "Web Developer",
      icon: Monitor,
      metrics: [
        { value: "40%", label: "Productivity Boost", sub: "Client management efficiency" },
        { value: "95%", label: "Client Satisfaction", sub: "Based on feedback surveys" },
      ],
    },
    {
      id: 2,
      quote:
        "Freelance Flow transformed how I handle invoices. The automated reminders have recovered thousands in late payments and saved me hours every week.",
      name: "Michael Chen",
      role: "Graphic Designer",
      icon: LayoutDashboard,
      metrics: [
        { value: "$8,450", label: "Recovered Revenue", sub: "From automated reminders" },
        { value: "70%", label: "Time Saved", sub: "On invoice management" },
      ],
    },
    {
      id: 3,
      quote:
        "The project tracking features in Freelance Flow changed how I manage deadlines. Everything is transparent and my clients love the progress updates.",
      name: "Emma Rodriguez",
      role: "Marketing Consultant",
      icon: Users,
      metrics: [
        { value: "2x", label: "Faster Delivery", sub: "Project completion rate" },
        { value: "88%", label: "Client Retention", sub: "Long-term partnerships" },
      ],
    },
  ];

  return (
    <section
      className="py-32 bg-black"
      aria-labelledby="case-studies-heading"
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto">
          <h2
            id="case-studies-heading"
            className="text-4xl font-semibold md:text-5xl text-white"
          >
            Real results with Freelance Flow
          </h2>
          <p className="text-gray-400">
            From client management to invoicing—Freelance Flow powers freelancers with speed,
            clarity, and consistency.
          </p>
        </div>

        {/* Cases */}
        <div className="mt-20 flex flex-col gap-20">
          {caseStudies.map((study, idx) => {
            const reversed = idx % 2 === 1;
            return (
              <div
                key={study.id}
                className="grid gap-12 lg:grid-cols-3 xl:gap-24 items-center border-b border-gray-800 pb-12"
              >
                {/* Left: Image + Quote */}
                <div
                  className={[
                    "flex flex-col sm:flex-row gap-10 lg:col-span-2 lg:border-r lg:pr-12 xl:pr-16 text-left",
                    reversed
                      ? "lg:order-2 lg:border-r-0 lg:border-l border-gray-800 lg:pl-12 xl:pl-16 lg:pr-0"
                      : "border-gray-800",
                  ].join(" ")}
                >
                  <div className="aspect-[29/35] h-auto w-full max-w-60 rounded-2xl bg-gray-800 ring-1 ring-gray-700 hover:scale-105 transition-all duration-300 flex items-center justify-center">
                    <study.icon className="h-16 w-16 text-gray-400" />
                  </div>
                  <figure className="flex flex-col justify-between gap-8 text-left">
                    <blockquote className="text-lg sm:text-xl text-white leading-relaxed text-left">
                      <h3 className="text-lg sm:text-xl lg:text-xl font-normal text-white leading-relaxed text-left">
                        Intuitive Dashboard Experience{" "}
                        <span className="block text-gray-400 text-sm sm:text-base lg:text-lg mt-2">
                          {study.quote}
                        </span>
                      </h3>
                    </blockquote>
                    <figcaption className="flex items-center gap-6 mt-4 text-left">
                      <div className="flex flex-col gap-1">
                        <span className="text-md font-medium text-white">
                          {study.name}
                        </span>
                        <span className="text-sm text-gray-400">
                          {study.role}
                        </span>
                      </div>
                    </figcaption>
                  </figure>
                </div>

                {/* Right: Metrics */}
                <div
                  className={[
                    "grid grid-cols-1 gap-10 self-center text-left",
                    reversed ? "lg:order-1" : "",
                  ].join(" ")}
                >
                  {study.metrics.map((metric, i) => (
                    <MetricStat
                      key={`${study.id}-${i}`}
                      value={metric.value}
                      label={metric.label}
                      sub={metric.sub}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}