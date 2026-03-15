import { cn } from "../../lib/utils";
import {
  IconUsers,
  IconFolder,
  IconReceipt,
  IconShield,
  IconRobot,
  IconCalendar,
  IconChartBar,
  IconSparkles,
} from "@tabler/icons-react";

export function FeaturesSectionWithHoverEffects() {
  const features = [
    {
      title: "Client Management",
      description:
        "Organize all your clients in one place with detailed profiles and contact information.",
      icon: <IconUsers />,
    },
    {
      title: "Project Tracking",
      description:
        "Monitor project progress, deadlines, and milestones with intuitive task management.",
      icon: <IconFolder />,
    },
    {
      title: "Invoice System",
      description:
        "Create, send, and track invoices with automated reminders and payment processing.",
      icon: <IconReceipt />,
    },
    {
      title: "Secure & Private",
      description:
        "Your data is protected with enterprise-grade security and privacy controls.",
      icon: <IconShield />,
    },
    {
      title: "AI-Powered Assistance",
      description:
        "Get intelligent suggestions and automate repetitive tasks with our AI assistant.",
      icon: <IconRobot />,
    },
    {
      title: "Calendar Integration",
      description:
        "Sync with your favorite calendar apps and never miss a deadline or meeting.",
      icon: <IconCalendar />,
    },
    {
      title: "Revenue Analytics",
      description:
        "Track your earnings, expenses, and financial performance with detailed reports.",
      icon: <IconChartBar />,
    },
    {
      title: "Smart Automation",
      description:
        "Streamline your workflow with automated invoicing, reminders, and follow-ups.",
      icon: <IconSparkles />,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-300 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-200/20 dark:from-neutral-700/20 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-300 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-200/20 dark:from-neutral-700/20 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-400/60 transition-all duration-300 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-300 inline-block text-white">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};