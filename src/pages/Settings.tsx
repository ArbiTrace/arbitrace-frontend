import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings as SettingsIcon, Bell, Palette, Sliders } from 'lucide-react';
import { useSettingsStore } from '@/stores';
import { toast } from 'sonner';

const Settings = () => {
  const { notifications, display, setNotifications, setDisplay } = useSettingsStore();

  const handleNotificationChange = (key: keyof typeof notifications, value: boolean) => {
    setNotifications({ [key]: value });
    toast.success(`${key.replace(/([A-Z])/g, ' $1').trim()} ${value ? 'enabled' : 'disabled'}`);
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in max-w-3xl">
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-display font-bold">Settings</h1>
            <p className="text-muted-foreground">Configure your preferences</p>
          </div>
        </div>

        {/* Notifications */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription>Manage your alert preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-2">
                <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                <Switch checked={value} onCheckedChange={(v) => handleNotificationChange(key as keyof typeof notifications, v)} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Display */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Display
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Currency</Label>
              <Select value={display.currency} onValueChange={(v) => setDisplay({ currency: v as 'USD' | 'EUR' | 'CRO' })}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="CRO">CRO</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label>Chart Type</Label>
              <Select value={display.chartType} onValueChange={(v) => setDisplay({ chartType: v as 'area' | 'line' | 'candle' })}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="area">Area</SelectItem>
                  <SelectItem value="line">Line</SelectItem>
                  <SelectItem value="candle">Candle</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Advanced */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-primary" />
              Advanced
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">RPC endpoint and gas settings coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
