export const educationContent = [
  {
    id: "stocks",
    title: "Stocks: Building Wealth Through Equity",
    subtitle: "Learn how to invest in company shares and understand stock market fundamentals",
    image: "/constants/stocks.png",  // Updated path format
    difficulty: "Beginner",
    overview: [
      "Stocks represent ownership shares in a company. When you buy a stock, you're purchasing a small piece of that company, becoming a shareholder. As a shareholder, you may benefit from the company's growth and profits through appreciation in the stock price and potentially dividends.",
      "Stock investing is one of the most accessible ways to build wealth over time. While short-term price movements can be volatile, historical data shows that stocks have outperformed most other asset classes over the long term. Understanding how to research, select, and monitor stocks is essential for any investor's toolkit."
    ],
    keyPoints: [
      "Stocks represent partial ownership in a company",
      "Stock prices fluctuate based on company performance, investor sentiment, and market conditions",
      "Long-term stock investing has historically outperformed other asset classes",
      "Diversification across multiple stocks helps manage risk",
      "Dividends provide income from stock investments without selling shares"
    ],
    learningPath: [
      {
        title: "Introduction to Stock Markets",
        duration: "15 min",
        type: "video"
      },
      {
        title: "How to Research Stocks",
        duration: "25 min",
        type: "reading"
      },
      {
        title: "Understanding Stock Valuation",
        duration: "30 min",
        type: "video"
      },
      {
        title: "Building a Stock Portfolio",
        duration: "20 min",
        type: "reading"
      }
    ],
    lessons: [
      {
        title: "Understanding Stock Markets",
        duration: "15 minutes",
        description: "Learn the basics of how stock markets function and why companies issue stocks.",
        content: [
          "Stock markets are platforms where buyers and sellers trade shares of publicly listed companies. These markets provide companies with access to capital and give investors the opportunity to share in the financial success of these companies.",
          "The primary market is where new securities are issued and sold for the first time, like in an Initial Public Offering (IPO). The secondary market is where existing securities are bought and sold between investors."
        ],
        example: "When Apple Inc. first offered its shares to the public in 1980, the IPO price was $22 per share. This transaction occurred in the primary market. Since then, Apple shares have been trading between investors in the secondary market."
      },
      {
        title: "Stock Valuation Methods",
        duration: "25 minutes",
        description: "Discover how to analyze and determine the intrinsic value of a stock.",
        content: [
          "Stock valuation is the process of determining the intrinsic value of a stock. Two major approaches are fundamental analysis and technical analysis.",
          "Fundamental analysis involves evaluating a company's financial health, business model, competitive advantage, and growth prospects to determine if a stock is undervalued or overvalued.",
          "Key metrics in fundamental analysis include P/E ratio (Price-to-Earnings), EPS (Earnings Per Share), P/B ratio (Price-to-Book), and dividend yield."
        ]
      },
      {
        title: "Creating a Diversified Portfolio",
        duration: "20 minutes",
        description: "Learn strategies for building a balanced stock portfolio to manage risk.",
        content: [
          "Diversification is the strategy of spreading investments across various assets to reduce risk. With stocks, this means investing in companies across different sectors, market capitalizations, and geographic regions.",
          "A well-diversified stock portfolio might include growth stocks for capital appreciation, value stocks that appear undervalued, dividend stocks for income, and potentially international stocks for global exposure."
        ]
      }
    ],
    resources: [
      {
        title: "The Intelligent Investor",
        type: "book",
        description: "Benjamin Graham's classic text on value investing strategy",
        source: "Benjamin Graham",
        link: "https://yourknowledgedigest.org/wp-content/uploads/2020/04/the-intelligent-investor.pdf"
      },
      {
        title: "Understanding Financial Statements",
        type: "article",
        description: "How to read and analyze company financial reports",
        source: "Investopedia",
        duration: "15 min read",
        link: "https://www.investopedia.com/terms/f/financial-statements.asp"
      },
      {
        title: "Stock Valuation Models Explained",
        type: "video",
        description: "Detailed walkthrough of DCF and comparable company analysis",
        source: "Investopedia",
        duration: "28 min",
        link: "https://www.investopedia.com/articles/fundamental-analysis/11/choosing-valuation-methods.asp"
      },
      {
        title: "Market Cycles and Timing Strategies",
        type: "article",
        description: "Understanding economic cycles and their impact on stock prices",
        source: "Investopeida",
        duration: "12 min read",
        link: "https://www.investopedia.com/terms/m/market_cycles.asp"
      }
    ],
    glossary: [
      {
        term: "Bull Market",
        definition: "A financial market condition in which prices are rising or expected to rise."
      },
      {
        term: "Bear Market",
        definition: "A market condition in which stock prices fall and widespread pessimism causes the stock market's downward spiral to be self-sustaining."
      },
      {
        term: "Dividend",
        definition: "A portion of a company's earnings that is paid to shareholders, usually in cash, on a quarterly or annual basis."
      },
      {
        term: "Market Capitalization",
        definition: "The total dollar market value of a company's outstanding shares, calculated by multiplying the current share price by the total number of shares outstanding."
      },
      {
        term: "P/E Ratio",
        definition: "The price-to-earnings ratio, which is the current share price divided by earnings per share, used to determine if a stock is overvalued or undervalued."
      }
    ],
    quiz: {
      questions: [
        {
          text: "What does owning a stock represent?",
          options: [
            "A loan to a company",
            "Partial ownership in a company",
            "A guaranteed return on investment",
            "A bond issued by a company"
          ],
          correctAnswer: 1
        },
        {
          text: "Which of the following is NOT a common stock valuation metric?",
          options: [
            "P/E Ratio",
            "Dividend Yield",
            "Market Share",
            "Price-to-Book Ratio"
          ],
          correctAnswer: 2
        },
        {
          text: "What is the main benefit of diversification in a stock portfolio?",
          options: [
            "Guaranteed higher returns",
            "Lower transaction costs",
            "Reduced risk through exposure to different assets",
            "Tax advantages"
          ],
          correctAnswer: 2
        }
      ]
    },
    relatedTopics: [
      {
        title: "Technical Analysis",
        description: "Learn how to analyze price movements and trading patterns",
        id: "technical-analysis"
      },
      {
        title: "Fundamental Analysis",
        description: "Evaluate companies using financial statements and economic indicators",
        id: "fundamental-analysis"
      },
      {
        title: "Mutual Funds",
        description: "Understand professionally managed investment portfolios",
        id: "mutual-funds"
      }
    ]
  },
  {
    id: "bonds",
    title: "Bonds: Fixed Income Investing",
    subtitle: "Understand how bonds work as debt instruments and their role in your portfolio",
    image: "/constants/bonds.png",
    difficulty: "Intermediate",
    overview: [
      "Bonds are debt securities where investors lend money to an entity (typically a government or corporation) for a defined period at a fixed or variable interest rate. When you purchase a bond, you're essentially becoming a creditor to the issuer.",
      "Unlike stocks, bonds typically offer regular interest payments (coupons) and return the principal at maturity. They are generally considered less risky than stocks, making them an important component of a balanced investment portfolio, especially for income-focused or risk-averse investors."
    ],
    keyPoints: [
      "Bonds represent debt, not ownership like stocks",
      "Bond prices move inversely to interest rates",
      "Credit ratings impact bond yields and risk levels",
      "Bonds typically offer more stable income than stocks",
      "Government bonds generally carry lower risk than corporate bonds"
    ],
    learningPath: [
      {
        title: "Bond Fundamentals",
        duration: "20 min",
        type: "video"
      },
      {
        title: "Types of Bonds",
        duration: "25 min",
        type: "reading"
      },
      {
        title: "Understanding Bond Pricing",
        duration: "30 min",
        type: "video"
      },
      {
        title: "Building a Bond Portfolio",
        duration: "20 min",
        type: "reading"
      }
    ],
    lessons: [
      {
        title: "Introduction to Bond Markets",
        duration: "20 minutes",
        description: "Understand the basics of bonds and their role in financial markets.",
        content: [
          "Bonds are fixed-income securities that represent loans made by investors to borrowers, typically corporate or governmental entities. They serve as crucial financing tools for governments and corporations while providing investors with income opportunities.",
          "The global bond market is actually larger than the stock market in terms of dollar value. It plays a vital role in the economy by facilitating capital flow, determining interest rates, and providing economic indicators."
        ],
        example: "When the U.S. government needs to raise money to fund projects, it issues Treasury bonds. Investors buy these bonds, effectively lending money to the government. In return, the government pays investors interest over the bond's term and returns the principal at maturity."
      },
      {
        title: "Bond Types and Features",
        duration: "25 minutes",
        description: "Explore different categories of bonds and their unique characteristics.",
        content: [
          "Government bonds are issued by national governments and are considered the safest type. Municipal bonds are issued by state and local governments. Corporate bonds are issued by companies and typically offer higher yields due to increased risk.",
          "Key bond features include face value (the amount returned at maturity), coupon rate (the interest rate), maturity date (when the principal is repaid), and yield (the actual return based on price paid and interest received)."
        ]
      },
      {
        title: "Bond Pricing and Interest Rates",
        duration: "30 minutes",
        description: "Learn how bond prices fluctuate and their relationship with interest rates.",
        content: [
          "Bond prices and interest rates have an inverse relationship. When interest rates rise, existing bond prices fall because newer bonds offer higher yields. Conversely, when interest rates fall, existing bond prices rise as their fixed coupon rates become more attractive.",
          "Duration measures a bond's sensitivity to interest rate changes. Longer-term bonds typically have higher duration and are more sensitive to interest rate fluctuations than shorter-term bonds."
        ]
      }
    ],
    resources: [
      {
        title: "The Bond Book",
        type: "book",
        description: "Comprehensive guide to bond investing strategies and markets",
        source: "Annette Thau",
        link: "https://students.aiu.edu/submissions/profiles/resources/onlineBook/D7g6b3_The_Bond_Book_Everything_Investors_Need_to_Know_About_Treasuries-_Municipals-_GNMAs-_Corporates.pdf"
      },
      {
        title: "Understanding Bond Yield Curves",
        type: "article",
        description: "How to interpret yield curves and their economic implications",
        source: "Investopedia",
        duration: "15 min read",
        link: "https://www.investopedia.com/terms/y/yieldcurve.asp"
      },
      {
        title: "Bond Portfolio Construction",
        type: "video",
        description: "Strategies for building and managing a fixed-income portfolio",
        source: "Charles Schwab",
        duration: "28 min",
        link: "https://www.youtube.com/watch?v=UkVbFped0j8"
      },
      {
        title: "Credit Ratings Explained",
        type: "article",
        description: "How bond ratings work and what they mean for investors",
        source: "S&P Global",
        duration: "12 min read",
        link: "https://www.spglobal.com/ratings/en/about/understanding-credit-ratings"
      }
    ],
    glossary: [
      {
        term: "Coupon Rate",
        definition: "The annual interest rate paid on a bond, expressed as a percentage of the face value."
      },
      {
        term: "Yield to Maturity",
        definition: "The total return anticipated on a bond if held until its maturity date, considering purchase price, par value, coupon interest, and time to maturity."
      },
      {
        term: "Duration",
        definition: "A measure of a bond's sensitivity to interest rate changes, expressed in years."
      },
      {
        term: "Credit Rating",
        definition: "An assessment of the creditworthiness of a bond issuer, indicating the likelihood of default."
      },
      {
        term: "Bond Ladder",
        definition: "An investment strategy involving the purchase of bonds with staggered maturity dates to reduce interest rate risk and provide liquidity."
      }
    ],
    quiz: {
      questions: [
        {
          text: "What happens to existing bond prices when interest rates rise?",
          options: [
            "Bond prices rise",
            "Bond prices fall",
            "Bond prices remain unchanged",
            "Bond prices become more volatile"
          ],
          correctAnswer: 1
        },
        {
          text: "Which type of bond typically offers the highest yield?",
          options: [
            "Government bonds",
            "Municipal bonds",
            "Investment-grade corporate bonds",
            "High-yield (junk) corporate bonds"
          ],
          correctAnswer: 3
        },
        {
          text: "What does the 'duration' of a bond measure?",
          options: [
            "The time until maturity",
            "The sensitivity to interest rate changes",
            "The total number of coupon payments",
            "The default risk of the issuer"
          ],
          correctAnswer: 1
        }
      ]
    },
    relatedTopics: [
      {
        title: "Fixed Deposits",
        description: "Compare bonds with bank deposit investment options",
        id: "fixed-deposits"
      },
      {
        title: "Government Securities",
        description: "Learn about treasury bills, notes, and bonds",
        id: "currency-commodity"
      },
      {
        title: "Portfolio Allocation",
        description: "Understand how to balance stocks and bonds in your portfolio",
        id: "fundamental-analysis"
      }
    ]
  },
  {
    id: "cryptocurrencies",
    title: "Cryptocurrencies: Digital Asset Investing",
    subtitle: "Discover how to navigate the world of digital currencies and blockchain technology",
    image: "/constants/crypto.png",
    difficulty: "Advanced",
    overview: [
      "Cryptocurrencies are digital or virtual currencies that use cryptography for security and operate on decentralized networks called blockchains. Unlike traditional currencies issued by governments, most cryptocurrencies are not controlled by any central authority.",
      "The cryptocurrency market offers high-growth potential but comes with significant volatility and risk. Understanding blockchain technology, market trends, and security practices is essential before investing in this emerging asset class."
    ],
    keyPoints: [
      "Cryptocurrencies operate on decentralized blockchain technology",
      "Bitcoin was the first cryptocurrency, but thousands now exist",
      "Crypto markets are highly volatile with 24/7 trading",
      "Security is crucial - private keys control access to crypto assets",
      "Regulatory frameworks for cryptocurrencies vary globally and continue to evolve"
    ],
    learningPath: [
      {
        title: "Blockchain Fundamentals",
        duration: "20 min",
        type: "video"
      },
      {
        title: "Major Cryptocurrencies Explained",
        duration: "30 min",
        type: "reading"
      },
      {
        title: "Crypto Wallets and Security",
        duration: "25 min",
        type: "video"
      },
      {
        title: "Crypto Investment Strategies",
        duration: "20 min",
        type: "reading"
      }
    ],
    lessons: [
      {
        title: "Understanding Blockchain Technology",
        duration: "20 minutes",
        description: "Learn the fundamentals of blockchain and how it powers cryptocurrencies.",
        content: [
          "Blockchain is a distributed ledger technology that records transactions across many computers. This decentralized structure provides transparency and security without requiring a trusted central authority.",
          "Each 'block' contains a list of transactions, and once completed, it's linked to the previous block, creating a 'chain'. This design makes the data extremely difficult to alter retroactively."
        ],
        example: "When someone sends Bitcoin to another person, this transaction is broadcast to the network and verified by miners. Once verified, it's added to a block, which is then added to the blockchain, making the transaction permanent and visible to all."
      },
      {
        title: "Cryptocurrency Types and Use Cases",
        duration: "25 minutes",
        description: "Explore the various types of cryptocurrencies and their purposes.",
        content: [
          "Bitcoin (BTC) was the first cryptocurrency, designed as a peer-to-peer payment system. Ethereum introduced smart contracts, allowing for decentralized applications (dApps) beyond simple transactions.",
          "Stablecoins are cryptocurrencies designed to minimize price volatility, often by pegging their value to a currency like the US dollar. Utility tokens provide access to a product or service within a specific ecosystem."
        ]
      },
      {
        title: "Crypto Security Best Practices",
        duration: "20 minutes",
        description: "Learn essential security measures for protecting your cryptocurrency investments.",
        content: [
          "Private keys are the cryptographic codes that give you access to your cryptocurrency. Losing your private keys means losing access to your funds permanently.",
          "Hardware wallets provide the highest level of security by storing private keys offline. Two-factor authentication, strong passwords, and recognizing phishing attempts are essential practices for crypto investors."
        ]
      }
    ],
    resources: [
      {
        title: "Mastering Bitcoin",
        type: "book",
        description: "Comprehensive guide to Bitcoin and blockchain technology",
        source: "Andreas M. Antonopoulos",
        link: "https://unglueit-files.s3.amazonaws.com/ebf/05db7df4f31840f0a873d6ea14dcc28d.pdf"
      },
      {
        title: "Crypto Market Analysis",
        type: "article",
        description: "How to research and evaluate cryptocurrency projects",
        source: "Fidelity",
        duration: "18 min read",
        link: "https://www.fidelity.com/learning-center/trading-investing/crypto/evaluate-cryptocurrencies"
      },
      {
        title: "Securing Your Crypto Assets",
        type: "video",
        description: "Step-by-step guide to crypto security best practices",
        source: "Every Bit Helps",
        duration: "11 min",
        link: "https://www.youtube.com/watch?v=TWR_o26_Odg"
      },
      {
        title: "DeFi Explained",
        type: "article",
        description: "Introduction to decentralized finance applications and protocols",
        source: "Investopedia",
        duration: "15 min read",
        link: "https://www.investopedia.com/decentralized-finance-defi-5113835"
      }
    ],
    glossary: [
      {
        term: "Blockchain",
        definition: "A distributed, decentralized public ledger where transactions are recorded in a secure, verifiable, and permanent way."
      },
      {
        term: "Mining",
        definition: "The process of validating transactions and adding them to a blockchain, usually rewarded with cryptocurrency."
      },
      {
        term: "Wallet",
        definition: "A digital tool that allows users to store and manage their cryptocurrencies."
      },
      {
        term: "DeFi",
        definition: "Decentralized Finance; financial applications built on blockchain technology that operate without centralized intermediaries."
      },
      {
        term: "NFT",
        definition: "Non-Fungible Token; a unique digital asset that represents ownership of a specific item or content, typically using blockchain technology."
      }
    ],
    quiz: {
      questions: [
        {
          text: "What technology powers most cryptocurrencies?",
          options: [
            "Artificial Intelligence",
            "Blockchain",
            "Cloud Computing",
            "Quantum Computing"
          ],
          correctAnswer: 1
        },
        {
          text: "Which of these is NOT a common way to store cryptocurrency?",
          options: [
            "Hardware wallet",
            "Paper wallet",
            "Credit card",
            "Software wallet"
          ],
          correctAnswer: 2
        },
        {
          text: "What happens if you lose your private keys?",
          options: [
            "The exchange can recover them for you",
            "You can request a replacement from the blockchain",
            "You permanently lose access to your cryptocurrency",
            "They automatically reset after 30 days"
          ],
          correctAnswer: 2
        }
      ]
    },
    relatedTopics: [
      {
        title: "Technical Analysis",
        description: "Apply chart analysis to cryptocurrency trading",
        id: "technical-analysis"
      },
      {
        title: "Risk Management",
        description: "Learn strategies to manage volatility in crypto investing",
        id: "fundamental-analysis"
      },
      {
        title: "Digital Asset Security",
        description: "Protect your investments from cyber threats",
        id: "markets-taxation"
      }
    ]
  },
  {
    id: "fixed-deposits",
    title: "Fixed Deposits: Stable Investment Solutions",
    subtitle: "Discover how to maximize returns with secure and predictable term deposits",
    image: "/constants/fixed-deposits.png",
    difficulty: "Beginner",
    overview: [
      "Fixed deposits, also known as term deposits or certificates of deposit (CDs), are financial instruments offered by banks and financial institutions where you deposit money for a specified period at a fixed interest rate. They offer guaranteed returns and principal safety, making them one of the safest investment options.",
      "While fixed deposits typically provide lower returns compared to stocks or mutual funds, they play a crucial role in a balanced portfolio by offering stability, predictable returns, and capital preservation. They're particularly valuable for emergency funds, short-term goals, and conservative investors."
    ],
    keyPoints: [
      "Fixed deposits offer guaranteed returns at predetermined interest rates",
      "Term lengths can range from a few months to several years",
      "Early withdrawal usually incurs penalties or reduced interest",
      "Interest rates typically increase with longer deposit terms",
      "Most fixed deposits are insured up to certain limits by government programs"
    ],
    learningPath: [
      {
        title: "Fixed Deposit Basics",
        duration: "15 min",
        type: "video"
      },
      {
        title: "Comparing FD Options",
        duration: "20 min",
        type: "reading"
      },
      {
        title: "Tax Implications of FDs",
        duration: "15 min",
        type: "video"
      },
      {
        title: "Fixed Deposits vs. Other Investments",
        duration: "25 min",
        type: "reading"
      }
    ],
    lessons: [
      {
        title: "Understanding Fixed Deposits",
        duration: "15 minutes",
        description: "Learn the fundamentals of fixed deposits and how they work.",
        content: [
          "Fixed deposits are time-bound investments where you deposit a lump sum for a specific period at a guaranteed interest rate. Unlike savings accounts, you cannot withdraw funds before maturity without penalties.",
          "Interest can be paid periodically (monthly, quarterly, annually) or at maturity. Compound interest options allow interest to be reinvested, maximizing returns over the deposit term."
        ],
        example: "If you deposit $10,000 in a 3-year FD with a 3% annual interest rate and annual compounding, at maturity you'll receive approximately $10,927.27. This represents your principal plus $927.27 in interest earnings."
      },
      {
        title: "Types of Fixed Deposits",
        duration: "20 minutes",
        description: "Explore various fixed deposit products and their features.",
        content: [
          "Standard fixed deposits maintain the same interest rate throughout the term. Flexible or variable rate deposits may adjust rates based on market conditions. Special FDs might offer higher rates for senior citizens or special durations.",
          "Tax-saving fixed deposits offer tax benefits in some countries but typically have longer lock-in periods. Recurring deposits allow regular monthly contributions rather than a one-time lump sum."
        ]
      },
      {
        title: "Fixed Deposits in Financial Planning",
        duration: "25 minutes",
        description: "Learn how to incorporate fixed deposits into your overall financial strategy.",
        content: [
          "Fixed deposits are ideal for capital preservation and serve specific financial goals like emergency funds (3-6 months of expenses), short-term objectives (1-3 years), or as the stable component in a diversified investment portfolio.",
          "Laddering is a strategy where you distribute money across multiple FDs with different maturity dates. This provides periodic liquidity while maintaining higher overall returns than keeping everything in short-term deposits."
        ]
      }
    ],
    resources: [
      {
        title: "Fixed Income Investing Guide",
        type: "book",
        description: "Comprehensive overview of fixed deposits and other secure investments",
        source: "PWL Capital",
        link: "https://pwlcapital.com/wp-content/uploads/2024/08/2019-11-29_PWL_WP_R-Kerzerho_Guide-Fixed-Income-Investing.pdf"
      },
      {
        title: "FD Interest Rate Comparison Tool",
        type: "tool",
        description: "Interactive calculator to compare fixed deposit options across institutions",
        source: "Groww",
        link: "https://groww.in/calculators/fd-calculator"
      },
      {
        title: "Tax Strategies for Fixed Deposits",
        type: "article",
        description: "Optimizing tax efficiency with your fixed deposit investments",
        source: "Tax Planning Weekly",
        duration: "Ujjivan Small Finance Bank",
        link: "https://www.ujjivansfb.in/banking-blogs/deposits/how-to-minimise-and-save-tax-on-fixed-deposit-interest#:~:text=Another%20way%20to%20minimise%20taxes,in%20period%20of%205%20years."
      },
      {
        title: "FD Laddering Demonstration",
        type: "video",
        description: "Step-by-step guide to creating an effective deposit ladder",
        source: "Money Control",
        duration: "4 min",
        link: "https://www.youtube.com/watch?v=jZTd34Sd5IA"
      }
    ],
    glossary: [
      {
        term: "Maturity Date",
        definition: "The date on which a fixed deposit concludes and the principal plus interest becomes available for withdrawal."
      },
      {
        term: "Premature Withdrawal",
        definition: "Redeeming a fixed deposit before its maturity date, usually resulting in a penalty or reduced interest rate."
      },
      {
        term: "Deposit Certificate",
        definition: "A document issued by the financial institution acknowledging the fixed deposit and its terms."
      },
      {
        term: "Laddering",
        definition: "A strategy of spreading investments across multiple fixed deposits with staggered maturity dates."
      },
      {
        term: "Automatic Renewal",
        definition: "A feature that automatically reinvests the principal and sometimes interest into a new fixed deposit upon maturity."
      }
    ],
    quiz: {
      questions: [
        {
          text: "What typically happens if you withdraw from a fixed deposit before maturity?",
          options: [
            "You receive the full interest as promised",
            "You pay a penalty or receive reduced interest",
            "You only get your principal back",
            "The bank charges additional fees"
          ],
          correctAnswer: 1
        },
        {
          text: "What is the 'laddering' strategy for fixed deposits?",
          options: [
            "Investing only in high-interest fixed deposits",
            "Opening deposits with multiple banks simultaneously",
            "Creating deposits with staggered maturity dates",
            "Automatically renewing deposits upon maturity"
          ],
          correctAnswer: 2
        },
        {
          text: "How do fixed deposit returns typically compare to stock market investments?",
          options: [
            "They offer higher returns with lower risk",
            "They offer lower returns with higher stability",
            "They offer similar returns with similar risk",
            "Returns vary widely but risks are identical"
          ],
          correctAnswer: 1
        }
      ]
    },
    relatedTopics: [
      {
        title: "Bonds",
        description: "Compare fixed deposits with corporate and government bonds",
        id: "bonds"
      },
      {
        title: "Risk Management",
        description: "Learn about risk-return tradeoffs in different investments",
        id: "fundamental-analysis"
      },
      {
        title: "Tax Planning",
        description: "Understand tax implications of interest income",
        id: "markets-taxation"
      }
    ]
  },
  {
    id: "currency-commodity",
    title: "Commodity and Currency Exchanges: Trading Beyond Stocks",
    subtitle: "Learn how commodities and currencies are traded and their impact on global markets",
    image: "/constants/commodity_currency.png", 
    difficulty: "Intermediate",
    overview: [
      "Commodity and currency exchanges facilitate trading in physical goods like gold, oil, and agricultural products, as well as foreign currencies. These markets help businesses hedge risks, ensure liquidity, and allow investors to profit from price fluctuations.",
      "Unlike stocks, commodities and currencies are influenced by factors such as geopolitical events, interest rates, inflation, and global demand-supply dynamics. Understanding these influences is crucial for traders looking to participate in these markets effectively."
    ],
    keyPoints: [
      "Commodity exchanges allow trading in physical goods like gold, oil, and wheat",
      "Currency exchanges facilitate forex trading, affecting international trade and economies",
      "Commodity prices are influenced by supply and demand, weather conditions, and economic cycles",
      "Forex trading is affected by interest rates, economic indicators, and geopolitical stability",
      "Both commodity and currency markets offer opportunities for hedging and speculation"
    ],
    learningPath: [
      {
        title: "Introduction to Commodity Trading",
        duration: "20 min",
        type: "video"
      },
      {
        title: "Understanding Forex Markets",
        duration: "30 min",
        type: "reading"
      },
      {
        title: "Risk Management in Commodity and Currency Trading",
        duration: "25 min",
        type: "video"
      },
      {
        title: "Trading Strategies for Forex and Commodities",
        duration: "35 min",
        type: "reading"
      }
    ],
    lessons: [
      {
        title: "Commodity Markets and Their Role",
        duration: "20 minutes",
        description: "Explore how commodity exchanges operate and their importance in the global economy.",
        content: [
          "Commodity markets allow producers, businesses, and investors to trade physical goods such as metals, energy resources, and agricultural products.",
          "The most well-known commodity exchanges include the Chicago Mercantile Exchange (CME), New York Mercantile Exchange (NYMEX), and London Metal Exchange (LME)."
        ],
        example: "A farmer can hedge against falling wheat prices by selling futures contracts on a commodity exchange, ensuring stable revenue."
      },
      {
        title: "Understanding Currency Exchange and Forex Trading",
        duration: "30 minutes",
        description: "Learn how the foreign exchange (forex) market operates and factors influencing currency prices.",
        content: [
          "Forex trading involves exchanging one currency for another, with values determined by supply and demand.",
          "Major forex trading centers include London, New York, Tokyo, and Sydney, where traders speculate on currency price movements."
        ]
      },
      {
        title: "Strategies for Trading Commodities and Currencies",
        duration: "25 minutes",
        description: "Discover effective trading techniques used by professionals in commodity and forex markets.",
        content: [
          "Traders use technical and fundamental analysis to predict price movements in commodities and forex markets.",
          "Common strategies include trend-following, mean-reversion, and arbitrage to capitalize on market inefficiencies."
        ]
      }
    ],
    resources: [
      {
        title: "Currency Trading for Dummies",
        type: "book",
        description: "A beginner’s guide to forex trading and currency markets",
        source: "Brian Dolan",
        link: "https://viptrade.ge/frontend-assets/books/Currency_Trading_For_Dummies_2nd_Edition_by_Brian_Dolan.pdf"
      },
      {
        title: "Commodity Futures Explained",
        type: "article",
        description: "Introduction to futures contracts and how they work in commodity trading",
        source: "Investopedia",
        duration: "15 min read",
        link: "https://www.investopedia.com/terms/c/commodityfuturescontract.asp"
      },
      {
        title: "Forex Market Fundamentals",
        type: "article",
        description: "Understanding key drivers of foreign exchange prices",
        source: "Investopedia",
        duration: "30 min",
        link: "https://www.investopedia.com/articles/trading/04/031704.asp"
      },
      {
        title: "Global Trade and Commodity Prices",
        type: "article",
        description: "The impact of international trade policies on commodity pricing",
        source: "Trading Economies",
        duration: "12 min read",
        link: "https://tradingeconomics.com/commodities"
      }
    ],
    glossary: [
      {
        term: "Forex Market",
        definition: "The global marketplace for trading national currencies against one another."
      },
      {
        term: "Futures Contract",
        definition: "A legal agreement to buy or sell a commodity at a predetermined price at a specified time in the future."
      },
      {
        term: "Hedging",
        definition: "A risk management strategy used to offset potential losses in investments."
      },
      {
        term: "Pip (Percentage in Point)",
        definition: "The smallest price move that a given exchange rate can make based on market convention."
      },
      {
        term: "Spot Market",
        definition: "A market where financial instruments, such as commodities and currencies, are traded for immediate delivery."
      }
    ],
    quiz: {
      questions: [
        {
          text: "What is the primary function of commodity exchanges?",
          options: [
            "Trading company stocks",
            "Facilitating trade of physical goods and derivatives",
            "Providing loans to businesses",
            "Regulating international currency exchange rates"
          ],
          correctAnswer: 1
        },
        {
          text: "Which factor has the most significant influence on currency exchange rates?",
          options: [
            "Company earnings reports",
            "Government bond yields",
            "Central bank interest rate policies",
            "Commodity supply levels"
          ],
          correctAnswer: 2
        },
        {
          text: "What is a futures contract in commodity trading?",
          options: [
            "A loan given to a commodity producer",
            "A contract to buy/sell a commodity at a predetermined price in the future",
            "A type of stock issued by mining companies",
            "An insurance policy for agricultural products"
          ],
          correctAnswer: 1
        }
      ]
    },
    relatedTopics: [
      {
        title: "Technical Analysis",
        description: "Learn how to analyze price movements and trading patterns",
        id: "technical-analysis"
      },
      {
        title: "Fundamental Analysis",
        description: "Evaluate commodities and currencies using economic indicators",
        id: "fundamental-analysis"
      },
    ]
  },

  {
    id: "fundamental-analysis",
    title: "Fundamental Analysis: Evaluating Company Value",
    subtitle: "Learn how to assess a company's financial health and investment potential",
    image: "/constants/fundamental_analysis.png",
    difficulty: "Intermediate",
    overview: [
      "Fundamental analysis is a method used by investors to evaluate a security's intrinsic value by examining related economic, financial, and other qualitative and quantitative factors.",
      "This approach considers everything from macroeconomic factors such as the overall economy and industry conditions to microeconomic factors like the company's financial statements, management, and competitive advantages."
    ],
    keyPoints: [
      "Fundamental analysis assesses a company's intrinsic value",
      "It includes examining financial statements like balance sheets, income statements, and cash flow statements",
      "Investors use fundamental analysis to determine if a stock is undervalued or overvalued",
      "Macroeconomic factors such as GDP growth and interest rates impact company performance",
      "Qualitative aspects like management effectiveness and brand reputation also play a role"
    ],
    learningPath: [
      {
        title: "Introduction to Fundamental Analysis",
        duration: "20 min",
        type: "video"
      },
      {
        title: "Analyzing Financial Statements",
        duration: "30 min",
        type: "reading"
      },
      {
        title: "Key Financial Ratios and Metrics",
        duration: "25 min",
        type: "video"
      },
      {
        title: "Applying Fundamental Analysis to Stocks",
        duration: "20 min",
        type: "reading"
      }
    ],
    lessons: [
      {
        title: "Understanding Financial Statements",
        duration: "25 minutes",
        description: "Learn how to interpret financial statements and what they reveal about a company's health.",
        content: [
          "Financial statements provide insight into a company's revenue, expenses, profitability, and overall financial position.",
          "The three primary financial statements include the balance sheet, income statement, and cash flow statement.",
          "Investors analyze these statements to assess a company's ability to generate profits and sustain growth."
        ]
      },
      {
        title: "Key Financial Ratios for Analysis",
        duration: "20 minutes",
        description: "Discover the most important financial ratios used in fundamental analysis.",
        content: [
          "Commonly used financial ratios include the P/E ratio (Price-to-Earnings), P/B ratio (Price-to-Book), and ROE (Return on Equity).",
          "These ratios help investors compare a company’s valuation and profitability with industry peers.",
          "Debt-to-equity and current ratio assess a company's financial stability and ability to meet obligations."
        ]
      },
      {
        title: "Macroeconomic and Industry Analysis",
        duration: "20 minutes",
        description: "Learn how broader economic factors impact company performance and valuation.",
        content: [
          "Macroeconomic factors such as inflation, interest rates, and GDP growth influence business performance.",
          "Industry trends and competitive positioning play a critical role in a company's growth prospects.",
          "Investors analyze these external factors to determine long-term investment potential."
        ]
      }
    ],
    resources: [
      {
        title: "The Intelligent Investor",
        type: "book",
        description: "Benjamin Graham's classic text on value investing and fundamental analysis",
        source: "Benjamin Graham",
        link: "https://yourknowledgedigest.org/wp-content/uploads/2020/04/the-intelligent-investor.pdf"
      },
      {
        title: "How to Read Financial Statements",
        type: "article",
        description: "A guide to understanding corporate financial reports",
        source: "Investopedia",
        duration: "12 min read",
        link: "https://www.investopedia.com/terms/f/financial-statements.asp"
      },
      {
        title: "Financial Ratio Analysis Explained",
        type: "video",
        description: "A breakdown of the most important ratios for evaluating stocks",
        source: "Accounting Stuff",
        duration: "24 min",
        link: "https://www.youtube.com/watch?v=3W_LwpeG8c8"
      },
      {
        title: "Economic Indicators and Stock Performance",
        type: "article",
        description: "How economic trends impact the stock market and individual investments",
        source: "Investopedia",
        duration: "15 min read",
        link: "https://www.investopedia.com/ask/answers/032415/what-are-most-common-market-indicators-follow-us-stock-market-and-economy.asp"
      }
    ],
    glossary: [
      {
        term: "Intrinsic Value",
        definition: "The perceived or calculated true value of a stock, determined through fundamental analysis."
      },
      {
        term: "Earnings Per Share (EPS)",
        definition: "A company's net profit divided by the number of outstanding shares, indicating profitability."
      },
      {
        term: "Return on Equity (ROE)",
        definition: "A measure of financial performance calculated by dividing net income by shareholders' equity."
      },
      {
        term: "Price-to-Earnings Ratio (P/E Ratio)",
        definition: "A valuation metric that compares a company’s share price to its earnings per share."
      },
      {
        term: "Cash Flow Statement",
        definition: "A financial statement showing a company's inflows and outflows of cash, crucial for liquidity analysis."
      }
    ],
    quiz: {
      questions: [
        {
          text: "What is the primary goal of fundamental analysis?",
          options: [
            "Predict short-term price movements",
            "Determine a stock’s intrinsic value",
            "Analyze daily trading volumes",
            "Evaluate only technical indicators"
          ],
          correctAnswer: 1
        },
        {
          text: "Which of the following is NOT considered in fundamental analysis?",
          options: [
            "Financial statements",
            "Company management",
            "Stock chart patterns",
            "Macroeconomic trends"
          ],
          correctAnswer: 2
        },
        {
          text: "Why is the P/E ratio important in fundamental analysis?",
          options: [
            "It helps assess a company’s profitability relative to its stock price",
            "It predicts short-term price fluctuations",
            "It is only relevant for government bonds",
            "It tracks daily stock trading volume"
          ],
          correctAnswer: 0
        }
      ]
    },
    relatedTopics: [
      {
        title: "Technical Analysis",
        description: "Learn how to analyze price movements and trading patterns",
        id: "technical-analysis"
      },
      {
        title: "Market and taxation",
        description: "Learn about market regulations and taxation impacts",
        id: "markets-taxation"
      }
    ]
  },


  {
    id: "technical-analysis",
    title: "Technical Analysis: Predicting Market Movements",
    subtitle: "Learn how to analyze price movements and trading patterns",
    image: "/constants/technical_analysis.png",
    difficulty: "Intermediate",
    overview: [
      "Technical analysis is a method of evaluating financial markets by analyzing historical price movements and trading volume. It focuses on price trends, patterns, and indicators to forecast future price movements rather than analyzing a company's fundamentals.",
      "Traders and investors use technical analysis to make informed decisions about entry and exit points in financial markets. Common tools include moving averages, support and resistance levels, candlestick patterns, and technical indicators such as the Relative Strength Index (RSI) and Moving Average Convergence Divergence (MACD)."
    ],
    keyPoints: [
      "Technical analysis focuses on price action and market trends",
      "Chart patterns and indicators help predict future price movements",
      "Common tools include moving averages, RSI, MACD, and Bollinger Bands",
      "Support and resistance levels indicate potential buying or selling zones",
      "Technical analysis is widely used in stock, forex, and cryptocurrency trading"
    ],
    learningPath: [
      {
        title: "Introduction to Technical Analysis",
        duration: "15 min",
        type: "video"
      },
      {
        title: "Understanding Price Charts and Patterns",
        duration: "25 min",
        type: "reading"
      },
      {
        title: "Common Technical Indicators Explained",
        duration: "30 min",
        type: "video"
      },
      {
        title: "Building a Trading Strategy",
        duration: "20 min",
        type: "reading"
      }
    ],
    lessons: [
      {
        title: "Basics of Technical Analysis",
        duration: "15 minutes",
        description: "Understand the core principles of technical analysis and why traders use it.",
        content: [
          "Technical analysis is based on the idea that price movements follow trends and patterns that can be studied to make predictions.",
          "It differs from fundamental analysis, which focuses on company financials, economic data, and intrinsic value."
        ],
        example: "If a stock consistently finds support at $100 and resistance at $120, traders may use this range to make buy or sell decisions."
      },
      {
        title: "Understanding Candlestick Patterns",
        duration: "25 minutes",
        description: "Learn how candlestick charts provide insights into market psychology.",
        content: [
          "Candlestick patterns help traders identify potential reversals and continuation trends.",
          "Popular patterns include Doji, Engulfing, Hammer, and Shooting Star."
        ]
      },
      {
        title: "Using Moving Averages for Trend Analysis",
        duration: "20 minutes",
        description: "Explore how moving averages smooth price action to identify trends.",
        content: [
          "Moving averages help filter out short-term price noise and reveal the overall trend direction.",
          "The 50-day and 200-day moving averages are commonly used by traders to spot bullish or bearish trends."
        ]
      }
    ],
    resources: [
      {
        title: "Technical Analysis of the Financial Markets",
        type: "book",
        description: "A comprehensive guide to technical analysis techniques and tools.",
        source: "John Murphy",
        link: "https://sharemarketclasses.in/wp-content/uploads/2024/08/Technical_Analysis_of_the_Financial.pdf"
      },
      {
        title: "Mastering Technical Indicators",
        type: "video",
        description: "A step-by-step guide to using indicators like RSI and MACD.",
        source: "Peachy Investor",
        duration: "20 min",
        link: "https://www.youtube.com/watch?v=MygajfeNe9E"
      },
      {
        title: "Candlestick Charting Explained",
        type: "article",
        description: "Learn the basics of candlestick patterns and their meanings.",
        source: "Investopedia",
        duration: "12 min read",
        link: "https://www.investopedia.com/trading/candlestick-charting-what-is-it/"
      }
    ],
    glossary: [
      {
        term: "Support Level",
        definition: "A price level where buying interest is strong enough to prevent further declines."
      },
      {
        term: "Resistance Level",
        definition: "A price level where selling pressure is strong enough to prevent further price increases."
      },
      {
        term: "RSI (Relative Strength Index)",
        definition: "A momentum oscillator that measures the speed and change of price movements."
      },
      {
        term: "MACD (Moving Average Convergence Divergence)",
        definition: "A trend-following indicator that shows the relationship between two moving averages."
      },
      {
        term: "Bollinger Bands",
        definition: "A volatility indicator that consists of a moving average and two standard deviation lines."
      }
    ],
    quiz: {
      questions: [
        {
          text: "What is the primary focus of technical analysis?",
          options: [
            "Company financials",
            "Market trends and price patterns",
            "Economic indicators",
            "Dividend history"
          ],
          correctAnswer: 1
        },
        {
          text: "Which of the following is NOT a common technical indicator?",
          options: [
            "RSI",
            "MACD",
            "P/E Ratio",
            "Bollinger Bands"
          ],
          correctAnswer: 2
        },
        {
          text: "What does a support level indicate?",
          options: [
            "A price level where buying interest is strong",
            "A price level where selling interest is strong",
            "A signal to always buy",
            "A guarantee of price increase"
          ],
          correctAnswer: 0
        }
      ]
    },
    relatedTopics: [
      {
        title: "Fundamental Analysis",
        description: "Evaluate companies using financial statements and economic indicators",
        id: "fundamental-analysis"
      },
      {
        title: "Cryptocurrency",
        description: "Apply technical indicators to the volatile crypto market",
        id: "cryptocurrencies"
      }
    ]
  },

  {
    id: "markets-taxation",
    title: "Markets and Taxation: Understanding Financial Systems and Tax Implications",
    subtitle: "Explore different financial markets and learn about taxation on investments",
    image: "/constants/markets_taxation.png",
    difficulty: "Intermediate",
    overview: [
      "Financial markets facilitate the buying and selling of securities, commodities, and currencies. These markets help allocate resources efficiently and provide investors with opportunities to grow wealth.",
      "Taxation plays a crucial role in investment returns. Understanding capital gains tax, dividend tax, and other levies can help investors optimize their portfolios while ensuring compliance with legal regulations."
    ],
    keyPoints: [
      "Financial markets include stock markets, bond markets, forex markets, and commodity markets.",
      "Investors are subject to different types of taxes, including capital gains tax, dividend tax, and transaction taxes.",
      "Tax-efficient investing strategies can help minimize tax liabilities and maximize returns.",
      "Understanding global market structures helps in making informed investment decisions.",
      "Regulatory frameworks govern taxation policies across different jurisdictions."
    ],
    learningPath: [
      {
        title: "Introduction to Financial Markets",
        duration: "20 min",
        type: "video"
      },
      {
        title: "Types of Investment Taxes and How They Work",
        duration: "30 min",
        type: "reading"
      },
      {
        title: "Tax-Advantaged Investment Strategies",
        duration: "25 min",
        type: "video"
      },
      {
        title: "Global Markets and Their Role in Investing",
        duration: "35 min",
        type: "reading"
      }
    ],
    lessons: [
      {
        title: "Types of Financial Markets",
        duration: "20 minutes",
        description: "Understand the different financial markets and their roles in the economy.",
        content: [
          "Financial markets can be categorized into capital markets (stocks and bonds), money markets (short-term debt instruments), forex markets (currency trading), and commodities markets (trading of physical goods).",
          "Each market serves different functions, from raising capital for companies to hedging risks and speculating on price movements."
        ]
      },
      {
        title: "Understanding Capital Gains Tax",
        duration: "30 minutes",
        description: "Learn how capital gains tax applies to different investment types and how to manage it effectively.",
        content: [
          "Capital gains tax applies to profits made from selling investments like stocks, bonds, or real estate.",
          "Short-term capital gains are taxed at a higher rate than long-term gains in most jurisdictions.",
          "Using tax-advantaged accounts and offsetting gains with losses (tax-loss harvesting) can help reduce tax liability."
        ]
      },
      {
        title: "Tax-Efficient Investment Strategies",
        duration: "25 minutes",
        description: "Discover strategies to minimize taxes on your investments.",
        content: [
          "Investing in tax-deferred accounts such as IRAs and 401(k)s can help postpone taxation.",
          "Holding investments for the long term can reduce tax burdens by qualifying for lower capital gains tax rates.",
          "Municipal bonds and certain retirement accounts offer tax-free or tax-reduced returns."
        ]
      }
    ],
    resources: [
      {
        title: "The Tax-Free Wealth Guide",
        type: "book",
        description: "A guide to legally reducing your tax liabilities while investing.",
        source: "Tom Wheelwright",
        link: "https://archive.org/details/bwb_W8-BPG-945/page/n5/mode/2up"
      },
      {
        title: "Understanding Global Markets",
        type: "article",
        description: "An overview of international markets and how they impact investment opportunities.",
        source: "University of Kansas",
        duration: "20 min read",
        link: "https://onlinemba.ku.edu/experience-ku/mba-blog/global-business-and-economics-understanding-and-operating-in-the-international-market"
      },
      {
        title: "Tax-Efficient Investment Strategies",
        type: "video",
        description: "Learn how to optimize your portfolio while minimizing tax liability.",
        source: "Sherman",
        duration: "30 min",
        link: "https://www.youtube.com/watch?v=kTyPCJO2EyU"
      }
    ],
    glossary: [
      {
        term: "Capital Gains Tax",
        definition: "A tax imposed on the profit realized from the sale of an asset such as stocks or real estate."
      },
      {
        term: "Dividend Tax",
        definition: "A tax levied on dividend income received from stock investments."
      },
      {
        term: "Tax-Loss Harvesting",
        definition: "A strategy where investors sell underperforming assets to offset capital gains taxes."
      },
      {
        term: "Municipal Bonds",
        definition: "Bonds issued by local governments that often provide tax-free interest income."
      }
    ],
    quiz: {
      questions: [
        {
          text: "Which of the following is NOT a type of financial market?",
          options: [
            "Stock Market",
            "Forex Market",
            "Cryptocurrency Market",
            "Real Estate Market"
          ],
          correctAnswer: 3
        },
        {
          text: "What is the primary purpose of capital gains tax?",
          options: [
            "To tax dividend income",
            "To tax the profit made from selling assets",
            "To tax interest income from bonds",
            "To tax mutual fund distributions"
          ],
          correctAnswer: 1
        },
        {
          text: "Which investment strategy can help reduce taxes?",
          options: [
            "Frequent trading of stocks",
            "Holding investments for the long term",
            "Investing solely in short-term securities",
            "Avoiding government bonds"
          ],
          correctAnswer: 1
        }
      ]
    },
    relatedTopics: [
      {
        title: "Stock Markets",
        description: "Explore how stock markets work and how investors can participate.",
        id: "stocks"
      },
      {
        title: "Bonds and Fixed Income Investing",
        description: "Understand bonds and their role in a diversified portfolio.",
        id: "bonds"
      },
    ]
  },


  {
    id: "mutual-funds",
    title: "Mutual Funds: Diversified Investment for All",
    subtitle: "Learn how mutual funds pool resources to provide diversified investment opportunities",
    image: "/constants/mutual_funds.png",
    difficulty: "Beginner",
    overview: [
      "Mutual funds are professionally managed investment funds that pool money from multiple investors to purchase a diversified portfolio of stocks, bonds, or other assets. This provides investors access to diversified investment opportunities without requiring individual stock selection.",
      "Mutual funds are categorized into different types, such as equity funds, debt funds, and hybrid funds, catering to various risk appetites and financial goals. Investors benefit from professional fund management, liquidity, and diversification, making mutual funds a popular investment choice."
    ],
    keyPoints: [
      "Mutual funds pool money from multiple investors to invest in a diversified portfolio",
      "Professional fund managers make investment decisions on behalf of investors",
      "Types of mutual funds include equity, debt, hybrid, and index funds",
      "Mutual funds offer liquidity, diversification, and affordability",
      "Investors can choose between actively managed and passively managed funds"
    ],
    learningPath: [
      {
        title: "Introduction to Mutual Funds",
        duration: "15 min",
        type: "video"
      },
      {
        title: "Types of Mutual Funds and Their Risk Levels",
        duration: "25 min",
        type: "reading"
      },
      {
        title: "How to Select a Mutual Fund",
        duration: "30 min",
        type: "video"
      },
      {
        title: "Mutual Fund Taxation and Returns",
        duration: "20 min",
        type: "reading"
      }
    ],
    lessons: [
      {
        title: "Understanding Mutual Funds",
        duration: "15 minutes",
        description: "Learn what mutual funds are, how they work, and their benefits.",
        content: [
          "Mutual funds are investment vehicles that pool money from many investors to invest in various financial instruments such as stocks, bonds, and money market securities.",
          "They provide diversification, professional management, and easy accessibility to a broad range of investors."
        ],
        example: "An investor purchasing shares of an S&P 500 Index Fund gains exposure to all 500 companies in the index without buying individual stocks."
      },
      {
        title: "Types of Mutual Funds",
        duration: "25 minutes",
        description: "Discover the different categories of mutual funds and how they align with investment goals.",
        content: [
          "Equity funds invest primarily in stocks and are suitable for long-term growth.",
          "Debt funds invest in fixed-income securities like bonds and treasury bills, providing stability.",
          "Hybrid funds combine equity and debt instruments to balance risk and return.",
          "Index funds track a market index and offer lower expense ratios due to passive management."
        ]
      },
      {
        title: "How to Choose a Mutual Fund",
        duration: "20 minutes",
        description: "Learn about key factors like fund performance, risk, fees, and objectives.",
        content: [
          "Consider the fund's historical performance, though past returns do not guarantee future gains.",
          "Evaluate the fund manager’s track record and experience.",
          "Compare expense ratios, as higher fees can impact overall returns.",
          "Assess risk levels based on your investment horizon and financial goals."
        ]
      }
    ],
    resources: [
      {
        title: "Mutual Funds for Beginners",
        type: "book",
        description: "An introductory guide to mutual fund investing",
        source: "SEC",
        link: "https://www.sec.gov/investor/pubs/sec-guide-to-mutual-funds.pdf"
      },
      {
        title: "How to Analyze a Mutual Fund",
        type: "article",
        description: "Understanding key mutual fund metrics and performance indicators",
        source: "Groww",
        duration: "15 min read",
        link: "https://groww.in/blog/parameters-analyze-mutual-fund"
      },
      {
        title: "Active vs Passive Investing",
        type: "article",
        description: "Comparison of actively managed and index mutual funds",
        source: "Investopedia",
        duration: "12 min read",
        link: "https://www.investopedia.com/news/active-vs-passive-investing/"
      },
      {
        title: "Mutual Fund Taxation Guide",
        type: "article",
        description: "Learn how mutual funds are taxed based on holding period and fund type",
        source: "cleartax",
        duration: "12 min read",
        link: "https://cleartax.in/s/different-mutual-funds-taxed"
      }
    ],
    glossary: [
      {
        term: "Expense Ratio",
        definition: "The annual fee expressed as a percentage of a mutual fund’s average assets under management."
      },
      {
        term: "Net Asset Value (NAV)",
        definition: "The per-share value of a mutual fund, calculated as total assets minus liabilities divided by the number of shares."
      },
      {
        term: "Systematic Investment Plan (SIP)",
        definition: "A method of investing a fixed amount regularly into a mutual fund, helping with rupee cost averaging."
      },
      {
        term: "Redemption",
        definition: "Selling mutual fund units back to the fund house to withdraw invested money."
      },
      {
        term: "Exit Load",
        definition: "A fee charged when redeeming mutual fund units within a specified period."
      }
    ],
    quiz: {
      questions: [
        {
          text: "What is the primary benefit of investing in mutual funds?",
          options: [
            "Guaranteed high returns",
            "Professional management and diversification",
            "No risk involved",
            "Fixed annual returns"
          ],
          correctAnswer: 1
        },
        {
          text: "Which of the following is NOT a type of mutual fund?",
          options: [
            "Equity Fund",
            "Debt Fund",
            "Real Estate Fund",
            "Hybrid Fund"
          ],
          correctAnswer: 2
        },
        {
          text: "What does NAV represent in mutual funds?",
          options: [
            "Net Asset Value per unit of the fund",
            "The fund’s total earnings in a year",
            "The total expense ratio",
            "The number of shares held in the portfolio"
          ],
          correctAnswer: 0
        }
      ]
    },
    relatedTopics: [
      {
        title: "Personal Finance - Insurance ",
        description: "Learn how insurance protects your personal finances",
        id: "insurance"
      }
    ]
  },

  {
    id: "insurance",
    title: "Insurance: Protecting Your Financial Future",
    subtitle: "Learn the importance of insurance and how it safeguards against financial risks",
    image: "/constants/insurance.png",
    difficulty: "Beginner",
    overview: [
      "Insurance is a financial product that provides protection against financial losses due to unexpected events such as accidents, illness, property damage, or death. By paying a premium, individuals and businesses transfer the risk to an insurance provider, ensuring financial security.",
      "Understanding different types of insurance—health, life, auto, home, and disability—can help you make informed decisions and choose the right coverage based on your needs."
    ],
    keyPoints: [
      "Insurance provides financial protection against unforeseen events",
      "There are various types of insurance, including health, life, auto, and property insurance",
      "Premiums are payments made to maintain insurance coverage",
      "Policies have terms, conditions, and exclusions that define coverage limits",
      "Risk assessment and underwriting determine insurance eligibility and pricing"
    ],
    learningPath: [
      {
        title: "Introduction to Insurance",
        duration: "15 min",
        type: "video"
      },
      {
        title: "Types of Insurance and Their Benefits",
        duration: "25 min",
        type: "reading"
      },
      {
        title: "How Insurance Premiums Work",
        duration: "30 min",
        type: "video"
      },
      {
        title: "Choosing the Right Insurance Policy",
        duration: "20 min",
        type: "reading"
      }
    ],
    lessons: [
      {
        title: "Understanding Insurance Basics",
        duration: "15 minutes",
        description: "Learn the core concepts of insurance, including risk transfer and coverage types.",
        content: [
          "Insurance is a risk management tool that helps individuals and businesses mitigate financial losses due to unforeseen circumstances.",
          "An insurance policy is a contract between the policyholder and the insurer, outlining the coverage, premiums, and claim process."
        ],
        example: "If you have car insurance and get into an accident, your insurer covers the repair costs, depending on the policy terms."
      },
      {
        title: "Types of Insurance Policies",
        duration: "25 minutes",
        description: "Explore the different types of insurance and their specific uses.",
        content: [
          "Life Insurance: Provides financial support to beneficiaries in case of the policyholder’s death.",
          "Health Insurance: Covers medical expenses, including doctor visits, hospital stays, and treatments.",
          "Auto Insurance: Protects against vehicle-related damages and liabilities.",
          "Homeowners Insurance: Covers property damage and liability risks.",
          "Disability Insurance: Replaces income if you’re unable to work due to illness or injury."
        ]
      },
      {
        title: "How Insurance Premiums and Claims Work",
        duration: "20 minutes",
        description: "Understand how premiums are calculated and how to file a claim.",
        content: [
          "Premiums are determined based on risk factors such as age, health, and coverage amount.",
          "A deductible is the amount a policyholder pays out-of-pocket before insurance kicks in.",
          "The claim process involves submitting a request for compensation after a covered event occurs."
        ]
      }
    ],
    resources: [
      {
        title: "The Importance of Insurance",
        type: "article",
        description: "A detailed guide on why insurance is crucial for financial stability.",
        source: "ICICI Prudential",
        duration: "12 min read",
        link: "https://www.iciciprulife.com/insurance/insurance-importance.html"
      },
      {
        title: "How to Choose the Right Insurance Policy",
        type: "video",
        description: "A step-by-step guide on selecting the best coverage for your needs.",
        source: "Texas Department of Insurance",
        duration: "6 mins",
        link: "https://www.youtube.com/watch?v=EAUj7EwQfGY"
      },
      {
        title: "Understanding Insurance Deductibles",
        type: "article",
        description: "How deductibles work and their impact on premiums.",
        source: "iii.org",
        duration: "10 min read",
        link: "https://www.iii.org/article/understanding-your-insurance-deductibles"
      }
    ],
    glossary: [
      {
        term: "Premium",
        definition: "The amount paid to an insurance company for coverage."
      },
      {
        term: "Deductible",
        definition: "The amount a policyholder must pay before insurance covers the remaining costs."
      },
      {
        term: "Claim",
        definition: "A formal request to an insurance company for compensation due to a covered event."
      },
      {
        term: "Underwriting",
        definition: "The process by which an insurer evaluates risk and determines policy eligibility and pricing."
      },
      {
        term: "Coverage Limit",
        definition: "The maximum amount an insurance policy will pay for a covered loss."
      }
    ],
    quiz: {
      questions: [
        {
          text: "What is the purpose of insurance?",
          options: [
            "To eliminate all financial risks",
            "To provide protection against unforeseen financial losses",
            "To increase wealth through investments",
            "To act as a savings account"
          ],
          correctAnswer: 1
        },
        {
          text: "Which of the following is NOT a type of insurance?",
          options: [
            "Health Insurance",
            "Auto Insurance",
            "Real Estate Insurance",
            "Life Insurance"
          ],
          correctAnswer: 2
        },
        {
          text: "What does a deductible refer to in an insurance policy?",
          options: [
            "The amount an insurer pays before a claim is processed",
            "The portion of the claim paid by the policyholder before insurance coverage applies",
            "The total coverage amount of the policy",
            "The refund a policyholder gets at the end of the term"
          ],
          correctAnswer: 1
        }
      ]
    },
    relatedTopics: [
      {
        title: "Personal Finance - Mutual Funds",
        description: "Discover how to invest and growmoney in Mutual Funds",
        id: "mutual-funds"
      }
    ]
  }

];


