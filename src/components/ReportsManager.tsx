'use client';

import React, { useState } from 'react';
import {
  X,
  Download,
  Mail,
  Calendar,
  Clock,
  FileText,
  BarChart3,
  Users,
  TrendingUp,
  Check,
  Send,
  Settings,
  ChevronDown,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import type { Company } from '@/types';

interface ReportsManagerProps {
  company: Company;
  onClose: () => void;
}

type ReportType = 'progress' | 'completion' | 'engagement' | 'assessment' | 'custom';
type ReportFrequency = 'once' | 'daily' | 'weekly' | 'monthly';
type ReportFormat = 'pdf' | 'excel' | 'csv';

interface ScheduledReport {
  id: string;
  type: ReportType;
  frequency: ReportFrequency;
  recipients: string[];
  lastSent: string | null;
  nextScheduled: string | null;
  isActive: boolean;
}

export default function ReportsManager({ company, onClose }: ReportsManagerProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'schedule' | 'history'>('generate');
  const [selectedReportType, setSelectedReportType] = useState<ReportType>('progress');
  const [selectedFormat, setSelectedFormat] = useState<ReportFormat>('pdf');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Scheduling state
  const [scheduleFrequency, setScheduleFrequency] = useState<ReportFrequency>('weekly');
  const [scheduleRecipients, setScheduleRecipients] = useState('');
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([
    {
      id: 'sr-001',
      type: 'progress',
      frequency: 'weekly',
      recipients: [company.adminEmail || 'admin@company.com'],
      lastSent: '2024-12-09',
      nextScheduled: '2024-12-16',
      isActive: true,
    },
  ]);

  const reportTypes = [
    { id: 'progress', name: 'Progress Report', desc: 'Learner progress and completion status', icon: TrendingUp },
    { id: 'completion', name: 'Completion Report', desc: 'Course and module completions', icon: Check },
    { id: 'engagement', name: 'Engagement Report', desc: 'Time spent, login frequency, activity', icon: Users },
    { id: 'assessment', name: 'Assessment Report', desc: 'Quiz scores and performance', icon: BarChart3 },
    { id: 'custom', name: 'Custom Report', desc: 'Build your own report with selected metrics', icon: Settings },
  ];

  const handleGenerateReport = async () => {
    setIsGenerating(true);

    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate and download report
    const reportContent = generateReportContent();
    downloadReport(reportContent);

    setIsGenerating(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const generateReportContent = () => {
    const now = new Date();
    let content = `${company.name} - ${reportTypes.find(r => r.id === selectedReportType)?.name}\n`;
    content += `Generated: ${now.toLocaleString()}\n`;
    content += `Period: ${dateRange.start || 'All time'} to ${dateRange.end || 'Present'}\n`;
    content += `==========================================\n\n`;

    // Add mock data based on report type
    switch (selectedReportType) {
      case 'progress':
        content += `LEARNER PROGRESS SUMMARY\n`;
        content += `------------------------\n`;
        content += `Total Learners: ${company.learnerCount}\n`;
        content += `Active Enrollments: ${company.activeEnrollments}\n`;
        content += `Average Progress: 72%\n`;
        content += `Completion Rate: 68%\n\n`;
        content += `TOP PERFORMERS:\n`;
        content += `1. Alice Johnson - 95% complete\n`;
        content += `2. Bob Williams - 88% complete\n`;
        content += `3. Carol Davis - 85% complete\n`;
        break;
      case 'completion':
        content += `COURSE COMPLETION SUMMARY\n`;
        content += `-------------------------\n`;
        content += `Courses Completed This Period: 45\n`;
        content += `Certificates Issued: 38\n`;
        content += `Average Time to Complete: 28 days\n\n`;
        content += `BY COURSE:\n`;
        content += `AZ-104: 18 completions (76% rate)\n`;
        content += `AZ-400: 12 completions (68% rate)\n`;
        content += `AWS SAA: 15 completions (71% rate)\n`;
        break;
      case 'engagement':
        content += `ENGAGEMENT METRICS\n`;
        content += `------------------\n`;
        content += `Total Logins: 1,245\n`;
        content += `Avg Session Duration: 45 mins\n`;
        content += `Daily Active Users: 85\n`;
        content += `Weekly Active Users: 156\n\n`;
        content += `PEAK HOURS:\n`;
        content += `9 AM - 11 AM: High Activity\n`;
        content += `2 PM - 4 PM: Medium Activity\n`;
        break;
      case 'assessment':
        content += `ASSESSMENT RESULTS\n`;
        content += `------------------\n`;
        content += `Quizzes Taken: 892\n`;
        content += `Average Score: 78%\n`;
        content += `Pass Rate: 82%\n\n`;
        content += `BY MODULE:\n`;
        content += `Identity & Governance: 82% avg\n`;
        content += `Storage Management: 76% avg\n`;
        content += `Virtual Networking: 74% avg\n`;
        break;
      default:
        content += `Custom report data would be generated based on selected metrics.\n`;
    }

    return content;
  };

  const downloadReport = (content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const reportName = reportTypes.find(r => r.id === selectedReportType)?.name.replace(/\s+/g, '_') || 'report';
    a.download = `${company.slug}_${reportName}_${formatDate(new Date().toISOString())}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleScheduleReport = () => {
    const recipients = scheduleRecipients.split(',').map(e => e.trim()).filter(Boolean);
    if (recipients.length === 0) {
      alert('Please enter at least one recipient email');
      return;
    }

    const newSchedule: ScheduledReport = {
      id: `sr-${Date.now()}`,
      type: selectedReportType,
      frequency: scheduleFrequency,
      recipients,
      lastSent: null,
      nextScheduled: getNextScheduledDate(scheduleFrequency),
      isActive: true,
    };

    setScheduledReports(prev => [...prev, newSchedule]);
    setScheduleRecipients('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const getNextScheduledDate = (frequency: ReportFrequency): string => {
    const now = new Date();
    switch (frequency) {
      case 'daily':
        now.setDate(now.getDate() + 1);
        break;
      case 'weekly':
        now.setDate(now.getDate() + 7);
        break;
      case 'monthly':
        now.setMonth(now.getMonth() + 1);
        break;
      default:
        return '';
    }
    return now.toISOString().split('T')[0];
  };

  const toggleScheduleStatus = (id: string) => {
    setScheduledReports(prev =>
      prev.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r)
    );
  };

  const deleteSchedule = (id: string) => {
    setScheduledReports(prev => prev.filter(r => r.id !== id));
  };

  const sendReportNow = async (report: ScheduledReport) => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsGenerating(false);

    setScheduledReports(prev =>
      prev.map(r => r.id === report.id ? { ...r, lastSent: new Date().toISOString().split('T')[0] } : r)
    );

    alert(`Report sent to: ${report.recipients.join(', ')}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Reports & Analytics</h2>
            <p className="text-sm text-gray-500">{company.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { id: 'generate', label: 'Generate Report', icon: FileText },
            { id: 'schedule', label: 'Scheduled Reports', icon: Calendar },
            { id: 'history', label: 'Report History', icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-cyan-600 text-cyan-600 bg-cyan-50/50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Generate Report Tab */}
          {activeTab === 'generate' && (
            <div className="space-y-6">
              {/* Report Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Report Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {reportTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setSelectedReportType(type.id as ReportType)}
                        className={cn(
                          'p-4 rounded-xl border-2 text-left transition-all',
                          selectedReportType === type.id
                            ? 'border-cyan-500 bg-cyan-50'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <Icon className={cn(
                          'w-6 h-6 mb-2',
                          selectedReportType === type.id ? 'text-cyan-600' : 'text-gray-400'
                        )} />
                        <p className="font-medium text-gray-900">{type.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{type.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Date Range
                </label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">End Date</label>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Format Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Export Format
                </label>
                <div className="flex gap-3">
                  {[
                    { id: 'pdf', label: 'PDF' },
                    { id: 'excel', label: 'Excel' },
                    { id: 'csv', label: 'CSV' },
                  ].map((format) => (
                    <button
                      key={format.id}
                      onClick={() => setSelectedFormat(format.id as ReportFormat)}
                      className={cn(
                        'px-6 py-2 rounded-lg font-medium transition-colors',
                        selectedFormat === format.id
                          ? 'bg-cyan-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      )}
                    >
                      {format.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  className={cn(
                    'flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors',
                    isGenerating
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-cyan-600 text-white hover:bg-cyan-700'
                  )}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Generate & Download
                    </>
                  )}
                </button>

                {showSuccess && (
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="w-5 h-5" />
                    <span>Report downloaded successfully!</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Schedule Reports Tab */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              {/* New Schedule Form */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Schedule New Report</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Report Type
                    </label>
                    <select
                      value={selectedReportType}
                      onChange={(e) => setSelectedReportType(e.target.value as ReportType)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none bg-white"
                    >
                      {reportTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequency
                    </label>
                    <select
                      value={scheduleFrequency}
                      onChange={(e) => setScheduleFrequency(e.target.value as ReportFrequency)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none bg-white"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipients (comma-separated emails)
                  </label>
                  <input
                    type="text"
                    value={scheduleRecipients}
                    onChange={(e) => setScheduleRecipients(e.target.value)}
                    placeholder="coordinator@company.com, manager@company.com"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                </div>

                <button
                  onClick={handleScheduleReport}
                  className="flex items-center gap-2 px-6 py-2 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Schedule Report
                </button>
              </div>

              {/* Existing Schedules */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Active Schedules</h3>
                {scheduledReports.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No scheduled reports yet</p>
                ) : (
                  <div className="space-y-3">
                    {scheduledReports.map((report) => (
                      <div
                        key={report.id}
                        className={cn(
                          'p-4 rounded-xl border-2 transition-all',
                          report.isActive ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-gray-900">
                                {reportTypes.find(t => t.id === report.type)?.name}
                              </p>
                              <span className={cn(
                                'px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                                report.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                              )}>
                                {report.isActive ? 'Active' : 'Paused'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">
                              {report.frequency.charAt(0).toUpperCase() + report.frequency.slice(1)} •
                              To: {report.recipients.join(', ')}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {report.lastSent && `Last sent: ${report.lastSent}`}
                              {report.nextScheduled && ` • Next: ${report.nextScheduled}`}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => sendReportNow(report)}
                              className="p-2 text-cyan-600 hover:bg-cyan-100 rounded-lg transition-colors"
                              title="Send now"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => toggleScheduleStatus(report.id)}
                              className={cn(
                                'p-2 rounded-lg transition-colors',
                                report.isActive
                                  ? 'text-amber-600 hover:bg-amber-100'
                                  : 'text-green-600 hover:bg-green-100'
                              )}
                              title={report.isActive ? 'Pause' : 'Resume'}
                            >
                              {report.isActive ? (
                                <Clock className="w-4 h-4" />
                              ) : (
                                <RefreshCw className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => deleteSchedule(report.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Report History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Recent Reports</h3>
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>

              {/* Mock history */}
              {[
                { type: 'Progress Report', date: '2024-12-10', format: 'PDF', size: '245 KB' },
                { type: 'Completion Report', date: '2024-12-09', format: 'Excel', size: '128 KB' },
                { type: 'Engagement Report', date: '2024-12-08', format: 'PDF', size: '312 KB' },
                { type: 'Assessment Report', date: '2024-12-05', format: 'CSV', size: '89 KB' },
                { type: 'Progress Report', date: '2024-12-01', format: 'PDF', size: '198 KB' },
              ].map((report, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-lg border border-gray-200">
                      <FileText className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{report.type}</p>
                      <p className="text-sm text-gray-500">{report.date} • {report.format} • {report.size}</p>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
