"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import CalculatorSwitcher from "../components/CalculatorSwitcher";

const formatCurrency = (value: number) =>
  value.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });

// Common wedding jewellery items
const jewelleryItems = [
  { name: "Mangalsutra", weight: 30, category: "Bride Essential" },
  { name: "Bridal Necklace Set", weight: 80, category: "Bride Essential" },
  { name: "Bangles (4 pcs)", weight: 40, category: "Bride Essential" },
  { name: "Earrings", weight: 15, category: "Bride Essential" },
  { name: "Maang Tikka", weight: 10, category: "Bride Essential" },
  { name: "Nose Ring", weight: 5, category: "Bride Essential" },
  { name: "Waist Belt (Kamarband)", weight: 100, category: "Bride Optional" },
  { name: "Anklets", weight: 20, category: "Bride Optional" },
  { name: "Arm Bands (Bajuband)", weight: 30, category: "Bride Optional" },
  { name: "Groom Chain", weight: 25, category: "Groom" },
  { name: "Groom Ring", weight: 8, category: "Groom" },
  { name: "Groom Bracelet", weight: 20, category: "Groom" },
];

type SelectedItem = {
  name: string;
  weight: number;
  selected: boolean;
  category: string;
};

export default function WeddingGoldPlannerPage() {
  const [goldPrice, setGoldPrice] = useState(5920); // per gram 22K
  const [makingCharges, setMakingCharges] = useState(15); // percentage
  const [items, setItems] = useState<SelectedItem[]>(
    jewelleryItems.map(item => ({ ...item, selected: false }))
  );
  const [customWeight, setCustomWeight] = useState(0);
  const [budget, setBudget] = useState(1000000); // 10 lakhs default
  const [loading, setLoading] = useState(true);

  // Fetch latest gold rate
  useEffect(() => {
    async function fetchRate() {
      try {
        const response = await fetch('/api/calculator-rates');
        const data = await response.json();
        if (data.success && data.rates?.[0]) {
          setGoldPrice(Math.round(data.rates[0].gold22k / 10)); // 22K per gram
        }
      } catch (error) {
        console.error('Failed to fetch rate:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchRate();
  }, []);

  const toggleItem = (index: number) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, selected: !item.selected } : item
    ));
  };

  const updateItemWeight = (index: number, weight: number) => {
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, weight: weight } : item
    ));
  };

  const result = useMemo(() => {
    const selectedItems = items.filter(item => item.selected);
    const totalWeight = selectedItems.reduce((sum, item) => sum + item.weight, 0) + customWeight;
    
    const goldValue = totalWeight * goldPrice;
    const makingCost = goldValue * (makingCharges / 100);
    const gst = (goldValue + makingCost) * 0.03;
    const totalCost = goldValue + makingCost + gst;
    
    const withinBudget = totalCost <= budget;
    const budgetRemaining = budget - totalCost;
    const affordableWeight = Math.floor(budget / (goldPrice * (1 + makingCharges / 100) * 1.03));
    
    return {
      selectedItems,
      totalWeight,
      goldValue: Math.round(goldValue),
      makingCost: Math.round(makingCost),
      gst: Math.round(gst),
      totalCost: Math.round(totalCost),
      withinBudget,
      budgetRemaining: Math.round(budgetRemaining),
      affordableWeight,
    };
  }, [items, customWeight, goldPrice, makingCharges, budget]);

  const handleShare = async () => {
    const itemsList = result.selectedItems.map(i => i.name).join(', ');
    const shareData = {
      title: 'Wedding Gold Planner - GoldMeter',
      text: `My wedding gold plan: ${result.totalWeight}g of 22K gold (${itemsList || 'Custom'}). Estimated cost: ₹${formatCurrency(result.totalCost)} including making charges & GST.`,
      url: window.location.href,
    };
    
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert('Link copied to clipboard!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const brideEssentials = items.filter(i => i.category === "Bride Essential");
  const brideOptional = items.filter(i => i.category === "Bride Optional");
  const groomItems = items.filter(i => i.category === "Groom");

  return (
    <main className="min-h-screen bg-amber-50 py-10 print:bg-white print:py-0">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
          <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-soft print:shadow-none print:border-0">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-amber-600 transition-colors mb-4 print:hidden"
            >
              ← Back to Home
            </Link>
            <p className="text-xs uppercase tracking-widest text-slate-500">
              Gold tools
            </p>
            <h1 className="mt-2 text-3xl font-bold text-charcoal">
              Wedding Gold Planner 💍
            </h1>
            <p className="text-sm text-slate-600">
              Plan and budget gold jewellery for your wedding with accurate cost estimates.
            </p>
            
            {loading && (
              <div className="mt-4 text-sm text-amber-600">Loading latest gold rate...</div>
            )}

            {/* Budget & Settings */}
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <label className="text-sm font-medium text-slate-600">
                Your budget (₹)
                <input
                  type="number"
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value) || 0)}
                  step={50000}
                />
              </label>
              <label className="text-sm font-medium text-slate-600">
                22K Gold rate (₹/gram)
                <input
                  type="number"
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                  value={goldPrice}
                  onChange={(e) => setGoldPrice(Number(e.target.value) || 0)}
                />
              </label>
              <label className="text-sm font-medium text-slate-600">
                Making charges (%)
                <select
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                  value={makingCharges}
                  onChange={(e) => setMakingCharges(Number(e.target.value))}
                >
                  <option value={8}>8% (Machine made)</option>
                  <option value={12}>12% (Light work)</option>
                  <option value={15}>15% (Standard)</option>
                  <option value={20}>20% (Designer)</option>
                  <option value={25}>25% (Antique/Kundan)</option>
                </select>
              </label>
            </div>

            {/* Jewellery Selection */}
            <div className="mt-8 space-y-6">
              {/* Bride Essentials */}
              <div>
                <h3 className="text-sm font-semibold text-amber-700 uppercase tracking-wide">
                  👰 Bride Essentials
                </h3>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {brideEssentials.map((item) => {
                    const actualIdx = items.findIndex(i => i.name === item.name);
                    return (
                      <div key={item.name} className={`rounded-xl border p-3 transition-colors ${item.selected ? 'border-amber-400 bg-amber-50' : 'border-slate-200 hover:border-amber-200'}`}>
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={() => toggleItem(actualIdx)}
                            className="w-5 h-5 rounded text-amber-600 cursor-pointer"
                          />
                          <span className="text-sm font-medium flex-1">{item.name}</span>
                          <span className="text-sm font-semibold text-slate-700">₹{formatCurrency(item.weight * goldPrice)}</span>
                        </div>
                        <div className="mt-2 flex items-center gap-2 ml-8">
                          <label className="text-xs text-slate-500">Weight:</label>
                          <input
                            type="number"
                            value={item.weight}
                            onChange={(e) => updateItemWeight(actualIdx, Number(e.target.value) || 0)}
                            className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-sm text-center"
                            min={1}
                          />
                          <span className="text-xs text-slate-500">grams</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bride Optional */}
              <div>
                <h3 className="text-sm font-semibold text-pink-700 uppercase tracking-wide">
                  ✨ Bride Optional
                </h3>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {brideOptional.map((item) => {
                    const actualIdx = items.findIndex(i => i.name === item.name);
                    return (
                      <div key={item.name} className={`rounded-xl border p-3 transition-colors ${item.selected ? 'border-pink-400 bg-pink-50' : 'border-slate-200 hover:border-pink-200'}`}>
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={() => toggleItem(actualIdx)}
                            className="w-5 h-5 rounded text-pink-600 cursor-pointer"
                          />
                          <span className="text-sm font-medium flex-1">{item.name}</span>
                          <span className="text-sm font-semibold text-slate-700">₹{formatCurrency(item.weight * goldPrice)}</span>
                        </div>
                        <div className="mt-2 flex items-center gap-2 ml-8">
                          <label className="text-xs text-slate-500">Weight:</label>
                          <input
                            type="number"
                            value={item.weight}
                            onChange={(e) => updateItemWeight(actualIdx, Number(e.target.value) || 0)}
                            className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-sm text-center"
                            min={1}
                          />
                          <span className="text-xs text-slate-500">grams</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Groom */}
              <div>
                <h3 className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
                  🤵 Groom
                </h3>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {groomItems.map((item) => {
                    const actualIdx = items.findIndex(i => i.name === item.name);
                    return (
                      <div key={item.name} className={`rounded-xl border p-3 transition-colors ${item.selected ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:border-blue-200'}`}>
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={() => toggleItem(actualIdx)}
                            className="w-5 h-5 rounded text-blue-600 cursor-pointer"
                          />
                          <span className="text-sm font-medium flex-1">{item.name}</span>
                          <span className="text-sm font-semibold text-slate-700">₹{formatCurrency(item.weight * goldPrice)}</span>
                        </div>
                        <div className="mt-2 flex items-center gap-2 ml-8">
                          <label className="text-xs text-slate-500">Weight:</label>
                          <input
                            type="number"
                            value={item.weight}
                            onChange={(e) => updateItemWeight(actualIdx, Number(e.target.value) || 0)}
                            className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-sm text-center"
                            min={1}
                          />
                          <span className="text-xs text-slate-500">grams</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Custom Gold */}
              <div>
                <label className="text-sm font-medium text-slate-600">
                  Additional custom gold (grams)
                  <input
                    type="number"
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
                    value={customWeight}
                    onChange={(e) => setCustomWeight(Number(e.target.value) || 0)}
                    min={0}
                    placeholder="Add extra gold weight"
                  />
                </label>
              </div>
            </div>

            {/* Summary */}
            <section className="mt-8 rounded-3xl border border-amber-100 bg-amber-50/60 p-6">
              <h2 className="text-lg font-semibold">Wedding Gold Summary</h2>
              
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-xs text-slate-500">Total Gold Weight</p>
                  <p className="text-2xl font-bold text-amber-600">{result.totalWeight}g</p>
                  <p className="text-xs text-slate-500">22K gold</p>
                </div>
                <div className={`rounded-2xl p-4 ${result.withinBudget ? 'bg-emerald-50 border-2 border-emerald-400' : 'bg-rose-50 border-2 border-rose-400'}`}>
                  <p className="text-xs text-slate-500">Total Cost</p>
                  <p className={`text-2xl font-bold ${result.withinBudget ? 'text-emerald-600' : 'text-rose-600'}`}>
                    ₹{formatCurrency(result.totalCost)}
                  </p>
                  <p className={`text-xs ${result.withinBudget ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {result.withinBudget ? `₹${formatCurrency(result.budgetRemaining)} under budget ✓` : `₹${formatCurrency(Math.abs(result.budgetRemaining))} over budget`}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-white p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Gold value ({result.totalWeight}g × ₹{formatCurrency(goldPrice)})</span>
                  <span className="font-semibold">₹{formatCurrency(result.goldValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Making charges ({makingCharges}%)</span>
                  <span className="font-semibold">₹{formatCurrency(result.makingCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">GST (3%)</span>
                  <span className="font-semibold">₹{formatCurrency(result.gst)}</span>
                </div>
                <hr className="border-dashed" />
                <div className="flex justify-between text-base">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-amber-600">₹{formatCurrency(result.totalCost)}</span>
                </div>
              </div>

            <p className="mt-4 text-sm text-slate-600">
              💡 With your budget of ₹{formatCurrency(budget)}, you can afford approximately <strong>{result.affordableWeight}g</strong> of 22K gold.
            </p>
            
            <div className="mt-4 text-sm text-slate-600">
              <p className="font-semibold">Tips for Wedding Gold Shopping:</p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li><Link href="/jewellers" className="text-amber-600 hover:underline">Compare prices</Link> from multiple jewellers before buying</li>
                <li>Ask for detailed bill showing gold weight, making charges, and GST separately</li>
                <li>Check for <Link href="/hallmark-guide" className="text-amber-600 hover:underline">BIS hallmark</Link> to ensure gold purity</li>
                <li>Use our <Link href="/wastage-calculator" className="text-amber-600 hover:underline">wastage calculator</Link> to verify jeweller quotes</li>
                <li>Read our <Link href="/jewellers/buying-guide" className="text-amber-600 hover:underline">gold buying guide</Link> before shopping</li>
              </ul>
            </div>

              <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold print:hidden">
                <button 
                  onClick={handleShare}
                  className="flex-1 rounded-full bg-amber-600 px-4 py-2 text-white shadow-soft hover:bg-amber-700"
                >
                  📤 Share Plan
                </button>
                <button 
                  onClick={handlePrint}
                  className="flex-1 rounded-full border border-amber-200 px-4 py-2 text-amber-600 hover:bg-amber-50"
                >
                  🖨️ Print
                </button>
              </div>
            </section>
          </div>
          
          <div className="lg:sticky lg:top-6 lg:self-start print:hidden">
            <CalculatorSwitcher />
          </div>
        </div>

        <section className="mt-10 grid gap-3 md:grid-cols-3 print:hidden">
          <Link
            href="/calculator"
            className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 text-sm text-charcoal hover:border-amber-200"
          >
            Gold Calculator → Calculate jewellery cost with GST.
          </Link>
          <Link
            href="/hallmark-guide"
            className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 text-sm text-charcoal hover:border-amber-200"
          >
            Hallmark Guide → Verify BIS hallmark before buying.
          </Link>
          <Link
            href="/jewellers"
            className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4 text-sm text-charcoal hover:border-amber-200"
          >
            Compare Jewellers → Making charges across brands.
          </Link>
          <Link
            href="/investment-calculator"
            className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-charcoal hover:border-amber-200"
          >
            Gold investment calculator → Plan your gold SIP.
          </Link>
          <Link
            href="/gold-loan-calculator"
            className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-charcoal hover:border-amber-200"
          >
            Gold loan calculator → Check loan eligibility.
          </Link>
          <Link
            href="/wastage-calculator"
            className="rounded-2xl border border-slate-100 bg-white p-4 text-sm text-charcoal hover:border-amber-200"
          >
            Wastage calculator → Compare jeweller quotes.
          </Link>
        </section>
      </div>
    </main>
  );
}

