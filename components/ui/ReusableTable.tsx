import type React from "react"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "./table/table"

interface Column<T> {
  label: string
  accessor: keyof T | string
  render?: (row: T) => React.ReactNode
  className?: string
}

interface ReusableTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  caption?: string
  actions?: (row: T) => React.ReactNode
  emptyText?: string
}

function ReusableTable<T extends { id: string | number }>({
  columns,
  data,
  loading,
  caption,
  actions,
  emptyText = "कोई डेटा नहीं मिला",
}: ReusableTableProps<T>) {
  return (
    <div className="rounded-lg shadow overflow-hidden border border-orange-200 bg-white w-full">
      <div className="overflow-x-auto">
        <Table>
          {caption && <TableCaption className="text-sm sm:text-base p-2 sm:p-4">{caption}</TableCaption>}
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-orange-400 to-orange-500">
              {columns.map((col, idx) => (
                <TableHead
                  key={col.label + idx}
                  className="px-2 py-2 sm:px-4 lg:px-6 sm:py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider whitespace-nowrap"
                >
                  {col.label}
                </TableHead>
              ))}
              {actions && (
                <TableHead className="px-2 py-2 sm:px-4 lg:px-6 sm:py-3 text-left text-xs sm:text-sm font-bold text-white uppercase tracking-wider whitespace-nowrap">
                  कार्रवाई
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="text-center text-orange-500 font-semibold py-8 text-sm sm:text-base"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                    लोड हो रहा है...
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="text-center text-gray-400 py-8 text-sm sm:text-base"
                >
                  {emptyText}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, idx) => (
                <TableRow
                  key={row.id}
                  className={
                    idx % 2 === 0
                      ? "bg-orange-50 hover:bg-orange-100 transition-colors"
                      : "bg-white hover:bg-orange-50 transition-colors"
                  }
                >
                  {columns.map((col, cidx) => (
                    <TableCell
                      key={col.label + cidx}
                      className={`${col.className || ""} px-2 py-2 sm:px-4 lg:px-6 sm:py-4 text-xs sm:text-sm`}
                    >
                      <div className="max-w-[120px] sm:max-w-[200px] lg:max-w-none">
                        {col.render ? (
                          col.render(row)
                        ) : (
                          <span className="truncate block" title={String((row as any)[col.accessor])}>
                            {(row as any)[col.accessor]}
                          </span>
                        )}
                      </div>
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell className="px-2 py-2 sm:px-4 lg:px-6 sm:py-4 whitespace-nowrap">
                      <div className="flex gap-1 sm:gap-2 flex-wrap">{actions(row)}</div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default ReusableTable
