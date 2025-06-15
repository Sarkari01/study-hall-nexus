
import React, { useState } from 'react';
import {
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
import { useToast } from "@/hooks/use-toast"
import { useStudyHalls } from "@/hooks/useStudyHalls";
import StudyHallForm from './StudyHallForm';
import StudyHallView from './StudyHallView';
import { StudyHall, StudyHallFormData } from "@/types/studyHall";
import { convertToFormData, convertToViewData } from "@/utils/studyHallConverters";
import { createStudyHallColumns } from "./studyHalls/StudyHallTableColumns";

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

  const handleEdit = (studyHall: StudyHall) => {
    setEditingStudyHall(studyHall);
    setShowAddStudyHall(true);
  };

  const handleView = (studyHall: StudyHall) => {
    setViewingStudyHall(studyHall);
    setShowViewStudyHall(true);
  };

  const handleDelete = async (studyHallId: string) => {
    await deleteStudyHall(studyHallId);
  };

  const handleToggleFeatured = (studyHall: StudyHall, featured: boolean) => {
    updateStudyHall(studyHall.id, { is_featured: featured });
    toast({
      title: "Success",
      description: `Study hall ${featured ? 'featured' : 'unfeatured'} successfully`,
    });
  };

  const columns = createStudyHallColumns({
    onEdit: handleEdit,
    onView: handleView,
    onDelete: handleDelete,
    onToggleFeatured: handleToggleFeatured,
  });

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

  const handleAddStudyHall = async (data: StudyHallFormData) => {
    // TODO: Implement add study hall logic here
    console.log("Adding study hall:", data);
  };

  // Get editData with proper type conversion
  const editData: StudyHallFormData | null = editingStudyHall ? convertToFormData(editingStudyHall) : null;

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
        editData={editData}
        isAdmin={true}
      />

      {viewingStudyHall && (
        <StudyHallView
          studyHall={convertToViewData(viewingStudyHall)}
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
