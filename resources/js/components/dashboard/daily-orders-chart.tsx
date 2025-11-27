import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const data = [
    { day: 'Mon', orders: 8, completed: 6 },
    { day: 'Tue', orders: 12, completed: 10 },
    { day: 'Wed', orders: 15, completed: 12 },
    { day: 'Thu', orders: 10, completed: 8 },
    { day: 'Fri', orders: 18, completed: 15 },
    { day: 'Sat', orders: 14, completed: 11 },
    { day: 'Sun', orders: 9, completed: 7 },
];

export default function DailyOrdersChart() {
    return (
        <div className="h-full w-full">
            <ResponsiveContainer width="100%" height={320}>
                <BarChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                    <CartesianGrid
                        strokeDasharray="0"
                        vertical={false}
                        stroke="hsl(var(--border))"
                        strokeOpacity={0.3}
                    />
                    <XAxis
                        dataKey="day"
                        className="text-xs"
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        className="text-xs"
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
                        contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '0.5rem',
                            color: 'hsl(var(--foreground))',
                            fontSize: '12px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        }}
                        labelStyle={{
                            color: 'hsl(var(--muted-foreground))',
                            fontWeight: 600,
                            marginBottom: '4px'
                        }}
                    />
                    <Legend
                        wrapperStyle={{ paddingTop: '1rem', fontSize: '12px' }}
                        iconType="circle"
                    />
                    <Bar
                        dataKey="orders"
                        fill="hsl(var(--chart-1))"
                        name="New Orders"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={60}
                    />
                    <Bar
                        dataKey="completed"
                        fill="hsl(var(--chart-4))"
                        name="Completed"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={60}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}


