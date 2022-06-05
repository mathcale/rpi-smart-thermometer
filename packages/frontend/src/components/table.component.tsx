import { useEffect } from 'react';
import { useTable, usePagination } from 'react-table';
import dayjs from 'dayjs';

import ChevronLeftIcon from './icons/chevron-left.icon.component';
import ChevronRightIcon from './icons/chevron-right.icon.component';
import DoubleChevronLeftIcon from './icons/double-chevron-left.icon.component';
import DoubleChevronRightIcon from './icons/double-chevron-right.icon.component';

interface TableProps {
  columns: any;
  data: any;
  fetchData: Function; // eslint-disable-line @typescript-eslint/ban-types
  loading: boolean;
  pageCount: number;
}

export default function Table({
  columns,
  data,
  fetchData,
  loading,
  pageCount: controlledPageCount,
}: TableProps): JSX.Element {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
      manualPagination: true,
      pageCount: controlledPageCount,
    },
    usePagination,
  );

  useEffect(() => {
    fetchData({ pageIndex, pageSize });
  }, [fetchData, pageIndex, pageSize]);

  const formatCell = (field, value) => {
    if (field === 'measuredAt') {
      return dayjs(value).format('DD/MM/YYYY HH:mm');
    } else if (field === 'temperature') {
      return `${Number(value).toFixed(1)}°C`;
    } else if (field === 'humidity') {
      return `${Number(value).toFixed(1)}%`;
    }
  };

  return (
    <>
      <table
        {...getTableProps()}
        className="table table-zebra w-full mb-5"
        data-testid="measurements-table"
      >
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={i}>
              {headerGroup.headers.map((column, j) => (
                <th {...column.getHeaderProps()} key={j}>
                  {column.render('Header')}
                  <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {page.map((row, k) => {
            prepareRow(row);

            return (
              <tr {...row.getRowProps()} key={k}>
                {row.cells.map((cell, l) => {
                  return (
                    <td {...cell.getCellProps()} key={l}>
                      {formatCell(cell.column.id, cell.value)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex flex-col justify-center items-center">
        <div className="mb-5">
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </div>

        <div className="btn-group mb-5">
          <button className="btn" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            <DoubleChevronLeftIcon />
          </button>

          <button className="btn" onClick={() => previousPage()} disabled={!canPreviousPage}>
            <ChevronLeftIcon />
          </button>

          <button className="btn" onClick={() => nextPage()} disabled={!canNextPage}>
            <ChevronRightIcon />
          </button>

          <button className="btn" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            <DoubleChevronRightIcon />
          </button>
        </div>

        <div className="mb-5 flex flex-row items-center">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <p>
              Showing {page.length} of ~{controlledPageCount * pageSize} results
            </p>
          )}

          <select
            className="select select-bordered ml-5"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}
