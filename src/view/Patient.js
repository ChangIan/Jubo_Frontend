import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";

import {
  Comparator,
  Sort,
} from "./../util/sort";

const headCells = [
  {
    id: "Id",
    numeric: true,
    disablePadding: false,
    label: "編號",
    align: "center",
  },
  {
    id: "Name",
    numeric: false,
    disablePadding: false,
    label: "患者",
    align: "center",
  },
  {
    id: "Phone",
    numeric: false,
    disablePadding: false,
    label: "電話",
    align: "center",
  },
  {
    id: "Gender",
    numeric: false,
    disablePadding: false,
    label: "性別",
    align: "center",
  },
];

const EnhancedTableHead = (props) => {
  const { order, orderBy } = props;

  return (
    <TableHead>
      <TableRow
        sx={{
          "& th": {
            fontWeight: "bold",
            fontSize: "1rem",
            color: "white",
            backgroundColor: "#708283",
          },
        }}
      >
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.label}
            {orderBy === headCell.id ? (
              <Box component="span" sx={visuallyHidden}>
                {order === "desc" ? "sorted descending" : "sorted ascending"}
              </Box>
            ) : null}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

// 自定義屬性類型
EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

export default function Patient(props) {
  // store order
  const [order, setOrder] = useState("desc");
  // store orderBy
  const [orderBy, setOrderBy] = useState("Id");
  // store page
  const [page, setPage] = useState(0);
  // store rowsPerPage
  const [rowsPerPage, setRowsPerPage] = useState(20);

  // 排序
  const OnSort = (_, property) => {
    const isAsc = orderBy === property && order === "asc";

    setOrder(isAsc ? "desc" : "asc");

    setOrderBy(property);
  };

  // OnClick
  const OnClick = (_, data) => {
    props.handleSelectedPatient(data);
  };

  // OnChangePage
  const OnChangePage = (_, newPage) => {
    setPage(newPage);
  };

  // OnChangeRowsPerPage
  const OnChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));

    setPage(0);
  };

  // 當到達有空行的最後一頁時避免佈局跳躍
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.data.length) : 0;

  // useMemo - visibleRows
  const visibleRows = useMemo(
    () =>
      Sort(props.data, Comparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, props.data]
  );

  return (
    <Box
      sx={{
        width: "100%"
      }}
    >
      <Paper
        sx={{
          width: "100%"
        }}
      >
        <TableContainer>
          <Table aria-labelledby="tableTitle" size="medium">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={OnSort}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => OnClick(event, row)}
                    tabIndex={-1}
                    key={row.Id}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell align="center">{row.Id}</TableCell>
                    <TableCell align="center" component="th" id={labelId} scope="row">
                      {row.Name}
                    </TableCell>
                    <TableCell align="center">{row.Phone}</TableCell>
                    <TableCell align="center">{row.Gender}</TableCell>
                  </TableRow>
                );
              })}

              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 50, 100]}
          component="div"
          count={props.data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={OnChangePage}
          onRowsPerPageChange={OnChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
