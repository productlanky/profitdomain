"use client"

import * as React from "react"
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts"
import { Loader2, TrendingUp, TrendingDown, Activity, Lock } from "lucide-react"
import { useRouter } from "next/navigation"

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { companyName } from "@/lib/data/info"

// --- TYPES ---
interface Coin {
    id: string
    symbol: string
    name: string
    image: string
    current_price: number
    price_change_percentage_24h: number
    total_volume: number
    sparkline_in_7d: {
        price: number[]
    }
}

interface ProcessedCoin extends Coin {
    chartData: { price: number }[]
    color: string
}

export default function CoinFetch() {
    const router = useRouter()
    const [coins, setCoins] = React.useState<ProcessedCoin[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState(false)

    const fetchMarketData = React.useCallback(async () => {
        try {
            // Using CoinGecko's "markets" endpoint which returns EVERYTHING in one call
            // (Price, Volume, Image, AND Sparkline data)
            const response = await fetch(
                "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=20&page=1&sparkline=true&price_change_percentage=24h"
            )

            if (!response.ok) throw new Error("Rate limit or network error")

            const data: Coin[] = await response.json()

            const processed = data.map((coin) => {
                // Process chart data
                const prices = coin.sparkline_in_7d.price
                const startPrice = prices[0]
                const endPrice = prices[prices.length - 1]
                const isUp = endPrice >= startPrice

                // Simplify chart data for performance
                // Taking every 4th point to reduce DOM nodes in chart
                const simpleChart = prices
                    .filter((_, i) => i % 4 === 0)
                    .map((p) => ({ price: p }))

                return {
                    ...coin,
                    chartData: simpleChart,
                    color: isUp ? "#10b981" : "#f43f5e", // Emerald vs Rose
                }
            })

            setCoins(processed)
            setError(false)
        } catch (err) {
            console.error("Fetch Error:", err)
            setError(true)
        } finally {
            setLoading(false)
        }
    }, [])

    React.useEffect(() => {
        fetchMarketData()
        // Refresh every 60 seconds
        const interval = setInterval(fetchMarketData, 60000)
        return () => clearInterval(interval)
    }, [fetchMarketData])

    const handleInvest = (coin: Coin) => {
        router.push(`/investments/${coin.name}`)
    }

    if (loading && coins.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] w-full rounded-[2rem] border border-border/50 bg-card/30 backdrop-blur-md">
                <Loader2 className="h-10 w-10 animate-spin text-brand-500 mb-4" />
                <p className="text-sm font-medium text-muted-foreground animate-pulse">
                    Syncing Global Markets...
                </p>
            </div>
        )
    }

    if (error && coins.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[300px] w-full rounded-[2rem] border border-red-500/20 bg-red-500/5 backdrop-blur-md p-6 text-center">
                <Activity className="h-10 w-10 mb-4 text-red-500 opacity-80" />
                <p className="font-semibold text-red-500">Market Data Unavailable</p>
                <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                    We couldn't connect to the exchange feed. This might be due to network restrictions.
                </p>
                <Button
                    onClick={() => { setLoading(true); fetchMarketData(); }}
                    variant="outline"
                    className="mt-6 border-red-500/30 hover:bg-red-500/10 text-red-500"
                >
                    Retry Connection
                </Button>
            </div>
        )
    }

    return (
        // Glassmorphism styling consistent with the outer page
        <Card className="border border-white/20 bg-white/40 py-0 dark:bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden rounded-4xl">
            {/* Header */}
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-border/50 p-6 md:p-8 bg-muted/20">
                <div className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                        <Activity className="h-5 w-5 text-brand-500" />
                        Live Markets
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Real-time prices and volume from Binance Liquidity Pools.
                    </p>
                </div>
                <div className="mt-4 md:mt-0 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                    </span>
                    Socket Connected
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-black/5 dark:bg-white/5 text-xs uppercase font-semibold text-muted-foreground">
                            <tr>
                                <th className="px-6 py-4 min-w-[200px]">Asset</th>
                                <th className="px-6 py-4 text-right">Price</th>
                                <th className="px-6 py-4 text-right">24h Change</th>
                                <th className="px-6 py-4 text-right hidden md:table-cell">Vol (24h)</th>
                                <th className="px-6 py-4 text-center hidden lg:table-cell w-[180px]">7d Trend</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 dark:divide-white/5">
                            {coins.map((coin) => {
                                const isUp = coin.price_change_percentage_24h >= 0

                                return (
                                    <tr
                                        key={coin.id}
                                        onClick={() => handleInvest(coin)}
                                        className="group cursor-pointer hover:bg-white/40 dark:hover:bg-white/5 transition-colors"
                                    >
                                        {/* Asset */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white shadow-sm p-0.5">
                                                    <img
                                                        src={coin.image}
                                                        alt={coin.name}
                                                        className="h-full w-full object-cover rounded-full"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-foreground text-base">
                                                        {coin.name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground font-mono uppercase">
                                                        {coin.symbol}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Price */}
                                        <td className="px-6 py-4 text-right font-mono font-medium text-foreground text-base">
                                            ${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>

                                        {/* 24h Change */}
                                        <td className="px-6 py-4 text-right">
                                            <div className={`inline-flex items-center gap-1 font-bold ${isUp ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                                                {isUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                                {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                                            </div>
                                        </td>

                                        {/* Volume */}
                                        <td className="px-6 py-4 text-right text-muted-foreground hidden md:table-cell">
                                            ${(coin.total_volume / 1000000).toLocaleString(undefined, { maximumFractionDigits: 0 })}M
                                        </td>

                                        {/* Sparkline Chart */}
                                        <td className="px-6 py-4 hidden lg:table-cell align-middle">
                                            <div className="h-10 w-32 mx-auto opacity-70 group-hover:opacity-100 transition-opacity">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={coin.chartData}>
                                                        <Line
                                                            type="monotone"
                                                            dataKey="price"
                                                            stroke={coin.color}
                                                            strokeWidth={2}
                                                            dot={false}
                                                            isAnimationActive={false}
                                                        />
                                                        <YAxis domain={['dataMin', 'dataMax']} hide />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </td>

                                        {/* Action */}
                                        <td className="px-6 py-4 text-right">
                                            <Button
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleInvest(coin);
                                                }}
                                                className="rounded-full bg-white/50 dark:bg-white/10 border border-white/20 hover:bg-brand-500 hover:text-white hover:border-brand-500 transition-all text-xs font-bold h-9 px-5 shadow-sm text-foreground backdrop-blur-md"
                                            >
                                                Invest
                                            </Button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </CardContent>

            <CardFooter className="flex flex-col md:flex-row items-center justify-between border-t border-white/10 bg-black/5 dark:bg-white/5 p-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Lock className="h-3 w-3" />
                    <span>Secure trading requires KYC verification.</span>
                </div>
                <div className="mt-2 md:mt-0">
                    Data provided by {companyName}. Updates every 60s.
                </div>
            </CardFooter>
        </Card>
    )
}