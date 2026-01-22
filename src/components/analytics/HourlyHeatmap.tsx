import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { generateHourlyHeatmapData } from '@/services/mockData';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hours = Array.from({ length: 24 }, (_, i) => i);

export const HourlyHeatmap = () => {
  const data = useMemo(() => generateHourlyHeatmapData(), []);

  const getColor = (value: number) => {
    if (value < 0.2) return 'bg-destructive/30';
    if (value < 0.4) return 'bg-destructive/50';
    if (value < 0.5) return 'bg-muted';
    if (value < 0.6) return 'bg-success/30';
    if (value < 0.8) return 'bg-success/50';
    return 'bg-success/70';
  };

  const getPerformanceLabel = (value: number) => {
    if (value < 0.3) return 'Poor';
    if (value < 0.5) return 'Below Average';
    if (value < 0.6) return 'Average';
    if (value < 0.8) return 'Good';
    return 'Excellent';
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Hourly Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {/* Hours header */}
          <div className="flex gap-0.5 mb-1 ml-10">
            {hours.filter((_, i) => i % 3 === 0).map((hour) => (
              <span 
                key={hour} 
                className="text-xs text-muted-foreground"
                style={{ width: '36px' }}
              >
                {hour.toString().padStart(2, '0')}
              </span>
            ))}
          </div>
          
          {/* Heatmap grid */}
          <div className="space-y-0.5">
            {data.map((dayData, dayIndex) => (
              <div key={dayIndex} className="flex items-center gap-0.5">
                <span className="text-xs text-muted-foreground w-8 text-right mr-2">
                  {days[dayIndex]}
                </span>
                {dayData.map((value, hourIndex) => (
                  <Tooltip key={hourIndex}>
                    <TooltipTrigger asChild>
                      <div
                        className={`w-3 h-3 rounded-sm cursor-pointer transition-transform hover:scale-150 ${getColor(value)}`}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-mono">
                        {days[dayIndex]} {hourIndex}:00 - {hourIndex + 1}:00
                      </p>
                      <p className="text-muted-foreground">
                        {getPerformanceLabel(value)} ({(value * 100).toFixed(0)}%)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                <div className="w-3 h-3 rounded-sm bg-destructive/50" />
                <div className="w-3 h-3 rounded-sm bg-muted" />
                <div className="w-3 h-3 rounded-sm bg-success/50" />
              </div>
              <span className="text-xs text-muted-foreground">
                Low → High Performance
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-3">
          Best trading hours based on historical performance
        </p>
      </CardContent>
    </Card>
  );
};
