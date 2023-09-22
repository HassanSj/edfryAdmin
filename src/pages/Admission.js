/* eslint new-cap: ["error", { "newIsCap": false }] */
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import 'jspdf-autotable';
import axios from 'axios';
import './page.css';
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
  { id: 'name', label: 'Name' , alignRight: false},
  { id: 'contact', label: 'Contact' , alignRight: false},
  { id: 'qualification', label: 'Qualification' , alignRight: false},
  { id: 'interestedEducation', label: 'InterestedEducation' , alignRight: false},
  { id: 'budget', label: 'Budget' , alignRight: false},
  { id: 'timeSlot', label: 'TimeSlot' , alignRight: false},
  { id: 'country', label: 'Country' , alignRight: false},
  { id: 'program', label: 'Program' , alignRight: false}
];

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

export default function Admission() {
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
      const response = await axios.get('https://edfry-backend.vercel.app/api/admission/get');
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
        <title> Admission Page </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Admission
          </Typography>
          <Button variant="contained" onClick={downloadData} style={{ marginLeft: '735px' }}>
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
                        name,
                        contact,
                        qualification,
                        interestedEducation,
                        budget,
                        timeSlot,
                        country,
                        program,
                      } = row;
                      const selectedUser = selected.indexOf(name) !== -1;

                      return (
                        <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                          <TableCell padding="checkbox">
                            <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, name)} />
                          </TableCell>
                          <TableCell align="left">{name}</TableCell>
                          <TableCell align="left">{contact}</TableCell>
                          <TableCell align="left">{qualification}</TableCell>
                          <TableCell align="left">{interestedEducation}</TableCell>
                          <TableCell align="left">{budget}</TableCell>
                          <TableCell align="left">{timeSlot}</TableCell>
                          <TableCell align="left">{country}</TableCell>
                          <TableCell align="left">{program}</TableCell>
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
