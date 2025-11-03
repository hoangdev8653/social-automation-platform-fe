const AvatarFanpage = ({ page }) => {
  const getImageUrl = () => {
    switch (page.platform.name) {
      case "Facebook":
        return `https://graph.facebook.com/${page.account_id}/picture?access_token=${page.access_token}`;
      case "Youtube":
        return page.account_image;
      default:
        return page.account_image;
    }
  };

  return (
    <img
      className="w-16 h-16 rounded-full object-cover border border-gray-100"
      src={getImageUrl()}
      alt={page.account_name}
    />
  );
};

export default AvatarFanpage;
