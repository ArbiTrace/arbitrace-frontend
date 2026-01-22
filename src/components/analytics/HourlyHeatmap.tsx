import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { useTradingStore } from '@/stores';
import { generateHourlyHeatmapData } from '@/services/mockData';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = Array.from({ length: 24 }, (_, i) => i);

export const HourlyHeatmap = () => {
  const { trades } = useTradingStore();
  const [hoveredCell, setHoveredCell] = useState<{ day: number; hour: number } | null>(null);

  const data = useMemo(() => {
    if (trades.length === 0) {
      return generateHourlyHeatmapData();
    }

    // Build heatmap from real trades
    const heatmap = Array(7).fill(0).map(() => Array(24).fill(0));
    const counts = Array(7).fill(0).map(() => Array(24).fill(0));

    trades.forEach(trade => {
      const date = new Date(trade.timestamp);
      const day = (date.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
      const hour = date.getHours();
      
      const profitPercent = trade.profitPercent || 0;
      heatmap[day][hour] += profitPercent > 0 ? 1 : 0;
      counts[day][hour]++;
    });

    // Calculate performance ratio (0-1)
    return heatmap.map((dayData, dayIdx) =>
      dayData.map((wins, hourIdx) => {
        const total = counts[dayIdx][hourIdx];
        return total > 0 ? wins / total : 0.5; // Default to neutral if no data
      })
    );
  }, [trades]);

  const getColor = (value: number) => {
    if (value === 0) return 'bg-secondary/30';
    if (value < 0.3) return 'bg-destructive/40';
    if (value < 0.4) return 'bg-destructive/30';
    if (value < 0.5) return 'bg-muted';
    if (value < 0.6) return 'bg-success/30';
    if (value < 0.7) return 'bg-success/40';
    if (value < 0.8) return 'bg-success/50';
    return 'bg-success/70';
  };

  const getPerformanceLabel = (value: number) => {
    if (value === 0) return 'No Data';
    if (value < 0.3) return 'Poor';
    if (value < 0.5) return 'Below Average';
    if (value < 0.6) return 'Average';
    if (value < 0.7) return 'Good';
    if (value < 0.8) return 'Very Good';
    return 'Excellent';
  };

  const getPerformanceIcon = (value: number) => {
    if (value >= 0.6) return <TrendingUp className="w-3 h-3 text-success" />;
    if (value < 0.4) return <TrendingDown className="w-3 h-3 text-destructive" />;
    return null;
  };

  // Calculate best performing time
  const bestTime = useMemo(() => {
    let maxValue = 0;
    let bestDay = 0;
    let bestHour = 0;

    data.forEach((dayData, dayIdx) => {
      dayData.forEach((value, hourIdx) => {
        if (value > maxValue) {
          maxValue = value;
          bestDay = dayIdx;
          bestHour = hourIdx;
        }
      });
    });

    return { day: bestDay, hour: bestHour, value: maxValue };
  }, [data]);

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="space-y-3">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Hourly Performance Heatmap
          </CardTitle>

          {/* Best Time Display */}
          {bestTime.value > 0 && (
            <div className="flex items-center gap-2 text-sm p-2 rounded-lg bg-success/10 border border-success/20">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-muted-foreground">Best time:</span>
              <span className="font-medium text-success">
                {days[bestTime.day]} {bestTime.hour.toString().padStart(2, '0')}:00
              </span>
              <span className="text-muted-foreground">
                ({(bestTime.value * 100).toFixed(0)}% win rate)
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <TooltipProvider>
          <div className="overflow-x-auto">
            {/* Hours header */}
            <div className="flex gap-0.5 mb-1 ml-12">
              {hours.filter((_, i) => i % 3 === 0).map((hour) => (
                <span 
                  key={hour} 
                  className="text-xs text-muted-foreground font-mono"
                  style={{ width: '14px', textAlign: 'center' }}
                >
                  {hour.toString().padStart(2, '0')}
                </span>
              ))}
            </div>
            
            {/* Heatmap grid */}
            <div className="space-y-1">
              {data.map((dayData, dayIndex) => (
                <div key={dayIndex} className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground w-10 text-right font-medium">
                    {days[dayIndex]}
                  </span>
                  {dayData.map((value, hourIndex) => (
                    <UITooltip key={hourIndex}>
                      <TooltipTrigger asChild>
                        <motion.div
                          whileHover={{ scale: 1.4, zIndex: 10 }}
                          onHoverStart={() => setHoveredCell({ day: dayIndex, hour: hourIndex })}
                          onHoverEnd={() => setHoveredCell(null)}
                          className={cn(
                            'w-3.5 h-3.5 rounded-sm cursor-pointer transition-all',
                            getColor(value),
                            'border border-transparent',
                            hoveredCell?.day === dayIndex && hoveredCell?.hour === hourIndex && 
                            'ring-2 ring-primary'
                          )}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-mono font-semibold">
                              {days[dayIndex]} {hourIndex.toString().padStart(2, '0')}:00 - {(hourIndex + 1).toString().padStart(2, '0')}:00
                            </p>
                            {getPerformanceIcon(value)}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "font-medium",
                              value >= 0.6 ? "text-success" :
                              value < 0.4 ? "text-destructive" :
                              "text-muted-foreground"
                            )}>
                              {getPerformanceLabel(value)}
                            </span>
                            <span className="text-muted-foreground">
                              ({(value * 100).toFixed(0)}% win rate)
                            </span>
                          </div>
                        </div>
                      </TooltipContent>
                    </UITooltip>
                  ))}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  <div className="w-3 h-3 rounded-sm bg-destructive/40" />
                  <div className="w-3 h-3 rounded-sm bg-muted" />
                  <div className="w-3 h-3 rounded-sm bg-success/40" />
                  <div className="w-3 h-3 rounded-sm bg-success/70" />
                </div>
                <span className="text-xs text-muted-foreground">
                  Low → High Win Rate
                </span>
              </div>
            </div>
          </div>
        </TooltipProvider>

        <p className="text-xs text-muted-foreground text-center mt-3">
          {trades.length > 0 
            ? `Analyzing ${trades.length} trades to identify optimal trading hours`
            : 'Heatmap will update as trades are executed'
          }
        </p>

        {/* Empty State Overlay */}
        {trades.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/60 backdrop-blur-sm rounded-lg">
            <div className="text-center">
              <Clock className="h-10 w-10 mx-auto mb-2 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No hourly data yet</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Trade data will populate the heatmap
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};