/* eslint new-cap: ["error", { "newIsCap": false }] */
import { Helmet } from 'react-helmet-async';
import { filter, first, last } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import ReactHTMLTableToExcel from 'react-html-table-to-excel'; 
import 'jspdf-autotable';
import axios from 'axios';
import "./page.css"
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'ID', alignRight: false },
  { id: 'firstName', label: 'FirstName', alignRight: false },
  { id: 'lastName', label: 'LastName', alignRight: false },
  { id: 'contact', label: 'Contact', alignRight: false },
  { id: 'age', label: 'Age', alignRight: false },
  { id: 'martialStatus', label: 'MartialStatus', alignRight: false },
  { id: 'familyUnitSize', label: 'FamilyUnitSize', alignRight: false },
  { id: 'funds', label: 'Funds', alignRight: false },
  { id: 'education', label: 'Education', alignRight: false },
  { id: 'experience', label: 'Experience', alignRight: false },
  { id: 'relatives', label: 'Relatives', alignRight: false },
  { id: 'financialCapacity', label: 'Financial Capacity', alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export default function Immigration() {
  const [open, setOpen] = useState(null);

  const [admission, setAdmission] = useState('');

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };
  const fetchData = async () => {
    try {
      const response = await axios.get('https://edfry-backend.vercel.app/api/immigration/get');
      const data = response.data;
      setAdmission(data);
      console.log('Asm', data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - admission.length) : 0;

  // const filteredUsers = applySortFilter(admission, getComparator(order, orderBy), filterName);

  const isNotFound = !admission.length && !!filterName;
  const downloadData = () => {
    const pdf = new jsPDF();
    pdf.autoTable({ html: '#table' });
    pdf.save('Todos.pdf');
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <Helmet>
        <title> Immigrations Page </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Immigration
          </Typography>
          <Button variant="contained" onClick={downloadData} style={{marginLeft :"735px"}}>
            Export PDF
          </Button>
          <ReactHTMLTableToExcel
          className="btn btn-info"
          table="table"
          filename="ReportExcel"
          sheet="Sheet"
          buttonText="Export excel"
        />
         
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table id="table">
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={admission.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {admission ? (
                    admission?.map((row) => {
                      const {
                        id,
                        firstName,
                        lastName,
                        contact,
                        age,
                        martialStatus,
                        familyUnitSize,
                        funds,
                        education,
                        experience,
                        relatives,
                        financialCapacity,
                      } = row;
                      const name =  firstName && lastName;
                      const selectedUser = selected.indexOf(contact) !== -1;

                      return (
                        <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                          <TableCell padding="checkbox">
                            <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, contact)} />
                          </TableCell>
                          <TableCell align="left">{id}</TableCell>
                          <TableCell align="left">{firstName}</TableCell>
                          <TableCell align="left">{lastName}</TableCell>
                          <TableCell align="left">{contact}</TableCell>
                          <TableCell align="left">{age}</TableCell>
                          <TableCell align="left">{martialStatus}</TableCell>
                          <TableCell align="left">{familyUnitSize}</TableCell>
                          <TableCell align="left">{funds}</TableCell>
                          <TableCell align="left">{education}</TableCell>
                          <TableCell align="left">{experience}</TableCell>
                          <TableCell align="left">{relatives}</TableCell>
                          <TableCell align="left">{financialCapacity}</TableCell>
                          {/* <TableCell align="left">
                            <Label color={(ieltsTaken === 'no' && 'error') || 'success'}>
                              {sentenceCase(ieltsTaken)}
                            </Label>
                          </TableCell>
                          <TableCell align="left">{ieltsScore}</TableCell>
                          <TableCell align="left">{qualification}</TableCell> */}
                        </TableRow>
                      );
                    })
                  ) : (
                    <p>No data</p>
                  )}

                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      
    </>
  );
}
