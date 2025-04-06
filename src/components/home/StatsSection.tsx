'use client';

type Stat = {
  value: string;
  label: string;
};

type StatsSectionProps = {
  stats?: Stat[];
};

export default function StatsSection({ stats }: StatsSectionProps) {
  // Default stats if none provided
  const defaultStats = [
    { value: "500+", label: "Fitness Venues" },
    { value: "15,000+", label: "Happy Users" },
    { value: "25+", label: "Cities Covered" },
    { value: "4.8", label: "Average Rating" }
  ];

  const displayStats = stats || defaultStats;

  return (
    <section className="py-16 bg-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {displayStats.map((stat, index) => (
            <div key={index}>
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-indigo-200">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 