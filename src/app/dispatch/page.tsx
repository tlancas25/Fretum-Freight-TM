"use client"

import React, { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

type Load = {
  id: string;
  pickup: string;
  dropoff: string;
  payout: number;
};

type Driver = {
  id: string;
  name: string;
  avatarUrl: string;
};

type BoardData = {
  unassigned: Load[];
  [driverId: string]: Load[];
};

const initialLoads: Load[] = [
  { id: 'load-1', pickup: 'New York, NY', dropoff: 'Los Angeles, CA', payout: 4500 },
  { id: 'load-2', pickup: 'Chicago, IL', dropoff: 'Houston, TX', payout: 2200 },
  { id: 'load-3', pickup: 'Miami, FL', dropoff: 'Seattle, WA', payout: 5100 },
  { id: 'load-4', pickup: 'Denver, CO', dropoff: 'Phoenix, AZ', payout: 1800 },
];

const initialDrivers: Driver[] = [
  { id: 'driver-1', name: 'John Smith', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'driver-2', name: 'Maria Garcia', avatarUrl: 'https://placehold.co/100x100.png' },
];

export default function DispatchPage() {
  const [boardData, setBoardData] = useState<BoardData>({
    unassigned: initialLoads,
    'driver-1': [],
    'driver-2': [],
  });

  const [draggedItem, setDraggedItem] = useState<{ loadId: string; sourceCol: string } | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, loadId: string, sourceCol: string) => {
    setDraggedItem({ loadId, sourceCol });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetCol: string) => {
    e.preventDefault();
    if (!draggedItem) return;

    const { loadId, sourceCol } = draggedItem;

    if (sourceCol === targetCol) {
      setDraggedItem(null);
      return;
    }

    const loadToMove = boardData[sourceCol].find(load => load.id === loadId);
    if (!loadToMove) return;

    const newBoardData = { ...boardData };
    newBoardData[sourceCol] = newBoardData[sourceCol].filter(load => load.id !== loadId);
    newBoardData[targetCol] = [...newBoardData[targetCol], loadToMove];

    setBoardData(newBoardData);
    setDraggedItem(null);
  };
  
  const getDriverById = (id: string) => initialDrivers.find(d => d.id === id);

  return (
    <AppLayout>
      <main className="flex-1 p-4 md:p-6">
        <h1 className="font-headline text-3xl font-bold mb-6">Dispatch Board</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <Card 
            className="h-full min-h-[600px] bg-muted/30" 
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'unassigned')}
          >
            <CardHeader>
              <CardTitle>Unassigned Loads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {boardData.unassigned.map(load => (
                <LoadCard key={load.id} load={load} onDragStart={(e) => handleDragStart(e, load.id, 'unassigned')} />
              ))}
            </CardContent>
          </Card>
          
          {initialDrivers.map(driver => (
            <Card 
              key={driver.id} 
              className="h-full min-h-[600px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, driver.id)}
            >
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <Avatar>
                  <AvatarImage src={driver.avatarUrl} alt={driver.name} data-ai-hint="driver avatar" />
                  <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle>{driver.name}</CardTitle>
                </div>
                <Badge variant="secondary">Available</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                {boardData[driver.id]?.map(load => (
                   <LoadCard key={load.id} load={load} onDragStart={(e) => handleDragStart(e, load.id, driver.id)} />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </AppLayout>
  );
}

function LoadCard({ load, onDragStart }: { load: Load, onDragStart: (e: React.DragEvent<HTMLDivElement>) => void }) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm cursor-grab active:cursor-grabbing"
    >
      <div className="flex justify-between items-start">
        <p className="font-semibold">Load #{load.id.split('-')[1]}</p>
        <p className="font-bold text-primary">${load.payout.toLocaleString()}</p>
      </div>
      <div className="text-sm text-muted-foreground mt-2">
        <p><span className="font-medium">From:</span> {load.pickup}</p>
        <p><span className="font-medium">To:</span> {load.dropoff}</p>
      </div>
    </div>
  );
}
