import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Box } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import { IoFilterSharp } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";
import { BsDisplay } from "react-icons/bs";
import PaginatedItems from "../PaginationList";
import Loader from "../../Loader/Loader";

const GOOGLE_SHEET_ID = "1hB_LjBT9ezZigXnC-MblT2PXZledkZqBnvV23ssfSuE";
const GOOGLE_API_KEY = "AIzaSyABYgJvIfE2iKEkGSznbyjQaMUc74ZwCeE";
const SHEET_NAME = "FMSCA_records (2)";

const TableComponent = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [PAGE_SIZE, setPAGE_SIZE] = useState(10);
  const [created_at, setCreated_at] = useState("");
  const [modified_at, setModified_at] = useState("");
  const [entity, setEntity] = useState("");
  const [operating_status, setOperating_status] = useState("");
  const [legal_name, setLegal_name] = useState("");
  const [dba_name, setDba_name] = useState("");
  const [physics, setPhysics] = useState("");
  const [phone, setPhone] = useState("");
  const [mc, setMC] = useState("");
  const [power, setPower] = useState("");
  const [dot, setDot] = useState("");
  const [out_service, setOut_service] = useState("");
  const [all_rows, setAll_rows] = useState([]);
  const [show_filter, setShowFilter] = useState(false);
  const [searched, setSearched] = useState(false);
  const [start, setStart] = useState(10);
  const [end, setEnd] = useState(20);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/${SHEET_NAME}?key=${GOOGLE_API_KEY}`
        );
        const rows = response.data.values;

        if (rows.length > 0) {
          const keys = rows[0];
          const values = rows.slice(1);
          const merged_array = values.slice().map((row) => {
            const obj = {};
            keys.forEach((key, index) => {
              obj[key] = row[index] || "";
            });
            return obj;
          });
          setAll_rows(merged_array);
          const totalItems = values.length;
          setTotalPages(Math.ceil(totalItems / PAGE_SIZE));
          const paginatedData = values
            .slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
            .map((row) => {
              const obj = {};
              keys.forEach((key, index) => {
                obj[key] = row[index] || "";
              });
              return obj;
            });

          setData(paginatedData);
        }
      } catch (error) {
        console.error("Error fetching data from Google Sheets:", error);
      }
    };

    fetchData();
  }, [page, PAGE_SIZE]);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFilterData = () => {
    setAnchorEl(false);
    const filteredItems =
      data &&
      data.filter((items) => {
        return (
          (created_at &&
            moment(items?.created_dt).format("DD-MM-YY") ===
              moment(created_at).format("DD-MM-YY")) ||
          (modified_at &&
            moment(items?.data_source_modified_dtt).format("DD-MM-YY") ===
              moment(modified_at).format("DD-MM-YY")) ||
          (entity &&
            items?.entity_type?.toLowerCase() === entity?.toLowerCase()) ||
          (operating_status &&
            items?.operating_status?.toLowerCase() ===
              operating_status?.toLowerCase()) ||
          (legal_name &&
            items?.legal_name
              ?.toLowerCase()
              .includes(legal_name.toLowerCase())) ||
          (dba_name &&
            items?.dba_name?.toLowerCase().includes(dba_name.toLowerCase())) ||
          (physics &&
            items?.physical_address
              ?.toLowerCase()
              .includes(physics.toLowerCase())) ||
          (phone &&
            items?.phone?.toLowerCase().includes(phone.toLowerCase())) ||
          (dot &&
            items?.usdot_number?.toLowerCase().includes(dot.toLowerCase())) ||
          (mc &&
            items?.mc_mx_ff_number?.toLowerCase().includes(mc.toLowerCase())) ||
          (power &&
            items?.power_units
              ?.toString()
              .toLowerCase()
              .includes(power.toString().toLowerCase())) || // Ensure numeric values are treated as strings
          (out_service &&
            items?.out_of_service_date
              ?.toLowerCase()
              .includes(out_service.toLowerCase()))
        );
      });

    setData(filteredItems?.slice(0, 10000));
    setSearched(true);
    setShowFilter(true);
  };

  return (
    <Box className="container">
      <Box sx={{ width: "100%" }}>
        <Box className="filter_outer">
          <FormControl
            fullWidth
            sx={{ marginTop: "30px", minWidth: "150px", width: "unset" }}
          >
            <InputLabel id="demo-simple-select-label">Rows Per Page</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Rows Per Page"
              sx={{ width: "200px" }}
              onChange={(e) => setPAGE_SIZE(e.target.value)}
            >
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={50}>Fifty</MenuItem>
              <MenuItem value={100}>Hundred</MenuItem>
              <MenuItem value={1000}>Thousand</MenuItem>
            </Select>
          </FormControl>

          <IconButton
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleClick}
            sx={{
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "transparent",
              },
              marginTop: "2rem",
            }}
          >
            <IoFilterSharp /> Filter
          </IconButton>
          {show_filter && (
            <IconButton
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={() => window.location.reload()}
              sx={{
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "transparent",
                },
                marginTop: "2rem",
              }}
            >
              Clear
            </IconButton>
          )}
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            className="menu_items"
          >
            <MenuItem sx={{ gap: "10px" }}>
              <span> Created_DT </span>
              <input
                type="date"
                value={created_at}
                onChange={(e) => setCreated_at(e.target.value)}
              ></input>
            </MenuItem>
            <MenuItem sx={{ gap: "10px" }}>
              <span> Modifed_DT </span>
              <input
                type="date"
                onChange={(e) => setModified_at(e.target.value)}
              ></input>
            </MenuItem>
            <MenuItem sx={{ gap: "10px" }}>
              <span>Entity(In Progress)</span>{" "}
              <input
                type="text"
                value={entity}
                placeholder="Entity"
                onChange={(e) => setEntity(e.target.value)}
              ></input>
            </MenuItem>
            <MenuItem sx={{ gap: "10px" }}>
              <span> Operating status(In Progress) </span>
              <input
                type="text"
                value={operating_status}
                placeholder="Operating Status"
                onChange={(e) => setOperating_status(e.target.value)}
              ></input>{" "}
            </MenuItem>
            <MenuItem sx={{ gap: "10px" }}>
              <span>Legal name</span>{" "}
              <input
                type="text"
                value={legal_name}
                placeholder="Legal name"
                onChange={(e) => setLegal_name(e.target.value)}
              ></input>
            </MenuItem>
            <MenuItem sx={{ gap: "10px" }}>
              <span>DBA name </span>
              <input
                type="text"
                value={dba_name}
                placeholder="DBA name"
                onChange={(e) => setDba_name(e.target.value)}
              ></input>
            </MenuItem>
            <MenuItem sx={{ gap: "10px" }}>
              {" "}
              <span> Physical address </span>
              <input
                type="text"
                value={physics}
                placeholder="Physical address"
                onChange={(e) => setPhysics(e.target.value)}
              ></input>
            </MenuItem>
            <MenuItem sx={{ gap: "10px" }}>
              <span>Phone</span>{" "}
              <input
                type="text"
                value={phone}
                placeholder="Phone"
                onChange={(e) => setPhone(e.target.value)}
              ></input>
            </MenuItem>
            <MenuItem sx={{ gap: "10px" }}>
              <span>DOT</span>{" "}
              <input
                type="text"
                value={dot}
                placeholder="DOT"
                onChange={(e) => setDot(e.target.value)}
              ></input>
            </MenuItem>
            <MenuItem sx={{ gap: "10px" }}>
              <span> MC/MX/FF</span>{" "}
              <input
                type="text"
                value={mc}
                placeholder="MC/MX/FF"
                onChange={(e) => setMC(e.target.value)}
              ></input>
            </MenuItem>
            <MenuItem sx={{ gap: "10px" }}>
              <span> Power units</span>{" "}
              <input
                type="text"
                value={power}
                placeholder="Power units"
                onChange={(e) => setPower(e.target.value)}
              ></input>
            </MenuItem>
            <MenuItem sx={{ gap: "10px" }}>
              <span> Out of service date </span>{" "}
              <input
                type="text"
                placeholder="Out Of Service Date"
                value={out_service}
                onChange={(e) => setOut_service(e.target.value)}
              ></input>
            </MenuItem>
            <Box className="btn_outer">
              <Button className="Search_btn" onClick={handleFilterData}>
                Search
              </Button>
            </Box>
          </Menu>
        </Box>

        <TableContainer component={Paper} sx={{ marginTop: "2rem" }}>
          <Table className="datatable">
            <TableHead>
              <TableCell
                sx={{
                  backgroundColor: "#bf6349",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "13px",
                }}
              >
                Created_DT
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#bf6349",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Modifed_DT
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#bf6349",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Entity
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#bf6349",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Operating status
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#bf6349",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Legal name
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#bf6349",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                DBA name
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#bf6349",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Physical address
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#bf6349",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Phone
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#bf6349",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                DOT
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#bf6349",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                MC/MX/FF
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#bf6349",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Power units
              </TableCell>
              <TableCell
                sx={{
                  backgroundColor: "#bf6349",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Out of service date
              </TableCell>
            </TableHead>
            <TableBody>
              {data?.length === 0 ? (
                <Loader />
              ) : (
                data?.map((row) => (
                  <TableRow key={row?.id}>
                    <TableCell>
                      {row?.created_dt
                        ? moment(row?.created_dt).format("DD-MM-YY")
                        : "Not Available"}
                    </TableCell>
                    <TableCell>
                      {row?.data_source_modified_dt
                        ? moment(row?.data_source_modified_dt).format(
                            "DD-MM-YY"
                          )
                        : "Not Available"}
                    </TableCell>
                    <TableCell>
                      {row?.entity_type ? row?.entity_type : "Not Available"}
                    </TableCell>
                    <TableCell>
                      {row?.operating_status
                        ? row?.operating_status
                        : "Not Available"}
                    </TableCell>
                    <TableCell>
                      {row?.legal_name ? row?.legal_name : "Not Available"}
                    </TableCell>
                    <TableCell>
                      {row?.dba_name ? row?.dba_name : "Not Available"}
                    </TableCell>
                    <TableCell>
                      {row?.physical_address
                        ? row?.physical_address
                        : "Not Available"}
                    </TableCell>
                    <TableCell>
                      {row?.phone ? row?.phone : "Not Available"}
                    </TableCell>
                    <TableCell>
                      {row?.usdot_number ? row?.usdot_number : "Not Available"}
                    </TableCell>
                    <TableCell>
                      {row?.mc_mx_ff_number
                        ? row?.mc_mx_ff_number
                        : "Not Available"}
                    </TableCell>
                    <TableCell>
                      {row?.power_units ? row?.power_units : "Not Available"}
                    </TableCell>
                    <TableCell>
                      {row?.out_of_service_date
                        ? row?.out_of_service_date
                        : "Not Available"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {!show_filter && (
          <PaginatedItems
            setPage={setPage}
            itemsPerPage={4}
            totalPages={totalPages}
            setData={setData}
            searched={searched}
          />
        )}
      </Box>
    </Box>
  );
};

export default TableComponent;
