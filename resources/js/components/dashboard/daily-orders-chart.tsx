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
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-sidebar-border/50"
                    />
                    <XAxis
                        dataKey="day"
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
                    <Bar
                        dataKey="orders"
                        fill="#3b82f6"
                        name="New Orders"
                        radius={[8, 8, 0, 0]}
                    />
                    <Bar
                        dataKey="completed"
                        fill="#10b981"
                        name="Completed"
                        radius={[8, 8, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

