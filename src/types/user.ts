export interface UserStats {
  totalServices: number;
  activeServices: number;
  totalUsage: number;
  currentSpend: number;
  recentActivity: Array<{
    id: string;
    type: 'service_created' | 'service_deleted' | 'service_updated';
    description: string;
    timestamp: string;
  }>;
}