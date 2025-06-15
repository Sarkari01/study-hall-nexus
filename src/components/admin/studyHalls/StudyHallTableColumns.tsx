
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { StudyHall } from "@/types/studyHall";

interface CreateColumnsProps {
  onEdit: (studyHall: StudyHall) => void;
  onView: (studyHall: StudyHall) => void;
  onDelete: (studyHallId: string) => void;
  onToggleFeatured: (studyHall: StudyHall, featured: boolean) => void;
}

export const createStudyHallColumns = ({
  onEdit,
  onView,
  onDelete,
  onToggleFeatured,
}: CreateColumnsProps): ColumnDef<StudyHall>[] => [
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
  },
  {
    accessorKey: "is_featured",
    header: () => <div className="text-center">Featured</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <Checkbox
          checked={Boolean(row.original.is_featured)}
          onCheckedChange={(checked) => {
            onToggleFeatured(row.original, Boolean(checked));
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
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onView(row.original)}>
              <Edit className="h-4 w-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(row.original.id)}>
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
];
