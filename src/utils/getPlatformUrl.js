const getPlatformUrl = (platform, id, name) => {
  switch (platform) {
    case "Facebook":
      return `https://facebook.com/${id}`;
    case "Youtube":
      return `https://www.youtube.com/channel/${id}`;
    case "Twitter":
      return `https://x.com/i/user/${id}`;
    case "Instagram":
      return `https://instagram.com/${name}`;
    case "TikTok":
      return `https://www.tiktok.com/@${name}`;
    default:
      return "#";
  }
};

export default getPlatformUrl;
