import React from 'react';
import { TrendingUp, Users, Globe, Calendar, Eye, MousePointer, Smartphone, Monitor } from 'lucide-react';

interface WebsiteAnalyticsProps {
  websiteData: any;
}

export default function WebsiteAnalytics({ websiteData }: WebsiteAnalyticsProps) {
  // Mock analytics data - in a real app, this would come from your analytics service
  const analyticsData = {
    pageViews: {
      total: 1247,
      thisWeek: 89,
      lastWeek: 76,
      growth: 17.1
    },
    uniqueVisitors: {
      total: 892,
      thisWeek: 67,
      lastWeek: 58,
      growth: 15.5
    },
    rsvpConversion: {
      rate: 68.5,
      total: 45,
      thisWeek: 8,
      lastWeek: 6
    },
    deviceBreakdown: {
      mobile: 62,
      desktop: 28,
      tablet: 10
    },
    topPages: [
      { page: 'Home', views: 456, percentage: 36.6 },
      { page: 'RSVP', views: 234, percentage: 18.8 },
      { page: 'Our Story', views: 189, percentage: 15.2 },
      { page: 'Schedule', views: 167, percentage: 13.4 },
      { page: 'Accommodations', views: 123, percentage: 9.9 },
      { page: 'Registry', views: 78, percentage: 6.3 }
    ],
    trafficSources: [
      { source: 'Direct', visitors: 312, percentage: 35.0 },
      { source: 'Social Media', visitors: 267, percentage: 29.9 },
      { source: 'Email', visitors: 178, percentage: 20.0 },
      { source: 'Search', visitors: 89, percentage: 10.0 },
      { source: 'Referral', visitors: 46, percentage: 5.2 }
    ],
    weeklyData: [
      { day: 'Mon', views: 45, visitors: 32 },
      { day: 'Tue', views: 52, visitors: 38 },
      { day: 'Wed', views: 38, visitors: 29 },
      { day: 'Thu', views: 67, visitors: 48 },
      { day: 'Fri', views: 89, visitors: 62 },
      { day: 'Sat', views: 134, visitors: 89 },
      { day: 'Sun', views: 98, visitors: 71 }
    ]
  };

  const formatGrowth = (growth: number) => {
    const isPositive = growth > 0;
    return (
      <span className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        <TrendingUp className={`h-3 w-3 mr-1 ${!isPositive ? 'rotate-180' : ''}`} />
        {Math.abs(growth).toFixed(1)}%
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-600">Page Views</span>
            </div>
            {formatGrowth(analyticsData.pageViews.growth)}
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {analyticsData.pageViews.total.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            {analyticsData.pageViews.thisWeek} this week
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-gray-600">Unique Visitors</span>
            </div>
            {formatGrowth(analyticsData.uniqueVisitors.growth)}
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {analyticsData.uniqueVisitors.total.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            {analyticsData.uniqueVisitors.thisWeek} this week
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <MousePointer className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium text-gray-600">RSVP Rate</span>
            </div>
            <span className="text-green-600 text-sm font-medium">
              {analyticsData.rsvpConversion.rate}%
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            {analyticsData.rsvpConversion.total}
          </div>
          <div className="text-sm text-gray-500">
            {analyticsData.rsvpConversion.thisWeek} this week
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-medium text-gray-600">Website Status</span>
            </div>
            <span className={`text-sm font-medium ${websiteData.isPublished ? 'text-green-600' : 'text-yellow-600'}`}>
              {websiteData.isPublished ? 'Live' : 'Draft'}
            </span>
          </div>
          <div className="text-lg font-bold text-gray-800 mb-1">
            {websiteData.url}
          </div>
          <div className="text-sm text-gray-500">
            Last updated {websiteData.analytics.lastUpdated.toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Weekly Traffic Chart */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Weekly Traffic</h3>
          <div className="space-y-4">
            {analyticsData.weeklyData.map((day, index) => (
              <div key={day.day} className="flex items-center space-x-4">
                <div className="w-12 text-sm text-gray-600 font-medium">{day.day}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">Views: {day.views}</span>
                    <span className="text-sm text-gray-500">Visitors: {day.visitors}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ width: `${(day.views / Math.max(...analyticsData.weeklyData.map(d => d.views))) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Device Breakdown</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Smartphone className="h-5 w-5 text-blue-500" />
                <span className="text-gray-700">Mobile</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${analyticsData.deviceBreakdown.mobile}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-800 w-10">
                  {analyticsData.deviceBreakdown.mobile}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Monitor className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">Desktop</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${analyticsData.deviceBreakdown.desktop}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-800 w-10">
                  {analyticsData.deviceBreakdown.desktop}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-purple-500 rounded"></div>
                <span className="text-gray-700">Tablet</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${analyticsData.deviceBreakdown.tablet}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-800 w-10">
                  {analyticsData.deviceBreakdown.tablet}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Top Pages */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Most Visited Pages</h3>
          <div className="space-y-3">
            {analyticsData.topPages.map((page, index) => (
              <div key={page.page} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </div>
                  <span className="text-gray-700 font-medium">{page.page}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">{page.percentage}%</span>
                  <span className="text-sm font-medium text-gray-800">{page.views}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">Traffic Sources</h3>
          <div className="space-y-3">
            {analyticsData.trafficSources.map((source, index) => (
              <div key={source.source} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' :
                    index === 2 ? 'bg-purple-500' :
                    index === 3 ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-gray-700 font-medium">{source.source}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">{source.percentage}%</span>
                  <span className="text-sm font-medium text-gray-800">{source.visitors}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-primary-50 to-sage-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Insights & Recommendations</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-800">Strong Mobile Traffic</p>
                <p className="text-sm text-gray-600">62% of visitors use mobile devices. Your responsive design is working well.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-800">High RSVP Conversion</p>
                <p className="text-sm text-gray-600">68.5% RSVP rate is excellent. Consider sending reminders to boost it further.</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-800">Peak Weekend Traffic</p>
                <p className="text-sm text-gray-600">Most visitors browse on weekends. Consider timing updates accordingly.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-800">Social Media Success</p>
                <p className="text-sm text-gray-600">30% traffic from social media. Your sharing strategy is effective.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}