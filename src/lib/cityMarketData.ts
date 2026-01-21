/**
 * City-specific market data for local SEO enhancement
 * Contains unique local information about gold markets, landmarks, making charges, and trends
 */

import type { CityMarketData } from "@/app/components/CityLocalSEOBlock";

export const CITY_MARKET_DATA: Record<string, CityMarketData> = {
  chennai: {
    landmarks: [
      {
        name: "T. Nagar (Usman Road)",
        description: "India's largest gold jewellery market with over 500 shops. Home to GRT, Lalitha Jewellery, Saravana Stores, and hundreds of traditional jewellers. Best for wedding shopping and bulk purchases.",
        speciality: "Traditional South Indian temple jewellery, wedding sets, antique designs",
        area: "Thyagaraya Nagar",
      },
      {
        name: "Mylapore",
        description: "Historic temple town with traditional jewellers near Kapaleeshwarar Temple. Known for authentic temple jewellery designs and family-run gold shops with generations of expertise.",
        speciality: "Temple jewellery, Manga Malai, Kasu Malai, devotional ornaments",
        area: "Near Kapaleeshwarar Temple",
      },
      {
        name: "Pondy Bazaar",
        description: "Popular shopping destination with a mix of showrooms and local jewellers. Good for comparison shopping with competitive pricing and variety of styles.",
        speciality: "Modern designs, daily wear jewellery, competitive pricing",
        area: "T. Nagar area",
      },
      {
        name: "Anna Nagar",
        description: "Upscale residential area with premium jewellery showrooms including Tanishq, Kalyan, and boutique stores. Modern shopping experience with parking facilities.",
        speciality: "Premium branded jewellery, contemporary designs, diamond studded",
        area: "Anna Nagar West & East",
      },
    ],
    makingCharges: {
      range: "₹150 - ₹500 per gram",
      plain: "₹150 - ₹250/gram",
      antique: "₹300 - ₹400/gram",
      temple: "₹350 - ₹500/gram",
      diamond: "₹400 - ₹600/gram",
      tips: [
        "T. Nagar offers the most competitive making charges due to high competition",
        "Local family jewellers in Mylapore often have lower charges than showrooms",
        "Negotiate making charges for bulk wedding purchases (10+ grams)",
        "Ask for separate billing of gold weight, making charges, and GST",
        "Compare at least 3-4 shops in T. Nagar before finalizing",
      ],
    },
    historicalTrends: {
      summary: "Chennai gold rates closely follow IBJA benchmarks with minimal premium. Tamil Nadu accounts for nearly 40% of India's gold consumption, making Chennai a price-setter for South India. Rates are typically ₹50-100 higher than Mumbai due to strong local demand.",
      yearlyTrend: "8-12% annual appreciation over the past decade, with 2023-24 showing exceptional 15%+ growth",
      seasonalPattern: "Prices peak during Tamil wedding season (April-June, November-February) and festivals like Pongal and Deepavali",
      bestBuyingTime: "Post-monsoon (August-September) and January (post-wedding season) often see relatively stable prices",
      festivalImpact: "Pongal, Akshaya Tritiya, and Deepavali see 20-30% surge in buying volumes with potential premium pricing",
    },
  },

  mumbai: {
    landmarks: [
      {
        name: "Zaveri Bazaar",
        description: "Asia's oldest and largest bullion market, established over 150 years ago. Over 5,000 jewellers and bullion traders operate here. The heart of India's gold trade and home to IBJA which sets national reference rates.",
        speciality: "Wholesale bullion, Maharashtrian jewellery, investment gold, lowest premiums",
        area: "Kalbadevi, South Mumbai",
      },
      {
        name: "Dadar",
        description: "Popular retail destination with a mix of traditional Maharashtrian jewellers and national chains. Known for competitive pricing and authentic Kolhapuri Saaj designs.",
        speciality: "Kolhapuri Saaj, Maharashtrian wedding sets, Waman Hari Pethe designs",
        area: "Dadar West",
      },
      {
        name: "Borivali-Kandivali",
        description: "Major suburban jewellery hub with multiple showrooms catering to North Mumbai residents. PNG, TBZ, and other major chains have flagship stores here.",
        speciality: "Gujarati wedding jewellery, modern showroom experience, family shopping",
        area: "Western Suburbs",
      },
      {
        name: "Malad-Goregaon",
        description: "Growing jewellery destination with malls and standalone showrooms. Convenient for suburban customers with ample parking and modern facilities.",
        speciality: "Diamond jewellery, contemporary designs, mall shopping experience",
        area: "Western Suburbs",
      },
    ],
    makingCharges: {
      range: "₹200 - ₹550 per gram",
      plain: "₹200 - ₹300/gram",
      antique: "₹350 - ₹450/gram",
      diamond: "₹400 - ₹550/gram",
      tips: [
        "Zaveri Bazaar offers the lowest making charges due to wholesale volumes",
        "Compare rates between Zaveri Bazaar (wholesale) and showrooms (retail)",
        "PNG and TBZ often have seasonal offers with reduced making charges",
        "For investment gold, buy from Zaveri Bazaar bullion dealers for minimal premium",
        "Wedding season (November-February) may have promotional discounts at showrooms",
      ],
    },
    historicalTrends: {
      summary: "Mumbai sets the benchmark for Indian gold prices through IBJA. Being the primary import gateway and MCX trading hub, Mumbai rates are typically ₹20-50 lower than South Indian cities with the quickest response to international price movements.",
      yearlyTrend: "8-12% annual appreciation historically, with prices closely tracking international markets",
      seasonalPattern: "Prices fluctuate during Gudi Padwa, wedding season (November-February), and Diwali season",
      bestBuyingTime: "Post-Diwali (November) and monsoon months (July-August) often see price corrections",
      festivalImpact: "Dhanteras sees the highest single-day gold sales in India; Gudi Padwa is major buying occasion in Maharashtra",
    },
  },

  delhi: {
    landmarks: [
      {
        name: "Chandni Chowk & Dariba Kalan",
        description: "Historic gold market dating back to Mughal era. Dariba Kalan is India's premier destination for traditional Kundan and Polki jewellery. Over 3,000 jewellery shops in the area.",
        speciality: "Kundan jewellery, Polki diamonds, traditional North Indian bridal sets",
        area: "Old Delhi",
      },
      {
        name: "Karol Bagh",
        description: "Major retail jewellery hub with hundreds of shops in Ajmal Khan Road and surrounding areas. Known for competitive pricing and variety of styles from traditional to modern.",
        speciality: "Competitive pricing, variety of styles, both traditional and modern designs",
        area: "Central Delhi",
      },
      {
        name: "South Extension",
        description: "Upscale shopping destination with premium jewellery showrooms and designer boutiques. Popular among South Delhi residents for high-end purchases.",
        speciality: "Premium designer jewellery, branded showrooms, contemporary designs",
        area: "South Delhi",
      },
      {
        name: "Greater Kailash (GK) & Defence Colony",
        description: "Premium shopping areas with exclusive boutiques and designer stores. Known for customized designs and high-end diamond jewellery.",
        speciality: "Custom designs, diamond jewellery, celebrity jewellers",
        area: "South Delhi",
      },
    ],
    makingCharges: {
      range: "₹220 - ₹700 per gram",
      plain: "₹220 - ₹320/gram",
      antique: "₹350 - ₹500/gram",
      kundan: "₹500 - ₹700/gram",
      diamond: "₹450 - ₹650/gram",
      tips: [
        "Chandni Chowk offers authentic Kundan work at competitive rates",
        "Karol Bagh has the highest competition, enabling better bargaining",
        "For Kundan/Polki, verify the gold and polki quality separately",
        "South Delhi showrooms charge premium but offer better shopping experience",
        "Wedding season (October-February) sees special schemes and offers",
      ],
    },
    historicalTrends: {
      summary: "Delhi NCR gold rates serve as the North India benchmark, closely following IBJA rates with minimal variance. Strong demand during wedding season (October-February) and festivals like Karva Chauth drive local price movements.",
      yearlyTrend: "10-15% annual appreciation over the past decade, outperforming many investment classes",
      seasonalPattern: "Peak demand during wedding season (Oct-Feb), Karva Chauth, and Diwali pushes prices higher",
      bestBuyingTime: "Summer months (May-July) and post-wedding season (March-April) typically see stable prices",
      festivalImpact: "Karva Chauth is unique to North India with significant gold buying; Dhanteras sees maximum footfall",
    },
  },

  bangalore: {
    landmarks: [
      {
        name: "Commercial Street",
        description: "Bangalore's oldest and most popular shopping street with numerous jewellery shops. Mix of traditional South Indian designs and contemporary styles catering to the cosmopolitan city.",
        speciality: "Mix of traditional and modern, competitive pricing, wide variety",
        area: "Central Bangalore",
      },
      {
        name: "Jayanagar 4th Block",
        description: "Popular shopping complex with both local jewellers and national chains. Known for South Indian traditional designs with a focus on quality.",
        speciality: "Karnataka traditional designs, family jewellers, trusted shops",
        area: "South Bangalore",
      },
      {
        name: "Chickpete",
        description: "Traditional wholesale and retail market in old Bangalore. Known for competitive pricing and traditional Kannada jewellery designs.",
        speciality: "Wholesale rates, traditional Karnataka jewellery, Kasumala designs",
        area: "Old Bangalore",
      },
      {
        name: "Indiranagar & Koramangala",
        description: "Modern shopping areas with premium showrooms catering to IT professionals. Contemporary designs and international styles available.",
        speciality: "Contemporary designs, diamond jewellery, premium branded stores",
        area: "East Bangalore",
      },
    ],
    makingCharges: {
      range: "₹180 - ₹500 per gram",
      plain: "₹180 - ₹280/gram",
      antique: "₹320 - ₹420/gram",
      temple: "₹350 - ₹480/gram",
      diamond: "₹400 - ₹550/gram",
      tips: [
        "Chickpete and Jayanagar offer better rates than mall showrooms",
        "C. Krishniah Chetty is Bangalore's oldest and most trusted jeweller",
        "Compare IT hub area prices with traditional markets",
        "Many shops offer exchange schemes during Ugadi and Deepavali",
        "Negotiate on bulk purchases for wedding jewellery",
      ],
    },
    historicalTrends: {
      summary: "Bangalore gold rates follow Karnataka Bullion Merchants Association pricing, closely aligned with South Indian markets. Strong demand from IT professionals and affluent population keeps prices competitive with Chennai.",
      yearlyTrend: "9-13% annual appreciation, driven by strong purchasing power of IT sector",
      seasonalPattern: "Peak buying during Ugadi, wedding season, and Deepavali; IT bonus season (January-March) sees increased demand",
      bestBuyingTime: "Post-monsoon (September-October) before festival season often offers stable pricing",
      festivalImpact: "Ugadi and Varamahalakshmi Vrata are significant gold buying occasions in Karnataka",
    },
  },

  hyderabad: {
    landmarks: [
      {
        name: "Begum Bazaar",
        description: "Historic market in old city with traditional wholesale and retail gold shops. Known for Hyderabadi jewellery designs and competitive pricing.",
        speciality: "Hyderabadi Choker, Satlada, traditional Nizami designs",
        area: "Old City, near Charminar",
      },
      {
        name: "Panjagutta & Jubilee Hills",
        description: "Modern jewellery hub with showrooms from national and regional brands. Premium shopping experience catering to upscale customers.",
        speciality: "Branded showrooms, contemporary designs, diamond jewellery",
        area: "Central Hyderabad",
      },
      {
        name: "Abids",
        description: "Central Hyderabad shopping area with mix of traditional and modern jewellers. Popular destination for everyday jewellery purchases.",
        speciality: "Variety of price points, convenient central location",
        area: "Central Hyderabad",
      },
      {
        name: "Secunderabad",
        description: "Twin city shopping destination with established jewellery shops and malls. Good for North Hyderabad residents.",
        speciality: "Mall shopping, suburban convenience, family stores",
        area: "Secunderabad",
      },
    ],
    makingCharges: {
      range: "₹200 - ₹550 per gram",
      plain: "₹200 - ₹300/gram",
      antique: "₹350 - ₹450/gram",
      temple: "₹400 - ₹500/gram",
      diamond: "₹420 - ₹550/gram",
      tips: [
        "Begum Bazaar offers traditional designs at wholesale-like rates",
        "GRT and Joyalukkas have strong presence with competitive offers",
        "Verify Hyderabadi designs have proper gold content (some use meenakari)",
        "Wedding packages often include making charge discounts",
        "Compare Begum Bazaar rates with Jubilee Hills showroom prices",
      ],
    },
    historicalTrends: {
      summary: "Hyderabad gold prices blend Andhra Pradesh and Telangana market influences. The city has strong gold buying tradition, especially for Nizami-style jewellery. Rates are comparable to Chennai with occasional local variations.",
      yearlyTrend: "8-12% annual appreciation, with IT sector growth boosting demand in recent years",
      seasonalPattern: "Peak buying during Ugadi, Bathukamma, Diwali, and wedding season (November-February)",
      bestBuyingTime: "Summer months and post-festival periods typically offer stable pricing",
      festivalImpact: "Bathukamma festival and Ugadi see significant gold purchases; Dussehra is also important",
    },
  },

  kolkata: {
    landmarks: [
      {
        name: "Bowbazar",
        description: "Kolkata's historic jewellery district with over 1,000 shops. The primary destination for traditional Bengali gold jewellery and wholesale bullion trading.",
        speciality: "Bengali jewellery, Mantasha, Dhokla designs, wholesale bullion",
        area: "Central Kolkata",
      },
      {
        name: "Gariahat",
        description: "Popular South Kolkata shopping area with mix of local jewellers and branded showrooms. Known for everyday jewellery and wedding shopping.",
        speciality: "Mix of traditional and modern, family jewellers, convenient shopping",
        area: "South Kolkata",
      },
      {
        name: "Park Street & Camac Street",
        description: "Premium shopping area with high-end boutiques and showrooms. Contemporary designs catering to Kolkata's cosmopolitan crowd.",
        speciality: "Designer jewellery, contemporary styles, premium showrooms",
        area: "Central Kolkata",
      },
      {
        name: "Salt Lake & New Town",
        description: "Modern residential areas with new showrooms and malls. Convenient for IT sector residents with parking facilities.",
        speciality: "Mall shopping, modern showroom experience, branded stores",
        area: "East Kolkata",
      },
    ],
    makingCharges: {
      range: "₹250 - ₹600 per gram",
      plain: "₹250 - ₹350/gram",
      antique: "₹400 - ₹500/gram",
      diamond: "₹450 - ₹600/gram",
      tips: [
        "Bowbazar offers the most competitive rates for Bengali designs",
        "Senco Gold and PC Chandra are Kolkata's most trusted chains",
        "Traditional Bengali designs have higher making charges due to craftsmanship",
        "Verify meenakari work quality as it affects gold content",
        "Durga Puja season sees special schemes and offers",
      ],
    },
    historicalTrends: {
      summary: "Kolkata gold rates serve as the East India benchmark. The city has deep cultural connection with gold, especially for Bengali wedding traditions. Rates are typically aligned with IBJA with slight regional variations during festival seasons.",
      yearlyTrend: "8-11% annual appreciation, with steady demand from traditional households",
      seasonalPattern: "Peak buying during Durga Puja, Lakshmi Puja, Bengali wedding season (December-February)",
      bestBuyingTime: "Post-monsoon (October) before Durga Puja rush, and summer months (April-May)",
      festivalImpact: "Durga Puja is THE major gold buying occasion; Akshaya Tritiya and Dhanteras also significant",
    },
  },

  ahmedabad: {
    landmarks: [
      {
        name: "Manek Chowk",
        description: "Historic jewellery and bullion market in old Ahmedabad. One of India's largest gold markets with hundreds of shops selling traditional Gujarati designs.",
        speciality: "Traditional Gujarati jewellery, Kundan work, wholesale bullion",
        area: "Old City, Walled Ahmedabad",
      },
      {
        name: "Ashram Road",
        description: "Modern commercial area with branded showrooms and designer stores. Premium shopping experience with air-conditioned comfort.",
        speciality: "Branded showrooms, contemporary designs, modern shopping",
        area: "Central Ahmedabad",
      },
      {
        name: "CG Road",
        description: "Upscale shopping destination with premium jewellery boutiques and national chain showrooms. Popular among young professionals.",
        speciality: "Diamond jewellery, designer collections, premium brands",
        area: "Navrangpura area",
      },
      {
        name: "SG Highway",
        description: "New Ahmedabad's premium shopping corridor with malls and flagship showrooms. Modern facilities catering to West Ahmedabad residents.",
        speciality: "Mall shopping, flagship stores, parking facilities",
        area: "West Ahmedabad",
      },
    ],
    makingCharges: {
      range: "₹200 - ₹500 per gram",
      plain: "₹200 - ₹300/gram",
      antique: "₹350 - ₹450/gram",
      kundan: "₹400 - ₹500/gram",
      diamond: "₹380 - ₹520/gram",
      tips: [
        "Manek Chowk has the most competitive rates due to wholesale trading",
        "Gujarat has strong gold buying culture - dealers are experienced",
        "Traditional Gujarati designs have moderate making charges",
        "Compare old city rates with modern showroom prices",
        "Diwali and Dhanteras see special promotional offers",
      ],
    },
    historicalTrends: {
      summary: "Ahmedabad is Gujarat's primary gold market, benefiting from the state's prosperous trading community. The city has historically lower gold prices than South India due to proximity to ports and strong bullion trading.",
      yearlyTrend: "8-12% annual appreciation, with Gujarati NRI remittances adding to demand",
      seasonalPattern: "Peak buying during Diwali, Dhanteras, wedding season (November-February), and Navratri",
      bestBuyingTime: "Summer months (April-June) and post-Diwali (November) often see price stability",
      festivalImpact: "Dhanteras is the biggest gold buying day; Navratri also sees significant purchases",
    },
  },

  pune: {
    landmarks: [
      {
        name: "Tulshibaug",
        description: "Historic shopping area with traditional Maharashtrian jewellers. Known for authentic Kolhapuri Saaj and Marathi jewellery designs at competitive rates.",
        speciality: "Kolhapuri Saaj, traditional Maharashtrian designs, competitive rates",
        area: "Central Pune, near Laxmi Road",
      },
      {
        name: "Laxmi Road",
        description: "Pune's primary shopping street with multiple jewellery showrooms. Mix of traditional and modern stores catering to all budgets.",
        speciality: "Variety of shops, all price ranges, convenient central location",
        area: "Central Pune",
      },
      {
        name: "FC Road & JM Road",
        description: "Popular areas for young professionals with branded showrooms and modern designs. Contemporary jewellery and workwear options.",
        speciality: "Contemporary designs, daily wear, branded stores",
        area: "Deccan area",
      },
      {
        name: "Aundh & Baner",
        description: "New Pune's residential areas with modern showrooms in malls. Convenient for IT professionals with parking and modern facilities.",
        speciality: "Mall shopping, modern showrooms, IT hub convenience",
        area: "North-West Pune",
      },
    ],
    makingCharges: {
      range: "₹200 - ₹500 per gram",
      plain: "₹200 - ₹300/gram",
      antique: "₹320 - ₹420/gram",
      diamond: "₹400 - ₹520/gram",
      tips: [
        "Tulshibaug and Laxmi Road offer the best rates for traditional designs",
        "PNG Jewellers originated in Pune and offers competitive local pricing",
        "Compare old city jewellers with Aundh/Baner mall showrooms",
        "Wedding season (November-March) brings promotional offers",
        "IT bonus season (January-March) sees increased demand",
      ],
    },
    historicalTrends: {
      summary: "Pune gold rates closely follow Mumbai, being just 150km away. The city's growing IT sector and educational institutions drive young buyer demand. Prices are typically within ₹10-20 of Mumbai rates.",
      yearlyTrend: "9-12% annual appreciation, with strong growth in diamond jewellery segment",
      seasonalPattern: "Peak buying during Gudi Padwa, wedding season, and Diwali; IT bonus season adds to Q1 demand",
      bestBuyingTime: "Monsoon months (July-September) and post-Diwali typically see stable pricing",
      festivalImpact: "Gudi Padwa is the primary gold buying festival; Diwali and Dhanteras also significant",
    },
  },

  jaipur: {
    landmarks: [
      {
        name: "Johari Bazaar",
        description: "Historic jewellery market in the Pink City, famous for Kundan, Meenakari, and traditional Rajasthani jewellery. One of India's oldest and most renowned jewellery markets.",
        speciality: "Kundan work, Meenakari, Thewa jewellery, precious stones",
        area: "Old City, Pink City",
      },
      {
        name: "Chandpole Bazaar",
        description: "Traditional market near Chandpole Gate with artisan workshops and wholesale dealers. Known for authentic handcrafted Rajasthani designs.",
        speciality: "Handcrafted designs, artisan workshops, traditional craftsmanship",
        area: "Near Chandpole Gate",
      },
      {
        name: "MI Road",
        description: "Modern shopping street with branded showrooms alongside traditional shops. Good mix of contemporary and traditional options.",
        speciality: "Mix of traditional and modern, branded stores, convenient shopping",
        area: "Central Jaipur",
      },
      {
        name: "Vaishali Nagar & Mansarovar",
        description: "Residential areas with modern jewellery showrooms and malls. Convenient for suburban customers with parking facilities.",
        speciality: "Modern showrooms, mall shopping, suburban convenience",
        area: "New Jaipur",
      },
    ],
    makingCharges: {
      range: "₹280 - ₹700 per gram",
      plain: "₹280 - ₹380/gram",
      antique: "₹400 - ₹500/gram",
      kundan: "₹500 - ₹700/gram",
      diamond: "₹450 - ₹600/gram",
      tips: [
        "Johari Bazaar is known worldwide for Kundan and Meenakari work",
        "Verify stone quality separately - Jaipur is famous for gemstones",
        "Kundan work commands premium but should be priced fairly",
        "Traditional Rajasthani designs have higher making charges due to craftsmanship",
        "Wedding purchases often get special attention and discounts",
      ],
    },
    historicalTrends: {
      summary: "Jaipur is India's gemstone capital and known for traditional Kundan jewellery. The city attracts tourists and buyers from across India seeking authentic Rajasthani designs. Prices include premium for unique craftsmanship.",
      yearlyTrend: "8-12% annual appreciation for plain gold; Kundan prices vary based on craftsmanship",
      seasonalPattern: "Peak buying during Teej, Gangaur, wedding season (November-March), and tourist season (October-March)",
      bestBuyingTime: "Summer months (April-June) see lower tourist crowds and potentially better bargaining",
      festivalImpact: "Teej and Gangaur are uniquely Rajasthani gold buying occasions; Akshaya Tritiya also important",
    },
  },

  kochi: {
    landmarks: [
      {
        name: "Broadway (Ernakulam)",
        description: "Commercial hub of Kochi with numerous jewellery shops. Known for traditional Kerala designs and competitive pricing in a bustling market atmosphere.",
        speciality: "Traditional Kerala jewellery, Manga Mala, competitive pricing",
        area: "Ernakulam",
      },
      {
        name: "MG Road",
        description: "Prime shopping street with branded showrooms and traditional shops. Mix of Malabar, Kalyan, and local jewellers offering variety of styles.",
        speciality: "Branded and local mix, variety of styles, convenient location",
        area: "Ernakulam",
      },
      {
        name: "Mattancherry",
        description: "Historic trading area in old Kochi with traditional jewellers. Known for antique designs and gold trading with Middle East connections.",
        speciality: "Antique designs, traditional craftsmanship, historic traders",
        area: "Fort Kochi area",
      },
      {
        name: "Lulu Mall & Centre Square",
        description: "Modern malls with air-conditioned showrooms of national chains. Premium shopping experience with parking and modern facilities.",
        speciality: "Mall shopping, branded stores, modern convenience",
        area: "Edappally area",
      },
    ],
    makingCharges: {
      range: "₹180 - ₹450 per gram",
      plain: "₹180 - ₹280/gram",
      antique: "₹300 - ₹400/gram",
      temple: "₹350 - ₹450/gram",
      diamond: "₹380 - ₹480/gram",
      tips: [
        "Kerala has the highest gold consumption per capita in India",
        "Malabar Gold originated in Kerala and offers competitive local rates",
        "Traditional Kerala designs have moderate making charges",
        "Compare Broadway (old market) with mall showroom prices",
        "Onam season brings special offers and schemes",
      ],
    },
    historicalTrends: {
      summary: "Kochi gold rates reflect Kerala's unique position as India's gold consumption leader. With high NRI remittances and cultural importance of gold, Kerala often sees premium pricing but also intense competition keeping rates fair.",
      yearlyTrend: "8-11% annual appreciation, with consistent demand throughout the year",
      seasonalPattern: "Peak buying during Onam, Vishu, wedding season (April-May, November-February)",
      bestBuyingTime: "Post-monsoon (October) and summer months before wedding season",
      festivalImpact: "Onam is Kerala's biggest gold buying festival; Vishu sees gold gifts as tradition",
    },
  },

  lucknow: {
    landmarks: [
      {
        name: "Hazratganj",
        description: "Lucknow's premier shopping street with traditional and modern jewellers. Known for Awadhi designs and competitive pricing in an organized market.",
        speciality: "Awadhi jewellery designs, mix of traditional and modern",
        area: "Central Lucknow",
      },
      {
        name: "Chowk",
        description: "Historic market in old Lucknow with traditional jewellers specializing in Nawabi-era designs. Known for intricate work and wholesale trading.",
        speciality: "Traditional Awadhi designs, Kundan work, wholesale rates",
        area: "Old Lucknow",
      },
      {
        name: "Aminabad",
        description: "Popular shopping area with variety of jewellers catering to middle-class families. Good for everyday jewellery at reasonable prices.",
        speciality: "Affordable jewellery, family shops, reasonable making charges",
        area: "Near Chowk",
      },
      {
        name: "Gomti Nagar",
        description: "Modern commercial area with branded showrooms and malls. Premium shopping experience for new Lucknow residents.",
        speciality: "Branded stores, modern shopping, parking facilities",
        area: "New Lucknow",
      },
    ],
    makingCharges: {
      range: "₹200 - ₹500 per gram",
      plain: "₹200 - ₹300/gram",
      antique: "₹350 - ₹450/gram",
      kundan: "₹400 - ₹500/gram",
      diamond: "₹380 - ₹520/gram",
      tips: [
        "Chowk area offers traditional designs at competitive rates",
        "Hazratganj provides organized shopping with transparent pricing",
        "Compare old city rates with Gomti Nagar showroom prices",
        "Awadhi designs have unique craftsmanship worth the premium",
        "Wedding season and Eid see special offers",
      ],
    },
    historicalTrends: {
      summary: "Lucknow gold rates follow North India benchmarks with prices typically within ₹20-30 of Delhi. The city's Nawabi heritage influences unique jewellery designs that command appropriate premiums.",
      yearlyTrend: "8-11% annual appreciation, aligned with North Indian market trends",
      seasonalPattern: "Peak buying during wedding season (October-February), Eid, and Diwali",
      bestBuyingTime: "Summer months (April-June) typically see stable pricing with less crowd",
      festivalImpact: "Eid-ul-Fitr and Eid-ul-Adha are significant buying occasions; Dhanteras also important",
    },
  },

  coimbatore: {
    landmarks: [
      {
        name: "Town Hall Area (Big Bazaar Street)",
        description: "Traditional jewellery market with numerous shops near Town Hall. Known for competitive pricing and traditional Tamil designs.",
        speciality: "Traditional Tamil jewellery, competitive pricing, established shops",
        area: "Central Coimbatore",
      },
      {
        name: "Gandhipuram",
        description: "Commercial hub with mix of local and national jewellers. Popular for variety of designs and convenient central location.",
        speciality: "Variety of shops, all price ranges, central location",
        area: "Central Coimbatore",
      },
      {
        name: "RS Puram",
        description: "Upscale residential area with premium showrooms. Known for branded stores and contemporary designs catering to affluent customers.",
        speciality: "Premium showrooms, branded stores, contemporary designs",
        area: "West Coimbatore",
      },
      {
        name: "Brookefields Mall & Fun Republic",
        description: "Modern malls with air-conditioned showrooms. Convenient shopping with parking and family-friendly facilities.",
        speciality: "Mall shopping, branded stores, modern amenities",
        area: "Various locations",
      },
    ],
    makingCharges: {
      range: "₹150 - ₹400 per gram",
      plain: "₹150 - ₹250/gram",
      antique: "₹280 - ₹380/gram",
      temple: "₹320 - ₹400/gram",
      diamond: "₹350 - ₹450/gram",
      tips: [
        "Coimbatore has some of Tamil Nadu's most competitive making charges",
        "Local jewellers in Town Hall area offer excellent rates",
        "Thangamayil and Lalitha have strong presence with local pricing",
        "Compare traditional market rates with mall showroom prices",
        "Wedding purchases get special attention and possible discounts",
      ],
    },
    historicalTrends: {
      summary: "Coimbatore gold rates closely follow Chennai but are typically ₹20-40 lower due to lower overheads and direct sourcing. The textile industry wealth drives strong gold demand in the region.",
      yearlyTrend: "8-12% annual appreciation, consistent with Tamil Nadu trends",
      seasonalPattern: "Peak buying during Tamil wedding season (April-June, November-February), Pongal, and Deepavali",
      bestBuyingTime: "Post-monsoon (August-September) and January typically see stable pricing",
      festivalImpact: "Pongal and Deepavali are major buying festivals; Aadi month (July-August) sees dips in buying",
    },
  },

  surat: {
    landmarks: [
      {
        name: "Chauta Bazaar",
        description: "Historic market known for diamond cutting and gold jewellery. Surat is the world's diamond cutting capital, influencing local jewellery market significantly.",
        speciality: "Diamond-studded jewellery, traditional Gujarati designs, wholesale rates",
        area: "Old Surat",
      },
      {
        name: "Athwa Lines",
        description: "Modern commercial area with premium showrooms. Popular among Surat's prosperous diamond merchant community.",
        speciality: "Premium showrooms, diamond jewellery, modern designs",
        area: "Central Surat",
      },
      {
        name: "Ring Road & Vesu",
        description: "New Surat's premium shopping destinations with malls and flagship stores. Modern facilities catering to new city residents.",
        speciality: "Mall shopping, flagship stores, parking facilities",
        area: "New Surat",
      },
      {
        name: "Mahidharpura",
        description: "Traditional market with focus on diamond processing and jewellery. Known for competitive rates on diamond-studded gold.",
        speciality: "Diamond processing, studded jewellery, competitive rates",
        area: "Near diamond markets",
      },
    ],
    makingCharges: {
      range: "₹180 - ₹480 per gram",
      plain: "₹180 - ₹280/gram",
      antique: "₹320 - ₹420/gram",
      diamond: "₹350 - ₹480/gram",
      tips: [
        "Surat is the diamond cutting capital - get excellent rates on studded jewellery",
        "Local jewellers offer competitive rates on diamond-gold combinations",
        "Verify diamond quality separately using GIA/IGI certificates",
        "Traditional Gujarati designs available at moderate making charges",
        "Diwali and wedding season bring special offers",
      ],
    },
    historicalTrends: {
      summary: "Surat gold rates benefit from Gujarat's strong trading community and the city's unique position as a diamond hub. Prices are typically competitive with Ahmedabad, with excellent deals on diamond-studded jewellery.",
      yearlyTrend: "8-11% annual appreciation for plain gold; diamond jewellery shows different trends",
      seasonalPattern: "Peak buying during Diwali, Dhanteras, wedding season (November-February)",
      bestBuyingTime: "Summer months and post-Diwali often see stable plain gold prices",
      festivalImpact: "Dhanteras sees massive gold sales; Dev Diwali also significant in Gujarat",
    },
  },

  patna: {
    landmarks: [
      {
        name: "Patna City (Old Patna)",
        description: "Traditional market area with established jewellers serving families for generations. Known for competitive pricing and trusted shops.",
        speciality: "Traditional designs, family jewellers, competitive rates",
        area: "Old Patna",
      },
      {
        name: "Fraser Road",
        description: "Commercial hub with mix of traditional and modern jewellers. Convenient central location with variety of shops.",
        speciality: "Variety of shops, central location, all price ranges",
        area: "Central Patna",
      },
      {
        name: "Boring Road",
        description: "Popular shopping area with branded showrooms and local shops. Known for mix of traditional and contemporary options.",
        speciality: "Mix of brands and local, convenient shopping",
        area: "Central Patna",
      },
      {
        name: "Kankarbagh & Pataliputra",
        description: "Residential areas with modern showrooms. Premium shopping experience for South Patna residents.",
        speciality: "Modern showrooms, branded stores, parking facilities",
        area: "South Patna",
      },
    ],
    makingCharges: {
      range: "₹200 - ₹450 per gram",
      plain: "₹200 - ₹300/gram",
      antique: "₹320 - ₹400/gram",
      diamond: "₹380 - ₹450/gram",
      tips: [
        "Traditional jewellers in Patna City offer competitive rates",
        "Compare rates between old city and modern area showrooms",
        "Verify BIS hallmarking on all purchases",
        "Wedding season brings special offers from major shops",
        "Chhath Puja sees significant gold buying in Bihar",
      ],
    },
    historicalTrends: {
      summary: "Patna gold rates serve as the Bihar benchmark, typically aligned with North Indian markets. Growing affluence and wedding traditions drive steady demand throughout the year.",
      yearlyTrend: "8-11% annual appreciation, following national trends",
      seasonalPattern: "Peak buying during wedding season (November-February), Chhath Puja, and Diwali",
      bestBuyingTime: "Summer months and post-wedding season typically see stable pricing",
      festivalImpact: "Chhath Puja is Bihar's biggest festival with significant gold buying; Dhanteras also important",
    },
  },

  chandigarh: {
    landmarks: [
      {
        name: "Sector 17",
        description: "Chandigarh's main shopping plaza with numerous jewellery showrooms. Organized market with branded and local shops.",
        speciality: "Organized shopping, mix of brands, variety of designs",
        area: "Sector 17 Plaza",
      },
      {
        name: "Sector 22",
        description: "Commercial area with traditional and modern jewellers. Popular for wedding shopping with competitive pricing.",
        speciality: "Wedding jewellery, competitive rates, variety of shops",
        area: "Sector 22",
      },
      {
        name: "Elante Mall",
        description: "Premium mall with flagship showrooms of national chains. Air-conditioned shopping with modern facilities.",
        speciality: "Mall shopping, branded stores, premium experience",
        area: "Industrial Area",
      },
      {
        name: "Panchkula (Sector 9)",
        description: "Haryana-side shopping area with jewellers serving tri-city residents. Good option for Panchkula and Mohali residents.",
        speciality: "Suburban convenience, local jewellers, tri-city serving",
        area: "Panchkula",
      },
    ],
    makingCharges: {
      range: "₹220 - ₹520 per gram",
      plain: "₹220 - ₹320/gram",
      antique: "₹350 - ₹450/gram",
      kundan: "₹420 - ₹520/gram",
      diamond: "₹400 - ₹500/gram",
      tips: [
        "Sector 17 and 22 have the most competitive rates",
        "Compare mall showroom prices with Sector market rates",
        "Punjabi families prefer heavy designs - negotiate on bulk",
        "Wedding season (November-February) sees special schemes",
        "Karva Chauth is significant gold buying occasion in Chandigarh",
      ],
    },
    historicalTrends: {
      summary: "Chandigarh gold rates reflect the affluent tri-city (Chandigarh, Mohali, Panchkula) market. Prices are typically within ₹10-30 of Delhi, influenced by strong Punjabi wedding traditions.",
      yearlyTrend: "9-12% annual appreciation, driven by strong purchasing power",
      seasonalPattern: "Peak buying during wedding season (Oct-Feb), Karva Chauth, Lohri, and Diwali",
      bestBuyingTime: "Summer months (May-July) typically see stable pricing with less crowd",
      festivalImpact: "Karva Chauth and Lohri are significant Punjabi gold buying occasions; Dhanteras also important",
    },
  },

  madurai: {
    landmarks: [
      {
        name: "South Masi Street",
        description: "Historic jewellery market near Meenakshi Temple. Traditional Tamil jewellers with generations of expertise in temple jewellery.",
        speciality: "Temple jewellery, traditional Tamil designs, pilgrimage purchases",
        area: "Temple area",
      },
      {
        name: "West Masi Street",
        description: "Commercial area with mix of local and branded jewellers. Good for everyday jewellery and wedding shopping.",
        speciality: "Mix of traditional and modern, competitive pricing",
        area: "Central Madurai",
      },
      {
        name: "Periyar Bus Stand Area",
        description: "Popular shopping area with multiple jewellery shops catering to visitors and locals.",
        speciality: "Convenient location, variety of shops, tourist-friendly",
        area: "Near Periyar Bus Stand",
      },
    ],
    makingCharges: {
      range: "₹140 - ₹400 per gram",
      plain: "₹140 - ₹240/gram",
      antique: "₹280 - ₹380/gram",
      temple: "₹320 - ₹400/gram",
      diamond: "₹350 - ₹450/gram",
      tips: [
        "Madurai has among the lowest making charges in Tamil Nadu",
        "Temple jewellery near Meenakshi Temple is authentic and well-crafted",
        "Compare rates with Chennai for best deals",
        "Wedding season (April-June) brings special offers",
        "Pilgrimage season sees good variety of religious jewellery",
      ],
    },
    historicalTrends: {
      summary: "Madurai gold rates are typically ₹30-50 lower than Chennai due to lower overheads. The city's temple town status drives unique demand for religious and traditional jewellery designs.",
      yearlyTrend: "8-11% annual appreciation, following Tamil Nadu market trends",
      seasonalPattern: "Peak buying during Chithirai festival, wedding season (April-June), and Deepavali",
      bestBuyingTime: "Post-monsoon months and January typically see stable pricing",
      festivalImpact: "Meenakshi Temple's Chithirai festival sees significant gold buying; Pongal also important",
    },
  },

  mangalore: {
    landmarks: [
      {
        name: "Hampankatta",
        description: "Commercial hub with numerous jewellery shops. Known for traditional Tulu and Karnataka designs with competitive pricing.",
        speciality: "Tulu jewellery designs, Karnataka traditional, competitive rates",
        area: "Central Mangalore",
      },
      {
        name: "Balmatta Road",
        description: "Popular shopping area with mix of local and national jewellers. Good for variety of designs.",
        speciality: "Variety of shops, mix of brands, convenient location",
        area: "Central Mangalore",
      },
      {
        name: "Forum Fiza Mall",
        description: "Modern mall with branded showrooms. Premium shopping experience with parking facilities.",
        speciality: "Mall shopping, branded stores, modern amenities",
        area: "New Mangalore",
      },
    ],
    makingCharges: {
      range: "₹160 - ₹420 per gram",
      plain: "₹160 - ₹260/gram",
      antique: "₹300 - ₹380/gram",
      temple: "₹320 - ₹420/gram",
      diamond: "₹360 - ₹450/gram",
      tips: [
        "Mangalore has strong goldsmith tradition - quality craftsmanship",
        "Traditional Tulu designs are unique to the region",
        "Compare Hampankatta rates with mall showroom prices",
        "Moodbidri nearby is famous for traditional jewellery",
        "Deepavali and wedding season bring special offers",
      ],
    },
    historicalTrends: {
      summary: "Mangalore gold rates reflect the Coastal Karnataka market with strong demand from trading communities. The city's goldsmith heritage ensures quality craftsmanship at competitive prices.",
      yearlyTrend: "8-11% annual appreciation, consistent with Karnataka markets",
      seasonalPattern: "Peak buying during wedding season, Deepavali, and Ugadi",
      bestBuyingTime: "Post-monsoon (September-October) typically sees stable pricing",
      festivalImpact: "Tulu New Year and Deepavali are significant buying occasions; Ugadi also important",
    },
  },

  mysore: {
    landmarks: [
      {
        name: "Devaraja Market Area",
        description: "Historic market with traditional jewellers near the famous Devaraja Market. Known for authentic Karnataka designs.",
        speciality: "Traditional Karnataka designs, family jewellers, heritage shops",
        area: "Central Mysore",
      },
      {
        name: "Sayyaji Rao Road",
        description: "Main commercial street with branded showrooms and local jewellers. Convenient central location.",
        speciality: "Mix of brands and local, convenient shopping, variety",
        area: "Central Mysore",
      },
      {
        name: "Mall of Mysore",
        description: "Modern mall with national chain showrooms. Air-conditioned shopping with modern facilities.",
        speciality: "Mall shopping, branded stores, modern experience",
        area: "Outer Mysore",
      },
    ],
    makingCharges: {
      range: "₹170 - ₹430 per gram",
      plain: "₹170 - ₹270/gram",
      antique: "₹300 - ₹400/gram",
      temple: "₹340 - ₹430/gram",
      diamond: "₹380 - ₹480/gram",
      tips: [
        "Mysore has rich heritage of royal jewellery designs",
        "Traditional Karnataka designs available at competitive rates",
        "Compare heritage area rates with mall showroom prices",
        "Dasara season brings special offers and unique designs",
        "Wedding purchases get attention from traditional jewellers",
      ],
    },
    historicalTrends: {
      summary: "Mysore gold rates follow Bangalore trends, typically within ₹10-20. The city's royal heritage influences unique design preferences, with tourists also driving demand for traditional pieces.",
      yearlyTrend: "8-11% annual appreciation, aligned with Karnataka market",
      seasonalPattern: "Peak buying during Dasara festival, wedding season, and Ugadi",
      bestBuyingTime: "Summer months (March-May) before monsoon typically see stable pricing",
      festivalImpact: "Mysore Dasara is THE major festival with significant gold buying; tourists contribute to demand",
    },
  },

  nagpur: {
    landmarks: [
      {
        name: "Itwari",
        description: "Historic wholesale and retail market with traditional Vidarbha jewellers. Known for competitive pricing.",
        speciality: "Traditional designs, wholesale rates, competitive pricing",
        area: "Central Nagpur",
      },
      {
        name: "Sitabuldi",
        description: "Main commercial area with branded showrooms and local shops. Convenient central location.",
        speciality: "Mix of brands and local, central location, variety",
        area: "Central Nagpur",
      },
      {
        name: "Dharampeth",
        description: "Upscale area with premium jewellery showrooms. Popular among affluent Nagpur residents.",
        speciality: "Premium showrooms, branded stores, modern designs",
        area: "South Nagpur",
      },
    ],
    makingCharges: {
      range: "₹180 - ₹450 per gram",
      plain: "₹180 - ₹280/gram",
      antique: "₹320 - ₹400/gram",
      diamond: "₹380 - ₹450/gram",
      tips: [
        "Itwari market offers wholesale-like rates for retail buyers",
        "Nagpur is central India's gold hub - competitive pricing",
        "Compare Itwari rates with modern area showrooms",
        "Wedding season and Diwali bring promotional offers",
        "Orange city has unique regional design preferences",
      ],
    },
    historicalTrends: {
      summary: "Nagpur gold rates serve as the Vidarbha region benchmark. Being centrally located, the city offers competitive rates influenced by both North and South Indian markets.",
      yearlyTrend: "8-11% annual appreciation, following national trends",
      seasonalPattern: "Peak buying during wedding season (November-February), Diwali, and regional festivals",
      bestBuyingTime: "Summer months and post-Diwali typically see stable pricing",
      festivalImpact: "Diwali and Dhanteras see maximum buying; Gudi Padwa also important in Maharashtra",
    },
  },

  nashik: {
    landmarks: [
      {
        name: "Main Road (Mahatma Gandhi Road)",
        description: "Central shopping street with numerous jewellery shops. Mix of traditional and modern jewellers.",
        speciality: "Variety of shops, central location, competitive pricing",
        area: "Central Nashik",
      },
      {
        name: "Panchavati",
        description: "Historic temple area with traditional jewellers. Known for religious and traditional designs.",
        speciality: "Religious jewellery, traditional designs, pilgrimage purchases",
        area: "Panchavati area",
      },
      {
        name: "College Road",
        description: "Popular shopping area with branded and local jewellers. Good for modern designs.",
        speciality: "Modern designs, branded stores, young buyers",
        area: "Central Nashik",
      },
    ],
    makingCharges: {
      range: "₹180 - ₹450 per gram",
      plain: "₹180 - ₹280/gram",
      antique: "₹320 - ₹400/gram",
      diamond: "₹360 - ₹450/gram",
      tips: [
        "Nashik has competitive rates compared to nearby Pune/Mumbai",
        "Traditional designs available near Panchavati temples",
        "Compare rates across different shopping areas",
        "Kumbh Mela years see special demand and offers",
        "Gudi Padwa and Diwali bring promotional schemes",
      ],
    },
    historicalTrends: {
      summary: "Nashik gold rates are typically ₹20-30 lower than Mumbai due to lower overheads. The holy city status drives unique demand, especially during Kumbh Mela periods.",
      yearlyTrend: "8-11% annual appreciation, following Maharashtra trends",
      seasonalPattern: "Peak buying during wedding season, Gudi Padwa, Diwali, and pilgrimage seasons",
      bestBuyingTime: "Post-monsoon and summer months typically see stable pricing",
      festivalImpact: "Gudi Padwa is major buying festival; Kumbh Mela years see exceptional demand",
    },
  },

  rajkot: {
    landmarks: [
      {
        name: "Junagadh Road",
        description: "Traditional jewellery market with established Saurashtra jewellers. Known for authentic Gujarati designs.",
        speciality: "Traditional Gujarati designs, family jewellers, competitive rates",
        area: "Central Rajkot",
      },
      {
        name: "Yagnik Road",
        description: "Modern commercial area with branded showrooms. Premium shopping experience.",
        speciality: "Branded stores, modern designs, premium experience",
        area: "Central Rajkot",
      },
      {
        name: "Crystal Mall & Big Bazaar Area",
        description: "Mall shopping with national chain showrooms. Modern facilities and parking.",
        speciality: "Mall shopping, branded stores, modern amenities",
        area: "New Rajkot",
      },
    ],
    makingCharges: {
      range: "₹180 - ₹450 per gram",
      plain: "₹180 - ₹280/gram",
      antique: "₹320 - ₹400/gram",
      kundan: "₹380 - ₹450/gram",
      diamond: "₹350 - ₹450/gram",
      tips: [
        "Rajkot is Saurashtra's gold hub - competitive rates",
        "Traditional Gujarati designs at reasonable making charges",
        "Compare Junagadh Road rates with mall showrooms",
        "Wedding season brings special promotional offers",
        "Navratri sees significant gold buying in Gujarat",
      ],
    },
    historicalTrends: {
      summary: "Rajkot gold rates reflect Saurashtra region pricing, typically aligned with Ahmedabad. The city's prosperous trading community drives steady demand throughout the year.",
      yearlyTrend: "8-11% annual appreciation, following Gujarat market trends",
      seasonalPattern: "Peak buying during Navratri, Diwali, Dhanteras, and wedding season",
      bestBuyingTime: "Summer months and post-Diwali typically see stable pricing",
      festivalImpact: "Navratri and Dhanteras are major buying festivals in Saurashtra",
    },
  },

  trichy: {
    landmarks: [
      {
        name: "NSB Road",
        description: "Main commercial street with numerous jewellery shops. Mix of traditional and modern jewellers.",
        speciality: "Variety of shops, competitive pricing, central location",
        area: "Central Trichy",
      },
      {
        name: "Srirangam",
        description: "Temple town with traditional jewellers near Ranganathaswamy Temple. Known for temple jewellery.",
        speciality: "Temple jewellery, religious designs, pilgrimage purchases",
        area: "Srirangam",
      },
      {
        name: "Cantonment Area",
        description: "Modern shopping area with branded showrooms. Convenient for residents.",
        speciality: "Branded stores, modern designs, organized shopping",
        area: "Trichy Cantonment",
      },
    ],
    makingCharges: {
      range: "₹140 - ₹400 per gram",
      plain: "₹140 - ₹240/gram",
      antique: "₹280 - ₹360/gram",
      temple: "₹320 - ₹400/gram",
      diamond: "₹350 - ₹420/gram",
      tips: [
        "Trichy has competitive rates - among lowest in Tamil Nadu",
        "Srirangam area has authentic temple jewellery specialists",
        "Compare NSB Road rates with modern showrooms",
        "Wedding season (April-June) brings special offers",
        "Traditional Tamil designs at reasonable making charges",
      ],
    },
    historicalTrends: {
      summary: "Trichy gold rates are typically ₹30-50 lower than Chennai. The temple city's traditional jewellery market offers competitive pricing with focus on religious designs.",
      yearlyTrend: "8-10% annual appreciation, following Tamil Nadu trends",
      seasonalPattern: "Peak buying during Tamil wedding season (April-June, November-February), Pongal",
      bestBuyingTime: "Post-monsoon and January typically see stable pricing",
      festivalImpact: "Pongal and temple festival seasons see significant buying; Aadi month is slow",
    },
  },

  vadodara: {
    landmarks: [
      {
        name: "Mandvi",
        description: "Historic market in old city with traditional Gujarati jewellers. Known for competitive wholesale-like rates.",
        speciality: "Traditional designs, wholesale rates, family jewellers",
        area: "Old Vadodara",
      },
      {
        name: "Alkapuri",
        description: "Modern commercial area with branded showrooms. Premium shopping experience.",
        speciality: "Branded stores, modern designs, premium experience",
        area: "Central Vadodara",
      },
      {
        name: "Race Course Road",
        description: "Upscale shopping area with designer stores and premium jewellers.",
        speciality: "Designer jewellery, premium brands, contemporary designs",
        area: "Central Vadodara",
      },
    ],
    makingCharges: {
      range: "₹180 - ₹460 per gram",
      plain: "₹180 - ₹280/gram",
      antique: "₹320 - ₹400/gram",
      kundan: "₹380 - ₹460/gram",
      diamond: "₹360 - ₹480/gram",
      tips: [
        "Vadodara has competitive rates between Ahmedabad and Surat",
        "Mandvi market offers best rates for traditional designs",
        "Compare old city rates with Alkapuri showrooms",
        "Navratri sees special offers and unique designs",
        "Wedding season brings promotional schemes",
      ],
    },
    historicalTrends: {
      summary: "Vadodara gold rates fall between Ahmedabad and Surat pricing. The cultural capital of Gujarat has strong demand for both traditional and contemporary designs.",
      yearlyTrend: "8-11% annual appreciation, following Gujarat market trends",
      seasonalPattern: "Peak buying during Navratri, Diwali, wedding season",
      bestBuyingTime: "Summer months and post-Diwali typically see stable pricing",
      festivalImpact: "Navratri is THE major festival in Vadodara with significant gold buying",
    },
  },

  vijayawada: {
    landmarks: [
      {
        name: "Besant Road",
        description: "Main commercial street with numerous jewellery shops. Mix of traditional Telugu and modern designs.",
        speciality: "Telugu traditional designs, variety of shops, competitive pricing",
        area: "Central Vijayawada",
      },
      {
        name: "Governorpet",
        description: "Traditional market area with established family jewellers. Known for competitive rates.",
        speciality: "Family jewellers, traditional designs, competitive rates",
        area: "Governorpet",
      },
      {
        name: "MG Road",
        description: "Modern shopping area with branded showrooms. Convenient central location.",
        speciality: "Branded stores, modern designs, organized shopping",
        area: "Central Vijayawada",
      },
    ],
    makingCharges: {
      range: "₹180 - ₹440 per gram",
      plain: "₹180 - ₹280/gram",
      antique: "₹300 - ₹380/gram",
      temple: "₹340 - ₹440/gram",
      diamond: "₹360 - ₹450/gram",
      tips: [
        "Vijayawada is Andhra Pradesh's emerging gold hub",
        "Competitive rates compared to Hyderabad",
        "Traditional Telugu designs at reasonable making charges",
        "Compare Besant Road rates with modern showrooms",
        "Wedding season and Ugadi bring special offers",
      ],
    },
    historicalTrends: {
      summary: "Vijayawada gold rates serve as the coastal Andhra benchmark. The city's growth as commercial capital drives competitive pricing with focus on Telugu traditional designs.",
      yearlyTrend: "8-11% annual appreciation, following Andhra Pradesh trends",
      seasonalPattern: "Peak buying during Telugu wedding season, Ugadi, Dussehra, and Deepavali",
      bestBuyingTime: "Summer months (March-May) and post-festival periods",
      festivalImpact: "Ugadi and Dussehra are major buying festivals; Kanuma (Sankranti) also important",
    },
  },

  visakhapatnam: {
    landmarks: [
      {
        name: "Dwaraka Nagar",
        description: "Main commercial area with branded and local jewellers. Convenient central location.",
        speciality: "Mix of brands and local, central location, variety",
        area: "Central Vizag",
      },
      {
        name: "Jagadamba Junction",
        description: "Popular shopping area with numerous jewellery shops. Mix of traditional and modern.",
        speciality: "Variety of shops, competitive pricing, convenient location",
        area: "Central Vizag",
      },
      {
        name: "CMR Central Mall",
        description: "Modern mall with national chain showrooms. Premium shopping experience.",
        speciality: "Mall shopping, branded stores, modern amenities",
        area: "Visakhapatnam",
      },
    ],
    makingCharges: {
      range: "₹180 - ₹450 per gram",
      plain: "₹180 - ₹280/gram",
      antique: "₹300 - ₹380/gram",
      temple: "₹340 - ₹420/gram",
      diamond: "₹360 - ₹450/gram",
      tips: [
        "Vizag has competitive rates - industrial city advantages",
        "Compare Dwaraka Nagar rates with mall showrooms",
        "Traditional Telugu designs available at competitive rates",
        "Navy and port employees drive steady demand",
        "Wedding season and Ugadi bring special offers",
      ],
    },
    historicalTrends: {
      summary: "Visakhapatnam gold rates benefit from the city's industrial growth and port city status. Prices are typically competitive with Vijayawada, catering to the coastal Andhra population.",
      yearlyTrend: "8-11% annual appreciation, following Andhra Pradesh trends",
      seasonalPattern: "Peak buying during wedding season, Ugadi, and Deepavali",
      bestBuyingTime: "Summer months and post-monsoon typically see stable pricing",
      festivalImpact: "Ugadi and Deepavali are major festivals; Simhachalam temple fair also drives demand",
    },
  },

  bhubaneswar: {
    landmarks: [
      {
        name: "Unit 1 Market",
        description: "Traditional market with established Odisha jewellers. Known for unique Odisha designs.",
        speciality: "Traditional Odisha designs, family jewellers, competitive rates",
        area: "Old Town area",
      },
      {
        name: "Saheed Nagar",
        description: "Popular shopping area with mix of local and branded jewellers. Convenient location.",
        speciality: "Mix of brands and local, convenient shopping, variety",
        area: "Central Bhubaneswar",
      },
      {
        name: "Esplanade One Mall",
        description: "Modern mall with national chain showrooms. Premium shopping experience.",
        speciality: "Mall shopping, branded stores, modern amenities",
        area: "Rasulgarh area",
      },
    ],
    makingCharges: {
      range: "₹200 - ₹460 per gram",
      plain: "₹200 - ₹300/gram",
      antique: "₹320 - ₹400/gram",
      temple: "₹350 - ₹460/gram",
      diamond: "₹380 - ₹480/gram",
      tips: [
        "Bhubaneswar has unique Odisha filigree (tarakasi) work",
        "Traditional temple jewellery available near temple areas",
        "Compare Unit 1 rates with modern mall showrooms",
        "Durga Puja season brings special offers",
        "Silver filigree is Odisha's specialty - excellent craftsmanship",
      ],
    },
    historicalTrends: {
      summary: "Bhubaneswar gold rates serve as the Odisha benchmark. The temple city has unique demand for traditional Odisha designs and filigree work.",
      yearlyTrend: "8-10% annual appreciation, following East Indian market trends",
      seasonalPattern: "Peak buying during Durga Puja, wedding season (December-February), and Rath Yatra",
      bestBuyingTime: "Summer months and post-Durga Puja typically see stable pricing",
      festivalImpact: "Durga Puja is THE major festival; Rath Yatra and Akshaya Tritiya also important",
    },
  },

  kerala: {
    landmarks: [
      {
        name: "Thrissur (Gold Capital of India)",
        description: "Thrissur is known as the Gold Capital of India with the highest concentration of jewellers. Home to major chains like Kalyan, Malabar, and Joy Alukkas.",
        speciality: "Headquarters of major chains, highest jeweller density, competitive pricing",
        area: "Central Kerala",
      },
      {
        name: "Thiruvananthapuram",
        description: "Capital city with numerous jewellery shops near East Fort and MG Road. Traditional Kerala designs.",
        speciality: "Traditional designs, government area, variety of shops",
        area: "South Kerala",
      },
      {
        name: "Kozhikode (Calicut)",
        description: "Malabar region's gold hub with strong trading tradition. Known for traditional designs.",
        speciality: "Malabar designs, trading community, competitive rates",
        area: "North Kerala",
      },
    ],
    makingCharges: {
      range: "₹160 - ₹420 per gram",
      plain: "₹160 - ₹260/gram",
      antique: "₹280 - ₹380/gram",
      temple: "₹320 - ₹420/gram",
      diamond: "₹350 - ₹450/gram",
      tips: [
        "Kerala has the highest per capita gold consumption in India",
        "Thrissur is the Gold Capital - visit for best variety and rates",
        "Major chains like Malabar, Kalyan originated in Kerala",
        "Onam season brings extensive offers and schemes",
        "Traditional Kerala Manga Mala and Kasavu designs are unique",
      ],
    },
    historicalTrends: {
      summary: "Kerala gold rates benefit from intense competition among major chains. The state's gold-loving culture and NRI remittances drive the highest per capita consumption in India.",
      yearlyTrend: "8-11% annual appreciation, with consistent year-round demand",
      seasonalPattern: "Peak buying during Onam, Vishu, wedding season (April-May, November-February)",
      bestBuyingTime: "Post-monsoon (October-November) and summer months before wedding season",
      festivalImpact: "Onam is Kerala's biggest festival with massive gold sales; Vishu gold gifts are tradition",
    },
  },

  moodbidri: {
    landmarks: [
      {
        name: "Moodbidri Main Market",
        description: "Small town famous for traditional goldsmith work. Known as 'Jain Kashi' with historic jewellery tradition.",
        speciality: "Traditional goldsmith work, Jain heritage designs, artisan craftsmanship",
        area: "Moodbidri town",
      },
      {
        name: "Local Goldsmith Workshops",
        description: "Traditional artisan workshops creating unique designs. Direct from craftsmen pricing.",
        speciality: "Artisan craftsmanship, unique designs, workshop visits",
        area: "Various locations",
      },
    ],
    makingCharges: {
      range: "₹150 - ₹400 per gram",
      plain: "₹150 - ₹250/gram",
      antique: "₹280 - ₹360/gram",
      temple: "₹300 - ₹400/gram",
      diamond: "₹340 - ₹420/gram",
      tips: [
        "Moodbidri is famous for traditional goldsmith heritage",
        "Direct from artisan purchases possible - unique experience",
        "Lower making charges than nearby Mangalore",
        "Traditional Tulu and Karnataka designs specialty",
        "Best for those seeking authentic handcrafted jewellery",
      ],
    },
    historicalTrends: {
      summary: "Moodbidri gold rates are typically lower than Mangalore due to direct artisan presence. The town's goldsmith heritage makes it a unique destination for handcrafted jewellery.",
      yearlyTrend: "8-10% annual appreciation, following Karnataka market trends",
      seasonalPattern: "Wedding season and festivals drive local demand",
      bestBuyingTime: "Throughout the year - artisan town has stable business",
      festivalImpact: "Local Jain festivals and Deepavali are important buying occasions",
    },
  },

  salem: {
    landmarks: [
      {
        name: "Five Roads Junction",
        description: "Main commercial area with numerous jewellery shops. Known for competitive pricing.",
        speciality: "Variety of shops, competitive rates, central location",
        area: "Central Salem",
      },
      {
        name: "Shevapet",
        description: "Traditional market area with established local jewellers. Good for traditional designs.",
        speciality: "Traditional Tamil designs, family jewellers, competitive pricing",
        area: "Shevapet area",
      },
    ],
    makingCharges: {
      range: "₹140 - ₹380 per gram",
      plain: "₹140 - ₹240/gram",
      antique: "₹260 - ₹340/gram",
      temple: "₹300 - ₹380/gram",
      diamond: "₹340 - ₹420/gram",
      tips: [
        "Salem has among the lowest making charges in Tamil Nadu",
        "Industrial city advantages - competitive pricing",
        "Compare Five Roads rates with mall showrooms",
        "Traditional Tamil designs at reasonable charges",
        "Wedding season brings special promotional offers",
      ],
    },
    historicalTrends: {
      summary: "Salem gold rates are typically ₹30-50 lower than Chennai and Coimbatore. The steel city's industrial base drives competitive pricing.",
      yearlyTrend: "8-10% annual appreciation, following Tamil Nadu trends",
      seasonalPattern: "Peak buying during Tamil wedding season (April-June, November-February)",
      bestBuyingTime: "Post-monsoon and January typically see stable pricing",
      festivalImpact: "Pongal and Deepavali are major buying festivals; Aadi month is slow",
    },
  },

  tirunelveli: {
    landmarks: [
      {
        name: "High Ground",
        description: "Main commercial area with numerous jewellery shops. Known for traditional Tamil designs.",
        speciality: "Traditional Tamil designs, variety of shops, competitive pricing",
        area: "Central Tirunelveli",
      },
      {
        name: "Palayamkottai",
        description: "Twin town with traditional jewellers. Known for South Tamil Nadu designs.",
        speciality: "South Tamil Nadu designs, family jewellers, competitive rates",
        area: "Palayamkottai",
      },
    ],
    makingCharges: {
      range: "₹130 - ₹360 per gram",
      plain: "₹130 - ₹230/gram",
      antique: "₹260 - ₹340/gram",
      temple: "₹300 - ₹360/gram",
      diamond: "₹320 - ₹400/gram",
      tips: [
        "Tirunelveli has among the lowest making charges in Tamil Nadu",
        "Traditional South Tamil Nadu designs are unique",
        "Compare High Ground rates with modern showrooms",
        "Wedding season (April-June) brings special offers",
        "Nellai designs have distinct craftsmanship",
      ],
    },
    historicalTrends: {
      summary: "Tirunelveli gold rates are among the lowest in Tamil Nadu due to lower overheads. The southern city has unique design preferences influenced by proximity to Kanyakumari.",
      yearlyTrend: "8-10% annual appreciation, following Tamil Nadu trends",
      seasonalPattern: "Peak buying during Tamil wedding season, Pongal, and Deepavali",
      bestBuyingTime: "Post-monsoon and January typically see stable pricing",
      festivalImpact: "Pongal and Deepavali drive significant buying; temple festivals also important",
    },
  },

  ayodhya: {
    landmarks: [
      {
        name: "Hanuman Garhi Area",
        description: "Temple town market with traditional jewellers. Known for religious and traditional designs.",
        speciality: "Religious jewellery, pilgrimage purchases, traditional designs",
        area: "Temple area",
      },
      {
        name: "Faizabad Market",
        description: "Twin city market with more commercial jewellers. Better variety of modern designs.",
        speciality: "Mix of traditional and modern, commercial jewellers",
        area: "Faizabad",
      },
    ],
    makingCharges: {
      range: "₹200 - ₹450 per gram",
      plain: "₹200 - ₹300/gram",
      antique: "₹320 - ₹400/gram",
      diamond: "₹360 - ₹450/gram",
      tips: [
        "Ayodhya is emerging as a pilgrimage gold destination",
        "Religious jewellery designs are specialty",
        "Compare Ayodhya temple area with Faizabad rates",
        "Ram Navami sees significant buying activity",
        "Wedding season brings special offers",
      ],
    },
    historicalTrends: {
      summary: "Ayodhya gold rates follow Lucknow benchmarks. The holy city's development as a religious tourism hub is driving growth in the jewellery market.",
      yearlyTrend: "8-11% annual appreciation, following UP market trends",
      seasonalPattern: "Peak buying during Ram Navami, Diwali, wedding season",
      bestBuyingTime: "Summer months and non-pilgrimage periods",
      festivalImpact: "Ram Navami is major buying occasion; Diwali and pilgrimage seasons also important",
    },
  },

  // Default data for cities without specific configuration
  default: {
    landmarks: [],
    makingCharges: {
      range: "₹200 - ₹500 per gram",
      plain: "₹200 - ₹300/gram",
      antique: "₹350 - ₹450/gram",
      diamond: "₹400 - ₹550/gram",
      tips: [
        "Always compare making charges across multiple jewellers",
        "Ask for itemized bill with separate gold weight and making charges",
        "Check if making charges are flat rate or percentage-based",
        "Negotiate on bulk purchases for wedding jewellery",
        "Verify BIS hallmarking on all purchases",
      ],
    },
    historicalTrends: {
      summary: "Gold prices follow the IBJA benchmark rates with minor local variations based on demand and competition.",
      yearlyTrend: "8-12% annual appreciation over the past decade",
      seasonalPattern: "Prices typically peak during wedding seasons and major festivals",
      bestBuyingTime: "Post-monsoon months and post-festival periods often see relatively stable prices",
      festivalImpact: "Dhanteras and Akshaya Tritiya see highest buying volumes nationwide",
    },
  },
};

/**
 * Get market data for a specific city
 * Falls back to default data if city-specific data is not available
 */
export function getCityMarketData(citySlug: string): CityMarketData {
  const slug = citySlug.toLowerCase();
  return CITY_MARKET_DATA[slug] || CITY_MARKET_DATA.default;
}
