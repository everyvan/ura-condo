import { NotificationItem } from '../types';

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'URA Realis Caveat Influx: D21 Clementi',
    timestamp: '14 mins ago',
    type: 'caveat',
    description: '12 new caveats lodged for Pinetree Hill at an average of S$ 2,385 PSF. Validates Pine Grove Parcel B projected pricing model.',
    read: false,
  },
  {
    id: 'n-2',
    title: 'GLS Tender Award Announcement',
    timestamp: '2 hours ago',
    type: 'award',
    description: 'BCA & URA awarded Holland Drive site to CapitaLand consortium at S$ 1,485 PSF PPR. Forecaster updated.',
    read: false,
  },
  {
    id: 'n-3',
    title: 'Jalan Tembusu Developer Notice',
    timestamp: 'Yesterday',
    type: 'planning',
    description: 'Sim Lian registered project name and preliminary e-brochure submission. Expected VIP Preview early next month.',
    read: true,
  },
  {
    id: 'n-4',
    title: 'BCA Tender Construction Cost Index',
    timestamp: '2 days ago',
    type: 'planning',
    description: 'Quarterly construction cost baseline updated to +S$ 420 PSF (including BCA green mark & prelims).',
    read: true,
  }
];
