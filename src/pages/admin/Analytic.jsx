import React, { useEffect, useState } from "react";
import { Facebook, Instagram, Video } from "lucide-react";
import { analyticsStore } from "../../store/analytics";

export default function Analytic() {
  const analytic = analyticsStore();
  const [overview, setOverview] = useState([]);
  const [topPost, setTopPost] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const overview = await analytic.getAnalyticsOverview();
      setOverview(overview?.data?.content);
      // console.log(overview?.data?.content);

      const allPost = await analytic.getAnalyticsAllPost();
      setTopPost(allPost?.data?.content);
    };
    fetchData();
  }, []);

  const totalPosts = overview.reduce((acc, item) => acc + item.total_posts, 0);

  const totalEngagement = overview.reduce(
    (acc, item) => acc + item.total_engagement,
    0
  );
  const averageEngagement =
    totalPosts > 0 ? (totalEngagement / totalPosts).toFixed(1) : 0;

  const totalEngagementRate =
    overview.reduce((acc, item) => acc + item.engagement_percentage, 0) /
    (overview.length || 1);

  return (
    <div className="p-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Analytics & Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-500 text-white p-4 rounded-2xl shadow">
          <p className="text-lg">Tổng bài đăng</p>
          <p className="text-4xl font-bold">{totalPosts}</p>
        </div>

        <div className="bg-green-500 text-white p-4 rounded-2xl shadow">
          <p className="text-lg">Tổng lượt tương tác</p>
          <p className="text-4xl font-bold">{totalEngagement}</p>
        </div>

        <div className="bg-purple-500 text-white p-4 rounded-2xl shadow">
          <p className="text-lg">Tương tác trung bình</p>
          <p className="text-4xl font-bold">{averageEngagement}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-6">
          Top bài đăng hiệu suất cao
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className=" py-3 px-4 text-sm font-medium text-gray-500 uppercase items-center justify-center mx-auto text-center">
                  Bài đăng
                </th>
                <th className=" py-3 px-4 text-sm font-medium text-gray-500 uppercase">
                  Nền tảng
                </th>
                <th className=" py-3 px-4 text-sm font-medium text-gray-500 uppercase">
                  Fanpage
                </th>
                <th className=" py-3 px-4 text-sm font-medium text-gray-500 uppercase">
                  Tương tác
                </th>
                <th className=" py-3 px-4 text-sm font-medium text-gray-500 uppercase">
                  Tỉ lệ
                </th>
              </tr>
            </thead>
            <tbody>
              {[...topPost]
                .sort((a, b) => b.engagement.total - a.engagement.total)
                .slice(0, 3)
                .map((post, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {/* <span className="text-2xl">{post.icon}</span> */}
                        <span className="text-gray-700 max-w-md">
                          {post.caption.length > 60
                            ? post.caption.slice(0, 60) + "..."
                            : post.caption}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2 flex-wrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium`}
                        >
                          {post.platform}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      {post.accountName}
                    </td>
                    <td className="py-4 px-4 text-gray-700 text-center">
                      {post.engagement.total}
                    </td>

                    <td className="py-4 px-4">
                      <span className={`font-semibold `}>
                        {(
                          (post.engagement.total / totalEngagement) *
                          100
                        ).toFixed(2)}
                        %
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Platform Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {overview.map((item, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-4 mb-6">
              <img
                src={item.platform_image}
                className={`  w-10 h-10 rounded-full`}
              ></img>
              <h3 className="text-lg font-semibold text-gray-800">
                {item.platform}
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Bài đăng:</span>
                <span className="text-2xl font-bold text-gray-800">
                  {item.total_posts}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tương tác:</span>
                <span className="text-2xl font-bold text-gray-800">
                  {item.total_engagement}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tỉ lệ:</span>
                <span className={`text-2xl font-bold `}>
                  {item.engagement_percentage}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
