import { cn } from "@/lib/utils";
import {
  IconAdjustmentsBolt,
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconHeart,
  IconHelp,
  IconRouteAltLeft,
  IconTerminal2,
} from "@tabler/icons-react";
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import WaterfallChartIcon from '@mui/icons-material/WaterfallChart';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import Link from 'next/link';

export function FeaturesSectionWithHoverEffects() {
  const features = [
    {
      title: "Stocks",
      description:
        "Invest in company shares and build a portfolio for long-term growth potential.",
      icon: <WaterfallChartIcon />,
      id: "stocks",
    },
    {
      title: "Bonds",
      description:
        "Secure fixed income investments with lower risk compared to equities.",
      icon: <IconEaseInOut />,
      id: "bonds",
    },
    {
      title: "Cryptocurrencies",
      description:
        "Trade digital currencies in a secure environment with real-time market data.",
      icon: <CurrencyBitcoinIcon />,
      id: "cryptocurrencies",
    },
    {
      title: "Personal Finance - Insurance",
      description: "Protect your assets with comprehensive coverage options tailored to your needs.",
      icon: <IconCloud />,
      id: "insurance",
    },
    {
      title: "Personal Finance - Mutual Funds",
      description: "Diversify investments through professionally managed funds with various risk profiles.",
      icon: <IconRouteAltLeft />,
      id: "mutual-funds",
    },
    {
      title: "Fundamental Analysis",
      description:
        "Evaluate investments using financial statements, industry trends, and economic indicators.",
      icon: <IconHelp />,
      id: "fundamental-analysis",
    },
    {
      title: "Technical Analysis",
      description:
        "Analyze price movements and trading volumes to identify potential market opportunities.",
      icon: <IconAdjustmentsBolt />,
      id: "technical-analysis",
    },
    {
      title: "Markets and Taxation",
      description:
        "Understand tax implications of your investments and optimize for tax efficiency.",
      icon: <IconTerminal2 />,
      id: "markets-taxation",
    },
    {
      title: "Currency, Commodity, and Government Securities",
      description:
        "Access global markets through forex, commodities, and sovereign debt investments.",
      icon: <CurrencyExchangeIcon />,
      id: "currency-commodity",
    },
    
    {
      title: "Fixed Deposits",
      description:
        "Earn stable returns with guaranteed principal safety through term deposits.",
      icon: <IconEaseInOut />,
      id: "fixed-deposits",
    },
  ];
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Educational Resources
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Expand your financial knowledge with our comprehensive educational materials
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-4 relative z-10 py-10 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <Feature key={feature.title} {...feature} index={index} />
        ))}
      </div>
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
  id,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
  id: string;
}) => {
  const bgColors = [
    "bg-red-100",
    "bg-green-100",
    "bg-blue-100",
    "bg-yellow-100",
    "bg-purple-100",
    "bg-pink-100",
    "bg-cyan-100",
    "bg-teal-100",
  ];
  const bgColor = bgColors[index % bgColors.length];

  // Calculate the position based on the index
  const row = Math.floor(index / 4);
  const col = index % 4;
  
  return (
    <Link href={`/education/${id}`} className="block">
      <div
        className={cn(
          bgColor,
          "flex flex-col py-10 relative group/feature cursor-pointer",
          "transition-all duration-300 ease-in-out",
          "hover:shadow-lg hover:z-20 hover:scale-105",
          "border border-neutral-200 dark:border-neutral-800",
          "min-h-[250px]"
        )}
      >
        <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400 transition-transform duration-300 group-hover/feature:translate-y-[-5px]">
          {icon}
        </div>
        <div className="text-lg font-bold mb-2 relative z-10 px-10">
          <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
          <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
            {title}
          </span>
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
          {description}
        </p>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent dark:from-transparent dark:via-transparent dark:to-transparent group-hover/feature:from-blue-50 group-hover/feature:via-blue-50 group-hover/feature:to-transparent dark:group-hover/feature:from-blue-950/20 dark:group-hover/feature:via-blue-950/20 dark:group-hover/feature:to-transparent transition-all duration-500"></div>
      </div>
    </Link>
  );
};
