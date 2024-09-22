"use client";

import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import Image from 'next/image'; 
import { Search,SearchX,Trash2,Eye } from 'lucide-react';
import Link from 'next/link';

const columns = [
  { id: 'action', label: 'Action', minWidth: 100, align: 'center', sortable: false },
  { id: 'customer', label: 'Customer Name', minWidth: 150, sortable: true },
  { id: 'image', label: 'Image', minWidth: 100, align: 'center', sortable: false },
  { id: 'email', label: 'Email', minWidth: 100, sortable: true },
  { id: 'address', label: 'Address', minWidth: 100, align: 'right', sortable: true },
  { id: 'phone', label: 'Phone Number', minWidth: 100, align: 'right', sortable: true },
];

const initialRows = [
  { id: 1, customer: 'John Doe', image: 'https://via.placeholder.com/50', email: 'johndoe@example.com', address: '123 Main St', phone: '(123) 456-7890' },
  { id: 2, customer: 'Jane Smith', image: 'https://via.placeholder.com/50', email: 'janesmith@example.com', address: '456 Elm St', phone: '(987) 654-3210' },
  { id: 3, customer: 'Alice Johnson', image: 'https://via.placeholder.com/50', email: 'alicej@example.com', address: '789 Oak St', phone: '(555) 555-5555' },
];

export default function ProductTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [rows, setRows] = useState(initialRows);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleDelete = (id) => {
    const updatedRows = rows.filter((item) => item.id !== id);
    setRows(updatedRows);
  };

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(+e.target.value);
    setPage(0);
  };



  const filteredRows = rows.filter(row =>
    Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="mt-5 p-5 ">
      <h1 className='text-xl font-semibold'>Customers</h1>
      <div className="flex items-center justify-between">
        <div></div>
        <div className="flex items-center">
          <div
            className={`transition-all duration-300 ease-in-out ${
              isVisible
                ? "opacity-100 scale-100 translate-x-0"
                : "opacity-0 scale-95 -translate-x-full"
            }`}
          >
            <div className="p-2 flex items-center mb-2">
              <input
                className=" rounded-md p-2 border focus:border-black"
                onChange={handleSearch}
                value={searchTerm}
                type="text"
                placeholder="Search..."
              />
            </div>
          </div>
          <div className="mx-2">
            {isVisible ? (
              <Search
                className="cursor-pointer transition-all duration-300 ease-in-out"
                onClick={() => setIsVisible((prev) => !prev)}
              />
            ) : (
              <SearchX
                className="cursor-pointer transition-all duration-300 ease-in-out"
                onClick={() => setIsVisible((prev) => !prev)}
              />
            )}
          </div>
        </div>
      </div>

      <Paper className='px-4' sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="customized table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === 'image' ? (
                            <Image className='rounded-full' src={value} alt={row.customer} width={50} height={50} />
                          ) : column.id === 'action' ? (
                            <div className='flex items-center justify-center'>
                              <Link href={`customers/${row.id}`}>
                              <IconButton  className='' aria-label="view">
                                <Eye />
                              </IconButton>

                              </Link>
                              <IconButton className='text-red-700'  aria-label="delete">
                                <Trash2 onClick={()=> handleDelete(row.id)} />
                              </IconButton>
                            </div>
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

    </div>
  );
}
