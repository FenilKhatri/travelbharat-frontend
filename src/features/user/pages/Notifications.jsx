import SharedNotifications from "../../../components/shared/SharedNotifications";

const Notifications = () => {
  return (
    <SharedNotifications 
      endpoint="/notifications/user"
      queryKey="userNotifications"
      title="Notifications"
      subtitle="Stay updated with your trips and platform activities."
      isAdmin={false}
    />
  );
};

export default Notifications;
