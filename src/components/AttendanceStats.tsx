import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceRecord } from '../utils/types';

interface AttendanceStatsProps {
  data: AttendanceRecord[];
}

const AttendanceStats: React.FC<AttendanceStatsProps> = ({ data }) => {
  const calculateStats = () => {
    const totalEntries = data.filter(record => record.type === 'check-in').length;
    const uniqueUsers = new Set(data.map(record => record.userId)).size;
    
    // Calculer la moyenne de présence par jour
    const entriesByDate = data.reduce((acc, record) => {
      const date = new Date(record.timestamp).toLocaleDateString();
      if (record.type === 'check-in') {
        acc[date] = (acc[date] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    const averagePerDay = Object.values(entriesByDate).reduce((a, b) => a + b, 0) / 
      (Object.keys(entriesByDate).length || 1);

    return {
      totalEntries,
      uniqueUsers,
      averagePerDay: Math.round(averagePerDay),
    };
  };

  const stats = calculateStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="bg-gray-900 border-gold">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-gold">Total Présences</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats.totalEntries}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-900 border-gold">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-gold">Utilisateurs Uniques</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats.uniqueUsers}</p>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-900 border-gold">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-gold">Moyenne par Jour</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats.averagePerDay}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceStats;