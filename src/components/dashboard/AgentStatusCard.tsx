import { motion } from 'framer-motion';
import {
  Activity,
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Settings,
  Brain,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useTradingStore, useComputedStats } from '@/stores';
import { formatDuration, formatCompact } from '@/utils/formatters';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

type AgentStatus = 'active' | 'paused' | 'error' | 'initializing';

interface HealthMetric {
  label: string;
  value: number;
  max: number;
  unit?: string;
  icon: React.ElementType;
  status: 'good' | 'warning' | 'error';
}

// ============================================================================
// Helper Functions
// ============================================================================

function getStatusConfig(status: AgentStatus) {
  const configs = {
    active: {
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/20',
      icon: CheckCircle2,
      label: 'Active',
      pulseClass: 'pulse-success',
    },
    paused: {
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/20',
      icon: AlertTriangle,
      label: 'Paused',
      pulseClass: 'pulse-warning',
    },
    error: {
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      borderColor: 'border-destructive/20',
      icon: XCircle,
      label: 'Error',
      pulseClass: 'pulse-error',
    },
    initializing: {
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20',
      icon: Activity,
      label: 'Initializing',
      pulseClass: '',
    },
  };

  return configs[status];
}

function getHealthStatus(value: number, max: number): 'good' | 'warning' | 'error' {
  const percentage = (value / max) * 100;
  if (percentage >= 80) return 'error';
  if (percentage >= 60) return 'warning';
  return 'good';
}

// ============================================================================
// Sub-Components
// ============================================================================

function HealthMetricItem({ metric }: { metric: HealthMetric }) {
  const percentage = Math.min((metric.value / metric.max) * 100, 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <metric.icon className="h-3.5 w-3.5" />
          <span>{metric.label}</span>
        </div>
        <span
          className={cn(
            'font-mono font-semibold',
            metric.status === 'good' && 'text-success',
            metric.status === 'warning' && 'text-warning',
            metric.status === 'error' && 'text-destructive'
          )}
        >
          {metric.value.toFixed(0)}
          {metric.unit}
        </span>
      </div>
      <Progress
        value={percentage}
        className={cn(
          'h-1.5',
          metric.status === 'good' && '[&>div]:bg-success',
          metric.status === 'warning' && '[&>div]:bg-warning',
          metric.status === 'error' && '[&>div]:bg-destructive'
        )}
      />
    </div>
  );
}

function StatusIndicator({
  status,
  uptime,
}: {
  status: AgentStatus;
  uptime: number;
}) {
  const config = getStatusConfig(status);
  const StatusIcon = config.icon;

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center',
            config.bgColor,
            'border',
            config.borderColor
          )}
        >
          <StatusIcon className={cn('h-6 w-6', config.color)} />
        </div>
        {status === 'active' && (
          <span
            className={cn(
              'absolute -top-1 -right-1 w-4 h-4 rounded-full bg-success',
              config.pulseClass
            )}
          />
        )}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-display font-semibold text-base">
            Agent Status
          </h3>
          <Badge
            variant="outline"
            className={cn('text-xs font-medium', config.bgColor, config.color)}
          >
            {config.label}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Uptime: {formatDuration(uptime)}
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function AgentStatusCard() {
  const { agentStatus } = useTradingStore();
  const { totalScans, executionRate, avgAIConfidence } = useComputedStats();

  // Calculate uptime duration
  const uptimeDuration = agentStatus.uptime > 0 
    ? Date.now() - agentStatus.uptime 
    : 0;

  // Calculate error rate
  const errorCount = agentStatus.errors?.length || 0;
  const totalTrades = agentStatus.totalTrades || 1;
  const errorRate = (errorCount / totalTrades) * 100;

  const healthMetrics: HealthMetric[] = [
    {
      label: 'AI Response Time',
      value: agentStatus.aiResponseTime || 0,
      max: 5000,
      unit: 'ms',
      icon: Brain,
      status: getHealthStatus(agentStatus.aiResponseTime || 0, 5000),
    },
    {
      label: 'Opportunities Scanned',
      value: totalScans,
      max: 1000,
      icon: Activity,
      status: 'good',
    },
    {
      label: 'Error Rate',
      value: errorRate,
      max: 100,
      unit: '%',
      icon: AlertTriangle,
      status: getHealthStatus(errorRate, 10), // Errors over 10% are concerning
    },
  ];

  return (
    <Card className="glass-hover">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <StatusIndicator
            status={agentStatus.status as AgentStatus}
            uptime={uptimeDuration}
          />
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-secondary/30 border border-border/50">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">
              Total Scans
            </p>
            <p className="font-mono text-xl font-bold text-primary">
              {formatCompact(totalScans)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">
              Execution Rate
            </p>
            <p className="font-mono text-xl font-bold">
              {executionRate.toFixed(0)}
              <span className="text-sm text-muted-foreground ml-1">%</span>
            </p>
          </div>
        </div>

        {/* AI Confidence Indicator (NEW) */}
        {avgAIConfidence > 0 && (
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">AI Confidence</span>
              </div>
              <span className="text-sm font-mono font-bold text-primary">
                {avgAIConfidence.toFixed(0)}%
              </span>
            </div>
            <Progress 
              value={avgAIConfidence} 
              className="h-2 [&>div]:bg-primary"
            />
          </div>
        )}

        {/* Health Metrics */}
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground font-medium">Health Metrics</p>
          {healthMetrics.map((metric) => (
            <HealthMetricItem key={metric.label} metric={metric} />
          ))}
        </div>

        {/* Trade Statistics (NEW) */}
        {agentStatus.totalTrades > 0 && (
          <div className="pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-2">Trade Statistics</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Executed</p>
                <p className="font-mono text-sm font-bold text-success">
                  {agentStatus.totalTrades}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Successful</p>
                <p className="font-mono text-sm font-bold text-success">
                  {agentStatus.successfulTrades || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Skipped</p>
                <p className="font-mono text-sm font-bold text-warning">
                  {agentStatus.skippedTrades || 0}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Errors */}
        {agentStatus.errors && agentStatus.errors.length > 0 && (
          <div className="pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
              Recent Errors ({agentStatus.errors.length})
            </p>
            <div className="space-y-1.5">
              {agentStatus.errors.slice(0, 3).map((error, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-xs text-destructive bg-destructive/5 px-2 py-1.5 rounded border border-destructive/20"
                >
                  {error.substring(0, 80)}
                  {error.length > 80 && '...'}
                </motion.p>
              ))}
            </div>
          </div>
        )}

        {/* Current Strategy & AI Engine */}
        <div className="pt-3 border-t border-border/50 space-y-2">
          {agentStatus.currentStrategy && (
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">
                Active Strategy
              </p>
              <Badge variant="secondary" className="font-medium">
                {agentStatus.currentStrategy}
              </Badge>
            </div>
          )}
          
          {agentStatus.aiEngine && (
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">
                AI Engine
              </p>
              <Badge variant="outline" className="font-medium bg-primary/5 text-primary border-primary/20">
                <Brain className="h-3 w-3 mr-1" />
                {agentStatus.aiEngine}
              </Badge>
            </div>
          )}
        </div>

        {/* Total Profit Display (NEW) */}
        {agentStatus.totalProfit && parseFloat(agentStatus.totalProfit) !== 0 && (
          <div className="pt-3 border-t border-border/50">
            <div className="p-3 rounded-lg bg-success/5 border border-success/20">
              <p className="text-xs text-muted-foreground mb-1">
                Total Profit
              </p>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" />
                <p className="font-mono text-lg font-bold text-success">
                  ${parseFloat(agentStatus.totalProfit).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}