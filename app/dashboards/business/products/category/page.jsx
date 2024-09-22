"use client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";
import { Add } from "@mui/icons-material";
import AddCategory from "./addcategory";
import {
  Typography,
  TextField,
  Button,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";

export const foodCategories = [
  {
    id: 1,
    name: "Appetizers",
    image: "https://images.unsplash.com/photo-1598887142481-81bcb2ebd6b5",
    amountOfFoods: 12,
  },
  {
    id: 2,
    name: "Main Course",
    image: "https://images.unsplash.com/photo-1612874746357-8bdeedb4a013",
    amountOfFoods: 20,
  },
  {
    id: 3,
    name: "Desserts",
    image: "https://images.unsplash.com/photo-1512058564366-c9faccaccf3c",
    amountOfFoods: 15,
  },
  {
    id: 4,
    name: "Beverages",
    image: "https://images.unsplash.com/photo-1510627498534-cf7e9002facc",
    amountOfFoods: 10,
  },
  {
    id: 5,
    name: "Salads",
    image: "https://images.unsplash.com/photo-1572448862528-61d1a6dc7a04",
    amountOfFoods: 8,
  },
  {
    id: 6,
    name: "Soups",
    image: "https://images.unsplash.com/photo-1600417091385-cb2dfb3f52e9",
    amountOfFoods: 6,
  },
  {
    id: 7,
    name: "Grill",
    image: "https://images.unsplash.com/photo-1578836537282-bbdba55e3f90",
    amountOfFoods: 14,
  },
  {
    id: 8,
    name: "Pasta",
    image: "https://images.unsplash.com/photo-1589307000156-966c2e0f6f4b",
    amountOfFoods: 9,
  },
  {
    id: 9,
    name: "Seafood",
    image: "https://images.unsplash.com/photo-1600891964757-341e3c8c5a8d",
    amountOfFoods: 11,
  },
  {
    id: 10,
    name: "Sides",
    image: "https://images.unsplash.com/photo-1613489920383-6da5c1f5df83",
    amountOfFoods: 7,
  },
];

export default function DataTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tableRows, setTableRows] = useState(foodCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (id) => {
    setTableRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const columns = [
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 120,
      renderCell: (params) => (
        <div>
          {/* <Tooltip title="Edit">
            <IconButton size="small">
              <EditIcon />
            </IconButton>
          </Tooltip> */}
          <Tooltip title="Delete">
            <IconButton
              size="small"
              className=""
              onClick={() => handleDelete(params.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "name",
      headerName: "Category",
      width: 200,
      renderCell: (params) => (
        <div className="flex items-center">
          <Image
            src={params.row.image}
            alt={params.row.name}
            width={30}
            height={30}
            className="w-full mr-2"
          />
          {params.row.name}
        </div>
      ),
    },
    {
      field: "amountOfFoods",
      headerName: "Amount",
      width: 120,
      renderCell: (params) => (
        <Chip label={params.value} color="primary" size="small" />
      ),
    },
  ];

  return (
    <div className="mt-20 py-4 rounded-lg p-6 shadow-lg bg-white">
      <h1 className="font-semibold text-gray-800 text-xl mb-2">Categories</h1>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <AddCategory onClose={() => setIsModalOpen(false)} />
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>{/* <h1>helllo</h1> */}</div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md hover:shadow-lg transition-all duration-300"
        >
          Add Category
        </Button>
      </div>

      <div className="mb-4">
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: <SearchIcon className="text-gray-400 mr-2" />,
          }}
        />
      </div>

      <div className="bg-white rounded-lg overflow-hidden">
        <DataGrid
          rows={tableRows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          checkboxSelection
          disableRowSelectionOnClick
          filterModel={{
            items: [
              {
                field: "name",
                operator: "contains",
                value: searchTerm,
              },
            ],
          }}
          className="border-none"
          sx={{
            "& .MuiDataGrid-cell:hover": {
              color: "primary.main",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "rgba(229, 231, 235, 0.5)",
              color: "text.secondary",
              fontSize: 14,
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: "white",
            },
          }}
        />
      </div>
    </div>
  );
}
