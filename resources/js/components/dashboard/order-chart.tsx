import {
    Area,
    AreaChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const data = [
    { name: 'Jan', orders: 12, deposit: 15000 },
    { name: 'Feb', orders: 19, deposit: 22000 },
    { name: 'Mar', orders: 15, deposit: 18000 },
    { name: 'Apr', orders: 28, deposit: 32000 },
    { name: 'May', orders: 24, deposit: 28000 },
    { name: 'Jun', orders: 32, deposit: 35000 },
];

export default function OrderChart() {
    return (
        <div className="h-full w-full">
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorDeposit" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-sidebar-border/50"
                    />
                    <XAxis
                        dataKey="name"
                        className="text-xs text-muted-foreground"
                        tick={{ fill: 'currentColor' }}
                        axisLine={{ stroke: 'currentColor' }}
                    />
                    <YAxis
                        className="text-xs text-muted-foreground"
                        tick={{ fill: 'currentColor' }}
                        axisLine={{ stroke: 'currentColor' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '0.5rem',
                            color: 'hsl(var(--foreground))',
                        }}
                        labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                    />
                    <Legend
                        wrapperStyle={{ paddingTop: '1rem' }}
                        iconType="circle"
                    />
                    <Area
                        type="monotone"
                        dataKey="orders"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#colorOrders)"
                        name="Orders"
                    />
                    <Area
                        type="monotone"
                        dataKey="deposit"
                        stroke="#10b981"
                        fillOpacity={1}
                        fill="url(#colorDeposit)"
                        name="Deposit ($)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

