import SharedNotifications from "../../../components/shared/SharedNotifications";

const Notifications = () => {
  return (
    <SharedNotifications 
      endpoint="/notifications/admin"
      queryKey="adminNotifications"
      title="System Notifications"
      subtitle="Review recent system events and alerts."
      isAdmin={true}
    />
  );
};

export default Notifications;
