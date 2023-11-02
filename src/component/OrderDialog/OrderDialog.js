import { useEffect, useReducer, useRef } from "react";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { randomId } from "@mui/x-data-grid-generator";
import validator from 'validator';
import moment from 'moment';

import {
  OrderGetAsync,
  OrderAddAsync,
  OrderUpdateAsync,
  OrderDeleteAsync,
} from "../../service/Orders";
import { DialogContext } from "./DialogContext";
import Toolbar from "./Toolbar";

export default function OrderDialog({ open, data, setShowDialog }) {
  // useGridApiRef - apiRef
  const apiRef = useGridApiRef();
  // useRef - patientIdRef
  const patientIdRef = useRef(0);
  // ViewModel
  const initialState = {
    orderList: [],
    selectedOrder: null,
  };

  // useReducer - OrderReducer
  const OrderReducer = (state, action) => {
    console.log(
      `%c
      ${moment().format('YYYY-MM-DD HH:mm:ss.SSS')} \r\n
      order reducer \r\n
      state -> ${JSON.stringify(state)} \r\n
      action -> ${JSON.stringify(action)} \r\n
      `
      ,
      'color: red; background-color: yellow; font-size: larger'
    );

    const { type, payload } = action;

    switch (type) {
      case "List": {
        const { orderList } = payload;

        return {
          ...state,
          orderList,
          selectedOrder: null,
        };
      }
      case "Select":
        const { row } = payload;

        return {
          ...state,
          selectedOrder: row,
        };
      case "Add": {
        const { orderList } = state;

        return {
          ...state,
          orderList: [
            ...orderList,
            {
              Id: ("未儲存" + (orderList.length + 1)),
              Message: "",
              isNew: true,
            },
          ],
          selectedOrder: null,
        };
      }
      case "Close": {
        return {
          ...state,
          selectedOrder: null,
        };
      }
      default:
        break;
    }
  };

  // 取得醫囑清單
  const GetOrder = async (patientId) => {
    let orderList = [];

    const { ErrorCode, ErrorMessage, Data } =
      await OrderGetAsync(patientId);

    console.log(
      `%c
      ${moment().format('YYYY-MM-DD HH:mm:ss.SSS')} \r\n
      取得醫囑清單 \r\n
      patientId -> ${JSON.stringify(patientId)} \r\n
      ErrorCode -> ${JSON.stringify(ErrorCode)} \r\n
      ErrorMessage -> ${JSON.stringify(ErrorMessage)} \r\n
      Data -> ${JSON.stringify(Data)} \r\n
      `
      ,
      'color: red; background-color: yellow; font-size: larger'
    );

    if (ErrorCode === 0) {
      orderList = Data;
    } else {
      alert(ErrorMessage);
    }

    dispatch({ type: "List", payload: { orderList } });
  };

  // 新增醫囑
  const AddOrder = async (patientId, message) => {
    await OrderAddAsync(
      patientId,
      message.trim(),
    );
  };

  // 更新醫囑
  const UpdateOrder = async (id, message) => {
    await OrderUpdateAsync(
      id,
      message.trim(),
    );
  };

  // 刪除醫囑
  const DeleteOrder = async (orderId) => {
    await OrderDeleteAsync(orderId);

    await GetOrder(patientIdRef.current);
  };

  // Select an order to edit or remove.
  const OnRowClick = (event) => {
    console.log(
      `%c
      ${moment().format('YYYY-MM-DD HH:mm:ss.SSS')} \r\n
      OnRowClick \r\n
      event -> ${JSON.stringify(event)} \r\n
      `
      ,
      'color: red; background-color: yellow; font-size: larger'
    );

    dispatch({ type: "Select", payload: { row: event.row } });
  };

  // 新增、更新醫囑
  const OnRowUpdate = async (newRow, oldRow) => {
    const { Id, Message, isNew } = newRow;
    const { Id: OldId, Message: OldMessage, isNew: OldIsNew } = oldRow;
    const patientId = patientIdRef.current;

    console.log(
      `%c
      process row update
      Id -> ${Id} ${OldId}
      Message -> ${Message} ${OldMessage}
      isNew -> ${isNew} ${OldIsNew}
      `
      ,
      'color: red; background-color: yellow; font-size: larger'
    );

    if (
      validator.isEmpty(Message, { ignore_whitespace: true })
    ) {
      return;
    }

    if (
      isNew
    ) {
      // 新增醫囑
      await AddOrder(patientId, Message);
    } else {
      if (
        Message !== OldMessage
      ) {
        // 更新醫囑
        await UpdateOrder(Id, Message);
      }
    }

    // 停止編輯模式並放棄所做的更改
    apiRef.current.stopCellEditMode({
      id: Id,
      field: 'Message',
      ignoreModifications: true,
    });
    apiRef.current.stopRowEditMode({
      id: Id,
      ignoreModifications: true,
    });

    // 刷新醫囑清單
    await GetOrder(patientId);
  };

  // 關閉 Dialog
  const OnClickClose = (_, reason) => {
    // 如果使用者在 Dialog 外部按一下，則不要關閉 Dialog。
    // 只接受使用者透過「關閉」按鈕關閉 Dialog。
    if (reason && reason === "backdropClick") {
      return;
    }
    else {
      dispatch({ type: "Close" });

      setShowDialog(false);
    }
  };

  // useReducer
  const [state, dispatch] = useReducer(OrderReducer, initialState);
  console.log(
    `%c
    ${moment().format('YYYY-MM-DD HH:mm:ss.SSS')} \r\n
    const [state, dispatch] = useReducer(OrderReducer, initialState); \r\n
    state -> ${JSON.stringify(state)} \r\n
    `
    ,
    'color: red; background-color: yellow; font-size: larger'
  );

  // useEffect
  useEffect(() => {
    if (data && data.Id && data.Id !== patientIdRef.current) {
      patientIdRef.current = data.Id;

      GetOrder(data.Id);
    }
  }, [data, state]);

  // DataGrid Columns
  const dgOrderColumns = [
    {
      field: "Id",
      headerName: "編號",
      width: 100,
      headerClassName: "jubo-theme-header",
    },
    {
      field: "Message",
      headerName: "醫囑內容",
      flex: 1,
      headerClassName: "jubo-theme-header",
      editable: true,
    },
  ];

  // Toolbar 的按鈕
  const buttons = [
    {
      text: "新增",
      icon: <AddIcon />,
      disabled: false,
      handler: () => dispatch({ type: "Add" }),
    },
    {
      text: "刪除",
      icon: <DeleteIcon />,
      disabled: (state.selectedOrder === null || state.selectedOrder.Id.toString().startsWith('未') ? true : false),
      handler: async () => {
        const { Id } = state.selectedOrder || {};

        await DeleteOrder(Id);
      },
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={OnClickClose}
      PaperProps={{
        sx: {
          width: "75%",
          minHeight: "300",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogContext.Provider value={state.selectedOrder}>
        <DialogTitle
          sx={{
            backgroundColor: "var(--header-color)",
            color: "#215b69",
            fontWeight: "bold",
          }}
        >
          醫囑清單 - #{patientIdRef.current} {data?.Name} ({data?.Phone}) {(data?.Gender === "Male" ? "男" : "女")}
        </DialogTitle>
        <DialogContent
          dividers={true}
          sx={{
            paddingTop: "0",
          }}
        >
          <Toolbar buttons={buttons} />
          <Box
            sx={{
              "& .jubo-theme-header": {
                backgroundColor: "var(--dark-jubo-color)",
                color: "white",
              },
            }}
          >
            <DataGrid
              experimentalFeatures={{ newEditingApi: true }}
              editMode="row"
              getRowId={(row) => row.Id}
              rows={state.orderList || []}
              columns={dgOrderColumns}
              onRowClick={OnRowClick}
              processRowUpdate={OnRowUpdate}
              onProcessRowUpdateError={() => { }}
              apiRef={apiRef}
            />
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            backgroundColor: "var(--footer-color)",
          }}
        >
          <Button
            onClick={OnClickClose}
            sx={{
              fontWeight: "bold",
            }}
          >
            關閉
          </Button>
        </DialogActions>
      </DialogContext.Provider>
    </Dialog>
  );
}
