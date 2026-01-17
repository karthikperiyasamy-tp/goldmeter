/**
 * Jeweller-specific configuration for jeweller directory pages
 * Contains unique SEO content, FAQs, and information for each jeweller
 */

export type JewellerType = 'national' | 'regional';
export type Region = 'north' | 'south' | 'east' | 'west' | 'pan-india';

export interface JewellerFAQ {
  question: string;
  answer: string;
}

export interface JewellerConfig {
  name: string;
  slug: string;
  type: JewellerType;
  headquarters: string;
  foundedYear: number;
  makingChargesRange: string;
  makingChargesMin: number; // For sorting/filtering
  makingChargesMax: number;
  purityStandards: string;
  popularCollections: string[];
  exchangePolicy: string;
  regions: Region[];
  cityLinks: { name: string; slug: string }[];
  description: string;
  highlights: string[];
  faqs: JewellerFAQ[];
  website?: string;
}

export const JEWELLER_CONFIGS: Record<string, JewellerConfig> = {
  tanishq: {
    name: 'Tanishq',
    slug: 'tanishq',
    type: 'national',
    headquarters: 'Bangalore, Karnataka',
    foundedYear: 1994,
    makingChargesRange: '₹350 - ₹800 per gram',
    makingChargesMin: 350,
    makingChargesMax: 800,
    purityStandards: 'All Tanishq jewellery is BIS hallmarked with 916 (22K) or 999 (24K) purity. They pioneered Karatmeter technology for instant purity verification in front of customers. Diamonds are certified by international labs (IGI, GIA).',
    popularCollections: ['Divyam', 'Rivaah (Bridal)', 'Mia by Tanishq', 'CaratLane', 'Zoya (Luxury)', 'Aveer (Men)', 'Mirayah', 'Shubham'],
    exchangePolicy: 'Tanishq offers lifetime exchange with full gold value for Tanishq jewellery. Old gold from any jeweller accepted at prevailing rates minus 2% deduction for impurity testing. Exchange bonus during special promotions.',
    regions: ['pan-india'],
    cityLinks: [
      { name: 'Chennai', slug: 'chennai' },
      { name: 'Mumbai', slug: 'mumbai' },
      { name: 'Bangalore', slug: 'bangalore' },
      { name: 'Delhi', slug: 'delhi' },
      { name: 'Hyderabad', slug: 'hyderabad' },
      { name: 'Kolkata', slug: 'kolkata' },
      { name: 'Pune', slug: 'pune' },
      { name: 'Ahmedabad', slug: 'ahmedabad' },
    ],
    description: `Tanishq, a flagship brand of Titan Company Limited (a Tata Group enterprise), stands as India's most trusted and largest jewellery retail brand. Founded in 1994, Tanishq revolutionized the Indian jewellery industry by introducing unprecedented transparency in pricing, certified purity verification, and standardized making charges - practices that were virtually unheard of in the traditional gold market. The brand has since grown to become synonymous with trust, quality, and innovation in the Indian jewellery sector.

The brand's name combines two Sanskrit words: "Tan" (body) and "Nishq" (gold ornament), symbolizing the intimate relationship between a person and their jewellery. This philosophy drives Tanishq's commitment to creating pieces that are not just ornaments but expressions of personal identity and cultural heritage. Every Tanishq design is crafted to celebrate the beauty and aspirations of the wearer.

With over 410 stores across 240+ cities in India, Tanishq has achieved remarkable pan-India presence that no other jeweller has matched. From metropolitan flagships in Mumbai's Linking Road and Delhi's South Extension to stores in tier-2 and tier-3 cities like Hubli, Guntur, and Siliguri, the brand ensures accessibility without compromising on the premium experience. Each store maintains consistent quality and service standards, so customers can expect the same experience whether they shop in Bangalore or Bhopal. The stores feature elegant interiors with dedicated sections for different collections, private consultation areas for bridal shopping, and trained staff who understand both traditional and contemporary jewellery needs.

Tanishq's most significant contribution to the industry is the Karatmeter technology - a revolutionary device that tests gold purity instantly in front of customers. Before Tanishq, buyers had no reliable way to verify purity claims, and the industry was rife with adulteration concerns. The Karatmeter created a new paradigm of trust, enabling customers to see exactly what they were buying. This innovation alone transformed how Indians purchase gold and forced the entire industry to adopt more transparent practices. Every Tanishq store has Karatmeter machines available for customer use, even for testing old gold brought for exchange.

The brand's product portfolio spans multiple collections catering to diverse preferences, occasions, and regional traditions. Rivaah is their celebrated bridal collection featuring region-specific designs for Bengali, Maharashtrian, Tamil, Punjabi, Gujarati, Rajasthani, and other Indian weddings - understanding that bridal jewellery varies significantly across India's diverse communities. Divyam offers divine temple-inspired pieces featuring traditional motifs of Lakshmi, Ganesha, and other deities. Mia by Tanishq targets young working women with contemporary, lightweight, everyday jewellery priced affordably for the urban millennial. Zoya represents the luxury segment with high-end diamond creations for discerning customers who seek exclusivity. Aveer caters to men's jewellery needs with masculine designs in gold and platinum. Shubham offers collections for religious and auspicious occasions. CaratLane, their subsidiary acquired in 2016, provides affordable diamond jewellery through an online-first approach.

Making charges at Tanishq typically range from ₹350 to ₹800 per gram, which is noticeably higher than regional jewellers. However, this premium includes the Tata Group's brand assurance (a 150+ year legacy of trust), pioneering purity verification technology, exceptional design quality created by skilled craftsmen, consistent service across 400+ stores in India, and a reliable lifetime exchange policy that works anywhere in the country. For customers prioritizing peace of mind over cost optimization, Tanishq delivers unmatched value. The premium is essentially insurance against the uncertainties of the traditional jewellery market.

Tanishq's exchange policy is industry-leading and sets the benchmark for organized jewellery retail. They accept old gold from any jeweller (not just Tanishq), applying current gold rates with only a 2% deduction for impurity testing - one of the lowest deductions in the industry. Tanishq jewellery itself can be exchanged at full gold value at any store nationwide, providing complete flexibility for customers who relocate or travel. During special promotions like Akshaya Tritiya and Dhanteras, they often offer exchange bonuses that further enhance value.

The brand has embraced digital transformation comprehensively with a robust e-commerce platform (tanishq.co.in) featuring thousands of designs, virtual try-on features using augmented reality, video calling consultations with jewellery experts, and an extensive online catalog with zoom and 360-degree views. Customers can reserve items online and pick up in-store, or have jewellery delivered with easy return options. Their mobile app provides personalized recommendations and exclusive app-only offers.

The Golden Harvest savings scheme is Tanishq's popular monthly deposit program where customers deposit a fixed amount for 11 months and receive bonus value (typically 75% of one month's payment) in the 12th month. This accumulated amount can be used to purchase any Tanishq jewellery. The scheme helps customers systematically save for major purchases like wedding jewellery while earning additional benefits - essentially a gold-backed savings plan.

Tanishq's marketing and advertising have been equally revolutionary, featuring campaigns that celebrate Indian women and cultural traditions while thoughtfully challenging societal norms. Their advertisements often go viral for addressing themes of women's empowerment, second marriages, inter-faith harmony, and diverse definitions of beauty. The brand has consistently positioned itself as progressive while respecting Indian values, creating deep emotional connections with customers.

As part of Titan Company (India's largest watchmaker with brands like Fastrack, Sonata, and Titan Eye+) and the broader Tata Group (one of the world's most respected conglomerates with over 150 years of history), Tanishq benefits from exceptional corporate governance, ethical sourcing practices, supply chain excellence, and long-term vision that prioritizes customer trust over short-term profits. This institutional backing is unmatched in the Indian jewellery industry.`,
    highlights: [
      'Part of Tata Group - India\'s most trusted conglomerate',
      'Pioneered Karatmeter technology for instant purity verification',
      '410+ stores across 240+ Indian cities - largest pan-India network',
      'Lifetime exchange policy with full gold value',
      'BIS hallmarked with certified purity - every piece verified',
      'Multiple collections: Rivaah (Bridal), Mia (Workwear), Zoya (Luxury)',
      'Golden Harvest savings scheme with bonus benefits',
      'CaratLane subsidiary for affordable diamond jewellery',
    ],
    faqs: [
      {
        question: 'What are Tanishq making charges per gram?',
        answer: 'Tanishq making charges range from ₹350 to ₹800 per gram depending on design complexity. Simple chains and daily wear cost ₹350-450/gram, regular wedding jewellery ₹500-650/gram, and intricate bridal sets with detailed craftsmanship go up to ₹800/gram. Making charges are calculated on net gold weight only.',
      },
      {
        question: 'Does Tanishq buy back old gold?',
        answer: 'Yes, Tanishq has a lifetime buyback and exchange policy. They repurchase Tanishq jewellery at full prevailing gold rates at any store. Old gold from other jewellers is also accepted with a 2% deduction for impurity testing. This is one of the most generous exchange policies in the industry.',
      },
      {
        question: 'Is Tanishq gold 100% pure and how can I verify?',
        answer: 'Tanishq sells BIS hallmarked gold in 22K (91.6% pure) and 24K (99.9% pure) varieties. All pieces come with a purity certificate. Uniquely, Tanishq stores have Karatmeter machines that can instantly verify purity in front of you - a technology they pioneered in India.',
      },
      {
        question: 'Which is cheaper - Tanishq or local jewellers?',
        answer: 'Local jewellers typically have lower making charges (₹150-300/gram) compared to Tanishq (₹350-800/gram). However, Tanishq offers certified purity (verifiable via Karatmeter), Tata Group backing, transparent billing, consistent quality across 400+ stores, and reliable nationwide exchange policies. Many customers find this premium worthwhile.',
      },
      {
        question: 'What is Tanishq Golden Harvest scheme?',
        answer: 'Golden Harvest is Tanishq\'s monthly savings scheme where customers deposit a fixed amount for 11 months. In the 12th month, they receive bonus value (typically 75% of one month\'s payment) which can be used to purchase any Tanishq jewellery. It helps customers plan for major purchases like weddings.',
      },
      {
        question: 'Is Tanishq jewellery available online?',
        answer: 'Yes, Tanishq has comprehensive online shopping at tanishq.co.in with thousands of designs. They offer try-at-home services, video consultations, easy returns, and nationwide delivery. CaratLane, their subsidiary, specializes in online diamond jewellery purchases.',
      },
      {
        question: 'Why is Tanishq more expensive than other jewellers?',
        answer: 'Tanishq\'s premium pricing reflects Tata Group\'s brand assurance, pioneering purity verification technology, exceptional design quality, consistent service across 410+ stores, lifetime exchange policy, and ethical sourcing practices. You pay more for peace of mind and reliability that regional jewellers may not offer.',
      },
    ],
    website: 'https://www.tanishq.co.in',
  },

  'kalyan-jewellers': {
    name: 'Kalyan Jewellers',
    slug: 'kalyan-jewellers',
    type: 'national',
    headquarters: 'Thrissur, Kerala',
    foundedYear: 1993,
    makingChargesRange: '₹250 - ₹600 per gram',
    makingChargesMin: 250,
    makingChargesMax: 600,
    purityStandards: 'All Kalyan jewellery is BIS hallmarked with 4-level purity certification: Certificate of Authenticity, Purity Tag, Invoice Details, and Kalyan Trust Seal. Diamonds are SGL (Swiss Gemological Laboratory) certified for quality assurance.',
    popularCollections: ['Mudhra (Antique)', 'Tejasvi (Diamond)', 'Nimah (Temple)', 'Candere (Online)', 'Sankalp (Wedding)', 'Glo (Daily Wear)', 'Rang (Colorstone)', 'Ziah (Solitaires)'],
    exchangePolicy: 'Kalyan offers 100% exchange value for their own jewellery at any store in India or Middle East. Old gold from other jewellers accepted at market rate with standard purity testing and deductions.',
    regions: ['pan-india'],
    cityLinks: [
      { name: 'Chennai', slug: 'chennai' },
      { name: 'Mumbai', slug: 'mumbai' },
      { name: 'Hyderabad', slug: 'hyderabad' },
      { name: 'Kochi', slug: 'kochi' },
      { name: 'Bangalore', slug: 'bangalore' },
      { name: 'Delhi', slug: 'delhi' },
      { name: 'Pune', slug: 'pune' },
      { name: 'Coimbatore', slug: 'coimbatore' },
    ],
    description: `Kalyan Jewellers, founded by T.S. Kalyanaraman in 1993, has transformed from a single store in Thrissur, Kerala into one of India's largest and most recognized jewellery retail chains. With over 180+ showrooms spanning India and the Middle East, Kalyan represents the successful scaling of a family business into a publicly traded multinational enterprise. The brand has become a household name across India, known for its perfect balance of quality, trust, and competitive pricing.

The brand's origin story is deeply rooted in Kerala's gold culture, where jewellery is not merely ornamental but an integral part of cultural identity, wedding traditions, and financial security. Kerala has one of the highest per capita gold consumption rates in the world, and understanding this cultural context was key to Kalyan's founding vision. T.S. Kalyanaraman, coming from a family of jewellers with generations of experience, envisioned creating a brand that would bring organized retail practices, transparent pricing, and certified purity to the jewellery sector while maintaining the warmth and personalized service of traditional family jewellers.

Kalyan Jewellers achieved a major milestone when it went public on the National Stock Exchange (NSE: KALYANKJIL) in March 2021, raising over ₹1,175 crores in one of the most successful jewellery sector IPOs in India. This IPO reflected strong market confidence in the brand's business model, governance standards, and growth trajectory. The publicly listed status brings transparency in financial reporting, quarterly disclosures, and regulatory oversight - giving customers additional assurance about the company's practices. The stock performance since listing has demonstrated continued investor confidence.

The brand's pan-India expansion has been strategic and comprehensive, establishing strong presence not just in its home territory of South India but systematically expanding across North, East, and West India. Key markets include Kerala (where they remain market leaders), Tamil Nadu, Karnataka, Andhra Pradesh, Telangana, Maharashtra, Gujarat, Delhi NCR, Uttar Pradesh, Bihar, and West Bengal. Their Middle East operations spanning UAE, Kuwait, Qatar, and Oman cater to the large Indian expatriate population and have become significant revenue contributors, accounting for over 25% of total revenue. The ability to serve Indian customers whether they're in Cochin or Dubai has been a key differentiator.

Celebrity endorsements have played a crucial role in Kalyan's brand building and national recognition. Bollywood megastar Amitabh Bachchan as brand ambassador has given the brand pan-India credibility and trust - his image as a trustworthy figure resonates with Kalyan's brand values. Other celebrity faces including Katrina Kaif, Malaika Arora, Janhvi Kapoor, and South Indian stars like Samantha, Kalyani Priyadarshan, and Pooja Hegde have helped the brand connect with diverse customer segments across regions and age groups. Regional celebrity associations ensure local relevance while national figures provide broad appeal.

Kalyan's product portfolio is designed to serve every occasion, preference, and regional tradition. The Mudhra collection offers stunning antique gold designs with traditional craftsmanship that appeals to customers seeking heritage aesthetics. Nimah features temple jewellery inspired by South Indian temple architecture and divine motifs - perfect for traditional ceremonies. Tejasvi showcases contemporary diamond creations for modern celebrations. Sankalp caters to wedding jewellery needs across different regional styles, understanding that a Tamil bride's requirements differ significantly from a Punjabi or Bengali bride. Glo targets daily wear with lightweight, affordable pieces for working professionals. Rang features colorful gemstone jewellery, while Ziah offers premium solitaire diamonds for those seeking luxury pieces.

Making charges at Kalyan range from ₹250 to ₹600 per gram, positioning the brand competitively between premium national chains like Tanishq and smaller regional jewellers. This sweet spot allows them to offer quality assurance, certified purity, organized retail benefits, and pan-India exchange without the highest price premiums. For a 50-gram bridal necklace, this could mean savings of ₹5,000-10,000 compared to premium-priced chains while still enjoying branded retail benefits.

Kalyan's 4-level purity certification system is a significant differentiator that builds customer confidence. Every piece comes with: (1) Certificate of Authenticity documenting the purchase, (2) Purity Tag physically attached to the jewellery, (3) detailed Invoice with complete specifications, and (4) the Kalyan Trust Seal as the final assurance. This comprehensive documentation ensures customers have complete transparency about their purchase and facilitates smooth exchanges in the future.

Candere, Kalyan's online jewellery platform acquired in 2017, represents their digital transformation strategy. Originally founded as an independent startup, Candere was acquired to accelerate Kalyan's e-commerce growth. The platform specializes in lightweight everyday jewellery with doorstep delivery across India, virtual try-on using augmented reality, easy 30-day returns, and designs specifically created for online purchase. Candere has become one of India's leading online jewellery destinations, particularly popular for gifting and everyday diamond jewellery.

Kalyan Gold Savings Scheme (KGSS) allows customers to deposit monthly amounts (starting from ₹1,000) for 11 months and receive bonus value equivalent to one month's deposit when making purchases. This scheme has made expensive wedding jewellery more accessible to middle-class families by enabling systematic savings over 1-2 years before weddings. The scheme locks in gold value based on purchase date, protecting customers from price increases during the saving period.

The company maintains state-of-the-art manufacturing facilities with over 4,000 craftsmen producing a significant portion of their jewellery in-house. This vertical integration ensures quality control from design to delivery and allows rapid response to market trends. Their design team creates thousands of new designs annually, blending traditional aesthetics with contemporary sensibilities while ensuring pieces are practical for Indian wear and occasions.`,
    highlights: [
      'Publicly listed on NSE (KALYANKJIL) - ₹1,175 Cr IPO in 2021',
      '180+ showrooms across India and Middle East (UAE, Kuwait, Qatar, Oman)',
      '4-level purity certification with Trust Seal guarantee',
      'Celebrity brand ambassadors: Amitabh Bachchan, Katrina Kaif',
      'Candere online platform for affordable everyday jewellery',
      'Strong in South Indian traditional designs and temple jewellery',
      'Kalyan Gold Savings Scheme (KGSS) for planned purchases',
      'SGL-certified diamonds with international quality standards',
    ],
    faqs: [
      {
        question: 'What are Kalyan Jewellers making charges per gram?',
        answer: 'Kalyan Jewellers making charges range from ₹250 to ₹600 per gram. Plain gold chains and bangles start from ₹250-300/gram, regular jewellery ₹350-450/gram, and elaborate designer or bridal pieces up to ₹600/gram. Making charges are calculated on net gold weight.',
      },
      {
        question: 'Is Kalyan Jewellers gold genuine and BIS hallmarked?',
        answer: 'Yes, all Kalyan gold is BIS hallmarked with their unique 4-level purity certification: Certificate of Authenticity, Purity Tag on each piece, detailed Invoice, and Kalyan Trust Seal. They offer both 22K (916) and 24K gold with documented purity.',
      },
      {
        question: 'Can I exchange old gold at Kalyan Jewellers?',
        answer: 'Yes, Kalyan accepts old gold exchange at all stores. Kalyan jewellery gets 100% gold value exchange. Gold from other jewellers is evaluated through purity testing with standard deductions (typically 2-4% for impurities). Exchange is valid across India and Middle East stores.',
      },
      {
        question: 'Does Kalyan Jewellers offer EMI and financing options?',
        answer: 'Yes, Kalyan offers multiple financing options: EMI through partner banks, Kalyan Gold Savings Scheme (KGSS) for monthly deposits, credit card EMI conversion, and special festive financing. KGSS is particularly popular for planning wedding jewellery purchases.',
      },
      {
        question: 'What is Candere by Kalyan Jewellers?',
        answer: 'Candere is Kalyan\'s online jewellery platform specializing in lightweight everyday jewellery. It offers virtual try-on, doorstep delivery across India, easy returns, and designs specifically created for online purchase. It\'s ideal for daily wear and gifting.',
      },
      {
        question: 'Is Kalyan Jewellers cheaper than Tanishq?',
        answer: 'Generally yes - Kalyan\'s making charges (₹250-600/gram) are lower than Tanishq (₹350-800/gram). Both are BIS hallmarked with certified purity. Kalyan offers good value with its 4-level certification and extensive network while being more competitively priced.',
      },
      {
        question: 'Where are Kalyan Jewellers showrooms located?',
        answer: 'Kalyan has 180+ showrooms across India (Kerala, Tamil Nadu, Karnataka, Andhra Pradesh, Maharashtra, Delhi NCR, and other states) and Middle East (UAE, Kuwait, Qatar, Oman). They have strong presence in both metros and tier-2 cities.',
      },
    ],
    website: 'https://www.kalyanjewellers.net',
  },

  'malabar-gold': {
    name: 'Malabar Gold & Diamonds',
    slug: 'malabar-gold',
    type: 'national',
    headquarters: 'Kozhikode, Kerala',
    foundedYear: 1993,
    makingChargesRange: '₹200 - ₹550 per gram',
    makingChargesMin: 200,
    makingChargesMax: 550,
    purityStandards: 'BIS hallmarked with proprietary MGD Assured certification guaranteeing purity, weight accuracy, and fair pricing. Diamonds are IGI/GIA certified. The brand has never compromised on purity across 30+ years.',
    popularCollections: ['Mine (Diamonds)', 'Era (Antique)', 'Precia (Gemstones)', 'Divine (Temple)', 'Starlet (Kids)', 'Ethnix (Traditional)', 'Quorra (Contemporary)', 'Quorra Men', 'Quorra Gems'],
    exchangePolicy: 'Lifetime free maintenance and 100% exchange value for Malabar jewellery at any store worldwide. Old gold accepted with market-rate evaluation. Exchange valid across all 10 countries of operation.',
    regions: ['pan-india'],
    cityLinks: [
      { name: 'Chennai', slug: 'chennai' },
      { name: 'Mumbai', slug: 'mumbai' },
      { name: 'Hyderabad', slug: 'hyderabad' },
      { name: 'Kochi', slug: 'kochi' },
      { name: 'Bangalore', slug: 'bangalore' },
      { name: 'Delhi', slug: 'delhi' },
      { name: 'Pune', slug: 'pune' },
      { name: 'Coimbatore', slug: 'coimbatore' },
    ],
    description: `Malabar Gold & Diamonds, established in 1993 by M.P. Ahammed in Kozhikode, Kerala, has grown into one of the world's largest jewellery retailers with over 350+ showrooms spanning 13 countries across 5 continents. This remarkable transformation from a single store in a small Kerala city to a global jewellery empire with operations in India, Middle East, Southeast Asia, North America, Europe, and Australia represents one of India's most successful retail expansion stories and a testament to the founder's vision and execution.

The brand's founding philosophy centered on two unshakeable principles that Mr. Ahammed established from day one: absolute purity in gold with zero compromise, and transparent dealings with every customer regardless of their purchase size. These values, now embodied in the MGD Assured certification program, have remained constant even as the business scaled from one store to 350+ globally. Every piece of Malabar jewellery comes with the MGD Assured guarantee - promising accurate weight (verified in customer's presence on certified scales), certified purity (BIS hallmarked with HUID), transparent pricing (no hidden charges), and 100% lifetime exchange value at any store worldwide.

Malabar's international presence is particularly notable and unmatched among Indian jewellery retailers. Beyond their strong India network, they operate showrooms in the United Arab Emirates (their largest international market with stores in Dubai, Abu Dhabi, Sharjah, Ajman), Saudi Arabia (Riyadh, Jeddah, Dammam), Kuwait, Qatar, Bahrain, Oman, Malaysia (Kuala Lumpur, Penang), Singapore, USA (New Jersey, Texas, Illinois), UK (London), Canada (Toronto), and Australia (Sydney, Melbourne). This global network serves the substantial Indian diaspora who prefer trusted Indian jewellery brands for weddings, festivals, and celebrations abroad. The ability to buy in India during a visit and exchange at a store near your home in Dubai, London, or New Jersey adds exceptional convenience for NRI families.

The product portfolio at Malabar is thoughtfully designed to serve diverse tastes across regions, age groups, and occasions. Mine is their premium diamond jewellery line featuring internationally certified stones (IGI/GIA certified), contemporary designs, and solitaire collections. Era showcases antique gold designs with traditional craftsmanship that appeals to customers seeking vintage aesthetics. Divine offers temple-inspired religious jewellery with deities, sacred symbols, and traditional South Indian motifs. Precia features colorful gemstone creations with rubies, emeralds, sapphires, and semi-precious stones. Starlet caters to children with safe, age-appropriate, playful designs for naming ceremonies, birthdays, and festivals. Ethnix celebrates regional Indian jewellery traditions with designs specific to different communities. Quorra represents contemporary minimalist aesthetics for young professionals seeking everyday elegance. The variety ensures every customer finds something suited to their style and occasion.

Making charges at Malabar range from ₹200 to ₹550 per gram - positioning them as one of the most competitive among national chains with pan-India presence. This aggressive pricing strategy, combined with quality assurance and international exchange flexibility, has made them particularly popular for wedding jewellery purchases where customers buy significant quantities (often 50-200 grams). For a bridal trousseau of 100 grams, the making charge savings compared to premium chains could be ₹15,000-25,000.

Malabar's manufacturing capabilities are world-class, with large-scale facilities in India producing millions of pieces annually. They employ over 4,000 skilled craftsmen specializing in various techniques from traditional Kerala workmanship to modern machine-assisted manufacturing. Their design team creates fresh collections for each season and festival, balancing traditional aesthetics with contemporary trends while ensuring pieces are wearable and practical. Strict quality control processes ensure consistency across their vast store network - a customer in Australia receives the same quality as one in Kozhikode.

The brand has invested significantly in digital transformation with their e-commerce platform (malabargoldanddiamonds.com) offering an extensive catalog of thousands of designs with delivery across India and select international locations. Virtual try-on features using augmented reality, video consultations with jewellery experts, detailed product videos with 360-degree views, and secure payment options help online customers make informed decisions. Their mobile app provides personalized recommendations and exclusive offers.

Malabar Gold & Diamonds also operates dedicated boutique formats: Mine stores exclusively for premium diamond jewellery in upscale locations, and Quorra stores focusing on contemporary designs for young professionals. These specialized formats provide focused shopping experiences for customers with specific preferences who want a curated selection rather than browsing extensive collections.

The company's CSR initiatives under the M.P. Ahammed Foundation include substantial contributions to education (schools, scholarships), healthcare (hospitals, medical camps), housing for economically weaker sections, and community development across the regions where they operate. M.P. Ahammed is personally known for philanthropic work and simple living despite the business's success, and the organization reflects these values in its culture.

Malabar's loyalty programs reward repeat customers with exclusive benefits, early access to new collections, and special pricing. Their gold savings schemes enable systematic purchase planning with monthly deposits and bonus benefits. Free lifetime maintenance including professional cleaning, polishing, and minor repairs ensures jewellery remains beautiful for generations - available at any of their 350+ stores worldwide.

With employee count exceeding 18,000 globally and revenues consistently among the highest in the Indian jewellery retail sector, Malabar Gold & Diamonds has proven that a Kerala family business can achieve truly global scale while maintaining its founding values of uncompromising quality and customer trust. The brand continues to expand, with new markets and store formats regularly being added to their growing network.`,
    highlights: [
      '350+ showrooms across 13 countries and 5 continents - truly global',
      'MGD Assured certification - purity, weight, price guarantee',
      'Competitive making charges (₹200-550/gram) among national chains',
      'Strong Middle East presence ideal for NRI customers',
      'Free lifetime maintenance on all purchases',
      'Collections: Mine (Diamonds), Era (Antique), Divine (Temple), Starlet (Kids)',
      '18,000+ employees worldwide with consistent quality',
      'Cross-country exchange valid at any global store',
    ],
    faqs: [
      {
        question: 'What are Malabar Gold making charges per gram?',
        answer: 'Malabar Gold making charges range from ₹200 to ₹550 per gram - among the most competitive for national chains. Plain chains and simple bangles start from ₹200-250/gram, regular jewellery ₹300-400/gram, and elaborate bridal pieces up to ₹550/gram.',
      },
      {
        question: 'Is Malabar Gold cheaper than Tanishq and Kalyan?',
        answer: 'Generally yes - Malabar has lower making charges (₹200-550/gram) compared to Tanishq (₹350-800/gram). They\'re comparable to Kalyan (₹250-600/gram) but often slightly lower. Gold rates are similar across all, so making charges drive the price difference.',
      },
      {
        question: 'Where does Malabar Gold have stores globally?',
        answer: 'Malabar Gold has 350+ stores across 13 countries: India (majority), UAE, Saudi Arabia, Kuwait, Qatar, Bahrain, Oman, Malaysia, Singapore, USA, UK, Canada, and Australia. Their Middle East presence is particularly strong.',
      },
      {
        question: 'What is MGD Assured certification?',
        answer: 'MGD Assured is Malabar\'s proprietary quality guarantee covering: accurate gold weight (verified in your presence), certified purity (BIS hallmarked), transparent pricing (no hidden charges), and 100% exchange value for life. It\'s their promise of integrity.',
      },
      {
        question: 'Can I exchange Malabar jewellery at any country?',
        answer: 'Yes, Malabar offers global exchange - you can buy in India and exchange at any of their 350+ stores across 13 countries. This is particularly useful for NRI customers who travel frequently between India and Gulf countries.',
      },
      {
        question: 'Does Malabar Gold offer free maintenance?',
        answer: 'Yes, Malabar provides free lifetime maintenance including cleaning, polishing, and minor repairs at any store worldwide. This service ensures your jewellery remains beautiful for generations without additional cost.',
      },
      {
        question: 'Is Malabar Gold good for wedding jewellery?',
        answer: 'Excellent - Malabar\'s competitive making charges, wide variety (traditional to contemporary), BIS hallmarked quality, and reliable exchange policy make them a popular choice for wedding jewellery. Their global presence is bonus for NRI weddings.',
      },
    ],
    website: 'https://www.malabargoldanddiamonds.com',
  },

  joyalukkas: {
    name: 'Joyalukkas',
    slug: 'joyalukkas',
    type: 'national',
    headquarters: 'Thrissur, Kerala',
    foundedYear: 1987,
    makingChargesRange: '₹280 - ₹650 per gram',
    makingChargesMin: 280,
    makingChargesMax: 650,
    purityStandards: 'BIS hallmarked with Joyalukkas Guarantee Card certifying purity, weight, and making charges. Diamonds are certified by international labs (IGI, GIA). 37+ years of trust with zero compromise on purity.',
    popularCollections: ['Veda (Temple)', 'Apurva (Antique)', 'Pride (Diamonds)', 'Eleganza (Italian)', 'Zenina (Arabian)', 'Ratna (Precious Stones)', 'Masaaki (Platinum)', 'Li\'l Joy (Kids)'],
    exchangePolicy: '100% gold value exchange for Joyalukkas jewellery at any store across 11 countries worldwide. Old gold from other jewellers accepted with standard purity testing. Global exchange is their signature advantage.',
    regions: ['pan-india'],
    cityLinks: [
      { name: 'Chennai', slug: 'chennai' },
      { name: 'Mumbai', slug: 'mumbai' },
      { name: 'Hyderabad', slug: 'hyderabad' },
      { name: 'Kochi', slug: 'kochi' },
      { name: 'Bangalore', slug: 'bangalore' },
      { name: 'Coimbatore', slug: 'coimbatore' },
      { name: 'Delhi', slug: 'delhi' },
      { name: 'Pune', slug: 'pune' },
    ],
    description: `Joyalukkas, founded by Joy Alukkas in 1987, began as a small jewellery shop in Abu Dhabi, United Arab Emirates, and has transformed into one of the world's largest and most trusted jewellery retail chains. With over 160+ opulent showrooms across 11 countries spanning Asia, Middle East, Europe, and North America, Joyalukkas has achieved truly global scale while maintaining its commitment to quality and trust.

The founder's journey from a modest beginning in the Gulf to creating a multinational jewellery empire is inspirational. Joy Alukkas started by serving the Indian expatriate community in UAE, understanding their need for trusted Indian jewellery abroad. This NRI-first approach became the foundation for the brand's international expansion strategy.

Joyalukkas showrooms are renowned for their award-winning architecture and luxurious ambiance. The brand has won multiple international retail awards for store design, creating shopping experiences that match or exceed the finest luxury retail worldwide. From opulent Dubai stores to elegant showrooms in London and New York, each location maintains consistent standards of grandeur.

The brand's international presence is unmatched among Indian jewellers. Beyond India, Joyalukkas operates in UAE, UK, USA, Saudi Arabia, Kuwait, Qatar, Bahrain, Oman, Singapore, and Malaysia. This enables their signature proposition: buy anywhere, exchange anywhere. Customers purchasing jewellery in India can exchange it at full gold value at any Joyalukkas store globally - a feature particularly valuable for NRIs and frequent travelers.

Joyalukkas' product portfolio spans every category imaginable. Veda collection features divine temple-inspired designs. Apurva showcases antique gold with traditional craftsmanship. Pride represents their premium diamond offerings. Eleganza brings Italian design sensibilities. Zenina celebrates Arabian aesthetics. Ratna features precious and semi-precious gemstones. Masaaki is their platinum collection. Li'l Joy caters to children with safe, playful designs.

Making charges range from ₹280 to ₹650 per gram, placing them competitively among premium national chains. The pricing reflects their brand positioning as accessible luxury - quality and ambiance comparable to the finest jewellers but without extreme premiums.

The Joyalukkas Guarantee Card accompanies every purchase, certifying purity, exact weight, making charges, and stone details. This documentation provides complete transparency and enables smooth exchange transactions at any store worldwide.

Joyalukkas Easy Buy is their popular savings scheme where customers make monthly deposits (starting ₹1,000) for 11 months and receive the 12th month free as bonus. This accumulated amount plus bonus can be used to purchase any jewellery, making significant purchases more accessible.

The brand maintains in-house design teams and manufacturing facilities ensuring quality control and design freshness. New collections are launched regularly to capture seasonal trends and cultural occasions. Their designers balance traditional aesthetics with contemporary sensibilities.

Celebrity endorsements feature prominent Bollywood and regional film stars, building brand recognition across diverse customer segments. The marketing emphasizes trust, quality, and the unique global exchange proposition.

Joyalukkas also offers comprehensive after-sales services including cleaning, maintenance, and repairs at any store. Their customer service extends across time zones given their global presence, ensuring support whenever customers need it.

With an employee count exceeding 8,000 globally, Joyalukkas has created significant employment while maintaining the service standards that define their brand. The company continues to expand, with new markets and formats regularly being added to their global network.`,
    highlights: [
      '160+ showrooms across 11 countries - India, UAE, UK, USA, Singapore & more',
      'Global exchange: buy anywhere, exchange at any store worldwide',
      'Award-winning showroom designs - luxury retail experience',
      '37+ years of heritage with zero compromise on purity',
      'Joyalukkas Guarantee Card certifying all purchase details',
      'Easy Buy savings scheme: 11 months deposit, 12th month free',
      'Collections: Veda (Temple), Pride (Diamonds), Eleganza (Italian)',
      'Particularly strong for NRI customers with cross-border needs',
    ],
    faqs: [
      {
        question: 'What are Joyalukkas making charges per gram?',
        answer: 'Joyalukkas making charges range from ₹280 to ₹650 per gram. Simple chains and daily wear start from ₹280-350/gram, regular jewellery ₹400-500/gram, and designer/bridal pieces up to ₹650/gram. Mass-produced items have lower charges than handcrafted pieces.',
      },
      {
        question: 'Can I exchange Joyalukkas jewellery at stores abroad?',
        answer: 'Yes, this is Joyalukkas\' signature advantage. You can buy in India and exchange at 100% gold value at any of their 160+ stores across 11 countries including UAE, UK, USA, Singapore, Malaysia, Saudi Arabia, Kuwait, Qatar, Bahrain, and Oman.',
      },
      {
        question: 'Is Joyalukkas gold genuine and certified?',
        answer: 'Yes, all Joyalukkas gold is BIS hallmarked in India with certified purity. Each piece comes with a Joyalukkas Guarantee Card documenting exact weight, purity certification, making charges, and stone details for complete transparency.',
      },
      {
        question: 'What is Joyalukkas Easy Buy savings scheme?',
        answer: 'Easy Buy allows monthly deposits starting from ₹1,000 for 11 months. The 12th month is given free as bonus (essentially 8% extra value). The total amount plus bonus can be used to purchase any Joyalukkas jewellery. Great for planning wedding purchases.',
      },
      {
        question: 'Is Joyalukkas better for NRI customers?',
        answer: 'Definitely - their global exchange policy is unmatched. NRIs can buy during India visits and exchange at stores in UAE, UK, USA, or other countries where they reside. The brand started in UAE serving NRIs, so they understand expatriate needs well.',
      },
      {
        question: 'How does Joyalukkas compare to Tanishq and Kalyan?',
        answer: 'Joyalukkas is positioned between Tanishq (most premium) and Kalyan (more value-focused). Making charges (₹280-650/gram) are moderate. Their unique advantage is global presence and exchange - neither Tanishq nor Kalyan has comparable international reach.',
      },
      {
        question: 'Where are Joyalukkas stores located in India?',
        answer: 'Joyalukkas has stores across India including Kerala (Kochi, Thrissur, multiple cities), Tamil Nadu (Chennai, Coimbatore), Karnataka (Bangalore), Telangana (Hyderabad), Maharashtra (Mumbai, Pune), Delhi NCR, and other major cities.',
      },
    ],
    website: 'https://www.joyalukkas.com',
  },

  grt: {
    name: 'GRT Jewellers',
    slug: 'grt',
    type: 'regional',
    headquarters: 'Chennai, Tamil Nadu',
    foundedYear: 1964,
    makingChargesRange: '₹180 - ₹450 per gram',
    makingChargesMin: 180,
    makingChargesMax: 450,
    purityStandards: 'All GRT jewellery is BIS hallmarked with 916 (22K) certification. The brand pioneered purity assurance in South India with in-house quality testing labs. Diamonds are certified by reputable international labs including IGI and GIA.',
    popularCollections: ['Adore', 'Elena', 'Mayuri', 'Zeva', 'Viha', 'Laya', 'Oriana', 'Nakshatra (Bridal)', 'Temple Collection', 'GRT Brides', 'GRT Verse', 'Silver Articles'],
    exchangePolicy: 'Full gold value exchange for GRT jewellery at any showroom. Old gold from other jewellers accepted at prevailing rates with standard purity testing. Exchange bonus during festivals.',
    regions: ['south'],
    cityLinks: [
      { name: 'Chennai', slug: 'chennai' },
      { name: 'Coimbatore', slug: 'coimbatore' },
      { name: 'Madurai', slug: 'madurai' },
      { name: 'Trichy', slug: 'trichy' },
      { name: 'Salem', slug: 'salem' },
      { name: 'Bangalore', slug: 'bangalore' },
      { name: 'Hyderabad', slug: 'hyderabad' },
    ],
    description: `GRT Jewellers (G.R. Thanga Maligai), established in 1964 by Shri G. Rajendran in Chennai (then Madras), has grown from a single store into one of South India's most trusted and beloved jewellery retail chains. With over 60 years of heritage and more than 75 showrooms across South India plus an international presence in Singapore, GRT represents the gold standard for quality, craftsmanship, and customer trust in the region. The brand has become synonymous with traditional South Indian jewellery, particularly the intricate temple designs and elaborate bridal collections that are integral to Tamil Nadu's cultural heritage.

The brand's founding story reflects the entrepreneurial spirit of Tamil Nadu. Starting as a small shop in T Nagar, Chennai, with a steadfast focus on purity and fair dealing, G. Rajendran built a reputation that attracted customers from across the city and beyond. His vision was to create a jewellery store where customers could trust the purity of gold without question and find designs that honored South Indian traditions while embracing contemporary aesthetics. Today, under the leadership of second-generation Managing Directors G.R. Ananthapadmanabhan and G.R. Radhakrishnan, the company continues to uphold these founding values while expanding its reach and modernizing its offerings for a new generation of customers.

GRT's flagship showroom in T Nagar, Chennai, has achieved legendary status among jewellery destinations in India. Spanning multiple floors with thousands of designs on display, it is one of the largest jewellery showrooms in the country and a must-visit destination for anyone shopping for gold in Tamil Nadu. The store features dedicated sections for different jewellery categories including traditional temple jewellery, contemporary diamond collections, silver articles, platinum jewellery, and bridal sets. The customer experience includes private consultation rooms for bridal jewellery selection, digital cataloging systems, and trained staff who can guide customers through the extensive collections. The store sees particularly heavy footfall during wedding seasons and auspicious occasions like Akshaya Tritiya, Pongal, and Diwali.

The brand's product portfolio is remarkably diverse, covering gold, silver, platinum, and diamond jewellery across every price point and occasion. Collections include traditional temple designs featuring deities like Lakshmi, Ganesha, and traditional motifs, contemporary pieces for everyday wear, elaborate bridal collections for South Indian weddings, lightweight office wear, children's jewellery, men's gold chains and rings, and ceremonial pieces for religious occasions. Named collections like Adore (contemporary gold), Elena (diamond cocktail rings), Mayuri (peacock-inspired designs), Zeva (modern minimalist), Viha (wedding collection), Laya (layered necklaces), Oriana (precious gemstones), GRT Brides (comprehensive bridal trousseau), and GRT Verse (fusion designs) cater to different aesthetic preferences and occasions. The company also offers an extensive range of silver articles including pooja items, dinner sets, gift articles, and decorative pieces.

Making charges at GRT range from ₹180 to ₹450 per gram - significantly more competitive than national chains like Tanishq (₹350-800/gram) while maintaining equivalent quality standards with BIS hallmarking. This value proposition, combined with trusted purity, exceptional design variety, and deep understanding of South Indian wedding traditions, has made GRT the default choice for Tamil Nadu weddings and celebrations. A typical 50-gram bridal necklace could cost ₹5,000-15,000 less at GRT compared to national chains, making a substantial difference for families purchasing complete wedding sets.

GRT has invested heavily in digital transformation, recognizing the changing preferences of modern customers. Their e-commerce platform (grtjewels.com) features over 8,000 ready-to-ship products across all categories. Digital features include free shipping across India, international delivery to select locations including the USA, UK, UAE, and Singapore, a mobile app for iOS and Android with virtual try-on capabilities, video shopping consultations through GRT Live where customers can connect with jewellery experts, reserve-online-pick-up-in-store functionality, 360-degree product views, and real-time gold rate tracking. The digital platform has become particularly popular for gifts and lightweight everyday jewellery purchases.

The brand's commitment to quality is backed by stringent standards at every level. All gold jewellery is BIS hallmarked with the mandatory 6-digit HUID (Hallmark Unique Identification Number) that can be verified online. GRT operates in-house quality testing laboratories to ensure purity before products reach showroom floors. Diamonds are certified by reputable international laboratories including IGI (International Gemological Institute) and GIA (Gemological Institute of America), providing customers with confidence in stone quality and grading. Transparent billing practices show gold rate, net weight, making charges, stone charges, and GST separately, allowing customers to understand exactly what they're paying for.

GRT operates several gold savings schemes designed to help customers plan for significant purchases. The popular Golden Eleven Flexi Plan allows customers to make monthly payments for 11 months and purchase jewellery in the 12th month with bonus benefits - effectively earning an 8-9% return on their deposits. The scheme offers flexibility in deposit amounts and can be used to purchase any jewellery from their collections. This has become particularly popular among families planning wedding purchases, allowing systematic savings over 1-2 years before the wedding date.

The company's geographic expansion has been strategic and steady. Starting from Chennai, GRT has established showrooms across Tamil Nadu including major cities like Coimbatore, Madurai, Trichy, Salem, Tiruppur, Tirunelveli, Erode, Vellore, Hosur, and numerous smaller towns. Beyond Tamil Nadu, they have expanded to Karnataka (Bangalore), Telangana (Hyderabad), Andhra Pradesh (Visakhapatnam, Vijayawada, Tirupati), and internationally to Singapore. Each showroom maintains consistent quality and service standards while adapting design selections to local preferences.

Beyond retail, the GRT Group has diversified into hospitality through GRT Hotels & Resorts, which operates premium properties in Chennai, Pondicherry, and other locations. The group has also invested in education and community development through various CSR initiatives. This diversification reflects the group's evolution from a jewellery retailer to a well-rounded business conglomerate while maintaining its core focus on jewellery excellence.

In 2024, GRT celebrated its 60th anniversary with a spectacular achievement - creating a Guinness World Record for the heaviest pair of gold earrings (jhumkas), weighing 3.527 kg in 22-carat gold. This remarkable creation, displaying extraordinary craftsmanship with intricate traditional designs, was a testament to their goldsmiths' skills and the brand's commitment to celebrating Indian jewellery traditions. The achievement garnered significant media attention and reinforced GRT's position as a leader in South Indian jewellery craftsmanship.

GRT's strength lies in understanding the nuances of South Indian wedding traditions and creating jewellery that honors these customs. Different Tamil Nadu communities have specific jewellery traditions - the Chettiars prefer particular designs, Brahmin weddings feature specific items, and Nadar community weddings have their own requirements. GRT's collections cater to all these variations, with staff trained to guide families through community-specific requirements. This deep cultural understanding, combined with competitive pricing and trusted quality, has made GRT an institution in South Indian jewellery retail.`,
    highlights: [
      'South India\'s most trusted jewellery chain - 60+ years heritage',
      '65+ showrooms across South India plus Singapore',
      'Competitive making charges (₹180-450/gram) vs national chains',
      'Iconic T Nagar flagship - one of India\'s largest showrooms',
      'Specialists in South Indian temple and traditional designs',
      '8,000+ products on e-commerce with free India shipping',
      'Golden Eleven Flexi savings scheme with bonus benefits',
      'Guinness Record for heaviest gold jhumkas (2024)',
    ],
    faqs: [
      {
        question: 'What are GRT Jewellers making charges per gram?',
        answer: 'GRT making charges range from ₹180 to ₹450 per gram depending on design complexity. Simple chains and plain bangles are around ₹180-220/gram, lightweight daily wear ₹250-300/gram, and elaborate bridal sets ₹350-450/gram. This is significantly lower than national chains like Tanishq.',
      },
      {
        question: 'Is GRT cheaper than Tanishq?',
        answer: 'Yes, GRT typically has lower making charges (₹180-450/gram) compared to Tanishq (₹350-800/gram). Since gold rates are similar (both follow IBJA rates), you can save ₹150-350 per gram on making charges at GRT while getting equivalent BIS hallmarked quality.',
      },
      {
        question: 'Where are GRT Jewellers showrooms located?',
        answer: 'GRT has 65+ showrooms primarily in Tamil Nadu (Chennai, Coimbatore, Madurai, Trichy, Salem, Tiruppur, Hosur, and 40+ other cities), Karnataka (Bangalore), Telangana (Hyderabad), Andhra Pradesh (Visakhapatnam, Tirupati), and internationally in Singapore.',
      },
      {
        question: 'Is GRT gold hallmarked and genuine?',
        answer: 'Yes, all GRT jewellery is BIS hallmarked with 916 (22K) certification for gold and certified diamonds. GRT pioneered purity assurance in South India and maintains in-house quality testing labs. Each piece comes with proper documentation.',
      },
      {
        question: 'Does GRT have online shopping?',
        answer: 'Yes, GRT has a comprehensive e-commerce platform (grtjewels.com) with 8,000+ ready-to-ship products. They offer free shipping across India, international delivery, video shopping (GRT Live), mobile apps, and reserve-online-pick-up-in-store options.',
      },
      {
        question: 'What is GRT Golden Eleven scheme?',
        answer: 'The Golden Eleven Flexi Plan is GRT\'s popular gold savings scheme. Customers pay monthly installments for 11 months and can purchase jewellery in the 12th month with bonus benefits. The scheme helps customers plan for major purchases like wedding jewellery.',
      },
      {
        question: 'Can I exchange old gold at GRT?',
        answer: 'Yes, GRT offers full gold value exchange for their own jewellery at any showroom. Old gold from other jewellers is also accepted at prevailing rates with standard purity testing. Festival periods often include exchange bonuses.',
      },
    ],
    website: 'https://www.grtjewels.com',
  },

  'senco-gold': {
    name: 'Senco Gold',
    slug: 'senco-gold',
    type: 'regional',
    headquarters: 'Kolkata, West Bengal',
    foundedYear: 1938,
    makingChargesRange: '₹200 - ₹500 per gram',
    makingChargesMin: 200,
    makingChargesMax: 500,
    purityStandards: 'BIS hallmarked with Senco Assurance Certificate. Known for Bengal-style intricate craftsmanship.',
    popularCollections: ['Everlite (Lightweight)', 'Gossip (Teen)', 'Aham (Men)', 'D\'signia (Diamonds)', 'Vivaha (Bridal)'],
    exchangePolicy: 'Lifetime exchange at full gold value for Senco jewellery. Old gold accepted across all stores.',
    regions: ['east', 'north'],
    cityLinks: [
      { name: 'Kolkata', slug: 'kolkata' },
      { name: 'Delhi', slug: 'delhi' },
      { name: 'Patna', slug: 'patna' },
      { name: 'Lucknow', slug: 'lucknow' },
      { name: 'Bhubaneswar', slug: 'bhubaneswar' },
    ],
    description: `Senco Gold & Diamonds, established in 1938, is Eastern India's premier jewellery brand with over 150 showrooms across India. Headquartered in Kolkata, the brand is known for exquisite Bengali craftsmanship and contemporary designs.

Publicly listed on NSE (SENCO), the company has built a reputation for quality and trust over 85+ years. Bengali goldsmith traditions are renowned for intricate filigree work and lightweight designs, and Senco has preserved these skills while modernizing for today's customers.

Senco's Everlite collection revolutionized the market by offering designer jewellery at lower weights, making gold more accessible. Their making charges range from ₹200 to ₹500 per gram, competitive for a branded jeweller.

The brand has strong presence in Eastern and Northern India, particularly West Bengal, Bihar, Jharkhand, Odisha, and Uttar Pradesh. For customers seeking Bengali-style designs or shopping in these regions, Senco is often the first choice.`,
    highlights: [
      'Publicly listed company (NSE: SENCO)',
      '85+ years of heritage since 1938',
      'Masters of Bengali filigree craftsmanship',
      'Everlite lightweight jewellery collection',
      '150+ showrooms in Eastern & Northern India',
    ],
    faqs: [
      {
        question: 'What are Senco Gold making charges?',
        answer: 'Senco Gold making charges range from ₹200 to ₹500 per gram. Their Everlite collection has lower charges as designs are optimized for weight efficiency.',
      },
      {
        question: 'Is Senco Gold a trusted brand?',
        answer: 'Yes, Senco is one of Eastern India\'s most trusted jewellery brands with 85+ years of history. They are publicly listed on NSE, adding financial transparency.',
      },
      {
        question: 'Where are Senco Gold stores located?',
        answer: 'Senco has 150+ stores primarily in Eastern and Northern India - West Bengal, Bihar, Odisha, Jharkhand, Uttar Pradesh, and Delhi NCR. They are expanding nationally.',
      },
      {
        question: 'Does Senco have lightweight jewellery?',
        answer: 'Yes, Senco\'s Everlite collection specializes in lightweight jewellery that looks heavy but weighs less. This makes designer pieces more affordable.',
      },
    ],
    website: 'https://www.sencogoldanddiamonds.com',
  },

  'pc-jeweller': {
    name: 'PC Jeweller',
    slug: 'pc-jeweller',
    type: 'national',
    headquarters: 'New Delhi',
    foundedYear: 2005,
    makingChargesRange: '₹250 - ₹550 per gram',
    makingChargesMin: 250,
    makingChargesMax: 550,
    purityStandards: 'BIS hallmarked with PCJ Assurance. All diamonds are conflict-free certified.',
    popularCollections: ['Quench (Diamonds)', 'Lavanya (Bridal)', 'Azva (Wedding)', 'Heritage (Antique)'],
    exchangePolicy: 'Lifetime exchange policy with full gold value for PC Jeweller purchases.',
    regions: ['north', 'pan-india'],
    cityLinks: [
      { name: 'Delhi', slug: 'delhi' },
      { name: 'Lucknow', slug: 'lucknow' },
      { name: 'Jaipur', slug: 'jaipur' },
      { name: 'Chandigarh', slug: 'chandigarh' },
      { name: 'Mumbai', slug: 'mumbai' },
    ],
    description: `PC Jeweller, founded in 2005, rapidly grew to become one of India's largest jewellery retailers with presence across North India and beyond. The brand is known for its modern retail approach and competitive pricing.

Listed on both NSE and BSE, PC Jeweller brought organized retail practices to the jewellery sector. Their showrooms feature contemporary ambiance with extensive collections for all occasions.

The brand offers making charges in the range of ₹250 to ₹550 per gram, positioning them as a value-conscious choice. They have particular strength in diamond jewellery with their Quench collection offering certified diamonds at competitive prices.

PC Jeweller has strong presence in North India, particularly Delhi NCR, Punjab, Haryana, Uttar Pradesh, and Rajasthan. Their modern retail approach appeals to young, urban customers.`,
    highlights: [
      'Publicly listed on NSE and BSE',
      'Modern retail approach to jewellery',
      'Strong North India presence',
      'Competitive diamond jewellery pricing',
      'Transparent billing and pricing',
    ],
    faqs: [
      {
        question: 'What are PC Jeweller making charges?',
        answer: 'PC Jeweller making charges range from ₹250 to ₹550 per gram. Diamond jewellery making charges are calculated differently based on diamond value.',
      },
      {
        question: 'Is PC Jeweller a reliable brand?',
        answer: 'PC Jeweller is a publicly listed company on NSE and BSE. While they faced some challenges in 2018, they continue to operate with BIS hallmarked products.',
      },
      {
        question: 'Where are PC Jeweller stores located?',
        answer: 'PC Jeweller has stores primarily in North India - Delhi NCR, Punjab, Haryana, UP, Rajasthan, and some other states. Check their website for current store locations.',
      },
      {
        question: 'Does PC Jeweller offer EMI?',
        answer: 'Yes, PC Jeweller offers EMI options through partner banks and their own savings schemes for customers.',
      },
    ],
    website: 'https://www.pcjeweller.com',
  },

  tbz: {
    name: 'Tribhovandas Bhimji Zaveri (TBZ)',
    slug: 'tbz',
    type: 'national',
    headquarters: 'Mumbai, Maharashtra',
    foundedYear: 1864,
    makingChargesRange: '₹300 - ₹700 per gram',
    makingChargesMin: 300,
    makingChargesMax: 700,
    purityStandards: 'BIS hallmarked with TBZ Purity Promise. 150+ years of quality heritage.',
    popularCollections: ['Mangalsutra Collection', 'Bridal Jewellery', 'Diamonds', 'Traditional Maharashtrian'],
    exchangePolicy: 'Lifetime gold exchange at full value for TBZ jewellery. Old gold accepted with purity testing.',
    regions: ['west', 'pan-india'],
    cityLinks: [
      { name: 'Mumbai', slug: 'mumbai' },
      { name: 'Pune', slug: 'pune' },
      { name: 'Nashik', slug: 'nashik' },
      { name: 'Nagpur', slug: 'nagpur' },
      { name: 'Ahmedabad', slug: 'ahmedabad' },
    ],
    description: `Tribhovandas Bhimji Zaveri (TBZ), established in 1864, is one of India's oldest and most prestigious jewellery houses with over 160 years of heritage. Originally starting in Zaveri Bazaar, Mumbai, TBZ has been synonymous with trust and quality for generations.

The brand carries the legacy of serving Maharashtrian families for wedding jewellery for over a century. Their Mangalsutra collection is particularly renowned, with traditional designs that have been passed down through generations.

TBZ's making charges range from ₹300 to ₹700 per gram, reflecting their premium positioning and heritage value. The brand is known for craftsmanship and traditional Maharashtrian designs that are hard to find elsewhere.

Listed on stock exchanges, TBZ has modernized while maintaining its heritage appeal. Their stores in Mumbai's Zaveri Bazaar remain pilgrimage destinations for jewellery lovers, while new-format stores cater to contemporary tastes.`,
    highlights: [
      '160+ years of heritage since 1864',
      'Zaveri Bazaar legacy and trust',
      'Masters of Maharashtrian jewellery',
      'Renowned Mangalsutra collection',
      'Publicly listed with transparent practices',
    ],
    faqs: [
      {
        question: 'What are TBZ making charges?',
        answer: 'TBZ making charges range from ₹300 to ₹700 per gram. Their heritage pieces and traditional Maharashtrian designs may have higher charges due to intricate craftsmanship.',
      },
      {
        question: 'Is TBZ the oldest jewellery brand in India?',
        answer: 'TBZ is one of the oldest, established in 1864 in Zaveri Bazaar, Mumbai. They have over 160 years of heritage serving Indian families.',
      },
      {
        question: 'Why is TBZ famous for Mangalsutra?',
        answer: 'TBZ has been crafting traditional Maharashtrian Mangalsutras for over a century. Their designs are considered authentic and are passed down as family traditions.',
      },
      {
        question: 'Does TBZ have stores outside Maharashtra?',
        answer: 'Yes, while TBZ is strongest in Maharashtra, they have expanded to other states including Gujarat, Karnataka, and Delhi NCR.',
      },
    ],
    website: 'https://www.tbztheoriginal.com',
  },

  png: {
    name: 'PNG Jewellers',
    slug: 'png',
    type: 'regional',
    headquarters: 'Pune, Maharashtra',
    foundedYear: 1832,
    makingChargesRange: '₹200 - ₹500 per gram',
    makingChargesMin: 200,
    makingChargesMax: 500,
    purityStandards: 'BIS hallmarked with PNG\'s purity guarantee. Nearly 200 years of trusted quality.',
    popularCollections: ['Sanskruti (Traditional)', 'Quorra (Contemporary)', 'Quench (Diamonds)', 'Lumina'],
    exchangePolicy: 'Lifetime exchange for PNG jewellery. Old gold accepted at all showrooms.',
    regions: ['west'],
    cityLinks: [
      { name: 'Pune', slug: 'pune' },
      { name: 'Mumbai', slug: 'mumbai' },
      { name: 'Nashik', slug: 'nashik' },
      { name: 'Nagpur', slug: 'nagpur' },
    ],
    description: `PNG Jewellers (P N Gadgil & Sons), established in 1832, is one of India's oldest jewellery houses with nearly 200 years of heritage. Based in Pune, the brand is a household name in Maharashtra and synonymous with trust.

The Gadgil family has been crafting jewellery for eight generations, making PNG one of the few jewellery brands with such deep heritage. Their expertise in traditional Maharashtrian designs is unparalleled.

PNG offers competitive making charges ranging from ₹200 to ₹500 per gram, making them excellent value for a heritage brand. They balance traditional craftsmanship with modern retail practices.

With over 35 showrooms primarily in Maharashtra, PNG is the jeweller of choice for Pune and surrounding regions. Their Sanskruti collection for traditional jewellery and Quorra for contemporary designs cater to all preferences.`,
    highlights: [
      'Nearly 200 years of heritage since 1832',
      'Eight generations of jewellery craftsmanship',
      'Pune\'s most trusted jewellery brand',
      'Competitive making charges for heritage brand',
      'Experts in Maharashtrian traditional jewellery',
    ],
    faqs: [
      {
        question: 'What are PNG Jewellers making charges?',
        answer: 'PNG Jewellers making charges range from ₹200 to ₹500 per gram. This is competitive for a heritage brand with nearly 200 years of history.',
      },
      {
        question: 'How old is PNG Jewellers?',
        answer: 'PNG Jewellers was established in 1832, making them nearly 200 years old. They are one of India\'s oldest jewellery brands with eight generations of heritage.',
      },
      {
        question: 'Where are PNG Jewellers stores?',
        answer: 'PNG has 35+ stores primarily in Maharashtra - Pune, Mumbai, Nashik, Nagpur, and surrounding cities. Pune has the highest concentration of stores.',
      },
      {
        question: 'Is PNG and P N Gadgil the same?',
        answer: 'Yes, PNG stands for P N Gadgil & Sons. They are also sometimes called PNG Jewellers or PN Gadgil Jewellers.',
      },
    ],
    website: 'https://www.pngjewellers.com',
  },

  lalitha: {
    name: 'Lalithaa Jewellery',
    slug: 'lalitha',
    type: 'regional',
    headquarters: 'Chennai, Tamil Nadu',
    foundedYear: 1986,
    makingChargesRange: '₹150 - ₹400 per gram',
    makingChargesMin: 150,
    makingChargesMax: 400,
    purityStandards: 'BIS hallmarked with 916 (22K) certification. Known for competitive pricing with quality assurance across all showrooms. Every piece undergoes rigorous purity testing before being displayed for sale.',
    popularCollections: ['Temple Collection', 'Bridal Sets', 'Daily Wear', 'Diamond Jewellery', 'Antique Gold', 'Silver Articles', 'Kids Collection', 'Men\'s Gold Chains', 'Platinum Jewellery'],
    exchangePolicy: 'Full gold value exchange for Lalithaa jewellery at any of their 55+ stores. Old gold from any jeweller accepted with standard purity testing and market-rate deductions. Festival exchange bonuses available during major shopping seasons.',
    regions: ['south'],
    cityLinks: [
      { name: 'Chennai', slug: 'chennai' },
      { name: 'Coimbatore', slug: 'coimbatore' },
      { name: 'Madurai', slug: 'madurai' },
      { name: 'Trichy', slug: 'trichy' },
      { name: 'Salem', slug: 'salem' },
      { name: 'Bangalore', slug: 'bangalore' },
    ],
    description: `Lalithaa Jewellery, established in 1986, has emerged as one of South India's most prominent and value-focused jewellery retail chains with over 55 showrooms spanning Tamil Nadu, Andhra Pradesh, Telangana, Karnataka, Kerala, and Puducherry. The brand has built its reputation on a powerful value proposition: offering high-quality BIS hallmarked gold jewellery at some of the most competitive making charges in the organized jewellery retail segment. This pricing strategy has made Lalithaa a favorite among value-conscious buyers who seek trusted quality without the premium charges associated with national chains.

The brand's journey from a single store in Chennai's prestigious T Nagar shopping district to a major regional chain spanning six states reflects its commitment to customer satisfaction, fair pricing, and understanding the needs of middle-class Indian families. The founding vision was to make quality gold jewellery accessible to all segments of society, not just the affluent. This democratization of quality jewellery has earned Lalithaa a loyal customer base that spans multiple generations, with grandmothers, mothers, and daughters all shopping at the same trusted destination.

Their flagship T Nagar store in Chennai remains one of the busiest jewellery destinations in the city, drawing customers not just from Chennai but from across Tamil Nadu and neighboring states. The store features multiple floors dedicated to different jewellery categories - traditional temple jewellery, contemporary collections, diamond pieces, bridal sets, silver articles, and gold coins. During wedding seasons and festivals like Akshaya Tritiya, Dhanteras, and Diwali, the store operates extended hours to accommodate the surge in customers. The T Nagar location benefits from being in one of India's busiest shopping districts, making it convenient for families to combine jewellery shopping with other purchases.

Lalithaa Jewellery's unique selling proposition lies in their aggressive pricing strategy that challenges industry norms. Making charges ranging from just ₹150 to ₹400 per gram are among the lowest in the branded jewellery segment - often ₹100-200 less per gram than GRT and ₹200-400 less than national chains like Tanishq. For a typical 50-gram bridal necklace, this translates to savings of ₹5,000-20,000 compared to competitors. This pricing, combined with strict adherence to BIS hallmarking and transparent billing, has created immense customer trust and loyalty.

The product range at Lalithaa is comprehensive, designed to serve customers across all life stages and occasions. Their traditional South Indian temple jewellery collection features intricate deity motifs of Lakshmi, Ganesha, and temple tower designs that are essential for Tamil and Telugu weddings. Contemporary diamond collections offer modern designs for working professionals who want everyday elegant pieces. Bridal sets come in various weight ranges and styles to suit different budgets and regional preferences. Daily wear pieces in the 5-20 gram range provide affordable options for regular use. Silver articles include pooja items, dinner sets, and decorative pieces. The kids' collection offers safe, age-appropriate designs for children's naming ceremonies and birthdays.

Lalithaa operates with complete transparency in pricing, which has been fundamental to building customer trust. Gold rates are prominently displayed in all stores and updated on their website in real-time. Billing is itemized showing gold weight, gold rate per gram, making charges per gram, stone charges if applicable, and GST - allowing customers to understand exactly what they're paying for. There are no hidden charges or surprise additions at checkout. This transparency extends to their exchange policies, which are clearly explained before purchase.

The brand offers an 11-month jewellery purchase scheme that has become extremely popular among middle-class families planning for weddings or other significant purchases. Customers can enroll by depositing a fixed amount monthly for 11 months. At the end of the scheme, they receive bonus benefits (typically the equivalent of one month's payment) and can purchase jewellery using the accumulated amount. The scheme essentially works as a dedicated savings plan with gold as the end goal, protecting customers from gold price volatility while providing systematic savings discipline. This scheme has made expensive bridal sets accessible to families who would otherwise struggle with lump-sum payments.

With presence in major cities including Chennai (multiple stores in T Nagar, Anna Nagar, Purasawalkam, Chromepet, Velachery, Porur, Tambaram), Bangalore (Jayanagar, Commercial Street, Marathahalli), Hyderabad (Abids, Ameerpet), Vijayawada, Visakhapatnam, Coimbatore, Madurai, Salem, Trichy, Tirunelveli, Erode, and numerous tier-2 and tier-3 towns, Lalithaa has established itself as an accessible trusted name across South India. Their expansion strategy focuses on bringing the same competitive pricing and quality standards to smaller towns where customers previously had limited options for branded jewellery.

The brand's success can be attributed to understanding the South Indian gold consumer psychologically. Gold in South India is not merely ornamental - it's deeply tied to family tradition, financial security, and cultural identity. Weddings require specific jewellery pieces, festivals demand auspicious purchases, and gold is passed down through generations. Lalithaa positions itself as the smart family's jeweller - offering the same trusted quality as premium brands at prices that don't strain family budgets. This value positioning resonates strongly with the practical, value-conscious South Indian customer.

Quality assurance at Lalithaa follows industry standards with all gold jewellery being BIS hallmarked with the mandatory 6-digit HUID. In-store purity testing equipment allows customers to verify purity before purchase. Diamonds come with appropriate certification. The company maintains strict quality control from sourcing through manufacturing to final sale. While Lalithaa's making charges are lower than competitors, this is achieved through operational efficiency and volume, not by compromising on gold purity or quality standards.

Looking ahead, Lalithaa continues to expand its footprint across South India while investing in digital capabilities. Their website offers catalog browsing, scheme enrollment, and store locator features. The focus remains on the core value proposition that built the brand: trusted quality gold jewellery at the most competitive prices in the market, serving the aspirations of middle-class South Indian families.`,
    highlights: [
      'Among the lowest making charges in South India (₹150+)',
      '55+ showrooms across 5 South Indian states',
      'Strong presence in Chennai T Nagar - flagship destination',
      '11-month jewellery purchase scheme with bonus benefits',
      'BIS hallmarked with certified 916 purity',
      'Transparent pricing with daily rate updates',
    ],
    faqs: [
      {
        question: 'What are Lalithaa Jewellery making charges?',
        answer: 'Lalithaa Jewellery offers some of the lowest making charges among branded jewellers - ₹150 to ₹400 per gram. Simple chains and bangles are at the lower end (₹150-200/gram), while intricate bridal jewellery ranges from ₹300-400/gram. This makes them very popular for budget-conscious buyers.',
      },
      {
        question: 'Is Lalithaa Jewellery cheaper than GRT?',
        answer: 'Generally yes - Lalithaa typically has lower making charges than GRT. While GRT charges ₹180-450/gram, Lalithaa starts from ₹150/gram. However, both are competitive for Tamil Nadu and offer good value with BIS hallmarked quality.',
      },
      {
        question: 'Where are Lalithaa Jewellery showrooms located?',
        answer: 'Lalithaa Jewellery has 55+ stores across South India including Tamil Nadu (Chennai T Nagar, Anna Nagar, Purasawalkam, Chromepet, Coimbatore, Madurai, Salem, Trichy, Erode), Karnataka (Bangalore), Telangana (Hyderabad), Andhra Pradesh (Vijayawada, Visakhapatnam), and Kerala.',
      },
      {
        question: 'Is Lalithaa Jewellery gold genuine?',
        answer: 'Yes, all Lalithaa jewellery is BIS hallmarked with certified 22K (916) or 24K purity. Each piece comes with proper documentation and weight verification. Despite lower making charges, they maintain strict quality standards across all showrooms.',
      },
      {
        question: 'Does Lalithaa Jewellery have a gold savings scheme?',
        answer: 'Yes, Lalithaa offers an 11-month jewellery purchase scheme where customers can make monthly payments. After completing 11 payments, they receive bonus benefits and can purchase jewellery at favorable terms. The scheme is beneficial regardless of gold price movements.',
      },
      {
        question: 'What is the exchange policy at Lalithaa Jewellery?',
        answer: 'Lalithaa offers full gold value exchange for their own jewellery at any store. Old gold from other jewellers is also accepted with purity testing - deductions are made based on actual purity compared to 22K standard. Current gold rates are applied for exchange.',
      },
    ],
    website: 'https://www.lalithaajewellery.com',
  },

  'jos-alukkas': {
    name: 'Jos Alukkas',
    slug: 'jos-alukkas',
    type: 'regional',
    headquarters: 'Thrissur, Kerala',
    foundedYear: 1964,
    makingChargesRange: '₹220 - ₹550 per gram',
    makingChargesMin: 220,
    makingChargesMax: 550,
    purityStandards: 'BIS hallmarked with Jos Alukkas guarantee certificate.',
    popularCollections: ['Temple Jewellery', 'Antique Collection', 'Diamond Sets', 'Gold Coins'],
    exchangePolicy: 'Full exchange value for Jos Alukkas jewellery at any store.',
    regions: ['south'],
    cityLinks: [
      { name: 'Kerala', slug: 'kerala' },
      { name: 'Chennai', slug: 'chennai' },
      { name: 'Bangalore', slug: 'bangalore' },
      { name: 'Coimbatore', slug: 'coimbatore' },
      { name: 'Hyderabad', slug: 'hyderabad' },
    ],
    description: `Jos Alukkas, established in 1964, is one of Kerala's most respected jewellery brands with a strong presence across South India. The brand is known for traditional designs and reliable quality.

With over 60 showrooms across Kerala, Tamil Nadu, Karnataka, and other states, Jos Alukkas has built a loyal customer base over six decades. They are particularly popular for traditional Kerala-style jewellery and temple designs.

Making charges at Jos Alukkas range from ₹220 to ₹550 per gram, placing them in the mid-range for branded jewellers. They offer good value with their combination of quality and competitive pricing.

The brand is a family-owned business that has maintained traditional values while modernizing retail practices. Their strong presence in Kerala makes them a top choice for Malayali weddings.`,
    highlights: [
      '60+ years of heritage since 1964',
      '60+ showrooms across South India',
      'Strong Kerala and Tamil Nadu presence',
      'Specialists in traditional Kerala designs',
      'Family-owned with traditional values',
    ],
    faqs: [
      {
        question: 'What are Jos Alukkas making charges?',
        answer: 'Jos Alukkas making charges range from ₹220 to ₹550 per gram depending on design complexity and jewellery type.',
      },
      {
        question: 'Is Jos Alukkas related to Joyalukkas?',
        answer: 'No, Jos Alukkas and Joyalukkas are separate companies. Both originated in Kerala\'s Thrissur region but are independently owned and operated.',
      },
      {
        question: 'Where does Jos Alukkas have stores?',
        answer: 'Jos Alukkas has 60+ stores primarily in Kerala, Tamil Nadu, and Karnataka. They also have presence in Telangana and some other South Indian states.',
      },
      {
        question: 'Does Jos Alukkas offer gold schemes?',
        answer: 'Yes, Jos Alukkas offers monthly gold savings schemes where you can deposit fixed amounts and purchase jewellery after completing the scheme period.',
      },
    ],
    website: 'https://www.josalukkas.com',
  },

  bhima: {
    name: 'Bhima Jewellers',
    slug: 'bhima',
    type: 'regional',
    headquarters: 'Thrissur, Kerala',
    foundedYear: 1925,
    makingChargesRange: '₹200 - ₹500 per gram',
    makingChargesMin: 200,
    makingChargesMax: 500,
    purityStandards: 'BIS hallmarked with Bhima quality certification.',
    popularCollections: ['Bridal Collection', 'Antique Gold', 'Temple Jewellery', 'Diamond Jewellery'],
    exchangePolicy: 'Lifetime exchange for Bhima jewellery at full gold value.',
    regions: ['south'],
    cityLinks: [
      { name: 'Kerala', slug: 'kerala' },
      { name: 'Chennai', slug: 'chennai' },
      { name: 'Bangalore', slug: 'bangalore' },
      { name: 'Hyderabad', slug: 'hyderabad' },
    ],
    description: `Bhima Jewellers, established in 1925, is one of Kerala's oldest and most trusted jewellery brands with nearly 100 years of heritage. The brand has built its reputation on quality craftsmanship and traditional designs.

With showrooms across Kerala and expanding to other South Indian states, Bhima serves customers who value heritage and authenticity. Their expertise in traditional Kerala jewellery designs has been passed down through generations.

Bhima offers competitive making charges ranging from ₹200 to ₹500 per gram, providing good value for a heritage brand. They specialize in bridal jewellery and traditional designs.

The brand maintains traditional craftsmanship while adopting modern retail standards, making them appealing to both older and younger generations of customers.`,
    highlights: [
      'Nearly 100 years of heritage since 1925',
      'One of Kerala\'s oldest jewellery brands',
      'Experts in traditional Kerala designs',
      'Competitive pricing for heritage brand',
      'Strong bridal jewellery collection',
    ],
    faqs: [
      {
        question: 'What are Bhima Jewellers making charges?',
        answer: 'Bhima Jewellers making charges range from ₹200 to ₹500 per gram. Traditional designs and bridal jewellery may be at the higher end.',
      },
      {
        question: 'How old is Bhima Jewellers?',
        answer: 'Bhima Jewellers was established in 1925, making them nearly 100 years old - one of Kerala\'s oldest jewellery brands.',
      },
      {
        question: 'Where are Bhima Jewellers stores?',
        answer: 'Bhima has showrooms across Kerala and has expanded to Tamil Nadu, Karnataka, and Telangana.',
      },
      {
        question: 'Is Bhima good for wedding jewellery?',
        answer: 'Yes, Bhima is particularly known for traditional Kerala bridal jewellery with nearly a century of expertise in wedding collections.',
      },
    ],
    website: 'https://www.bhimagold.com',
  },

  thangamayil: {
    name: 'Thangamayil Jewellery',
    slug: 'thangamayil',
    type: 'regional',
    headquarters: 'Madurai, Tamil Nadu',
    foundedYear: 1947,
    makingChargesRange: '₹160 - ₹420 per gram',
    makingChargesMin: 160,
    makingChargesMax: 420,
    purityStandards: 'BIS hallmarked with 916 (22K) certification. As a publicly listed company, Thangamayil maintains the highest transparency standards in gold purity and weight verification.',
    popularCollections: ['Temple Jewellery', 'Bridal Sets', 'Traditional Tamil', 'Diamond Collection', 'Antique Gold', 'Daily Wear', 'Kids Collection'],
    exchangePolicy: 'Full gold value exchange for Thangamayil purchases at any store. Old gold from other jewellers accepted with standard purity testing. Listed company policies ensure transparent exchange processes.',
    regions: ['south'],
    cityLinks: [
      { name: 'Madurai', slug: 'madurai' },
      { name: 'Chennai', slug: 'chennai' },
      { name: 'Coimbatore', slug: 'coimbatore' },
      { name: 'Trichy', slug: 'trichy' },
      { name: 'Salem', slug: 'salem' },
      { name: 'Tirunelveli', slug: 'tirunelveli' },
    ],
    description: `Thangamayil Jewellery Limited, established in 1947 in the temple city of Madurai, stands as one of Tamil Nadu's most respected and trusted jewellery retailers. With over 75 years of heritage, the company has evolved from a single family-owned store to a publicly listed enterprise with more than 60 showrooms across Tamil Nadu, serving millions of customers annually.

The brand's journey reflects the rich cultural heritage of Tamil Nadu, with Madurai - known for the iconic Meenakshi Temple - serving as both headquarters and spiritual home. This deep connection to Tamil culture is evident in their exceptional temple jewellery collections, featuring intricate designs inspired by traditional South Indian temple architecture and deity motifs.

As a company listed on the National Stock Exchange (NSE: THANGMAYL) and Bombay Stock Exchange, Thangamayil operates with exceptional transparency and corporate governance standards. Quarterly financial disclosures, independent audits, and regulatory compliance ensure customers can trust both the quality of products and the integrity of business practices. This public accountability is rare in the regional jewellery sector.

Thangamayil's competitive advantage lies in their aggressive pricing strategy combined with quality assurance. Making charges range from ₹160 to ₹420 per gram - significantly lower than many national chains. This value proposition, combined with BIS hallmarked gold and transparent billing, has made them the preferred choice for middle-class Tamil families purchasing wedding jewellery.

The brand's expansion strategy focuses on tier-2 and tier-3 cities of Tamil Nadu, bringing organized jewellery retail to towns where options were previously limited to local goldsmiths. Cities like Dindigul, Sivakasi, Nagercoil, Karur, and Thanjavur now have Thangamayil showrooms offering the same quality and pricing as metro stores.

Product offerings span traditional temple jewellery, elaborate bridal collections, contemporary diamond designs, lightweight daily wear, men's gold chains, and children's jewellery. Their gold savings schemes allow customers to make monthly deposits and purchase jewellery after completing the scheme period, with bonus benefits.

Thangamayil also maintains a strong online presence with daily gold rate updates, product catalogs, and scheme information. Their customer service includes home delivery in select cities, easy exchange policies, and after-sales support including cleaning and maintenance services.`,
    highlights: [
      'Publicly listed on NSE & BSE (THANGMAYL) - highest transparency',
      '75+ years of heritage since 1947 in Madurai',
      'Very competitive making charges (₹160+/gram)',
      '60+ stores across Tamil Nadu',
      'Strong presence in tier-2/3 cities beyond metros',
      'Rooted in Tamil culture and temple jewellery traditions',
    ],
    faqs: [
      {
        question: 'What are Thangamayil making charges per gram?',
        answer: 'Thangamayil offers very competitive making charges from ₹160 to ₹420 per gram - among the lowest for listed jewellery companies in India. Simple chains and bangles start from ₹160/gram, while intricate bridal sets may go up to ₹420/gram.',
      },
      {
        question: 'Is Thangamayil a listed company?',
        answer: 'Yes, Thangamayil Jewellery Limited is listed on both NSE (THANGMAYL) and BSE, making it one of the few regional jewellers with public market oversight. This ensures transparency in financial reporting and corporate governance.',
      },
      {
        question: 'Where is Thangamayil headquartered and where are their stores?',
        answer: 'Thangamayil is headquartered in Madurai, Tamil Nadu, and has 60+ stores across the state including Chennai, Coimbatore, Trichy, Salem, Tirunelveli, Dindigul, Thanjavur, Nagercoil, and many tier-2/3 cities.',
      },
      {
        question: 'Is Thangamayil good for traditional and wedding jewellery?',
        answer: 'Yes, Thangamayil specializes in traditional Tamil Nadu designs, temple jewellery, and bridal collections. Their Madurai heritage gives them deep expertise in South Indian traditional craftsmanship at competitive prices.',
      },
      {
        question: 'Does Thangamayil offer gold savings schemes?',
        answer: 'Yes, Thangamayil offers monthly gold savings schemes where customers can deposit fixed amounts and purchase jewellery after completing the scheme period. Bonus benefits are provided on scheme completion.',
      },
      {
        question: 'How does Thangamayil ensure gold purity?',
        answer: 'All Thangamayil gold is BIS hallmarked with 916 (22K) certification. As a listed company, they maintain strict quality control processes and transparent weight verification in front of customers.',
      },
    ],
    website: 'https://www.thangamayil.com',
  },

  khazana: {
    name: 'Khazana Jewellery',
    slug: 'khazana',
    type: 'regional',
    headquarters: 'Hyderabad, Telangana',
    foundedYear: 2004,
    makingChargesRange: '₹250 - ₹550 per gram',
    makingChargesMin: 250,
    makingChargesMax: 550,
    purityStandards: 'BIS hallmarked with Khazana purity assurance.',
    popularCollections: ['Nakshatra', 'Telugu Traditional', 'Diamond Collection', 'Polki Jewellery'],
    exchangePolicy: 'Full gold exchange value for Khazana jewellery at all stores.',
    regions: ['south'],
    cityLinks: [
      { name: 'Hyderabad', slug: 'hyderabad' },
      { name: 'Vijayawada', slug: 'vijayawada' },
      { name: 'Visakhapatnam', slug: 'visakhapatnam' },
      { name: 'Chennai', slug: 'chennai' },
      { name: 'Bangalore', slug: 'bangalore' },
    ],
    description: `Khazana Jewellery, established in 2004, has rapidly become one of Telangana and Andhra Pradesh's most popular jewellery chains. Based in Hyderabad, the brand is known for its Telugu traditional designs and celebrity endorsements.

The brand gained prominence through cricket and film star endorsements, making it popular among younger customers. Their showrooms are modern with extensive collections catering to Telugu tastes.

Making charges at Khazana range from ₹250 to ₹550 per gram, placing them competitively in the market. They specialize in Telugu traditional designs that are distinct from Tamil or Kerala styles.

With strong presence in Hyderabad, Vijayawada, and Visakhapatnam, Khazana is often the first choice for Telugu weddings and celebrations. They have also expanded to Chennai and Bangalore.`,
    highlights: [
      'Hyderabad\'s popular jewellery brand',
      'Specialists in Telugu traditional designs',
      'Modern showrooms with celebrity appeal',
      'Strong Telangana & Andhra presence',
      'Known for Polki and Kundan work',
    ],
    faqs: [
      {
        question: 'What are Khazana Jewellery making charges?',
        answer: 'Khazana making charges range from ₹250 to ₹550 per gram depending on design complexity and jewellery type.',
      },
      {
        question: 'Where is Khazana Jewellery located?',
        answer: 'Khazana has stores primarily in Telangana and Andhra Pradesh - Hyderabad, Vijayawada, Visakhapatnam, and has expanded to Chennai and Bangalore.',
      },
      {
        question: 'Is Khazana good for Telugu wedding jewellery?',
        answer: 'Yes, Khazana specializes in Telugu traditional designs and is very popular for wedding jewellery in Telangana and Andhra Pradesh.',
      },
      {
        question: 'Does Khazana have Polki jewellery?',
        answer: 'Yes, Khazana has a good collection of Polki and Kundan jewellery, which are popular for Telugu weddings.',
      },
    ],
    website: 'https://www.khazanajewellery.com',
  },

  chemmanur: {
    name: 'Chemmanur Jewellers',
    slug: 'chemmanur',
    type: 'regional',
    headquarters: 'Thrissur, Kerala',
    foundedYear: 1993,
    makingChargesRange: '₹180 - ₹480 per gram',
    makingChargesMin: 180,
    makingChargesMax: 480,
    purityStandards: 'BIS hallmarked with Chemmanur quality assurance.',
    popularCollections: ['Bridal Collection', 'Traditional Kerala', 'Temple Jewellery', 'Light Weight'],
    exchangePolicy: 'Full gold exchange at all Chemmanur showrooms.',
    regions: ['south'],
    cityLinks: [
      { name: 'Kerala', slug: 'kerala' },
      { name: 'Chennai', slug: 'chennai' },
      { name: 'Bangalore', slug: 'bangalore' },
      { name: 'Coimbatore', slug: 'coimbatore' },
    ],
    description: `Chemmanur Jewellers, established in 1993, is a prominent Kerala-based jewellery chain known for competitive pricing and wide variety. The brand has built a strong reputation in Kerala's competitive jewellery market.

The brand has gained visibility through aggressive marketing and celebrity endorsements. Their competitive making charges have made them popular among value-conscious customers.

With making charges ranging from ₹180 to ₹480 per gram, Chemmanur offers good value in Kerala's jewellery market. They have a comprehensive collection from traditional to contemporary designs.

Chemmanur has expanded beyond Kerala to Tamil Nadu and Karnataka, serving customers who prefer quality at reasonable prices. Their bridal collections are particularly popular for Kerala weddings.`,
    highlights: [
      'Competitive pricing in Kerala market',
      'Wide variety from traditional to modern',
      'Strong bridal jewellery collection',
      'Expanding South India presence',
      'Popular for value-conscious buyers',
    ],
    faqs: [
      {
        question: 'What are Chemmanur making charges?',
        answer: 'Chemmanur making charges range from ₹180 to ₹480 per gram, making them competitive in the Kerala jewellery market.',
      },
      {
        question: 'Where are Chemmanur stores located?',
        answer: 'Chemmanur has stores across Kerala and has expanded to Chennai, Bangalore, and Coimbatore in recent years.',
      },
      {
        question: 'Is Chemmanur gold quality good?',
        answer: 'Yes, all Chemmanur jewellery is BIS hallmarked with certified 22K or 24K purity.',
      },
      {
        question: 'Does Chemmanur have wedding collections?',
        answer: 'Yes, Chemmanur has extensive bridal and wedding collections featuring traditional Kerala designs at competitive prices.',
      },
    ],
    website: 'https://www.chemmanurjewellers.com',
  },

  'avr-swarna-mahal': {
    name: 'AVR Swarna Mahal',
    slug: 'avr-swarna-mahal',
    type: 'regional',
    headquarters: 'Salem, Tamil Nadu',
    foundedYear: 1954,
    makingChargesRange: '₹170 - ₹450 per gram',
    makingChargesMin: 170,
    makingChargesMax: 450,
    purityStandards: 'BIS hallmarked with AVR quality certification.',
    popularCollections: ['Temple Jewellery', 'Bridal Gold', 'Antique Collection', 'Diamond Jewellery'],
    exchangePolicy: 'Lifetime exchange for AVR jewellery at full gold value.',
    regions: ['south'],
    cityLinks: [
      { name: 'Salem', slug: 'salem' },
      { name: 'Chennai', slug: 'chennai' },
      { name: 'Coimbatore', slug: 'coimbatore' },
      { name: 'Madurai', slug: 'madurai' },
      { name: 'Trichy', slug: 'trichy' },
    ],
    description: `AVR Swarna Mahal Jewellers, established in 1954, is a well-respected Tamil Nadu jewellery chain based in Salem. With 70+ years of heritage, the brand is known for quality and competitive pricing.

The brand has strong presence in western Tamil Nadu and has become a trusted name for traditional jewellery. Their Salem roots have given them deep connections with the region's jewellery traditions.

AVR offers competitive making charges from ₹170 to ₹450 per gram, positioning them as excellent value for money. They specialize in temple jewellery and traditional Tamil designs.

With multiple showrooms across Tamil Nadu, AVR serves customers who prefer quality traditional jewellery at reasonable prices. Their expertise in bridal jewellery makes them popular for weddings.`,
    highlights: [
      '70+ years of heritage since 1954',
      'Salem\'s most trusted jeweller',
      'Competitive making charges',
      'Strong in western Tamil Nadu',
      'Experts in temple jewellery',
    ],
    faqs: [
      {
        question: 'What are AVR Swarna Mahal making charges?',
        answer: 'AVR making charges range from ₹170 to ₹450 per gram, making them competitive in the Tamil Nadu market.',
      },
      {
        question: 'Where is AVR Swarna Mahal based?',
        answer: 'AVR is headquartered in Salem, Tamil Nadu and has stores across Chennai, Coimbatore, Madurai, Trichy, and other cities.',
      },
      {
        question: 'Is AVR good for traditional jewellery?',
        answer: 'Yes, AVR Swarna Mahal specializes in temple jewellery and traditional Tamil Nadu designs with 70+ years of expertise.',
      },
      {
        question: 'Does AVR offer gold exchange?',
        answer: 'Yes, AVR offers lifetime exchange at full gold value for their jewellery and accepts old gold with standard testing.',
      },
    ],
    website: 'https://avrswarnamahal.com',
  },

  nac: {
    name: 'NAC Jewellers',
    slug: 'nac',
    type: 'regional',
    headquarters: 'Chennai, Tamil Nadu',
    foundedYear: 1973,
    makingChargesRange: '₹180 - ₹480 per gram',
    makingChargesMin: 180,
    makingChargesMax: 480,
    purityStandards: 'BIS hallmarked with NAC quality guarantee.',
    popularCollections: ['Bridal Collection', 'Temple Jewellery', 'Diamond Sets', 'Traditional Tamil'],
    exchangePolicy: 'Full exchange value for NAC jewellery at all stores.',
    regions: ['south'],
    cityLinks: [
      { name: 'Chennai', slug: 'chennai' },
      { name: 'Coimbatore', slug: 'coimbatore' },
      { name: 'Madurai', slug: 'madurai' },
      { name: 'Trichy', slug: 'trichy' },
    ],
    description: `NAC Jewellers (Nagappa & Co), established in 1973, is one of Chennai's respected jewellery chains with over 50 years of heritage. The brand has built loyalty through consistent quality and fair pricing.

Based in Chennai with presence across Tamil Nadu, NAC serves customers who value trust and traditional craftsmanship. Their expertise in South Indian designs has been passed down through generations.

NAC offers competitive making charges ranging from ₹180 to ₹480 per gram. They balance quality with affordability, making them popular among middle-class families.

The brand has strong bridal collections and traditional temple jewellery that cater to Tamil Nadu's wedding market. Their long presence has created a loyal customer base across generations.`,
    highlights: [
      '50+ years of Chennai heritage since 1973',
      'Competitive making charges',
      'Strong bridal and temple collections',
      'Trusted by multiple generations',
      'Good value for money',
    ],
    faqs: [
      {
        question: 'What are NAC Jewellers making charges?',
        answer: 'NAC making charges range from ₹180 to ₹480 per gram, which is competitive for Chennai jewellery market.',
      },
      {
        question: 'Where is NAC Jewellers located?',
        answer: 'NAC is based in Chennai and has stores across Tamil Nadu including Coimbatore, Madurai, and Trichy.',
      },
      {
        question: 'Is NAC good for wedding jewellery?',
        answer: 'Yes, NAC has strong bridal collections with 50+ years of expertise in traditional Tamil Nadu wedding jewellery.',
      },
      {
        question: 'Does NAC have temple jewellery?',
        answer: 'Yes, NAC offers traditional temple jewellery collections which are popular for weddings and festivals.',
      },
    ],
    website: 'https://www.nacjewellers.com',
  },

  prince: {
    name: 'Prince Jewellery',
    slug: 'prince',
    type: 'regional',
    headquarters: 'Chennai, Tamil Nadu',
    foundedYear: 1975,
    makingChargesRange: '₹200 - ₹500 per gram',
    makingChargesMin: 200,
    makingChargesMax: 500,
    purityStandards: 'BIS hallmarked with Prince quality assurance.',
    popularCollections: ['Grand Wedding', 'Temple Collection', 'Diamond Jewellery', 'Platinum Range'],
    exchangePolicy: 'Lifetime exchange at full gold value for Prince jewellery.',
    regions: ['south'],
    cityLinks: [
      { name: 'Chennai', slug: 'chennai' },
      { name: 'Coimbatore', slug: 'coimbatore' },
      { name: 'Madurai', slug: 'madurai' },
      { name: 'Trichy', slug: 'trichy' },
      { name: 'Salem', slug: 'salem' },
    ],
    description: `Prince Jewellery, established in 1975, is a prominent Chennai-based jewellery retailer known for extensive collections and grand showrooms. The brand has become a landmark destination for jewellery shopping in Tamil Nadu.

Their flagship store in Padi, Chennai is one of the largest jewellery showrooms in South India, featuring multiple floors of jewellery collections. This grand retail experience sets them apart.

Prince offers competitive making charges from ₹200 to ₹500 per gram. They cater to all segments from daily wear to elaborate bridal sets, with particularly strong wedding collections.

With presence across major Tamil Nadu cities, Prince Jewellery is known for variety and scale. Their Grand Wedding collection is specifically curated for Tamil Nadu wedding traditions.`,
    highlights: [
      'Grand flagship store in Chennai',
      '45+ years of heritage since 1975',
      'Extensive variety across segments',
      'Strong bridal and wedding collections',
      'Landmark destination in Tamil Nadu',
    ],
    faqs: [
      {
        question: 'What are Prince Jewellery making charges?',
        answer: 'Prince Jewellery making charges range from ₹200 to ₹500 per gram depending on design and category.',
      },
      {
        question: 'Where is Prince Jewellery\'s biggest store?',
        answer: 'Prince Jewellery\'s flagship store in Padi, Chennai is their largest showroom and one of the biggest jewellery stores in South India.',
      },
      {
        question: 'Is Prince good for wedding jewellery?',
        answer: 'Yes, Prince has extensive Grand Wedding collections specifically designed for Tamil Nadu wedding traditions.',
      },
      {
        question: 'Does Prince have diamond jewellery?',
        answer: 'Yes, Prince offers a comprehensive diamond jewellery collection along with platinum and gold ranges.',
      },
    ],
    website: 'https://www.princejewellery.com',
  },

  saravana: {
    name: 'Saravana Stores Gold Palace',
    slug: 'saravana',
    type: 'regional',
    headquarters: 'Chennai, Tamil Nadu',
    foundedYear: 1995,
    makingChargesRange: '₹140 - ₹350 per gram',
    makingChargesMin: 140,
    makingChargesMax: 350,
    purityStandards: 'BIS hallmarked jewellery.',
    popularCollections: ['Budget Wedding', 'Daily Wear', 'Temple Jewellery', 'Traditional Gold'],
    exchangePolicy: 'Gold exchange available at Gold Palace stores.',
    regions: ['south'],
    cityLinks: [
      { name: 'Chennai', slug: 'chennai' },
    ],
    description: `Saravana Stores Gold Palace, part of the famous Saravana Stores retail chain, is known for offering some of the lowest making charges in Chennai. The gold division operates from their flagship T Nagar location.

As an extension of India's largest retail store by floor space, Saravana Gold Palace leverages high volumes to offer competitive pricing. Their making charges are among the lowest in organized retail.

Making charges range from just ₹140 to ₹350 per gram - significantly lower than competitors. This pricing strategy attracts budget-conscious buyers looking for quality at minimal extra cost.

While variety may be more limited compared to dedicated jewellers, Saravana Gold Palace is ideal for buyers prioritizing cost over extensive selection. They are particularly popular for basic gold items and budget wedding jewellery.`,
    highlights: [
      'Among the lowest making charges in Chennai',
      'Part of famous Saravana Stores chain',
      'High volume enables competitive pricing',
      'Good for budget-conscious buyers',
      'Located in popular T Nagar shopping area',
    ],
    faqs: [
      {
        question: 'What are Saravana Stores gold making charges?',
        answer: 'Saravana Stores Gold Palace has some of the lowest making charges in Chennai - ₹140 to ₹350 per gram.',
      },
      {
        question: 'Is Saravana Stores gold genuine?',
        answer: 'Yes, Saravana Stores Gold Palace sells BIS hallmarked jewellery with certified purity.',
      },
      {
        question: 'Where is Saravana Gold Palace located?',
        answer: 'Saravana Stores Gold Palace is located within the Saravana Stores complex in T Nagar, Chennai.',
      },
      {
        question: 'Why is Saravana gold cheaper?',
        answer: 'Saravana leverages high customer volumes from their retail chain to keep making charges low while maintaining margins.',
      },
    ],
    website: 'https://www.saravanastores.in',
  },

  mehrasons: {
    name: 'Mehrasons Jewellers',
    slug: 'mehrasons',
    type: 'regional',
    headquarters: 'New Delhi',
    foundedYear: 1870,
    makingChargesRange: '₹280 - ₹650 per gram',
    makingChargesMin: 280,
    makingChargesMax: 650,
    purityStandards: 'BIS hallmarked with 150+ years of trust.',
    popularCollections: ['Polki Jewellery', 'Kundan Collection', 'Bridal Sets', 'Diamond Jewellery'],
    exchangePolicy: 'Full gold exchange value for Mehrasons jewellery.',
    regions: ['north'],
    cityLinks: [
      { name: 'Delhi', slug: 'delhi' },
      { name: 'Lucknow', slug: 'lucknow' },
      { name: 'Jaipur', slug: 'jaipur' },
      { name: 'Chandigarh', slug: 'chandigarh' },
    ],
    description: `Mehrasons Jewellers, established in 1870, is one of Delhi's oldest and most prestigious jewellery houses with over 150 years of heritage. Based in Chandni Chowk, they are specialists in traditional North Indian jewellery.

The brand is renowned for Polki and Kundan work - traditional North Indian uncut diamond and gold techniques that require exceptional craftsmanship. Their expertise has been passed down through six generations.

Making charges at Mehrasons range from ₹280 to ₹650 per gram, reflecting their heritage and specialized craftsmanship. For traditional North Indian wedding jewellery, especially Polki and Kundan, they are among the best.

Their Chandni Chowk showroom is a destination for brides seeking authentic traditional North Indian jewellery. The brand represents the best of Delhi's jewellery craftsmanship heritage.`,
    highlights: [
      '150+ years of heritage since 1870',
      'Six generations of craftsmanship',
      'Masters of Polki and Kundan work',
      'Historic Chandni Chowk presence',
      'Best for traditional North Indian bridal',
    ],
    faqs: [
      {
        question: 'What are Mehrasons making charges?',
        answer: 'Mehrasons making charges range from ₹280 to ₹650 per gram. Polki and Kundan work may have higher charges due to specialized craftsmanship.',
      },
      {
        question: 'Is Mehrasons good for Polki jewellery?',
        answer: 'Yes, Mehrasons is one of Delhi\'s best jewellers for traditional Polki and Kundan work with 150+ years of expertise.',
      },
      {
        question: 'Where is Mehrasons located?',
        answer: 'Mehrasons\' historic showroom is in Chandni Chowk, Delhi. They also have presence in other North Indian cities.',
      },
      {
        question: 'Is Mehrasons only for wedding jewellery?',
        answer: 'While famous for bridal jewellery, Mehrasons also offers contemporary designs, diamonds, and everyday gold jewellery.',
      },
    ],
    website: 'https://www.mehrasons.com',
  },
};

