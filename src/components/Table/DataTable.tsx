import React from "react";
import { useMemo } from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  TableInstance,
  TableState,
  ColumnInstance,
} from "react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, MoveLeft, MoveRight } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface ExtendedColumnInstance<T extends object> extends ColumnInstance<T> {
  isSorted?: boolean;
  isSortedDesc?: boolean;
  getSortByToggleProps?: () => any;
}

interface DataTableProps<T extends object> {
  columns: Array<{
    Header: string;
    accessor: keyof T;
  }>;
  data: T[];
  paginate?: boolean;
  extendWidth?: boolean;
}

const DataTable = <T extends object>({
  columns,
  data,
  paginate = false,
  extendWidth,
}: DataTableProps<T>) => {
  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedData = useMemo(() => data, [data]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
  } = useTable<T>(
    {
      columns: memoizedColumns,
      data: memoizedData,
      initialState: {
        pageIndex: 0,
        pageSize: paginate ? 100 : data.length,
      } as Partial<TableState<T>>,
    },
    useSortBy,
    usePagination
  ) as TableInstance<T> & {
    page: any[];
    canPreviousPage: boolean;
    canNextPage: boolean;
    nextPage: () => void;
    previousPage: () => void;
  };

  return (
    <>
      <Table
        {...getTableProps()}
        className={cn("w-full", extendWidth && "table-fixed")}
      >
        <TableHeader>
          {headerGroups.map((headerGroup, ind) => (
            <TableRow {...headerGroup.getHeaderGroupProps()} key={ind}>
              {headerGroup.headers.map((column, ind) => {
                const extendedColumn = column as ExtendedColumnInstance<T>;

                return (
                  <TableHead
                    {...extendedColumn.getHeaderProps(
                      extendedColumn.getSortByToggleProps
                        ? extendedColumn.getSortByToggleProps()
                        : {}
                    )}
                    key={ind}
                    className="bg-primary/10"
                  >
                    {extendedColumn.render("Header")}
                    <span>
                      {extendedColumn.isSorted ? (
                        extendedColumn.isSortedDesc ? (
                          <ChevronDown className="inline ml-2 w-4 h-4" />
                        ) : (
                          <ChevronUp className="inline ml-2 w-4 h-4" />
                        )
                      ) : (
                        ""
                      )}
                    </span>
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody {...getTableBodyProps()}>
          {page.map((row: any, ind: number) => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()} key={ind}>
                {row.cells.map((cell: any) => (
                  <TableCell
                    {...cell.getCellProps()}
                    key={ind}
                    className="py-3"
                  >
                    {cell.render("Cell")}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {paginate && (
        <div className="pagination flex justify-between gap-10 mt-3 text-farmacieGrey">
          <Button
            variant="outline"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="border-none bg-transparent"
          >
            <MoveLeft className="inline mr-2 mb-1" />
            {"Previous"}
          </Button>
          <Button
            variant="outline"
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="border-none bg-transparent"
          >
            {"Next "}
            <MoveRight className="inline" />
          </Button>
        </div>
      )}
    </>
  );
};

export default DataTable;
