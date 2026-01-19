/**
 * City-specific configuration for gold rate pages
 * Contains unique SEO content, FAQs, and local information for each city
 */

export interface CityLocalInfo {
  title: string;
  description: string;
}

export interface CityFAQ {
  question: string;
  answerTemplate: string; // Uses {perGram24k}, {perGram22k} placeholders
}

export interface CityGoldConfig {
  name: string;
  slug: string;
  metaDescription: string;
  intro: string;
  introParagraph1: string;
  introParagraph2: string;
  localInfo: CityLocalInfo[];
  faqTemplates: CityFAQ[];
  similarCities: string[];
  relatedCities: { name: string; slug: string }[];
}

// Helper to generate FAQ with actual prices
export function generateFAQs(
  config: CityGoldConfig,
  perGram24k: number,
  perGram22k: number
): { question: string; answer: string }[] {
  return config.faqTemplates.map((faq) => ({
    question: faq.question,
    answer: faq.answerTemplate
      .replace(/{perGram24k}/g, perGram24k.toLocaleString('en-IN'))
      .replace(/{perGram22k}/g, perGram22k.toLocaleString('en-IN')),
  }));
}

export const CITY_GOLD_CONFIGS: Record<string, CityGoldConfig> = {
  chennai: {
    name: 'Chennai',
    slug: 'chennai',
    metaDescription: 'Gold rate today Chennai ({date}): 22K & 24K per gram live prices. T Nagar jewellery rates, making charges ₹150-450/g. IBJA verified.',
    intro: 'Gold rate today in Chennai per gram: 22K & 24K live prices with T Nagar and Anna Nagar trends, charts, and FAQs.',
    introParagraph1: `The gold rate in Chennai is updated daily based on international market rates, USD/INR currency fluctuations, and local bullion market demand. Chennai's gold prices may vary slightly from national averages due to transport costs, regional demand during festivals like Pongal and weddings, and jeweller pricing policies. These rates reflect the spot metal price and do not include making charges (typically ₹150-450/gram in T Nagar) or 3% GST, which vary by retailer.`,
    introParagraph2: `Chennai is one of India's largest gold markets, with major jewellery hubs in T Nagar (Usman Road), Pondy Bazaar, and Anna Nagar. The city follows Tamil Nadu Bullion Merchants Association rates, which are among the most competitive in South India. For accurate buying decisions, compare rates across multiple jewellers and factor in making charges for your chosen design.`,
    localInfo: [
      { title: 'Hallmarking centers', description: 'Tamil Nadu Hallmarking Center (T Nagar) and Regional Assay Office (Egmore).' },
      { title: 'Making charges', description: '₹150 – ₹450 per gram for 22K ornaments in T Nagar.' },
      { title: 'Top jewellery hubs', description: 'Usman Road, Pondy Bazaar, and Anna Nagar flagship stores.' },
    ],
    faqTemplates: [
      {
        question: 'What is the gold rate today in Chennai?',
        answerTemplate: `Gold rate today in Chennai is ₹{perGram22k} per gram for 22K and ₹{perGram24k} per gram for 24K gold. Prices are updated daily from Chennai bullion market and IBJA.`,
      },
      {
        question: 'Why does Chennai gold rate change daily?',
        answerTemplate: `Chennai gold prices fluctuate based on London spot prices, USD/INR exchange rate, MCX futures, import duties, and local demand during wedding and festival seasons like Pongal.`,
      },
      {
        question: 'How is 22K different from 24K gold?',
        answerTemplate: `24K gold is 99.9% pure (ideal for investment), while 22K gold is 91.6% pure with 8.4% alloy metals for durability. 22K is preferred for jewellery in Chennai as it's stronger for daily wear.`,
      },
      {
        question: 'Does making charge affect final jewellery price?',
        answerTemplate: `Yes, making charges in Chennai range from ₹150-450 per gram depending on design complexity. Final price = Gold Rate × Weight + Making Charges + 3% GST. Always ask for a detailed bill breakdown.`,
      },
      {
        question: 'Are Chennai gold rates different from other cities?',
        answerTemplate: `Yes, Chennai gold rates are typically ₹40-100 higher than Mumbai due to stronger demand in Tamil Nadu, transportation costs, and local jeweller association pricing. South India traditionally has higher gold consumption.`,
      },
      {
        question: 'Which is the best jewellery market in Chennai?',
        answerTemplate: `T Nagar (Usman Road) is Chennai's largest jewellery hub with stores like GRT, Lalitha, and Saravana. Other popular areas include Pondy Bazaar, Anna Nagar, and Mylapore for traditional designs.`,
      },
    ],
    similarCities: ['Trichy', 'Coimbatore', 'Madurai', 'Hyderabad'],
    relatedCities: [
      { name: 'Mumbai', slug: 'mumbai' },
      { name: 'Bangalore', slug: 'bangalore' },
      { name: 'Coimbatore', slug: 'coimbatore' },
    ],
  },

  mumbai: {
    name: 'Mumbai',
    slug: 'mumbai',
    metaDescription: 'Gold rate today Mumbai ({date}): 22K & 24K per gram live prices. Zaveri Bazaar rates, making charges ₹200-500/g. IBJA verified.',
    intro: 'Gold rate today in Mumbai per gram: 22K & 24K live prices with Zaveri Bazaar and Dadar trends, charts, and FAQs.',
    introParagraph1: `The gold rate in Mumbai is updated daily based on international market rates, USD/INR currency movements, and Zaveri Bazaar bullion market prices. Mumbai, being India's financial capital and home to MCX (Multi Commodity Exchange), often sets the benchmark for gold prices across India. These rates reflect spot metal prices without making charges (typically ₹200-500/gram in Zaveri Bazaar) or 3% GST.`,
    introParagraph2: `Zaveri Bazaar in South Mumbai is Asia's oldest and largest bullion market, dating back over 150 years. Other popular jewellery destinations include Dadar, Borivali, and Malad. Mumbai's gold rates are typically ₹20-50 lower than South Indian cities due to proximity to international trade routes and wholesale trading volumes.`,
    localInfo: [
      { title: 'Hallmarking centers', description: 'BIS Regional Office (Andheri) and Zaveri Bazaar Assay Office.' },
      { title: 'Making charges', description: '₹200 – ₹500 per gram for 22K ornaments in Zaveri Bazaar.' },
      { title: 'Top jewellery hubs', description: 'Zaveri Bazaar, Dadar, and Andheri West flagship stores.' },
    ],
    faqTemplates: [
      {
        question: 'What is the gold rate today in Mumbai?',
        answerTemplate: `Gold rate today in Mumbai is ₹{perGram22k} per gram for 22K and ₹{perGram24k} per gram for 24K gold. Prices are updated daily from Zaveri Bazaar bullion market and IBJA.`,
      },
      {
        question: 'Why does Mumbai gold rate change daily?',
        answerTemplate: `Mumbai gold prices fluctuate based on London spot prices, MCX futures, USD/INR exchange rate, and trading volumes in Zaveri Bazaar. Being India's financial capital, Mumbai rates respond quickly to global market movements.`,
      },
      {
        question: 'How is 22K different from 24K gold?',
        answerTemplate: `24K gold is 99.9% pure (ideal for investment), while 22K gold is 91.6% pure with alloy metals for durability. Most Mumbai jewellers recommend 22K for ornaments and 24K for coins/bars.`,
      },
      {
        question: 'Does making charge affect final jewellery price?',
        answerTemplate: `Yes, making charges in Mumbai range from ₹200-500 per gram in Zaveri Bazaar. Final price = Gold Rate × Weight + Making Charges + 3% GST. Wholesale markets offer lower making charges.`,
      },
      {
        question: 'Are Mumbai gold rates lower than other cities?',
        answerTemplate: `Yes, Mumbai gold rates are typically ₹20-50 lower than Chennai or Bangalore due to proximity to ports, MCX trading, and higher wholesale volumes in Zaveri Bazaar.`,
      },
      {
        question: 'Which is the best place to buy gold in Mumbai?',
        answerTemplate: `Zaveri Bazaar (oldest bullion market), Dadar, Borivali, and Malad are popular. For branded jewellery, visit Tanishq, Kalyan, or PNG stores across the city.`,
      },
    ],
    similarCities: ['Pune', 'Ahmedabad', 'Surat', 'Chennai'],
    relatedCities: [
      { name: 'Delhi', slug: 'delhi' },
      { name: 'Pune', slug: 'pune' },
      { name: 'Ahmedabad', slug: 'ahmedabad' },
    ],
  },

  bangalore: {
    name: 'Bangalore',
    slug: 'bangalore',
    metaDescription: 'Gold rate today Bangalore ({date}): 22K & 24K per gram live prices. Commercial Street rates, making charges ₹180-450/g. IBJA verified.',
    intro: 'Gold rate today in Bangalore per gram: 22K & 24K live prices with Jayanagar and Commercial Street trends, charts, and FAQs.',
    introParagraph1: `The gold rate in Bangalore is updated daily based on international market rates, USD/INR exchange movements, and Karnataka Bullion Merchants Association pricing. Bangalore's gold prices are influenced by strong demand from IT professionals and the city's growing affluent population. These rates reflect spot metal prices and exclude making charges (typically ₹180-450/gram) and 3% GST.`,
    introParagraph2: `Commercial Street and Jayanagar are Bangalore's premier gold jewellery destinations, offering both traditional South Indian designs and contemporary styles. The city follows Karnataka state gold rates, which are competitive with Chennai and Hyderabad. For investment-grade gold, look for BIS hallmarked products from established jewellers.`,
    localInfo: [
      { title: 'Hallmarking centers', description: 'BIS Hallmarking Center (Indiranagar) and Regional Assay Office (Bangalore).' },
      { title: 'Making charges', description: '₹180 – ₹450 per gram for 22K ornaments in Commercial Street.' },
      { title: 'Top jewellery hubs', description: 'Commercial Street, Brigade Road, and Jayanagar shopping complex.' },
    ],
    faqTemplates: [
      {
        question: 'What is the gold rate today in Bangalore?',
        answerTemplate: `Gold rate today in Bangalore is ₹{perGram22k} per gram for 22K and ₹{perGram24k} per gram for 24K gold. Prices are updated daily from Karnataka bullion market and IBJA.`,
      },
      {
        question: 'Why does Bangalore gold rate change daily?',
        answerTemplate: `Bangalore gold prices fluctuate based on London spot prices, USD/INR exchange rate, and local demand especially from IT professionals and wedding seasons. Karnataka follows South India pricing trends.`,
      },
      {
        question: 'How is 22K different from 24K gold?',
        answerTemplate: `24K gold is 99.9% pure (ideal for coins/bars), while 22K gold is 91.6% pure with alloy for strength. Bangalore jewellers prefer 22K for traditional Karnataka-style jewellery.`,
      },
      {
        question: 'Does making charge affect final jewellery price?',
        answerTemplate: `Yes, making charges in Bangalore range from ₹180-450 per gram. Final price = Gold Rate × Weight + Making Charges + 3% GST. Compare rates across Commercial Street stores.`,
      },
      {
        question: 'Are Bangalore gold rates higher than other cities?',
        answerTemplate: `Bangalore rates are similar to Chennai, typically ₹20-50 higher than Mumbai due to strong South Indian gold buying tradition and demand from affluent IT population.`,
      },
      {
        question: 'Which is the best place to buy gold in Bangalore?',
        answerTemplate: `Commercial Street, Brigade Road, and Jayanagar are popular. For branded jewellery, visit C. Krishniah Chetty, Bhima, or Tanishq showrooms across the city.`,
      },
    ],
    similarCities: ['Chennai', 'Hyderabad', 'Mysore', 'Mangalore'],
    relatedCities: [
      { name: 'Chennai', slug: 'chennai' },
      { name: 'Hyderabad', slug: 'hyderabad' },
      { name: 'Coimbatore', slug: 'coimbatore' },
    ],
  },

  delhi: {
    name: 'Delhi',
    slug: 'delhi',
    metaDescription: 'Delhi gold rate today ({date}): 24K & 22K per gram. Chandni Chowk prices, making charges ₹220-600/g. Updated from IBJA.',
    intro: 'Gold rate in Delhi today per gram: 22K & 24K live prices with Karol Bagh and Chandni Chowk trends, charts, and FAQs.',
    introParagraph1: `The gold rate in Delhi NCR is updated daily based on international spot prices, USD/INR currency movements, and Chandni Chowk bullion market rates. Delhi, being India's capital and a major import hub, has some of the most competitive gold prices in North India. These rates reflect spot metal prices and exclude making charges (typically ₹220-600/gram) and 3% GST.`,
    introParagraph2: `Chandni Chowk is India's largest traditional gold market, with over 3,000 jewellery shops. Other popular destinations include Karol Bagh, Connaught Place, and South Extension. Delhi gold rates often see spikes during wedding season (November-February) and festivals like Dhanteras. The city offers both North Indian Kundan and Polki styles as well as modern designs.`,
    localInfo: [
      { title: 'Hallmarking centers', description: 'BIS Delhi Office (Chandni Chowk) and National Assay Centre.' },
      { title: 'Making charges', description: '₹220 – ₹600 per gram for 22K ornaments in Chandni Chowk.' },
      { title: 'Top jewellery hubs', description: 'Chandni Chowk, Karol Bagh, and Connaught Place stores.' },
    ],
    faqTemplates: [
      {
        question: 'What is the gold rate in Delhi today?',
        answerTemplate: `Today's gold rate in Delhi is ₹{perGram24k} per gram for 24K gold and ₹{perGram22k} per gram for 22K gold. Prices are updated daily from Chandni Chowk bullion market.`,
      },
      {
        question: 'Why does Delhi gold rate change daily?',
        answerTemplate: `Delhi gold prices fluctuate based on London spot prices, USD/INR exchange rate, and high wedding season demand. Being an import hub, Delhi responds quickly to international price changes.`,
      },
      {
        question: 'How is 22K different from 24K gold?',
        answerTemplate: `24K gold is 99.9% pure (ideal for investment), while 22K gold is 91.6% pure with alloy for durability. Delhi jewellers use 22K for traditional Kundan and Polki work.`,
      },
      {
        question: 'Does making charge affect final jewellery price?',
        answerTemplate: `Yes, making charges in Delhi range from ₹220-600 per gram depending on design. Kundan work costs more. Final price = Gold Rate × Weight + Making Charges + 3% GST.`,
      },
      {
        question: 'Are Delhi gold rates competitive?',
        answerTemplate: `Yes, Delhi has competitive rates due to proximity to import hubs and wholesale trading in Chandni Chowk. Prices are typically similar to Mumbai and ₹30-50 lower than South Indian cities.`,
      },
      {
        question: 'Which is the best place to buy gold in Delhi?',
        answerTemplate: `Chandni Chowk (India's largest gold market), Karol Bagh, Connaught Place, and South Extension. For branded stores, visit PC Jeweller, Tanishq, or Kalyan across Delhi NCR.`,
      },
    ],
    similarCities: ['Noida', 'Gurgaon', 'Faridabad', 'Mumbai'],
    relatedCities: [
      { name: 'Mumbai', slug: 'mumbai' },
      { name: 'Kolkata', slug: 'kolkata' },
      { name: 'Ahmedabad', slug: 'ahmedabad' },
    ],
  },

  hyderabad: {
    name: 'Hyderabad',
    slug: 'hyderabad',
    metaDescription: 'Gold rate today Hyderabad ({date}): 22K & 24K per gram live prices. Abids jewellery rates, making charges ₹180-500/g. IBJA verified.',
    intro: 'Gold rate today in Hyderabad per gram: 22K & 24K live prices with Abids and Banjara Hills trends, charts, and FAQs.',
    introParagraph1: `The gold rate in Hyderabad is updated daily based on international market rates, USD/INR exchange movements, and Telangana Bullion Association pricing. Hyderabad is known for competitive gold rates due to lower state taxes and strong local competition. These prices exclude making charges (₹180-500/gram) and 3% GST.`,
    introParagraph2: `Hyderabad's gold markets in Abids, Sultan Bazaar, and Begum Bazaar offer traditional Telugu and Hyderabadi designs at competitive prices. The city is famous for uncut diamond (Polki) and traditional temple jewellery. Gold demand peaks during Ugadi, Bonalu, and wedding season (November-February).`,
    localInfo: [
      { title: 'Hallmarking centers', description: 'Telangana State Hallmarking Center and Regional Assay Office (Hyderabad).' },
      { title: 'Making charges', description: '₹180 – ₹500 per gram for 22K ornaments in Old City.' },
      { title: 'Top jewellery hubs', description: 'Abids, Sultan Bazaar, and Begum Bazaar flagship stores.' },
    ],
    faqTemplates: [
      {
        question: 'What is the gold rate today in Hyderabad?',
        answerTemplate: `Gold rate today in Hyderabad is ₹{perGram22k} per gram for 22K and ₹{perGram24k} per gram for 24K gold. Prices are updated daily from Telangana bullion market and IBJA.`,
      },
      {
        question: 'Why does Hyderabad gold rate change daily?',
        answerTemplate: `Hyderabad gold prices fluctuate based on London spot prices, USD/INR exchange rate, and local demand during festivals like Ugadi and Bonalu. Lower state taxes keep prices competitive.`,
      },
      {
        question: 'How is 22K different from 24K gold?',
        answerTemplate: `24K gold is 99.9% pure (for investment), while 22K gold is 91.6% pure with alloy for durability. Hyderabad jewellers prefer 22K for traditional Telugu and temple jewellery designs.`,
      },
      {
        question: 'Does making charge affect final jewellery price?',
        answerTemplate: `Yes, making charges in Hyderabad range from ₹180-500 per gram. Traditional Polki work costs more. Final price = Gold Rate × Weight + Making Charges + 3% GST.`,
      },
      {
        question: 'Are Hyderabad gold rates lower than other cities?',
        answerTemplate: `Yes, Hyderabad offers competitive rates due to lower state taxes and strong competition in Abids. Prices are typically ₹20-40 lower than Chennai or Bangalore.`,
      },
      {
        question: 'Which is the best place to buy gold in Hyderabad?',
        answerTemplate: `Abids (largest market), Sultan Bazaar, and Begum Bazaar for traditional designs. For branded jewellery, visit Manepally, GRT, or Tanishq showrooms.`,
      },
    ],
    similarCities: ['Vijayawada', 'Bangalore', 'Chennai', 'Visakhapatnam'],
    relatedCities: [
      { name: 'Vijayawada', slug: 'vijayawada' },
      { name: 'Bangalore', slug: 'bangalore' },
      { name: 'Chennai', slug: 'chennai' },
    ],
  },

  kolkata: {
    name: 'Kolkata',
    slug: 'kolkata',
    metaDescription: 'Kolkata gold rate today ({date}): 24K & 22K per gram. Bowbazar prices, making charges ₹200-550/g. Updated from IBJA.',
    intro: 'Gold rate in Kolkata today per gram: 22K & 24K live prices with Bowbazar and Burrabazar trends, charts, and FAQs.',
    introParagraph1: `The gold rate in Kolkata is updated daily based on international market prices, USD/INR currency movements, and West Bengal Bullion Association rates. Kolkata, being East India's largest gold market, has unique pricing influenced by traditional Bengali jewellery demand. These rates exclude making charges (₹200-550/gram) and 3% GST.`,
    introParagraph2: `Bowbazar is Kolkata's historic gold hub with century-old jewellers specializing in traditional Bengali designs like Shakha-Pola and temple jewellery. Gold demand peaks during Durga Puja, Dhanteras, and Bengali wedding season. The city is known for intricate filigree work and lightweight contemporary designs.`,
    localInfo: [
      { title: 'Hallmarking centers', description: 'BIS Eastern Regional Office and Bowbazar Assay Centre.' },
      { title: 'Making charges', description: '₹200 – ₹550 per gram for 22K ornaments in Bowbazar.' },
      { title: 'Top jewellery hubs', description: 'Bowbazar, Bagree Market, and New Market stores.' },
    ],
    faqTemplates: [
      {
        question: 'What is the gold rate in Kolkata today?',
        answerTemplate: `Today's gold rate in Kolkata is ₹{perGram24k} per gram for 24K gold and ₹{perGram22k} per gram for 22K gold. Prices are updated daily from West Bengal bullion market.`,
      },
      {
        question: 'Why does Kolkata gold rate change daily?',
        answerTemplate: `Kolkata gold prices fluctuate based on London spot prices, USD/INR exchange rate, and local demand during Durga Puja and wedding season. Bengali jewellery traditions influence premium designs.`,
      },
      {
        question: 'How is 22K different from 24K gold?',
        answerTemplate: `24K gold is 99.9% pure (for investment), while 22K gold is 91.6% pure with alloy. Kolkata jewellers use 22K for traditional Bengali designs like Shakha-Pola and filigree work.`,
      },
      {
        question: 'Does making charge affect final jewellery price?',
        answerTemplate: `Yes, making charges in Kolkata range from ₹200-550 per gram. Traditional Bengali designs cost more. Final price = Gold Rate × Weight + Making Charges + 3% GST.`,
      },
      {
        question: 'Are Kolkata gold rates competitive?',
        answerTemplate: `Kolkata rates are competitive with Mumbai and Delhi. Prices are typically ₹20-40 lower than South Indian cities. Bowbazar offers the best wholesale rates.`,
      },
      {
        question: 'Which is the best place to buy gold in Kolkata?',
        answerTemplate: `Bowbazar (oldest market), Bagree Market, New Market, and Gariahat. For branded jewellery, visit Senco, PC Chandra, or Tanishq showrooms across the city.`,
      },
    ],
    similarCities: ['Siliguri', 'Asansol', 'Durgapur', 'Patna'],
    relatedCities: [
      { name: 'Delhi', slug: 'delhi' },
      { name: 'Mumbai', slug: 'mumbai' },
      { name: 'Chennai', slug: 'chennai' },
    ],
  },

  ahmedabad: {
    name: 'Ahmedabad',
    slug: 'ahmedabad',
    metaDescription: 'Ahmedabad gold rate today ({date}): 24K & 22K per gram. Manek Chowk prices, making charges ₹170-420/g. Updated from IBJA.',
    intro: 'Gold rate in Ahmedabad today per gram: live 22K & 24K prices with Manek Chowk and C.G. Road trends, charts, and FAQs.',
    introParagraph1: `The gold rate in Ahmedabad is updated daily based on international market rates, USD/INR currency movements, and Gujarat Bullion Association pricing. Ahmedabad benefits from proximity to Surat's diamond and gold wholesale market, making it one of the most competitive gold markets in India. These prices exclude making charges (₹170-420/gram) and 3% GST.`,
    introParagraph2: `Manek Chowk is Ahmedabad's iconic jewellery market, known for traditional Gujarati designs and competitive wholesale prices. The city's strong business community creates steady demand for gold as investment and jewellery. Gold buying peaks during Dhanteras, Diwali, and wedding season (November-February).`,
    localInfo: [
      { title: 'Hallmarking centers', description: 'BIS Gujarat Office and Manek Chowk Assay Centre.' },
      { title: 'Making charges', description: '₹170 – ₹420 per gram for 22K ornaments in Manek Chowk.' },
      { title: 'Top jewellery hubs', description: 'Manek Chowk, Relief Road, and CG Road stores.' },
    ],
    faqTemplates: [
      {
        question: 'What is the gold rate in Ahmedabad today?',
        answerTemplate: `Today's gold rate in Ahmedabad is ₹{perGram24k} per gram for 24K gold and ₹{perGram22k} per gram for 22K gold. Prices are updated daily from Gujarat bullion market.`,
      },
      {
        question: 'Why does Ahmedabad gold rate change daily?',
        answerTemplate: `Ahmedabad gold prices fluctuate based on London spot prices, USD/INR exchange rate, and influence from Surat's wholesale market. Local demand during Dhanteras and wedding season also impacts prices.`,
      },
      {
        question: 'How is 22K different from 24K gold?',
        answerTemplate: `24K gold is 99.9% pure (for investment), while 22K gold is 91.6% pure with alloy. Ahmedabad jewellers prefer 22K for traditional Gujarati designs and daily-wear jewellery.`,
      },
      {
        question: 'Does making charge affect final jewellery price?',
        answerTemplate: `Yes, making charges in Ahmedabad range from ₹170-420 per gram. Final price = Gold Rate × Weight + Making Charges + 3% GST. Manek Chowk offers competitive rates.`,
      },
      {
        question: 'Are Ahmedabad gold rates lower than other cities?',
        answerTemplate: `Yes, Ahmedabad has competitive rates due to proximity to Surat's wholesale market. Prices are typically ₹20-40 lower than Mumbai and significantly lower than South Indian cities.`,
      },
      {
        question: 'Which is the best place to buy gold in Ahmedabad?',
        answerTemplate: `Manek Chowk (iconic market), Relief Road, and CG Road. For branded jewellery, visit Tribhovandas Bhimji Zaveri, Tanishq, or Kalyan showrooms across the city.`,
      },
    ],
    similarCities: ['Surat', 'Rajkot', 'Vadodara', 'Gandhinagar'],
    relatedCities: [
      { name: 'Mumbai', slug: 'mumbai' },
      { name: 'Delhi', slug: 'delhi' },
      { name: 'Pune', slug: 'pune' },
    ],
  },

  pune: {
    name: 'Pune',
    slug: 'pune',
    metaDescription: 'Pune gold rate today ({date}): 24K & 22K per gram. Laxmi Road prices, making charges ₹190-480/g. Updated from IBJA.',
    intro: 'Gold rate in Pune today per gram: 22K & 24K live prices with Laxmi Road and Hadapsar trends, charts, and FAQs.',
    introParagraph1: `The gold rate in Pune is updated daily based on international market rates, USD/INR currency movements, and Maharashtra Bullion Association pricing. Pune, being close to Mumbai, enjoys competitive gold rates with lower overhead costs. These prices exclude making charges (₹190-480/gram) and 3% GST.`,
    introParagraph2: `Laxmi Road is Pune's premier jewellery destination, with established stores offering traditional Maharashtrian designs and contemporary styles. The city's IT and manufacturing workforce creates steady demand. Gold prices typically follow Mumbai trends but are ₹10-20 lower due to reduced logistics costs.`,
    localInfo: [
      { title: 'Hallmarking centers', description: 'BIS Hallmarking Center (Pune) and Maharashtra Assay Office.' },
      { title: 'Making charges', description: '₹190 – ₹480 per gram for 22K ornaments in Laxmi Road.' },
      { title: 'Top jewellery hubs', description: 'Laxmi Road, FC Road, and Deccan Gymkhana stores.' },
    ],
    faqTemplates: [
      {
        question: 'What is the gold rate in Pune today?',
        answerTemplate: `Today's gold rate in Pune is ₹{perGram24k} per gram for 24K gold and ₹{perGram22k} per gram for 22K gold. Prices are updated daily following Maharashtra bullion market.`,
      },
      {
        question: 'Why does Pune gold rate change daily?',
        answerTemplate: `Pune gold prices fluctuate based on London spot prices, USD/INR exchange rate, and follow Mumbai market trends. Local demand during Gudi Padwa and wedding season also impacts prices.`,
      },
      {
        question: 'How is 22K different from 24K gold?',
        answerTemplate: `24K gold is 99.9% pure (for investment), while 22K gold is 91.6% pure with alloy. Pune jewellers prefer 22K for traditional Maharashtrian designs like Thushi and Vajratik.`,
      },
      {
        question: 'Does making charge affect final jewellery price?',
        answerTemplate: `Yes, making charges in Pune range from ₹190-480 per gram. Final price = Gold Rate × Weight + Making Charges + 3% GST. Laxmi Road offers competitive rates.`,
      },
      {
        question: 'Are Pune gold rates lower than Mumbai?',
        answerTemplate: `Yes, Pune rates are typically ₹10-20 lower than Mumbai due to lower overhead costs and reduced logistics expenses from being an inland city.`,
      },
      {
        question: 'Which is the best place to buy gold in Pune?',
        answerTemplate: `Laxmi Road (main market), FC Road, and Deccan area. For branded jewellery, visit PNG, Tanishq, or Waman Hari Pethe showrooms across Pune.`,
      },
    ],
    similarCities: ['Mumbai', 'Nashik', 'Aurangabad', 'Kolhapur'],
    relatedCities: [
      { name: 'Mumbai', slug: 'mumbai' },
      { name: 'Ahmedabad', slug: 'ahmedabad' },
      { name: 'Bangalore', slug: 'bangalore' },
    ],
  },

  coimbatore: {
    name: 'Coimbatore',
    slug: 'coimbatore',
    metaDescription: 'Coimbatore gold rate today ({date}): 24K & 22K per gram. RS Puram prices, making charges ₹140-400/g. Updated from IBJA.',
    intro: 'Gold rate in Coimbatore today per gram: 22K & 24K live prices with RS Puram and Cross Cut Road trends, charts, and FAQs.',
    introParagraph1: `The gold rate in Coimbatore is updated daily based on international market rates, USD/INR currency movements, and Tamil Nadu Bullion Association pricing. Coimbatore, known as the "Manchester of South India," offers competitive gold rates compared to Chennai. These prices exclude making charges (₹140-400/gram) and 3% GST.`,
    introParagraph2: `RS Puram and Oppanakara Street are Coimbatore's main jewellery markets, offering traditional South Indian designs at competitive prices. The city's textile industry creates a wealthy consumer base with strong gold demand. Prices typically follow Chennai trends but are ₹20-40 lower due to lower overhead costs.`,
    localInfo: [
      { title: 'Hallmarking centers', description: 'Tamil Nadu Hallmarking Center (Coimbatore Branch) and Regional Office.' },
      { title: 'Making charges', description: '₹140 – ₹400 per gram for 22K ornaments in RS Puram.' },
      { title: 'Top jewellery hubs', description: 'RS Puram, Oppanakara Street, and Gandhipuram markets.' },
    ],
    faqTemplates: [
      {
        question: 'What is the gold rate in Coimbatore today?',
        answerTemplate: `Today's gold rate in Coimbatore is ₹{perGram24k} per gram for 24K gold and ₹{perGram22k} per gram for 22K gold. Prices are updated daily from Tamil Nadu bullion market.`,
      },
      {
        question: 'Why does Coimbatore gold rate change daily?',
        answerTemplate: `Coimbatore gold prices fluctuate based on London spot prices, USD/INR exchange rate, and follow Chennai market trends. Local demand during Pongal and wedding season also impacts prices.`,
      },
      {
        question: 'How is 22K different from 24K gold?',
        answerTemplate: `24K gold is 99.9% pure (for investment), while 22K gold is 91.6% pure with alloy. Coimbatore jewellers prefer 22K for traditional Tamil designs and temple jewellery.`,
      },
      {
        question: 'Does making charge affect final jewellery price?',
        answerTemplate: `Yes, making charges in Coimbatore range from ₹140-400 per gram - lower than Chennai. Final price = Gold Rate × Weight + Making Charges + 3% GST.`,
      },
      {
        question: 'Are Coimbatore gold rates lower than Chennai?',
        answerTemplate: `Yes, Coimbatore rates are typically ₹20-40 lower than Chennai due to lower overhead costs, making it attractive for bulk purchases.`,
      },
      {
        question: 'Which is the best place to buy gold in Coimbatore?',
        answerTemplate: `RS Puram (main market), Oppanakara Street, and Gandhipuram. For branded jewellery, visit GRT, Kalyan, or Tanishq showrooms across the city.`,
      },
    ],
    similarCities: ['Chennai', 'Madurai', 'Salem', 'Erode'],
    relatedCities: [
      { name: 'Chennai', slug: 'chennai' },
      { name: 'Bangalore', slug: 'bangalore' },
      { name: 'Hyderabad', slug: 'hyderabad' },
    ],
  },

  vijayawada: {
    name: 'Vijayawada',
    slug: 'vijayawada',
    metaDescription: 'Vijayawada gold rate today ({date}): 24K & 22K per gram. Governorpet prices, making charges ₹160-400/g. Updated from IBJA.',
    intro: 'Gold rate in Vijayawada today per gram: 22K & 24K live prices with Governorpet and Autonagar trends, charts, and FAQs.',
    introParagraph1: `The gold rate in Vijayawada is updated daily based on international market rates, USD/INR currency movements, and Andhra Pradesh Bullion Association pricing. As Andhra Pradesh's commercial capital, Vijayawada offers competitive gold rates similar to Hyderabad. These prices exclude making charges (₹160-400/gram) and 3% GST.`,
    introParagraph2: `Governorpet is Vijayawada's main jewellery hub, with established stores offering traditional Andhra designs and temple jewellery. The city's strategic location makes it a regional gold trading center. Gold demand peaks during Telugu festivals like Ugadi, Sankranti, and wedding season.`,
    localInfo: [
      { title: 'Hallmarking centers', description: 'Andhra Pradesh Hallmarking Center and Regional Assay Office.' },
      { title: 'Making charges', description: '₹160 – ₹400 per gram for 22K ornaments in Governorpet.' },
      { title: 'Top jewellery hubs', description: 'Governorpet, Besant Road, and Eluru Road stores.' },
    ],
    faqTemplates: [
      {
        question: 'What is the gold rate in Vijayawada today?',
        answerTemplate: `Today's gold rate in Vijayawada is ₹{perGram24k} per gram for 24K gold and ₹{perGram22k} per gram for 22K gold. Prices are updated daily from Andhra Pradesh bullion market.`,
      },
      {
        question: 'Why does Vijayawada gold rate change daily?',
        answerTemplate: `Vijayawada gold prices fluctuate based on London spot prices, USD/INR exchange rate, and regional demand during Telugu festivals like Ugadi and Sankranti.`,
      },
      {
        question: 'How is 22K different from 24K gold?',
        answerTemplate: `24K gold is 99.9% pure (for investment), while 22K gold is 91.6% pure with alloy. Vijayawada jewellers prefer 22K for traditional Andhra temple jewellery designs.`,
      },
      {
        question: 'Does making charge affect final jewellery price?',
        answerTemplate: `Yes, making charges in Vijayawada range from ₹160-400 per gram - lower than metro cities. Final price = Gold Rate × Weight + Making Charges + 3% GST.`,
      },
      {
        question: 'Are Vijayawada gold rates similar to Hyderabad?',
        answerTemplate: `Yes, Vijayawada rates are typically within ₹10-20 of Hyderabad prices, making it a convenient option for Andhra Pradesh residents.`,
      },
      {
        question: 'Which is the best place to buy gold in Vijayawada?',
        answerTemplate: `Governorpet (main market), Besant Road, and Eluru Road. For branded jewellery, visit Tanishq, Kalyan, or local stores like Manepally and Kirtilals.`,
      },
    ],
    similarCities: ['Hyderabad', 'Guntur', 'Visakhapatnam', 'Tirupati'],
    relatedCities: [
      { name: 'Hyderabad', slug: 'hyderabad' },
      { name: 'Chennai', slug: 'chennai' },
      { name: 'Bangalore', slug: 'bangalore' },
    ],
  },

  ayodhya: {
    name: 'Ayodhya',
    slug: 'ayodhya',
    metaDescription: 'Ayodhya gold rate today ({date}): 24K & 22K per gram. Local market prices, making charges ₹180-450/g. Updated from IBJA.',
    intro: 'Gold rate in Ayodhya today per gram: 22K & 24K live prices with local market trends, charts, and FAQs.',
    introParagraph1: `The gold rate in Ayodhya is updated daily based on international market rates, USD/INR currency movements, and Uttar Pradesh Bullion Association pricing. Ayodhya, being a major pilgrimage destination, sees significant gold demand during religious festivals and temple visits. These prices exclude making charges (₹180-450/gram) and 3% GST.`,
    introParagraph2: `Ayodhya's gold market centers around the main town area with traditional jewellers offering religious motif jewellery and temple designs. The city's spiritual significance drives demand for gold items used in religious ceremonies. Gold buying peaks during Ram Navami, Diwali, and wedding season.`,
    localInfo: [
      { title: 'Hallmarking centers', description: 'BIS Hallmarking Center (Lucknow) serves Ayodhya region.' },
      { title: 'Making charges', description: '₹180 – ₹450 per gram for 22K ornaments in local markets.' },
      { title: 'Top jewellery hubs', description: 'Naya Ghat, Hanumangarhi Road, and main market area stores.' },
    ],
    faqTemplates: [
      {
        question: 'What is the gold rate in Ayodhya today?',
        answerTemplate: `Today's gold rate in Ayodhya is ₹{perGram24k} per gram for 24K gold and ₹{perGram22k} per gram for 22K gold. Prices are updated daily from UP bullion market.`,
      },
      {
        question: 'Why does Ayodhya gold rate change daily?',
        answerTemplate: `Ayodhya gold prices fluctuate based on London spot prices, USD/INR exchange rate, and pilgrimage season demand. Religious festivals significantly impact local gold demand.`,
      },
      {
        question: 'How is 22K different from 24K gold?',
        answerTemplate: `24K gold is 99.9% pure (for investment), while 22K gold is 91.6% pure with alloy for durability. 22K is preferred for religious and traditional jewellery in Ayodhya.`,
      },
      {
        question: 'Does making charge affect final jewellery price?',
        answerTemplate: `Yes, making charges in Ayodhya range from ₹180-450 per gram. Final price = Gold Rate × Weight + Making Charges + 3% GST.`,
      },
      {
        question: 'Are Ayodhya gold rates similar to Lucknow?',
        answerTemplate: `Yes, Ayodhya gold rates closely follow Lucknow prices with minor variations of ₹20-50 due to local factors.`,
      },
      {
        question: 'Which is the best place to buy gold in Ayodhya?',
        answerTemplate: `Main market area near Hanumangarhi and Naya Ghat. For branded jewellery, visit Tanishq or Kalyan showrooms in nearby Faizabad.`,
      },
    ],
    similarCities: ['Lucknow', 'Varanasi', 'Allahabad', 'Kanpur'],
    relatedCities: [
      { name: 'Lucknow', slug: 'lucknow' },
      { name: 'Delhi', slug: 'delhi' },
      { name: 'Patna', slug: 'patna' },
    ],
  },

  bhubaneswar: {
    name: 'Bhubaneswar',
    slug: 'bhubaneswar',
    metaDescription: 'Bhubaneswar gold rate today ({date}): 24K & 22K per gram. Unit-1 prices, making charges ₹160-420/g. Updated from IBJA.',
    intro: 'Gold rate in Bhubaneswar today per gram: 22K & 24K live prices with Unit-1 and Saheed Nagar trends, charts, and FAQs.',
    introParagraph1: `The gold rate in Bhubaneswar is updated daily based on international market rates, USD/INR currency movements, and Odisha Bullion Association pricing. Bhubaneswar, the capital of Odisha, offers competitive gold rates with strong demand for traditional Odia jewellery designs. These prices exclude making charges (₹160-420/gram) and 3% GST.`,
    introParagraph2: `Unit-1 Market and Saheed Nagar are Bhubaneswar's main jewellery destinations, offering traditional Odia designs like Tarakasi (silver filigree with gold plating) and temple jewellery. Gold demand peaks during Durga Puja, Raja festival, and wedding season.`,
    localInfo: [
      { title: 'Hallmarking centers', description: 'Odisha State Hallmarking Center and BIS Regional Office (Bhubaneswar).' },
      { title: 'Making charges', description: '₹160 – ₹420 per gram for 22K ornaments in Unit-1 Market.' },
      { title: 'Top jewellery hubs', description: 'Unit-1 Market, Saheed Nagar, and Janpath stores.' },
    ],
    faqTemplates: [
      {
        question: 'What is the gold rate in Bhubaneswar today?',
        answerTemplate: `Today's gold rate in Bhubaneswar is ₹{perGram24k} per gram for 24K gold and ₹{perGram22k} per gram for 22K gold. Prices are updated daily from Odisha bullion market.`,
      },
      {
        question: 'Why does Bhubaneswar gold rate change daily?',
        answerTemplate: `Bhubaneswar gold prices fluctuate based on London spot prices, USD/INR exchange rate, and local demand during festivals like Durga Puja and Raja.`,
      },
      {
        question: 'How is 22K different from 24K gold?',
        answerTemplate: `24K gold is 99.9% pure (for investment), while 22K gold is 91.6% pure with alloy. Bhubaneswar jewellers prefer 22K for traditional Odia temple jewellery.`,
      },
      {
        question: 'Does making charge affect final jewellery price?',
        answerTemplate: `Yes, making charges in Bhubaneswar range from ₹160-420 per gram. Final price = Gold Rate × Weight + Making Charges + 3% GST.`,
      },
      {
        question: 'Are Bhubaneswar gold rates competitive?',
        answerTemplate: `Yes, Bhubaneswar rates are typically ₹30-50 lower than Kolkata due to lower overhead costs and direct supply chains.`,
      },
      {
        question: 'Which is the best place to buy gold in Bhubaneswar?',
        answerTemplate: `Unit-1 Market (main hub), Saheed Nagar, and Janpath. For branded jewellery, visit Tanishq, Kalyan, or local stores like Lalchands and Tribhovandas.`,
      },
    ],
    similarCities: ['Cuttack', 'Kolkata', 'Rourkela', 'Puri'],
    relatedCities: [
      { name: 'Kolkata', slug: 'kolkata' },
      { name: 'Hyderabad', slug: 'hyderabad' },
      { name: 'Chennai', slug: 'chennai' },
    ],
  },

  chandigarh: {
    name: 'Chandigarh',
    slug: 'chandigarh',
    metaDescription: 'Chandigarh gold rate today ({date}): 24K & 22K per gram. Sector 17 prices, making charges ₹200-500/g. Updated from IBJA.',
    intro: 'Gold rate in Chandigarh today per gram: 22K & 24K live prices with Sector 17 and Sector 22 trends, charts, and FAQs.',
    introParagraph1: `The gold rate in Chandigarh is updated daily based on international market rates, USD/INR currency movements, and Punjab Bullion Association pricing. Chandigarh, shared capital of Punjab and Haryana, enjoys competitive gold rates due to proximity to Delhi markets. These prices exclude making charges (₹200-500/gram) and 3% GST.`,
    introParagraph2: `Sector 17 and Sector 22 are Chandigarh's premier jewellery destinations, offering both Punjabi traditional designs and modern styles. The city's affluent population and strong Punjabi wedding culture drive significant gold demand, especially during wedding season (November-February).`,
    localInfo: [
      { title: 'Hallmarking centers', description: 'BIS Hallmarking Center (Chandigarh) and Punjab Assay Office.' },
      { title: 'Making charges', description: '₹200 – ₹500 per gram for 22K ornaments in Sector 17.' },
      { title: 'Top jewellery hubs', description: 'Sector 17 Plaza, Sector 22, and Sector 35 stores.' },
    ],
    faqTemplates: [
      {
        question: 'What is the gold rate in Chandigarh today?',
        answerTemplate: `Today's gold rate in Chandigarh is ₹{perGram24k} per gram for 24K gold and ₹{perGram22k} per gram for 22K gold. Prices are updated daily from Punjab bullion market.`,
      },
      {
        question: 'Why does Chandigarh gold rate change daily?',
        answerTemplate: `Chandigarh gold prices fluctuate based on London spot prices, USD/INR exchange rate, and strong Punjabi wedding demand. Prices follow Delhi market trends closely.`,
      },
      {
        question: 'How is 22K different from 24K gold?',
        answerTemplate: `24K gold is 99.9% pure (for investment), while 22K gold is 91.6% pure with alloy. Chandigarh jewellers prefer 22K for heavy Punjabi bridal sets and Polki work.`,
      },
      {
        question: 'Does making charge affect final jewellery price?',
        answerTemplate: `Yes, making charges in Chandigarh range from ₹200-500 per gram. Heavy bridal sets cost more. Final price = Gold Rate × Weight + Making Charges + 3% GST.`,
      },
      {
        question: 'Are Chandigarh gold rates similar to Delhi?',
        answerTemplate: `Yes, Chandigarh rates are typically within ₹20-40 of Delhi prices due to proximity and shared supply chains.`,
      },
      {
        question: 'Which is the best place to buy gold in Chandigarh?',
        answerTemplate: `Sector 17 (main market), Sector 22, and Sector 35. For branded jewellery, visit Tanishq, Kalyan, or local stores like Goyal Jewellers and Navratan.`,
      },
    ],
    similarCities: ['Ludhiana', 'Jalandhar', 'Amritsar', 'Delhi'],
    relatedCities: [
      { name: 'Delhi', slug: 'delhi' },
      { name: 'Jaipur', slug: 'jaipur' },
      { name: 'Lucknow', slug: 'lucknow' },
    ],
  },

  jaipur: {
    name: 'Jaipur',
    slug: 'jaipur',
    metaDescription: 'Jaipur gold rate today ({date}): 24K & 22K per gram. Johari Bazaar prices, Kundan making charges ₹250-700/g. Updated from IBJA.',
    intro: 'Gold rate in Jaipur today per gram: 22K & 24K live prices with Johari Bazaar and MI Road trends, charts, and FAQs.',
    introParagraph1: `The gold rate in Jaipur is updated daily based on international market rates, USD/INR currency movements, and Rajasthan Bullion Association pricing. Jaipur, known as India's gemstone capital, is famous for Kundan, Meenakari, and Thewa jewellery. These prices exclude making charges (₹250-700/gram for intricate work) and 3% GST.`,
    introParagraph2: `Johari Bazaar is one of India's oldest and most renowned jewellery markets, specializing in traditional Rajasthani designs. The city's rich heritage in jewellery craftsmanship makes it a destination for unique pieces. Gold demand peaks during Teej, Gangaur, and wedding season.`,
    localInfo: [
      { title: 'Hallmarking centers', description: 'Rajasthan State Hallmarking Center and BIS Office (Jaipur).' },
      { title: 'Making charges', description: '₹250 – ₹700 per gram for Kundan/Meenakari work in Johari Bazaar.' },
      { title: 'Top jewellery hubs', description: 'Johari Bazaar, MI Road, and Bapu Bazaar stores.' },
    ],
    faqTemplates: [
      {
        question: 'What is the gold rate in Jaipur today?',
        answerTemplate: `Today's gold rate in Jaipur is ₹{perGram24k} per gram for 24K gold and ₹{perGram22k} per gram for 22K gold. Prices are updated daily from Rajasthan bullion market.`,
      },
      {
        question: 'Why does Jaipur gold rate change daily?',
        answerTemplate: `Jaipur gold prices fluctuate based on London spot prices, USD/INR exchange rate, and tourist/wedding season demand. Being a tourist hub, prices may have slight premiums.`,
      },
      {
        question: 'How is 22K different from 24K gold?',
        answerTemplate: `24K gold is 99.9% pure (for investment), while 22K gold is 91.6% pure with alloy. Jaipur jewellers use 22K for traditional Kundan and Meenakari work.`,
      },
      {
        question: 'Does making charge affect final jewellery price?',
        answerTemplate: `Yes, making charges in Jaipur range from ₹250-700 per gram due to intricate craftsmanship. Kundan and Meenakari cost more. Final price = Gold Rate × Weight + Making Charges + 3% GST.`,
      },
      {
        question: 'Why is Jaipur famous for jewellery?',
        answerTemplate: `Jaipur is renowned for Kundan (uncut diamonds), Meenakari (enamel work), and Thewa (gold on glass) techniques. The city has centuries-old jewellery craftsmanship traditions.`,
      },
      {
        question: 'Which is the best place to buy gold in Jaipur?',
        answerTemplate: `Johari Bazaar (heritage market), MI Road, and Bapu Bazaar. For branded jewellery, visit Tanishq, PNG, or traditional stores like Gems Palace and Amrapali.`,
      },
    ],
    similarCities: ['Udaipur', 'Jodhpur', 'Ajmer', 'Delhi'],
    relatedCities: [
      { name: 'Delhi', slug: 'delhi' },
      { name: 'Mumbai', slug: 'mumbai' },
      { name: 'Ahmedabad', slug: 'ahmedabad' },
    ],
  },

  kochi: {
    name: 'Kochi',
    slug: 'kochi',
    metaDescription: 'Kochi gold rate today ({date}): 24K & 22K per gram. Broadway & MG Road prices, making charges ₹200-550/g. Updated from IBJA.',
    intro: 'Gold rate in Kochi today per gram: 22K & 24K live prices with Broadway and MG Road trends, charts, and FAQs.',
    introParagraph1: `The gold rate in Kochi is updated daily based on international market rates, USD/INR currency movements, and Kerala Bullion Merchants Association pricing. Kochi, being Kerala's commercial capital and a major port city, has one of the most competitive gold markets in South India. These prices exclude making charges (₹200-550/gram) and 3% GST.`,
    introParagraph2: `Broadway and MG Road are Kochi's premier jewellery destinations, with showrooms from major Kerala jewellers like Kalyan, Jos Alukkas, and Chemmanur. The city's cosmopolitan population and strong NRI connections drive significant gold demand. Gold buying peaks during Onam, Vishu, and the extensive Kerala wedding season.`,
    localInfo: [
      { title: 'Hallmarking centers', description: 'Kerala State Hallmarking Center (Kochi) and BIS Regional Office (Ernakulam).' },
      { title: 'Making charges', description: '₹200 – ₹550 per gram for 22K ornaments in Broadway/MG Road.' },
      { title: 'Top jewellery hubs', description: 'Broadway, MG Road, Edappally, and Kaloor showrooms.' },
    ],
    faqTemplates: [
      {
        question: 'What is the gold rate in Kochi today?',
        answerTemplate: `Today's gold rate in Kochi is ₹{perGram24k} per gram for 24K gold and ₹{perGram22k} per gram for 22K gold. Prices are updated daily from Kerala bullion market.`,
      },
      {
        question: 'Why does Kochi gold rate change daily?',
        answerTemplate: `Kochi gold prices fluctuate based on London spot prices, USD/INR exchange rate, and Kerala's exceptionally high gold demand. NRI remittances and festival seasons significantly impact prices.`,
      },
      {
        question: 'How is 22K different from 24K gold?',
        answerTemplate: `24K gold is 99.9% pure (for investment), while 22K gold is 91.6% pure with alloy. Kochi jewellers prefer 22K for traditional Kerala designs like Palakka, Nagapadam, and Manga Mala.`,
      },
      {
        question: 'Does making charge affect final jewellery price?',
        answerTemplate: `Yes, making charges in Kochi range from ₹200-550 per gram. Traditional bridal sets cost more. Final price = Gold Rate × Weight + Making Charges + 3% GST.`,
      },
      {
        question: 'Is Kochi good for gold shopping?',
        answerTemplate: `Yes, Kochi offers competitive prices with major Kerala jewellery brands headquartered nearby. The city has excellent variety in traditional Kerala and modern designs.`,
      },
      {
        question: 'Which is the best place to buy gold in Kochi?',
        answerTemplate: `Broadway (historic market), MG Road, and Edappally malls. For branded jewellery, visit Kalyan, Jos Alukkas, Chemmanur, or Joyalukkas showrooms.`,
      },
    ],
    similarCities: ['Thrissur', 'Trivandrum', 'Calicut', 'Coimbatore'],
    relatedCities: [
      { name: 'Kerala', slug: 'kerala' },
      { name: 'Coimbatore', slug: 'coimbatore' },
      { name: 'Chennai', slug: 'chennai' },
    ],
  },

  kerala: {
    name: 'Kerala',
    slug: 'kerala',
    metaDescription: 'Kerala gold rate today ({date}): 24K & 22K per gram. Thrissur & Kochi prices, making charges ₹200-550/g. Updated from IBJA.',
    intro: 'Gold rate in Kerala today per gram: 22K & 24K live prices with Kochi, Thrissur, and Trivandrum trends, charts, and FAQs.',
    introParagraph1: `The gold rate in Kerala is updated daily based on international market rates, USD/INR currency movements, and Kerala Bullion Merchants Association pricing. Kerala has the highest per capita gold consumption in India, driven by strong cultural traditions and wedding customs. These prices exclude making charges (₹200-550/gram) and 3% GST.`,
    introParagraph2: `Thrissur is known as Kerala's gold capital with major jewellers like Kalyan and Jos Alukkas headquartered here. Kochi's Broadway and MG Road are other major jewellery destinations. Gold demand peaks during Onam, Vishu, and the extensive wedding season.`,
    localInfo: [
      { title: 'Hallmarking centers', description: 'Kerala State Hallmarking Center (Kochi) and Regional Assay Offices.' },
      { title: 'Making charges', description: '₹200 – ₹550 per gram for 22K ornaments in Thrissur/Kochi.' },
      { title: 'Top jewellery hubs', description: 'Thrissur (gold capital), Kochi Broadway, and Trivandrum MG Road.' },
    ],
    faqTemplates: [
      {
        question: 'What is the gold rate in Kerala today?',
        answerTemplate: `Today's gold rate in Kerala is ₹{perGram24k} per gram for 24K gold and ₹{perGram22k} per gram for 22K gold. Prices are updated daily from Kerala bullion market.`,
      },
      {
        question: 'Why does Kerala gold rate change daily?',
        answerTemplate: `Kerala gold prices fluctuate based on London spot prices, USD/INR exchange rate, and the state's exceptionally high gold demand. Festival and wedding seasons significantly impact prices.`,
      },
      {
        question: 'How is 22K different from 24K gold?',
        answerTemplate: `24K gold is 99.9% pure (for investment), while 22K gold is 91.6% pure with alloy. Kerala jewellers prefer 22K for traditional designs like Palakka and Nagapadam.`,
      },
      {
        question: 'Does making charge affect final jewellery price?',
        answerTemplate: `Yes, making charges in Kerala range from ₹200-550 per gram. Traditional designs cost more. Final price = Gold Rate × Weight + Making Charges + 3% GST.`,
      },
      {
        question: 'Why does Kerala consume so much gold?',
        answerTemplate: `Kerala has India's highest per capita gold consumption due to strong wedding traditions, Gulf remittances, and cultural significance of gold in Malayali households.`,
      },
      {
        question: 'Which is the best place to buy gold in Kerala?',
        answerTemplate: `Thrissur (gold capital - Kalyan, Jos Alukkas), Kochi Broadway, and Trivandrum MG Road. For competitive prices, compare rates across major showrooms.`,
      },
    ],
    similarCities: ['Coimbatore', 'Chennai', 'Mangalore', 'Bangalore'],
    relatedCities: [
      { name: 'Chennai', slug: 'chennai' },
      { name: 'Bangalore', slug: 'bangalore' },
      { name: 'Coimbatore', slug: 'coimbatore' },
    ],
  },

  lucknow: {
    name: 'Lucknow',
    slug: 'lucknow',
    metaDescription: 'Lucknow gold rate today ({date}): 24K & 22K per gram. Hazratganj prices, making charges ₹180-480/g. Updated from IBJA.',
    intro: 'Gold rate in Lucknow today per gram: 22K & 24K live prices with Hazratganj and Aminabad trends, charts, and FAQs.',
    introParagraph1: `The gold rate in Lucknow is updated daily based on international market rates, USD/INR currency movements, and Uttar Pradesh Bullion Association pricing. Lucknow, the capital of India's most populous state, offers competitive gold rates with strong demand for traditional Nawabi-style jewellery. These prices exclude making charges (₹180-480/gram) and 3% GST.`,
    introParagraph2: `Hazratganj and Aminabad are Lucknow's premier jewellery destinations, known for intricate Lucknowi work and Jadau jewellery. The city's Nawabi heritage influences unique jewellery designs. Gold demand peaks during Eid, Diwali, and wedding season.`,
    localInfo: [
      { title: 'Hallmarking centers', description: 'Uttar Pradesh State Hallmarking Center and BIS Office (Lucknow).' },
      { title: 'Making charges', description: '₹180 – ₹480 per gram for 22K ornaments in Hazratganj.' },
      { title: 'Top jewellery hubs', description: 'Hazratganj, Aminabad, and Chowk market stores.' },
    ],
    faqTemplates: [
      {
        question: 'What is the gold rate in Lucknow today?',
        answerTemplate: `Today's gold rate in Lucknow is ₹{perGram24k} per gram for 24K gold and ₹{perGram22k} per gram for 22K gold. Prices are updated daily from UP bullion market.`,
      },
      {
        question: 'Why does Lucknow gold rate change daily?',
        answerTemplate: `Lucknow gold prices fluctuate based on London spot prices, USD/INR exchange rate, and festival demand during Eid, Diwali, and wedding season.`,
      },
      {
        question: 'How is 22K different from 24K gold?',
        answerTemplate: `24K gold is 99.9% pure (for investment), while 22K gold is 91.6% pure with alloy. Lucknow jewellers prefer 22K for traditional Nawabi and Jadau designs.`,
      },
      {
        question: 'Does making charge affect final jewellery price?',
        answerTemplate: `Yes, making charges in Lucknow range from ₹180-480 per gram. Jadau and Kundan work cost more. Final price = Gold Rate × Weight + Making Charges + 3% GST.`,
      },
      {
        question: 'Are Lucknow gold rates competitive?',
        answerTemplate: `Yes, Lucknow offers competitive rates similar to Delhi, typically within ₹30-50 of Delhi prices. Large market competition keeps prices in check.`,
      },
      {
        question: 'Which is the best place to buy gold in Lucknow?',
        answerTemplate: `Hazratganj (premium market), Aminabad (traditional), and Chowk area. For branded jewellery, visit Tanishq, Kalyan, or local stores like Chauhan Jewellers.`,
      },
    ],
    similarCities: ['Kanpur', 'Varanasi', 'Agra', 'Delhi'],
    relatedCities: [
      { name: 'Delhi', slug: 'delhi' },
      { name: 'Patna', slug: 'patna' },
      { name: 'Kolkata', slug: 'kolkata' },
    ],
  },

  madurai: {
    name: 'Madurai',
    slug: 'madurai',
    metaDescription: 'Madurai gold rate today ({date}): 24K & 22K per gram. Town Hall Road prices, making charges ₹140-380/g. Updated from IBJA.',
    intro: 'Gold rate in Madurai today per gram: 22K & 24K live prices with Town Hall Road and South Masi Street trends, charts, and FAQs.',
    introParagraph1: `The gold rate in Madurai is updated daily based on international market rates, USD/INR currency movements, and Tamil Nadu Bullion Association pricing. Madurai, one of Tamil Nadu's oldest cities, has a strong gold-buying tradition linked to Meenakshi Temple. These prices exclude making charges (₹140-380/gram) and 3% GST.`,
    introParagraph2: `Town Hall Road and South Masi Street are Madurai's main jewellery hubs, offering traditional South Indian temple jewellery at competitive prices. The city's temple culture drives demand for religious gold items. Gold buying peaks during Meenakshi Thirukalyanam, Chithirai festival, and wedding season.`,
    localInfo: [
      { title: 'Hallmarking centers', description: 'Tamil Nadu Hallmarking Center (Madurai Branch) and Regional Office.' },
      { title: 'Making charges', description: '₹140 – ₹380 per gram for 22K ornaments in Town Hall Road.' },
      { title: 'Top jewellery hubs', description: 'Town Hall Road, South Masi Street, and North Masi Street stores.' },
    ],
    faqTemplates: [
      {
        question: 'What is the gold rate in Madurai today?',
        answerTemplate: `Today's gold rate in Madurai is ₹{perGram24k} per gram for 24K gold and ₹{perGram22k} per gram for 22K gold. Prices are updated daily from Tamil Nadu bullion market.`,
      },
      {
        question: 'Why does Madurai gold rate change daily?',
        answerTemplate: `Madurai gold prices fluctuate based on London spot prices, USD/INR exchange rate, and temple festival demand. Meenakshi Temple events significantly boost gold buying.`,
      },
      {
        question: 'How is 22K different from 24K gold?',
        answerTemplate: `24K gold is 99.9% pure (for investment), while 22K gold is 91.6% pure with alloy. Madurai jewellers prefer 22K for traditional temple jewellery and antique designs.`,
      },
      {
        question: 'Does making charge affect final jewellery price?',
        answerTemplate: `Yes, making charges in Madurai range from ₹140-380 per gram - lower than Chennai. Final price = Gold Rate × Weight + Making Charges + 3% GST.`,
      },
      {
        question: 'Are Madurai gold rates lower than Chennai?',
        answerTemplate: `Yes, Madurai rates are typically ₹30-50 lower than Chennai due to lower overhead costs, making it attractive for bulk purchases.`,
      },
      {
        question: 'Which is the best place to buy gold in Madurai?',
        answerTemplate: `Town Hall Road (main market), South Masi Street, and near Meenakshi Temple. For branded jewellery, visit GRT, Saravana, or Lalitha showrooms.`,
      },
    ],
    similarCities: ['Coimbatore', 'Chennai', 'Trichy', 'Salem'],
    relatedCities: [
      { name: 'Chennai', slug: 'chennai' },
      { name: 'Coimbatore', slug: 'coimbatore' },
      { name: 'Trichy', slug: 'trichy' },
    ],
  },

  mangalore: {
    name: 'Mangalore',
    slug: 'mangalore',
    metaDescription: 'Mangalore gold rate today ({date}): 24K & 22K per gram. Car Street prices, making charges ₹170-430/g. Updated from IBJA.',
    intro: 'Gold rate in Mangalore today per gram: 22K & 24K live prices with Car Street and Hampankatta trends, charts, and FAQs.',
    introParagraph1: `The gold rate in Mangalore is updated daily based on international market rates, USD/INR currency movements, and Karnataka Bullion Association pricing. Mangalore, a major port city, has competitive gold rates influenced by coastal trade. These prices exclude making charges (₹170-430/gram) and 3% GST.`,
    introParagraph2: `Car Street and Hampankatta are Mangalore's main jewellery destinations, offering traditional Tulu Nadu and South Canara designs. The city's coastal prosperity and strong wedding traditions drive significant gold demand, especially during Tulunadu festivals.`,
    localInfo: [
      { title: 'Hallmarking centers', description: 'Karnataka State Hallmarking Center (Mangalore Branch) and Regional Office.' },
      { title: 'Making charges', description: '₹170 – ₹430 per gram for 22K ornaments in Car Street.' },
      { title: 'Top jewellery hubs', description: 'Car Street, Hampankatta, and Balmatta Road stores.' },
    ],
    faqTemplates: [
      {
        question: 'What is the gold rate in Mangalore today?',
        answerTemplate: `Today's gold rate in Mangalore is ₹{perGram24k} per gram for 24K gold and ₹{perGram22k} per gram for 22K gold. Prices are updated daily from Karnataka bullion market.`,
      },
      {
        question: 'Why does Mangalore gold rate change daily?',
        answerTemplate: `Mangalore gold prices fluctuate based on London spot prices, USD/INR exchange rate, and coastal trading patterns. Festival seasons like Deepavali boost demand.`,
      },
      {
        question: 'How is 22K different from 24K gold?',
        answerTemplate: `24K gold is 99.9% pure (for investment), while 22K gold is 91.6% pure with alloy. Mangalore jewellers prefer 22K for traditional Tulu Nadu designs.`,
      },
      {
        question: 'Does making charge affect final jewellery price?',
        answerTemplate: `Yes, making charges in Mangalore range from ₹170-430 per gram. Final price = Gold Rate × Weight + Making Charges + 3% GST.`,
      },
      {
        question: 'Are Mangalore gold rates competitive?',
        answerTemplate: `Yes, Mangalore offers competitive rates similar to Bangalore, typically within ₹20-40 due to port city trading advantages.`,
      },
      {
        question: 'Which is the best place to buy gold in Mangalore?',
        answerTemplate: `Car Street (heritage market), Hampankatta, and Balmatta Road. For branded jewellery, visit Bhima, Tanishq, or local stores like Joyalukkas and Chemmanur.`,
      },
    ],
    similarCities: ['Bangalore', 'Mysore', 'Udupi', 'Kerala'],
    relatedCities: [
      { name: 'Bangalore', slug: 'bangalore' },
      { name: 'Kerala', slug: 'kerala' },
      { name: 'Chennai', slug: 'chennai' },
    ],
  },

  moodbidri: {
    name: 'Moodbidri',
    slug: 'moodbidri',
    metaDescription: 'Moodbidri gold rate today ({date}): 24K & 22K per gram. Jain Basadi area prices, making charges ₹160-400/g. Updated from IBJA.',
    intro: 'Gold rate in Moodbidri today per gram: 22K & 24K live prices with local market trends, charts, and FAQs.',
    introParagraph1: `The gold rate in Moodbidri is updated daily based on international market rates, USD/INR currency movements, and Karnataka Bullion Association pricing. Moodbidri, known as the "Jain Kashi" for its 18 Jain temples, has a growing gold market influenced by nearby Mangalore. These prices exclude making charges (₹160-400/gram) and 3% GST.`,
    introParagraph2: `Moodbidri's gold market serves the Jain pilgrimage community and local residents, offering traditional South Canara and Tulu Nadu designs. The town's proximity to Mangalore (35 km) means competitive pricing. Gold demand peaks during Jain festivals, Deepavali, and wedding season.`,
    localInfo: [
      { title: 'Hallmarking centers', description: 'Karnataka State Hallmarking Center in nearby Mangalore serves Moodbidri.' },
      { title: 'Making charges', description: '₹160 – ₹400 per gram for 22K ornaments in local jewellers.' },
      { title: 'Top jewellery hubs', description: 'Main Road near Thousand Pillars Basadi and Mangalore city stores.' },
    ],
    faqTemplates: [
      {
        question: 'What is the gold rate in Moodbidri today?',
        answerTemplate: `Today's gold rate in Moodbidri is ₹{perGram24k} per gram for 24K gold and ₹{perGram22k} per gram for 22K gold. Prices are updated daily from Karnataka bullion market.`,
      },
      {
        question: 'Why does Moodbidri gold rate change daily?',
        answerTemplate: `Moodbidri gold prices fluctuate based on London spot prices, USD/INR exchange rate, and follow Mangalore market trends. Jain festival seasons also impact local demand.`,
      },
      {
        question: 'How is 22K different from 24K gold?',
        answerTemplate: `24K gold is 99.9% pure (for investment), while 22K gold is 91.6% pure with alloy. Moodbidri jewellers prefer 22K for traditional South Canara and temple jewellery.`,
      },
      {
        question: 'Does making charge affect final jewellery price?',
        answerTemplate: `Yes, making charges in Moodbidri range from ₹160-400 per gram - slightly lower than Mangalore city. Final price = Gold Rate × Weight + Making Charges + 3% GST.`,
      },
      {
        question: 'Are Moodbidri gold rates similar to Mangalore?',
        answerTemplate: `Yes, Moodbidri rates are typically within ₹10-20 of Mangalore prices. Many residents also shop in Mangalore for wider selection.`,
      },
      {
        question: 'Which is the best place to buy gold in Moodbidri?',
        answerTemplate: `Main Road near Jain Basadis for local jewellers. For branded options, visit Mangalore's Car Street (35 km) with stores like Bhima, Tanishq, and Joyalukkas.`,
      },
    ],
    similarCities: ['Mangalore', 'Udupi', 'Bangalore', 'Mysore'],
    relatedCities: [
      { name: 'Mangalore', slug: 'mangalore' },
      { name: 'Bangalore', slug: 'bangalore' },
      { name: 'Mysore', slug: 'mysore' },
    ],
  },

  mysore: {
    name: 'Mysore',
    slug: 'mysore',
    metaDescription: 'Mysore gold rate today ({date}): 24K & 22K per gram. Sayyaji Rao Road prices, making charges ₹180-450/g. Updated from IBJA.',
    intro: 'Gold rate in Mysore today per gram: 22K & 24K live prices with Sayyaji Rao Road and Devaraja Market trends, charts, and FAQs.',
    introParagraph1: `The gold rate in Mysore is updated daily based on international market rates, USD/INR currency movements, and Karnataka Bullion Association pricing. Mysore, the cultural capital of Karnataka, has a rich tradition of royal jewellery craftsmanship. These prices exclude making charges (₹180-450/gram) and 3% GST.`,
    introParagraph2: `Sayyaji Rao Road and Devaraja Market are Mysore's premier jewellery destinations, known for traditional Mysore-style ornaments. The city's royal heritage influences unique design aesthetics. Gold demand peaks during Dasara (Mysore's grandest festival), Deepavali, and wedding season.`,
    localInfo: [
      { title: 'Hallmarking centers', description: 'Karnataka State Hallmarking Center (Mysore Branch) and Regional Office.' },
      { title: 'Making charges', description: '₹180 – ₹450 per gram for 22K ornaments in Sayyaji Rao Road.' },
      { title: 'Top jewellery hubs', description: 'Sayyaji Rao Road, Devaraja Market, and Ashoka Road stores.' },
    ],
    faqTemplates: [
      {
        question: 'What is the gold rate in Mysore today?',
        answerTemplate: `Today's gold rate in Mysore is ₹{perGram24k} per gram for 24K gold and ₹{perGram22k} per gram for 22K gold. Prices are updated daily from Karnataka bullion market.`,
      },
      {
        question: 'Why does Mysore gold rate change daily?',
        answerTemplate: `Mysore gold prices fluctuate based on London spot prices, USD/INR exchange rate, and festival demand especially during Dasara celebrations.`,
      },
      {
        question: 'How is 22K different from 24K gold?',
        answerTemplate: `24K gold is 99.9% pure (for investment), while 22K gold is 91.6% pure with alloy. Mysore jewellers prefer 22K for traditional Karnataka and royal-style designs.`,
      },
      {
        question: 'Does making charge affect final jewellery price?',
        answerTemplate: `Yes, making charges in Mysore range from ₹180-450 per gram. Heritage designs cost more. Final price = Gold Rate × Weight + Making Charges + 3% GST.`,
      },
      {
        question: 'Are Mysore gold rates similar to Bangalore?',
        answerTemplate: `Yes, Mysore rates are typically within ₹20-30 of Bangalore prices, sometimes slightly lower due to reduced overhead costs.`,
      },
      {
        question: 'Which is the best place to buy gold in Mysore?',
        answerTemplate: `Sayyaji Rao Road (main market), Devaraja Market, and Ashoka Road. For branded jewellery, visit C. Krishniah Chetty, Tanishq, or Sri Krishna Jewellers.`,
      },
    ],
    similarCities: ['Bangalore', 'Mangalore', 'Hubli', 'Coimbatore'],
    relatedCities: [
      { name: 'Bangalore', slug: 'bangalore' },
      { name: 'Mangalore', slug: 'mangalore' },
      { name: 'Coimbatore', slug: 'coimbatore' },
    ],
  },

  nagpur: {
    name: 'Nagpur',
    slug: 'nagpur',
    metaDescription: 'Nagpur gold rate today ({date}): 24K & 22K per gram. Sitabuldi prices, making charges ₹180-450/g. Updated from IBJA.',
    intro: 'Gold rate in Nagpur today per gram: 22K & 24K live prices with Sitabuldi and Itwari trends, charts, and FAQs.',
    introParagraph1: `The gold rate in Nagpur is updated daily based on international market rates, USD/INR currency movements, and Vidarbha Bullion Association pricing. Nagpur, central India's largest city, serves as a gold trading hub for the Vidarbha region. These prices exclude making charges (₹180-450/gram) and 3% GST.`,
    introParagraph2: `Sitabuldi and Itwari are Nagpur's main jewellery markets, offering traditional Maharashtrian designs at competitive prices. The city's central location makes it accessible for buyers from surrounding regions. Gold demand peaks during Gudi Padwa, Diwali, and wedding season.`,
    localInfo: [
      { title: 'Hallmarking centers', description: 'Maharashtra State Hallmarking Center (Nagpur Branch) and Regional Office.' },
      { title: 'Making charges', description: '₹180 – ₹450 per gram for 22K ornaments in Sitabuldi.' },
      { title: 'Top jewellery hubs', description: 'Sitabuldi, Itwari, and Dharampeth stores.' },
    ],
    faqTemplates: [
      {
        question: 'What is the gold rate in Nagpur today?',
        answerTemplate: `Today's gold rate in Nagpur is ₹{perGram24k} per gram for 24K gold and ₹{perGram22k} per gram for 22K gold. Prices are updated daily from Vidarbha bullion market.`,
      },
      {
        question: 'Why does Nagpur gold rate change daily?',
        answerTemplate: `Nagpur gold prices fluctuate based on London spot prices, USD/INR exchange rate, and regional demand during Gudi Padwa and wedding season.`,
      },
      {
        question: 'How is 22K different from 24K gold?',
        answerTemplate: `24K gold is 99.9% pure (for investment), while 22K gold is 91.6% pure with alloy. Nagpur jewellers prefer 22K for traditional Maharashtrian designs.`,
      },
      {
        question: 'Does making charge affect final jewellery price?',
        answerTemplate: `Yes, making charges in Nagpur range from ₹180-450 per gram. Final price = Gold Rate × Weight + Making Charges + 3% GST.`,
      },
      {
        question: 'Are Nagpur gold rates lower than Mumbai?',
        answerTemplate: `Yes, Nagpur rates are typically ₹20-40 lower than Mumbai due to lower overhead costs and regional market dynamics.`,
      },
      {
        question: 'Which is the best place to buy gold in Nagpur?',
        answerTemplate: `Sitabuldi (main market), Itwari, and Dharampeth. For branded jewellery, visit PNG, Tanishq, or local stores like Chandukaka Saraf and PN Gadgil.`,
      },
    ],
    similarCities: ['Pune', 'Mumbai', 'Indore', 'Raipur'],
    relatedCities: [
      { name: 'Pune', slug: 'pune' },
      { name: 'Mumbai', slug: 'mumbai' },
      { name: 'Hyderabad', slug: 'hyderabad' },
    ],
  },

  nashik: {
    name: 'Nashik',
    slug: 'nashik',
    metaDescription: 'Nashik gold rate today ({date}): 24K & 22K per gram. Main Road prices, making charges ₹180-440/g. Updated from IBJA.',
    intro: 'Gold rate in Nashik today per gram: 22K & 24K live prices with Main Road and Panchavati trends, charts, and FAQs.',
    introParagraph1: `The gold rate in Nashik is updated daily based on international market rates, USD/INR currency movements, and Maharashtra Bullion Association pricing. Nashik, known for its wine industry and Kumbh Mela, has competitive gold rates. These prices exclude making charges (₹180-440/gram) and 3% GST.`,
    introParagraph2: `Main Road (MG Road) and Panchavati are Nashik's main jewellery destinations, offering traditional Maharashtrian designs. The city sees significant gold demand during Kumbh Mela years and regular pilgrimage seasons. Wedding season and Gudi Padwa also boost gold buying.`,
    localInfo: [
      { title: 'Hallmarking centers', description: 'Maharashtra State Hallmarking Center (Nashik Branch) and Regional Office.' },
      { title: 'Making charges', description: '₹180 – ₹440 per gram for 22K ornaments in Main Road.' },
      { title: 'Top jewellery hubs', description: 'Main Road (MG Road), Panchavati, and College Road stores.' },
    ],
    faqTemplates: [
      {
        question: 'What is the gold rate in Nashik today?',
        answerTemplate: `Today's gold rate in Nashik is ₹{perGram24k} per gram for 24K gold and ₹{perGram22k} per gram for 22K gold. Prices are updated daily from Maharashtra bullion market.`,
      },
      {
        question: 'Why does Nashik gold rate change daily?',
        answerTemplate: `Nashik gold prices fluctuate based on London spot prices, USD/INR exchange rate, and pilgrimage demand. Kumbh Mela years see exceptionally high gold demand.`,
      },
      {
        question: 'How is 22K different from 24K gold?',
        answerTemplate: `24K gold is 99.9% pure (for investment), while 22K gold is 91.6% pure with alloy. Nashik jewellers prefer 22K for traditional Maharashtrian and religious designs.`,
      },
      {
        question: 'Does making charge affect final jewellery price?',
        answerTemplate: `Yes, making charges in Nashik range from ₹180-440 per gram. Final price = Gold Rate × Weight + Making Charges + 3% GST.`,
      },
      {
        question: 'Are Nashik gold rates competitive?',
        answerTemplate: `Yes, Nashik rates are typically ₹15-30 lower than Mumbai, making it a good option for buyers from North Maharashtra.`,
      },
      {
        question: 'Which is the best place to buy gold in Nashik?',
        answerTemplate: `Main Road/MG Road (central market), Panchavati, and College Road. For branded jewellery, visit PNG, Tanishq, or local stores like Surana Jewellers.`,
      },
    ],
    similarCities: ['Pune', 'Mumbai', 'Aurangabad', 'Nagpur'],
    relatedCities: [
      { name: 'Pune', slug: 'pune' },
      { name: 'Mumbai', slug: 'mumbai' },
      { name: 'Nagpur', slug: 'nagpur' },
    ],
  },

  patna: {
    name: 'Patna',
    slug: 'patna',
    metaDescription: 'Patna gold rate today ({date}): 24K & 22K per gram. Hathwa Market prices, making charges ₹170-420/g. Updated from IBJA.',
    intro: 'Gold rate in Patna today per gram: 22K & 24K live prices with Hathwa Market and Kankarbagh trends, charts, and FAQs.',
    introParagraph1: `The gold rate in Patna is updated daily based on international market rates, USD/INR currency movements, and Bihar Bullion Association pricing. Patna, the capital of Bihar, offers competitive gold rates with growing demand from the state's rising middle class. These prices exclude making charges (₹170-420/gram) and 3% GST.`,
    introParagraph2: `Hathwa Market and Kankarbagh are Patna's main jewellery destinations, offering traditional Bihari designs and modern styles. Gold demand peaks during Chhath Puja, Diwali, and wedding season, with significant purchases during Akshaya Tritiya.`,
    localInfo: [
      { title: 'Hallmarking centers', description: 'Bihar State Hallmarking Center and BIS Office (Patna).' },
      { title: 'Making charges', description: '₹170 – ₹420 per gram for 22K ornaments in Hathwa Market.' },
      { title: 'Top jewellery hubs', description: 'Hathwa Market, Kankarbagh, and Boring Road stores.' },
    ],
    faqTemplates: [
      {
        question: 'What is the gold rate in Patna today?',
        answerTemplate: `Today's gold rate in Patna is ₹{perGram24k} per gram for 24K gold and ₹{perGram22k} per gram for 22K gold. Prices are updated daily from Bihar bullion market.`,
      },
      {
        question: 'Why does Patna gold rate change daily?',
        answerTemplate: `Patna gold prices fluctuate based on London spot prices, USD/INR exchange rate, and festival demand during Chhath Puja and Diwali.`,
      },
      {
        question: 'How is 22K different from 24K gold?',
        answerTemplate: `24K gold is 99.9% pure (for investment), while 22K gold is 91.6% pure with alloy. Patna jewellers prefer 22K for traditional Bihari bridal and festive jewellery.`,
      },
      {
        question: 'Does making charge affect final jewellery price?',
        answerTemplate: `Yes, making charges in Patna range from ₹170-420 per gram. Final price = Gold Rate × Weight + Making Charges + 3% GST.`,
      },
      {
        question: 'Are Patna gold rates competitive?',
        answerTemplate: `Yes, Patna offers competitive rates, typically within ₹30-50 of Kolkata prices, making it a good option for Bihar residents.`,
      },
      {
        question: 'Which is the best place to buy gold in Patna?',
        answerTemplate: `Hathwa Market (main market), Kankarbagh, and Boring Road. For branded jewellery, visit Tanishq, Kalyan, or local stores like Tribhovandas and Senco.`,
      },
    ],
    similarCities: ['Kolkata', 'Lucknow', 'Ranchi', 'Varanasi'],
    relatedCities: [
      { name: 'Kolkata', slug: 'kolkata' },
      { name: 'Lucknow', slug: 'lucknow' },
      { name: 'Delhi', slug: 'delhi' },
    ],
  },

  rajkot: {
    name: 'Rajkot',
    slug: 'rajkot',
    metaDescription: 'Rajkot gold rate today ({date}): 24K & 22K per gram. Soni Bazaar prices, making charges ₹160-400/g. Updated from IBJA.',
    intro: 'Gold rate in Rajkot today per gram: 22K & 24K live prices with Soni Bazaar and Yagnik Road trends, charts, and FAQs.',
    introParagraph1: `The gold rate in Rajkot is updated daily based on international market rates, USD/INR currency movements, and Gujarat Bullion Association pricing. Rajkot is a major gold manufacturing hub in India, producing jewellery for domestic and export markets. These prices exclude making charges (₹160-400/gram) and 3% GST.`,
    introParagraph2: `Soni Bazaar is Rajkot's historic jewellery market, known for traditional Gujarati designs and wholesale trading. The city's strong manufacturing base means competitive prices and wide variety. Gold demand peaks during Dhanteras, Diwali, and wedding season.`,
    localInfo: [
      { title: 'Hallmarking centers', description: 'Gujarat State Hallmarking Center (Rajkot Branch) and Regional Office.' },
      { title: 'Making charges', description: '₹160 – ₹400 per gram for 22K ornaments in Soni Bazaar.' },
      { title: 'Top jewellery hubs', description: 'Soni Bazaar, Yagnik Road, and Dhebar Road stores.' },
    ],
    faqTemplates: [
      {
        question: 'What is the gold rate in Rajkot today?',
        answerTemplate: `Today's gold rate in Rajkot is ₹{perGram24k} per gram for 24K gold and ₹{perGram22k} per gram for 22K gold. Prices are updated daily from Gujarat bullion market.`,
      },
      {
        question: 'Why does Rajkot gold rate change daily?',
        answerTemplate: `Rajkot gold prices fluctuate based on London spot prices, USD/INR exchange rate, and manufacturing demand. Being a production hub, prices are influenced by export orders too.`,
      },
      {
        question: 'How is 22K different from 24K gold?',
        answerTemplate: `24K gold is 99.9% pure (for investment), while 22K gold is 91.6% pure with alloy. Rajkot manufactures both types extensively for domestic and export markets.`,
      },
      {
        question: 'Does making charge affect final jewellery price?',
        answerTemplate: `Yes, making charges in Rajkot range from ₹160-400 per gram - often lower due to manufacturing hub status. Final price = Gold Rate × Weight + Making Charges + 3% GST.`,
      },
      {
        question: 'Why is Rajkot famous for gold jewellery?',
        answerTemplate: `Rajkot is one of India's largest gold jewellery manufacturing centers, known for machine-made and handcrafted pieces exported worldwide.`,
      },
      {
        question: 'Which is the best place to buy gold in Rajkot?',
        answerTemplate: `Soni Bazaar (manufacturing hub), Yagnik Road, and Dhebar Road. For branded jewellery, visit Tanishq, Kalyan, or local manufacturers like Kiran Gems.`,
      },
    ],
    similarCities: ['Ahmedabad', 'Surat', 'Vadodara', 'Mumbai'],
    relatedCities: [
      { name: 'Ahmedabad', slug: 'ahmedabad' },
      { name: 'Surat', slug: 'surat' },
      { name: 'Mumbai', slug: 'mumbai' },
    ],
  },

  salem: {
    name: 'Salem',
    slug: 'salem',
    metaDescription: 'Salem gold rate today ({date}): 24K & 22K per gram. Shevapet prices, making charges ₹140-380/g. Updated from IBJA.',
    intro: 'Gold rate in Salem today per gram: 22K & 24K live prices with Shevapet and Five Roads trends, charts, and FAQs.',
    introParagraph1: `The gold rate in Salem is updated daily based on international market rates, USD/INR currency movements, and Tamil Nadu Bullion Association pricing. Salem, known for steel and textiles, has a growing gold market with competitive prices. These prices exclude making charges (₹140-380/gram) and 3% GST.`,
    introParagraph2: `Shevapet and Five Roads are Salem's main jewellery markets, offering traditional South Indian designs at competitive prices. The city's industrial prosperity drives steady gold demand. Gold buying peaks during Pongal, Deepavali, and wedding season.`,
    localInfo: [
      { title: 'Hallmarking centers', description: 'Tamil Nadu Hallmarking Center (Salem Branch) and Regional Office.' },
      { title: 'Making charges', description: '₹140 – ₹380 per gram for 22K ornaments in Shevapet.' },
      { title: 'Top jewellery hubs', description: 'Shevapet, Five Roads, and Omalur Road stores.' },
    ],
    faqTemplates: [
      {
        question: 'What is the gold rate in Salem today?',
        answerTemplate: `Today's gold rate in Salem is ₹{perGram24k} per gram for 24K gold and ₹{perGram22k} per gram for 22K gold. Prices are updated daily from Tamil Nadu bullion market.`,
      },
      {
        question: 'Why does Salem gold rate change daily?',
        answerTemplate: `Salem gold prices fluctuate based on London spot prices, USD/INR exchange rate, and regional demand during festivals like Pongal and Deepavali.`,
      },
      {
        question: 'How is 22K different from 24K gold?',
        answerTemplate: `24K gold is 99.9% pure (for investment), while 22K gold is 91.6% pure with alloy. Salem jewellers prefer 22K for traditional South Indian temple jewellery.`,
      },
      {
        question: 'Does making charge affect final jewellery price?',
        answerTemplate: `Yes, making charges in Salem range from ₹140-380 per gram - lower than Chennai. Final price = Gold Rate × Weight + Making Charges + 3% GST.`,
      },
      {
        question: 'Are Salem gold rates competitive?',
        answerTemplate: `Yes, Salem rates are typically ₹30-50 lower than Chennai, making it attractive for buyers from western Tamil Nadu.`,
      },
      {
        question: 'Which is the best place to buy gold in Salem?',
        answerTemplate: `Shevapet (main market), Five Roads, and Omalur Road. For branded jewellery, visit GRT, Kalyan, or local stores like Saravana and Lalitha.`,
      },
    ],
    similarCities: ['Coimbatore', 'Chennai', 'Erode', 'Trichy'],
    relatedCities: [
      { name: 'Coimbatore', slug: 'coimbatore' },
      { name: 'Chennai', slug: 'chennai' },
      { name: 'Trichy', slug: 'trichy' },
    ],
  },

  surat: {
    name: 'Surat',
    slug: 'surat',
    metaDescription: 'Surat gold rate today ({date}): 24K & 22K per gram. Chauta Bazaar prices, making charges ₹150-400/g. Updated from IBJA.',
    intro: 'Gold rate in Surat today per gram: 22K & 24K live prices with Chauta Bazaar and Ring Road trends, charts, and FAQs.',
    introParagraph1: `The gold rate in Surat is updated daily based on international market rates, USD/INR currency movements, and Gujarat Bullion Association pricing. Surat, the world's diamond cutting capital, is also a major gold trading hub with competitive wholesale prices. These prices exclude making charges (₹150-400/gram) and 3% GST.`,
    introParagraph2: `Chauta Bazaar is Surat's historic jewellery market, while Ring Road and Athwa Lines have modern showrooms. The city's diamond industry workers are significant gold buyers. Gold demand peaks during Dhanteras, Diwali, and wedding season.`,
    localInfo: [
      { title: 'Hallmarking centers', description: 'Gujarat State Hallmarking Center (Surat Branch) and Regional Office.' },
      { title: 'Making charges', description: '₹150 – ₹400 per gram for 22K ornaments in Chauta Bazaar.' },
      { title: 'Top jewellery hubs', description: 'Chauta Bazaar, Ring Road, and Athwa Lines stores.' },
    ],
    faqTemplates: [
      {
        question: 'What is the gold rate in Surat today?',
        answerTemplate: `Today's gold rate in Surat is ₹{perGram24k} per gram for 24K gold and ₹{perGram22k} per gram for 22K gold. Prices are updated daily from Gujarat bullion market.`,
      },
      {
        question: 'Why does Surat gold rate change daily?',
        answerTemplate: `Surat gold prices fluctuate based on London spot prices, USD/INR exchange rate, and diamond industry demand. Being a trading hub, prices respond quickly to market changes.`,
      },
      {
        question: 'How is 22K different from 24K gold?',
        answerTemplate: `24K gold is 99.9% pure (for investment), while 22K gold is 91.6% pure with alloy. Surat offers both types with excellent diamond-studded options due to local expertise.`,
      },
      {
        question: 'Does making charge affect final jewellery price?',
        answerTemplate: `Yes, making charges in Surat range from ₹150-400 per gram. Diamond-studded pieces cost more. Final price = Gold Rate × Weight + Making Charges + 3% GST.`,
      },
      {
        question: 'Why is Surat good for gold shopping?',
        answerTemplate: `Surat's diamond industry expertise means excellent diamond-gold combination jewellery at competitive prices. The city has strong wholesale trading infrastructure.`,
      },
      {
        question: 'Which is the best place to buy gold in Surat?',
        answerTemplate: `Chauta Bazaar (historic market), Ring Road, and Athwa Lines. For branded jewellery, visit Tanishq, Kalyan, or local stores like Dharmanandan Diamonds.`,
      },
    ],
    similarCities: ['Ahmedabad', 'Rajkot', 'Vadodara', 'Mumbai'],
    relatedCities: [
      { name: 'Ahmedabad', slug: 'ahmedabad' },
      { name: 'Mumbai', slug: 'mumbai' },
      { name: 'Rajkot', slug: 'rajkot' },
    ],
  },

  tirunelveli: {
    name: 'Tirunelveli',
    slug: 'tirunelveli',
    metaDescription: 'Tirunelveli gold rate today ({date}): 24K & 22K per gram. South Car Street prices, making charges ₹130-360/g. Updated from IBJA.',
    intro: 'Gold rate in Tirunelveli today per gram: 22K & 24K live prices with South Car Street and Palayamkottai trends, charts, and FAQs.',
    introParagraph1: `The gold rate in Tirunelveli is updated daily based on international market rates, USD/INR currency movements, and Tamil Nadu Bullion Association pricing. Tirunelveli, a major city in southern Tamil Nadu, offers competitive gold rates with traditional South Indian jewellery options. These prices exclude making charges (₹130-360/gram) and 3% GST.`,
    introParagraph2: `South Car Street and Palayamkottai are Tirunelveli's main jewellery markets, offering traditional Tamil temple jewellery at competitive prices. The city's proximity to Nagercoil and Kanyakumari makes it a regional gold trading hub. Gold buying peaks during Pongal, Deepavali, and wedding season.`,
    localInfo: [
      { title: 'Hallmarking centers', description: 'Tamil Nadu Hallmarking Center serves Tirunelveli region via Madurai office.' },
      { title: 'Making charges', description: '₹130 – ₹360 per gram for 22K ornaments in South Car Street.' },
      { title: 'Top jewellery hubs', description: 'South Car Street, Palayamkottai, and Town area stores.' },
    ],
    faqTemplates: [
      {
        question: 'What is the gold rate in Tirunelveli today?',
        answerTemplate: `Today's gold rate in Tirunelveli is ₹{perGram24k} per gram for 24K gold and ₹{perGram22k} per gram for 22K gold. Prices are updated daily from Tamil Nadu bullion market.`,
      },
      {
        question: 'Why does Tirunelveli gold rate change daily?',
        answerTemplate: `Tirunelveli gold prices fluctuate based on London spot prices, USD/INR exchange rate, and regional demand during festivals like Pongal and temple occasions.`,
      },
      {
        question: 'How is 22K different from 24K gold?',
        answerTemplate: `24K gold is 99.9% pure (for investment), while 22K gold is 91.6% pure with alloy. Tirunelveli jewellers prefer 22K for traditional South Tamil Nadu temple jewellery and antique designs.`,
      },
      {
        question: 'Does making charge affect final jewellery price?',
        answerTemplate: `Yes, making charges in Tirunelveli range from ₹130-360 per gram - among the lowest in Tamil Nadu. Final price = Gold Rate × Weight + Making Charges + 3% GST.`,
      },
      {
        question: 'Are Tirunelveli gold rates lower than Chennai?',
        answerTemplate: `Yes, Tirunelveli rates are typically ₹40-60 lower than Chennai due to lower overhead costs, making it attractive for buyers from southern Tamil Nadu.`,
      },
      {
        question: 'Which is the best place to buy gold in Tirunelveli?',
        answerTemplate: `South Car Street (main market), Palayamkottai, and Town area. For branded jewellery, visit GRT, Thangamayil, Lalitha, or Kalyan showrooms.`,
      },
    ],
    similarCities: ['Madurai', 'Nagercoil', 'Tuticorin', 'Trichy'],
    relatedCities: [
      { name: 'Madurai', slug: 'madurai' },
      { name: 'Chennai', slug: 'chennai' },
      { name: 'Coimbatore', slug: 'coimbatore' },
    ],
  },

  trichy: {
    name: 'Trichy',
    slug: 'trichy',
    metaDescription: 'Trichy gold rate today ({date}): 24K & 22K per gram. NSB Road prices, making charges ₹140-380/g. Updated from IBJA.',
    intro: 'Gold rate in Trichy today per gram: 22K & 24K live prices with NSB Road and Thillai Nagar trends, charts, and FAQs.',
    introParagraph1: `The gold rate in Trichy (Tiruchirappalli) is updated daily based on international market rates, USD/INR currency movements, and Tamil Nadu Bullion Association pricing. Trichy, home to the famous Rockfort Temple, has a traditional gold market with competitive prices. These prices exclude making charges (₹140-380/gram) and 3% GST.`,
    introParagraph2: `NSB Road (Netaji Subhash Bose Road) and Thillai Nagar are Trichy's main jewellery destinations, offering traditional temple jewellery designs. The city's religious significance drives demand for traditional gold ornaments. Gold buying peaks during temple festivals, Pongal, and wedding season.`,
    localInfo: [
      { title: 'Hallmarking centers', description: 'Tamil Nadu Hallmarking Center (Trichy Branch) and Regional Office.' },
      { title: 'Making charges', description: '₹140 – ₹380 per gram for 22K ornaments in NSB Road.' },
      { title: 'Top jewellery hubs', description: 'NSB Road, Thillai Nagar, and Cantonment area stores.' },
    ],
    faqTemplates: [
      {
        question: 'What is the gold rate in Trichy today?',
        answerTemplate: `Today's gold rate in Trichy is ₹{perGram24k} per gram for 24K gold and ₹{perGram22k} per gram for 22K gold. Prices are updated daily from Tamil Nadu bullion market.`,
      },
      {
        question: 'Why does Trichy gold rate change daily?',
        answerTemplate: `Trichy gold prices fluctuate based on London spot prices, USD/INR exchange rate, and temple festival demand. Religious occasions significantly boost gold buying.`,
      },
      {
        question: 'How is 22K different from 24K gold?',
        answerTemplate: `24K gold is 99.9% pure (for investment), while 22K gold is 91.6% pure with alloy. Trichy jewellers prefer 22K for traditional temple and antique-style jewellery.`,
      },
      {
        question: 'Does making charge affect final jewellery price?',
        answerTemplate: `Yes, making charges in Trichy range from ₹140-380 per gram - lower than Chennai. Final price = Gold Rate × Weight + Making Charges + 3% GST.`,
      },
      {
        question: 'Are Trichy gold rates competitive?',
        answerTemplate: `Yes, Trichy rates are typically ₹30-50 lower than Chennai, making it attractive for buyers from central Tamil Nadu.`,
      },
      {
        question: 'Which is the best place to buy gold in Trichy?',
        answerTemplate: `NSB Road (main market), Thillai Nagar, and Cantonment area. For branded jewellery, visit GRT, Lalitha, or local stores like Saravana and Sri Kumaran.`,
      },
    ],
    similarCities: ['Madurai', 'Chennai', 'Coimbatore', 'Salem'],
    relatedCities: [
      { name: 'Chennai', slug: 'chennai' },
      { name: 'Madurai', slug: 'madurai' },
      { name: 'Coimbatore', slug: 'coimbatore' },
    ],
  },

  vadodara: {
    name: 'Vadodara',
    slug: 'vadodara',
    metaDescription: 'Vadodara gold rate today ({date}): 24K & 22K per gram. Mandvi prices, making charges ₹170-430/g. Updated from IBJA.',
    intro: 'Gold rate in Vadodara today per gram: 22K & 24K live prices with Mandvi and Alkapuri trends, charts, and FAQs.',
    introParagraph1: `The gold rate in Vadodara is updated daily based on international market rates, USD/INR currency movements, and Gujarat Bullion Association pricing. Vadodara, the cultural capital of Gujarat, has a rich tradition of jewellery craftsmanship. These prices exclude making charges (₹170-430/gram) and 3% GST.`,
    introParagraph2: `Mandvi Gate area and Alkapuri are Vadodara's main jewellery destinations, offering traditional Gujarati designs with Gaekwadi royal influence. The city's heritage attracts buyers seeking unique traditional pieces. Gold demand peaks during Navratri, Dhanteras, and wedding season.`,
    localInfo: [
      { title: 'Hallmarking centers', description: 'Gujarat State Hallmarking Center (Vadodara Branch) and Regional Office.' },
      { title: 'Making charges', description: '₹170 – ₹430 per gram for 22K ornaments in Mandvi area.' },
      { title: 'Top jewellery hubs', description: 'Mandvi Gate, Alkapuri, and Fatehgunj stores.' },
    ],
    faqTemplates: [
      {
        question: 'What is the gold rate in Vadodara today?',
        answerTemplate: `Today's gold rate in Vadodara is ₹{perGram24k} per gram for 24K gold and ₹{perGram22k} per gram for 22K gold. Prices are updated daily from Gujarat bullion market.`,
      },
      {
        question: 'Why does Vadodara gold rate change daily?',
        answerTemplate: `Vadodara gold prices fluctuate based on London spot prices, USD/INR exchange rate, and festival demand during Navratri, Dhanteras, and wedding season.`,
      },
      {
        question: 'How is 22K different from 24K gold?',
        answerTemplate: `24K gold is 99.9% pure (for investment), while 22K gold is 91.6% pure with alloy. Vadodara jewellers prefer 22K for traditional Gujarati and Gaekwadi-style designs.`,
      },
      {
        question: 'Does making charge affect final jewellery price?',
        answerTemplate: `Yes, making charges in Vadodara range from ₹170-430 per gram. Heritage designs cost more. Final price = Gold Rate × Weight + Making Charges + 3% GST.`,
      },
      {
        question: 'Are Vadodara gold rates competitive?',
        answerTemplate: `Yes, Vadodara rates are typically within ₹20-30 of Ahmedabad prices, with good variety due to local craftsmanship traditions.`,
      },
      {
        question: 'Which is the best place to buy gold in Vadodara?',
        answerTemplate: `Mandvi Gate (heritage market), Alkapuri, and Fatehgunj. For branded jewellery, visit Tanishq, Kalyan, or local stores like Khodesra and Tribhovandas.`,
      },
    ],
    similarCities: ['Ahmedabad', 'Surat', 'Rajkot', 'Mumbai'],
    relatedCities: [
      { name: 'Ahmedabad', slug: 'ahmedabad' },
      { name: 'Surat', slug: 'surat' },
      { name: 'Mumbai', slug: 'mumbai' },
    ],
  },

  visakhapatnam: {
    name: 'Visakhapatnam',
    slug: 'visakhapatnam',
    metaDescription: 'Vizag gold rate today ({date}): 24K & 22K per gram. Jagadamba prices, making charges ₹160-420/g. Updated from IBJA.',
    intro: 'Gold rate in Visakhapatnam today per gram: 22K & 24K live prices with Jagadamba Junction and Dwaraka Nagar trends, charts, and FAQs.',
    introParagraph1: `The gold rate in Visakhapatnam (Vizag) is updated daily based on international market rates, USD/INR currency movements, and Andhra Pradesh Bullion Association pricing. Vizag, the largest city in Andhra Pradesh, has a growing gold market with competitive prices. These prices exclude making charges (₹160-420/gram) and 3% GST.`,
    introParagraph2: `Jagadamba Junction and Dwaraka Nagar are Visakhapatnam's main jewellery destinations, offering traditional Telugu designs and modern styles. The city's port-based economy and growing IT sector drive steady gold demand. Gold buying peaks during Ugadi, Sankranti, and wedding season.`,
    localInfo: [
      { title: 'Hallmarking centers', description: 'Andhra Pradesh Hallmarking Center (Vizag Branch) and Regional Office.' },
      { title: 'Making charges', description: '₹160 – ₹420 per gram for 22K ornaments in Jagadamba Junction.' },
      { title: 'Top jewellery hubs', description: 'Jagadamba Junction, Dwaraka Nagar, and CMR Central stores.' },
    ],
    faqTemplates: [
      {
        question: 'What is the gold rate in Visakhapatnam today?',
        answerTemplate: `Today's gold rate in Visakhapatnam is ₹{perGram24k} per gram for 24K gold and ₹{perGram22k} per gram for 22K gold. Prices are updated daily from Andhra Pradesh bullion market.`,
      },
      {
        question: 'Why does Visakhapatnam gold rate change daily?',
        answerTemplate: `Visakhapatnam gold prices fluctuate based on London spot prices, USD/INR exchange rate, and regional demand during Telugu festivals like Ugadi and Sankranti.`,
      },
      {
        question: 'How is 22K different from 24K gold?',
        answerTemplate: `24K gold is 99.9% pure (for investment), while 22K gold is 91.6% pure with alloy. Vizag jewellers prefer 22K for traditional Andhra temple jewellery designs.`,
      },
      {
        question: 'Does making charge affect final jewellery price?',
        answerTemplate: `Yes, making charges in Visakhapatnam range from ₹160-420 per gram. Final price = Gold Rate × Weight + Making Charges + 3% GST.`,
      },
      {
        question: 'Are Visakhapatnam gold rates similar to Hyderabad?',
        answerTemplate: `Yes, Vizag rates are typically within ₹20-40 of Hyderabad prices, making it convenient for North Andhra residents.`,
      },
      {
        question: 'Which is the best place to buy gold in Visakhapatnam?',
        answerTemplate: `Jagadamba Junction (main market), Dwaraka Nagar, and CMR Central. For branded jewellery, visit Tanishq, Kalyan, or local stores like Manepally and GRT.`,
      },
    ],
    similarCities: ['Vijayawada', 'Hyderabad', 'Chennai', 'Bhubaneswar'],
    relatedCities: [
      { name: 'Vijayawada', slug: 'vijayawada' },
      { name: 'Hyderabad', slug: 'hyderabad' },
      { name: 'Chennai', slug: 'chennai' },
    ],
  },
};

// Get config by slug
export function getCityGoldConfig(slug: string): CityGoldConfig | undefined {
  return CITY_GOLD_CONFIGS[slug.toLowerCase()];
}

// Get all city slugs
export function getAllCitySlugs(): string[] {
  return Object.keys(CITY_GOLD_CONFIGS);
}

