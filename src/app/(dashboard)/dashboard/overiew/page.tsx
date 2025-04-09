"use client";
import { useContextConsumer } from "@/context/Context";
import { Toaster } from "react-hot-toast";
import { useGetEmailStats, useGetNameandPass } from "@/hooks/apis/useDashboard";
import {
  Copy,
  RefreshCw,
  CheckCircle,
  Hourglass,
  XCircle,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkeletonCard } from "@/components/Loaders/SkeletonLoader";

export default function Home() {
  const { token } = useContextConsumer();

  const { data, isLoading, isRefetching, refetch } = useGetNameandPass(token);
  const { data: emailStatsData } = useGetEmailStats(token);

  const name = data?.data?.name;
  const password = data?.data?.password;

  const stats = emailStatsData?.data || {};

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  const handleRefetch = async () => {
    try {
      await refetch();
    } catch (err) {
      console.error("Refetch error", err);
    }
  };

  const hasData = name && password;

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <main className="relative min-h-[calc(100vh-4rem)] w-full bg-gray-50 dark:bg-zinc-900">
        <div className="max-w-4xl p-6 md:p-12 mx-auto space-y-8">
          {stats && (
            <div className="dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-6 space-y-4 shadow-sm">
              <h2 className="text-xl font-bold text-primary mb-4">
                Email Stats Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label="Total"
                  value={stats.total ?? 0}
                  icon={<Mail className="text-blue-500 w-5 h-5" />}
                  bgColor="bg-blue-100 dark:bg-blue-900"
                  textColor="text-blue-700 dark:text-blue-300"
                />
                <StatCard
                  label="Pending"
                  value={stats.pending ?? 0}
                  icon={<Hourglass className="text-yellow-500 w-5 h-5" />}
                  bgColor="bg-yellow-100 dark:bg-yellow-900"
                  textColor="text-yellow-700 dark:text-yellow-300"
                />
                <StatCard
                  label="Good"
                  value={stats.good ?? 0}
                  icon={<CheckCircle className="text-green-500 w-5 h-5" />}
                  bgColor="bg-green-100 dark:bg-green-900"
                  textColor="text-green-700 dark:text-green-300"
                />
                <StatCard
                  label="Bad"
                  value={stats.bad ?? 0}
                  icon={<XCircle className="text-red-500 w-5 h-5" />}
                  bgColor="bg-red-100 dark:bg-red-900"
                  textColor="text-red-700 dark:text-red-300"
                />
              </div>
            </div>
          )}

          {isLoading ? (
            <SkeletonCard className="w-full h-52" />
          ) : hasData ? (
            <div className="dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl p-6 space-y-6 shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-primary">
                  Unique Name & Password
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Click the copy icon to copy and click refresh to regenerate
                  credentials.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="text-sm text-gray-800 dark:text-gray-100">
                    <span className="font-medium">Username:</span> {name}
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleCopy(name)}
                    title="Copy username"
                    className="ml-2"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center">
                  <div className="text-sm text-gray-800 dark:text-gray-100">
                    <span className="font-medium">Password:</span> {password}
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleCopy(password)}
                    title="Copy password"
                    className="ml-2"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefetch}
                  disabled={isRefetching}
                  className="mt-4"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {isRefetching ? "Refreshing..." : "Refresh"}
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No credentials found.
            </p>
          )}
        </div>
      </main>
    </>
  );
}

const StatCard = ({
  label,
  value,
  icon,
  bgColor,
  textColor,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}) => (
  <div className={`rounded-lg p-4 flex items-center gap-4 ${bgColor}`}>
    <div className="p-2 rounded-full bg-white dark:bg-zinc-800 shadow">
      {icon}
    </div>
    <div>
      <h4 className={`text-sm font-medium ${textColor}`}>{label}</h4>
      <p className={`text-lg font-semibold ${textColor}`}>{value}</p>
    </div>
  </div>
);
