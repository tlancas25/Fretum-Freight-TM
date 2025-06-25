import { AppLayout } from '@/components/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { File, ListFilter, MoreHorizontal } from 'lucide-react';

const invoices = [
  { id: 'INV001', customer: 'Global Imports Inc.', date: '2023-10-25', amount: 2500, status: 'Paid' },
  { id: 'INV002', customer: 'National Freight Co.', date: '2023-10-28', amount: 1500, status: 'Sent' },
  { id: 'INV003', customer: 'Statewide Logistics', date: '2023-11-01', amount: 3500, status: 'Paid' },
  { id: 'INV004', customer: 'Rapid Transport', date: '2023-11-02', amount: 450, status: 'Draft' },
  { id: 'INV005', customer: 'Cross-Country Movers', date: '2023-11-05', amount: 5500, status: 'Sent' },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Paid': return 'default';
    case 'Sent': return 'secondary';
    case 'Draft': return 'outline';
    default: return 'secondary';
  }
}

export default function InvoicesPage() {
  const filteredInvoices = (status: string | null) => 
    status ? invoices.filter(inv => inv.status === status) : invoices;

  const renderTable = (status: string | null) => (
    <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices(status).map(invoice => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.customer}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                <TableCell>
                    <Badge variant={getStatusVariant(invoice.status)}>{invoice.status}</Badge>
                </TableCell>
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
                      <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                      <DropdownMenuItem>Download PDF</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
  );

  return (
    <AppLayout>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Tabs defaultValue="all">
                <div className="flex items-center">
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="draft">Draft</TabsTrigger>
                        <TabsTrigger value="sent">Sent</TabsTrigger>
                        <TabsTrigger value="paid">Paid</TabsTrigger>
                    </TabsList>
                    <div className="ml-auto flex items-center gap-2">
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 gap-1">
                            <ListFilter className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Filter
                            </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {/* Filter options here */}
                        </DropdownMenuContent>
                        </DropdownMenu>
                        <Button size="sm" variant="outline" className="h-8 gap-1">
                            <File className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Export
                            </span>
                        </Button>
                    </div>
                </div>
                 <Card>
                    <CardHeader>
                        <CardTitle>Invoices</CardTitle>
                        <CardDescription>Manage your invoices and view their status.</CardDescription>
                    </CardHeader>
                    <TabsContent value="all">{renderTable(null)}</TabsContent>
                    <TabsContent value="draft">{renderTable('Draft')}</TabsContent>
                    <TabsContent value="sent">{renderTable('Sent')}</TabsContent>
                    <TabsContent value="paid">{renderTable('Paid')}</TabsContent>
                </Card>
            </Tabs>
        </main>
    </AppLayout>
  );
}
