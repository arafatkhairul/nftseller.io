import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';

const data = [
    { name: 'Pending', value: 12, color: 'hsl(var(--chart-5))' },
    { name: 'Approved', value: 8, color: 'hsl(var(--chart-4))' },
    { name: 'Sent', value: 28, color: 'hsl(var(--chart-1))' },
];

export default function OrderStatusChart() {
    return (
        <div className="h-full w-full">
            <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={90}
                        innerRadius={0}
                        fill="#8884d8"
                        dataKey="value"
                        stroke="hsl(var(--card))"
                        strokeWidth={2}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.color}
                            />
                        ))}
                    </Pie>
                    <Tooltip
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
                        }}
                    />
                    <Legend
                        wrapperStyle={{ paddingTop: '1rem', fontSize: '12px' }}
                        iconType="circle"
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}