// Helper functions
export function getJewellerConfig(slug: string): JewellerConfig | undefined {
  return JEWELLER_CONFIGS[slug.toLowerCase()];
}

export function getAllJewellerSlugs(): string[] {
  return Object.keys(JEWELLER_CONFIGS);
}

export function getAllJewellers(): JewellerConfig[] {
  return Object.values(JEWELLER_CONFIGS);
}

export function getJewellersByRegion(region: Region): JewellerConfig[] {
  return Object.values(JEWELLER_CONFIGS).filter(
    (j) => j.regions.includes(region) || j.regions.includes('pan-india')
  );
}

export function getJewellersByType(type: JewellerType): JewellerConfig[] {
  return Object.values(JEWELLER_CONFIGS).filter((j) => j.type === type);
}

export function searchJewellers(query: string): JewellerConfig[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(JEWELLER_CONFIGS).filter(
    (j) =>
      j.name.toLowerCase().includes(lowerQuery) ||
      j.headquarters.toLowerCase().includes(lowerQuery) ||
      j.regions.some((r) => r.includes(lowerQuery))
  );
}

// Get related jewellers (same region, different from current)
export function getRelatedJewellers(slug: string, limit: number = 4): JewellerConfig[] {
  const current = getJewellerConfig(slug);
  if (!current) return [];
  
  const related = Object.values(JEWELLER_CONFIGS).filter((j) => {
    if (j.slug === slug) return false;
    return j.regions.some((r) => current.regions.includes(r) || r === 'pan-india');
  });
  
  return related.slice(0, limit);
}
