
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { SearchInput } from './search-input';
import { Badge } from './badge';
import { MoreHorizontal, Filter, Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  title: string;
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  actions?: React.ReactNode;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, any>>({
  title,
  data,
  columns,
  loading = false,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = "Search records...",
  actions,
  onRowClick,
  emptyMessage = "No data available"
}: DataTableProps<T>) {
  const renderCell = (column: Column<T>, item: T) => {
    const value = item[column.key];
    if (column.render) {
      return column.render(value, item);
    }
    return value?.toString() || '-';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4">
                <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <div className="flex items-center gap-4">
            {onSearchChange && (
              <SearchInput
                value={searchValue}
                onChange={onSearchChange}
                placeholder={searchPlaceholder}
                className="w-64"
              />
            )}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              {actions}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>{emptyMessage}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {columns.map((column) => (
                    <th
                      key={column.key.toString()}
                      className="text-left p-3 font-medium text-gray-700"
                    >
                      {column.label}
                    </th>
                  ))}
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={item.id || index}
                    className={`border-b hover:bg-gray-50 ${
                      onRowClick ? 'cursor-pointer' : ''
                    }`}
                    onClick={() => onRowClick?.(item)}
                  >
                    {columns.map((column) => (
                      <td key={column.key.toString()} className="p-3">
                        {renderCell(column, item)}
                      </td>
                    ))}
                    <td className="p-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
