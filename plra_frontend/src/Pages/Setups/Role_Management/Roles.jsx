import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Typography, Box, Dialog } from '@mui/material';
import { useTheme } from '@emotion/react';
import { Btn, Loader, ErrorHandler, MyTableContainer } from '../../../Components/index';
import { useGroupAPIQuery, useDeleteRoleMutation } from '../../../Features/API/RoleManagement';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Warning } from '../../../Assets/Icons';

const Roles = () => {
  const theme = useTheme();
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);

  // Query
  const { data, isLoading: loading, isError: refreshError, error: queryError, refetch } = useGroupAPIQuery();
  const [deleteRole] = useDeleteRoleMutation();

  // function
  const handleRowClick = useCallback((params) => {
    console.log('Row clicked:', params);
  }, []);
  const handleCopy = useCallback((id) => {
    console.log('Copy clicked for id:', id);
  }, []);
  const handleUpdate = useCallback((id) => {
    console.log('Update clicked for id:', id);
  }, []);

  const handleDeleteClick = useCallback((id) => {
    setSelectedRoleId(id);
    setDeleteDialog(true);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!selectedRoleId) {
      toast.error('No role selected for deletion.', {
        position: 'top-center',
        autoClose: 3000,
      });
      return;
    }
    let id = selectedRoleId;

    try {
      const res = await deleteRole(id);

      if (res.error) {
        toast.error(`Failed to delete role: ${res.error.message || 'Please try again later.'}`, {
          position: 'top-center',
          autoClose: 3000,
        });
      } else {
        toast.success('Role Deleted Successfully', {
          position: 'top-center',
          autoClose: 3000,
        });
        refetch();
        setDeleteDialog(false);
        setSelectedRoleId(null);
      }
    } catch (error) {
      toast.error(`Error deleting role: ${error.message || 'Unknown error'}`, {
        position: 'top-center',
        autoClose: 3000,
      });
    }
  }, [deleteRole, refetch, selectedRoleId, setDeleteDialog, setSelectedRoleId]);

  // table data
  const columns = useMemo(
    () => [
      {
        field: 'name',
        headerName: 'Role',
        minWidth: 300,
        renderCell: (params) => {
          return (
            <span
              className="table_first_column"
              style={{ color: '#379237', textDecoration: 'none' }}
            >
              {params.value}
            </span>
          );
        },
      },
      // {
      //   field: 'copy',
      //   headerName: 'Copy',
      //   minWidth: 150,
      //   renderCell: (params) => (
      //     <button onClick={() => handleCopy(params.row.id)} className="RoleActionButton">
      //       Copy
      //     </button>
      //   ),
      // },
      {
        field: 'update',
        headerName: 'Update',
        minWidth: 150,
        renderCell: (params) => (
          <Link to={`/employee/setup/BasicRole/${params.row.id}`}>
            <button onClick={() => handleUpdate(params.row.id)} className="RoleActionButton" style={{ color: '#3498db', textDecoration: 'underline' }}>
              Update
            </button>
          </Link>
        ),
      },
      {
        field: 'delete',
        headerName: 'Delete',
        minWidth: 150,
        renderCell: (params) => (
          <button onClick={() => handleDeleteClick(params.row.id)} className="RoleActionButton" style={{ color: '#f44336', textDecoration: 'underline' }}>
            Delete
          </button>
        ),
      },
    ],
    [handleRowClick, handleCopy, handleUpdate, handleDeleteClick]
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div>
      <Box sx={{ width: '100%', display: 'flex', gap: 2, my: 1, alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ width: '100%', color: theme.palette.primary.main, fontWeight: '500', fontSize: '20px' }}>
          All Roles
        </Typography>
        <Link to="/employee/setup/BasicRole" style={{ textDecoration: 'none' }}>
          <Btn type="new" outerStyle={{ width: 1, display: 'flex', justifyContent: 'end' }} />
        </Link>
      </Box>
      {loading ? (
        <Loader placement={{ marginTop: '-100px' }} />
      ) : (
        <>
          {refreshError ? (
            <ErrorHandler online={navigator.onLine} />
          ) : (
            data && data?.results ? (
              <MyTableContainer
                columns={columns}
                data={data.results}
                RowFilterWith="id"
                customPageSize={10}
                minHeight={'calc(100vh - 280px)'}
              />
            ) : null
          )}
        </>
      )}

      {/* Delete Dialog  */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} sx={{ m: 'auto' }}>
        <Box sx={{ minWidth: '400px', p: 2 }}>
          <Typography variant="h6" color="initial" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning />
            Are you sure you want to delete the record?
          </Typography>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'end', mt: 4, gap: 1 }}>
            <Btn
              type="sure"
              onClick={handleDelete}
              outerStyle={{ border: `2px solid ${theme.palette.primary.light}`, borderRadius: '8px' }}
            />
            <Btn
              type="close"
              onClick={() => setDeleteDialog(false)}
              outerStyle={{ border: `2px solid ${theme.palette.error.light}`, borderRadius: '8px' }}
            />
          </Box>
        </Box>
      </Dialog>
    </div>
  );
};

export default Roles;
