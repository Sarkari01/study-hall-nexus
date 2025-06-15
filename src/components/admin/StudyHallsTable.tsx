import React, { useState, useEffect } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2, Filter } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useStudyHalls } from "@/hooks/useStudyHalls";
import StudyHallForm from './StudyHallForm';
import StudyHallView from './StudyHallView';

interface StudyHall {
  id: string;
  name: string;
  merchant_id?: string;
  description?: string;
  location: string;
  capacity: number;
  price_per_day: number;
  price_per_week?: number;
  price_per_month?: number;
  amenities: string[];
  status: 'draft' | 'active' | 'inactive' | 'maintenance';
  rating: number;
  total_bookings: number;
  total_revenue: number;
  is_featured: boolean;
  operating_hours?: any;
  created_at: string;
  updated_at: string;
}

interface DataTableProps {
  data: StudyHall[];
}

const StudyHallsTable: React.FC<DataTableProps> = ({ data }) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [showAddStudyHall, setShowAddStudyHall] = useState(false);
  const [editingStudyHall, setEditingStudyHall] = useState<StudyHall | null>(null);
  const [viewingStudyHall, setViewingStudyHall] = useState<StudyHall | null>(null);
  const [showViewStudyHall, setShowViewStudyHall] = useState(false);
  const { toast } = useToast();
  const { deleteStudyHall, updateStudyHall } = useStudyHalls();

  const columns: ColumnDef<StudyHall>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            {column.getIsSorted() === "asc" ? (
              " 🔽"
            ) : column.getIsSorted() === "desc" ? (
              " 🔼"
            ) : null}
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="font-bold">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "capacity",
      header: "Capacity",
    },
    {
      accessorKey: "price_per_day",
      header: "Price (Per Day)",
      cell: ({ row }) => `₹${row.getValue("price_per_day")}`,
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => (
        <div className="flex items-center">
          {row.getValue("rating")}
          <svg className="w-4 h-4 text-yellow-500 fill-current ml-1" viewBox="0 0 24 24">
            <path d="M12,17.27L18.18,21L16.86,13.81L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.14,13.81L5.82,21L12,17.27Z" />
          </svg>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as 'draft' | 'active' | 'inactive';
        let badgeColor = "bg-gray-200 text-gray-700";
        if (status === "active") {
          badgeColor = "bg-green-200 text-green-700";
        } else if (status === "inactive") {
          badgeColor = "bg-red-200 text-red-700";
        }
        return <Badge className={badgeColor}>{status}</Badge>;
      },
      filterFn: (row, id, value: string) => {
        return value === 'all' || row.getValue(id) === value
      },
      enableSorting: false,
      header: ({ column }) => (
        <div className="relative">
          <Button
            variant="ghost"
            onClick={() => column.toggleVisibility()}
          >
            Status
            <Filter className="h-4 w-4 ml-2" />
          </Button>
        </div>
      ),
    },
    {
      accessorKey: "is_featured",
      header: () => <div className="text-center">Featured</div>,
      cell: ({ row }) => (
        <div className="text-center">
          <Checkbox
            checked={row.original.is_featured}
            onCheckedChange={(checked) => {
              updateStudyHall(row.original.id, { is_featured: checked });
              toast({
                title: "Success",
                description: `Study hall ${checked ? 'featured' : 'unfeatured'} successfully`,
              });
            }}
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => {
                setEditingStudyHall(row.original);
                setShowAddStudyHall(true);
              }}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setViewingStudyHall(row.original);
                setShowViewStudyHall(true);
              }}>
                <Edit className="h-4 w-4 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={async () => {
                const studyHallId = row.original.id;
                await deleteStudyHall(studyHallId);
              }}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting: sorting,
      columnFilters: columnFilters,
    },
  })

  const handleAddStudyHall = async (data: any) => {
    // TODO: Implement add study hall logic here
    console.log("Adding study hall:", data);
  };

  // Update the editData object to include operatingHours
  const editData = {
    merchantId: data.find(studyHall => studyHall.id === editingStudyHall?.id)?.merchant_id?.toString() || '',
    pricePerDay: data.find(studyHall => studyHall.id === editingStudyHall?.id)?.price_per_day?.toString() || '',
    pricePerWeek: data.find(studyHall => studyHall.id === editingStudyHall?.id)?.price_per_week?.toString() || '',
    pricePerMonth: data.find(studyHall => studyHall.id === editingStudyHall?.id)?.price_per_month?.toString() || '',
    customAmenities: [],
    operatingHours: {
      open: '09:00',
      close: '21:00',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    },
    ...editingStudyHall,
    id: parseInt(editingStudyHall?.id || '0'),
    name: editingStudyHall?.name || '',
    merchantName: `Merchant ${editingStudyHall?.merchant_id}`,
    location: editingStudyHall?.location || '',
    gpsLocation: { lat: 28.6139, lng: 77.2090 },
    capacity: editingStudyHall?.capacity || 30,
    rows: 5,
    seatsPerRow: 6,
    layout: Array.from({ length: 30 }, (_, i) => ({ 
      id: `${String.fromCharCode(65 + Math.floor(i / 6))}${(i % 6) + 1}`, 
      status: Math.random() > 0.7 ? 'occupied' : 'available' as 'available' | 'occupied' | 'maintenance' | 'disabled'
    })),
    amenities: editingStudyHall?.amenities || [],
    status: editingStudyHall?.status as 'draft' | 'active' | 'inactive' || 'draft',
    rating: editingStudyHall?.rating || 4.2,
    totalBookings: editingStudyHall?.total_bookings || 0,
    description: editingStudyHall?.description || '',
    images: [],
    mainImage: '',
    qrCode: editingStudyHall?.id
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Study Halls</h1>
        <Button onClick={() => setShowAddStudyHall(true)}>Add Study Hall</Button>
      </div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter study halls..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <StudyHallForm
        isOpen={showAddStudyHall}
        onClose={() => {
          setShowAddStudyHall(false);
          setEditingStudyHall(null);
        }}
        onSubmit={handleAddStudyHall}
        editData={editData as any}
        isAdmin={true}
      />

      {viewingStudyHall && (
        <StudyHallView
          studyHall={viewingStudyHall}
          isOpen={showViewStudyHall}
          onClose={() => {
            setShowViewStudyHall(false);
            setViewingStudyHall(null);
          }}
          onEdit={() => {
            setEditingStudyHall(viewingStudyHall);
            setShowAddStudyHall(true);
            setShowViewStudyHall(false);
          }}
        />
      )}
    </div>
  )
}

export default StudyHallsTable;
