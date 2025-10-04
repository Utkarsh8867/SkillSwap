import { useSocket } from '@/hooks/useSocket';
    import toast from 'react-hot-toast';

    function NotificationBell() {
      useSocket('newNotification', (notificationData) => {
        toast.success(notificationData.message);
      });

      return <BellIcon />;
    }