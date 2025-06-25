import { AppLayout } from '@/components/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ListFilter, MoreHorizontal, PlusCircle, Search } from 'lucide-react';
import Link from 'next/link';

const loads = [
  { id: 'LD001', origin: 'New York, NY', destination: 'Los Angeles, CA', status: 'Booked', rate: 4500 },
  { id: 'LD002', origin: 'Chicago, IL', destination: 'Houston, TX', status: 'In-Transit', rate: 2200 },
  { id: 'LD003', origin: 'Miami, FL', destination: 'Seattle, WA', status: 'Delivered', rate: 5100 },
  { id: 'LD004', origin: 'Denver, CO', destination: 'Phoenix, AZ', status: 'Available', rate: 1800 },
  { id: 'LD005', origin: 'Atlanta, GA', destination: 'Boston, MA', status: 'Booked', rate: 1950 },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Booked': return 'secondary';
    case 'In-Transit': return 'default';
    case 'Delivered': return 'outline';
    case 'Available': return 'destructive';
    default: return 'secondary';
  }
}

export default function LoadsPage() {
  return (
    <AppLayout>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="flex items-center">
            <div className="relative flex-1 md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search loads..."
                    className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                />
            </div>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>Available</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Booked</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>In-Transit</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/loads/extract">
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Create from PDF</span>
              </Button>
            </Link>
            <Dialog>
                <DialogTrigger asChild>
                    <Button size="sm" className="h-8 gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">New Load</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create New Load</DialogTitle>
                        <DialogDescription>
                            Enter load details below. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="origin" className="text-right">Origin</Label>
                            <Input id="origin" placeholder="City, State" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="destination" className="text-right">Destination</Label>
                            <Input id="destination" placeholder="City, State" className="col-span-3" />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="rate" className="text-right">Rate</Label>
                            <Input id="rate" type="number" placeholder="$0.00" className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save Load</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Load Management</CardTitle>
            <CardDescription>View, manage, and track all your loads.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Load ID</TableHead>
                  <TableHead>Origin</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loads.map(load => (
                  <TableRow key={load.id}>
                    <TableCell className="font-medium">{load.id}</TableCell>
                    <TableCell>{load.origin}</TableCell>
                    <TableCell>{load.destination}</TableCell>
                    <TableCell>
                        <Badge variant={getStatusVariant(load.status)}>{load.status}</Badge>
                    </TableCell>
                    <TableCell>${load.rate.toFixed(2)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Assign Driver</DropdownMenuItem>
                          <DropdownMenuItem>Mark as Delivered</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </AppLayout>
  );
}
