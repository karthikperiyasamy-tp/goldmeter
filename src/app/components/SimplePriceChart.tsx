"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type ChartDataPoint = {
  date: string;
  price: number;
};

type PriceChartProps = {
  data: ChartDataPoint[];
  color?: string;
};

export default function PriceChart({ data, color = "#f59e0b" }: PriceChartProps) {
  const formatCurrency = (value: number) => {
    return `₹${new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(value)}`;
  };

  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={300}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="date"
          stroke="#94a3b8"
          style={{ fontSize: "12px" }}
          tickLine={false}
        />
        <YAxis
          stroke="#94a3b8"
          style={{ fontSize: "12px" }}
          tickFormatter={formatCurrency}
          tickLine={false}
          domain={["auto", "auto"]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          formatter={(value: number) => formatCurrency(value)}
          labelStyle={{ fontWeight: "600", marginBottom: "4px" }}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke={color}
          strokeWidth={2}
          dot={false}
          name="Rate"
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

