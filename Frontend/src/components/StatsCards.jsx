import CountUp from 'react-countup';

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Prompts',
      value: stats.totalPrompts,
      icon: '📊',
      gradient: 'from-blue-600 to-cyan-500',
      iconBg: 'bg-blue-500/10',
      border: 'border-blue-500/10',
    },
    {
      title: 'Attacks Blocked',
      value: stats.blockedAttacks,
      icon: '🚫',
      gradient: 'from-red-600 to-pink-500',
      iconBg: 'bg-red-500/10',
      border: 'border-red-500/10',
    },
    {
      title: 'Jailbreak Attempts',
      value: stats.jailbreakAttempts,
      icon: '🔓',
      gradient: 'from-orange-500 to-red-500',
      iconBg: 'bg-orange-500/10',
      border: 'border-orange-500/10',
    },
    {
      title: 'Injection Attempts',
      value: stats.injectionAttempts,
      icon: '💉',
      gradient: 'from-yellow-500 to-orange-500',
      iconBg: 'bg-yellow-500/10',
      border: 'border-yellow-500/10',
    },
    {
      title: 'Sanitized',
      value: stats.sanitizedPrompts,
      icon: '⚠️',
      gradient: 'from-amber-500 to-yellow-500',
      iconBg: 'bg-amber-500/10',
      border: 'border-amber-500/10',
    },
    {
      title: 'Safe & Allowed',
      value: stats.allowedPrompts,
      icon: '✅',
      gradient: 'from-green-500 to-emerald-500',
      iconBg: 'bg-green-500/10',
      border: 'border-green-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`glass rounded-2xl p-4 border ${card.border} hover:scale-[1.03] transition-all duration-300 animate-fade-in-up group cursor-default`}
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center text-lg group-hover:scale-110 transition-transform`}>
              {card.icon}
            </div>
            <div className={`h-1 w-8 rounded-full bg-gradient-to-r ${card.gradient} opacity-40`} />
          </div>
          <p className="text-2xl font-black text-white mb-1">
            <CountUp end={card.value} duration={1.5} />
          </p>
          <p className="text-[11px] text-gray-500 font-medium">{card.title}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;