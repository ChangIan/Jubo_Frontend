import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import moment from 'moment';

import "./App.css";

import Header from "./component/Header";
import Main from "./component/Main";
import Footer from "./component/Footer";
import Patient from "./view/Patient";
import OrderDialog from "./component/OrderDialog";
import {
  PatientGetAsync
} from "./service/Patient";

function App() {
  console.log(
    `%c
    ${moment().format('YYYY-MM-DD HH:mm:ss.SSS')} \r\n
    process.env \r\n
    ${JSON.stringify(process.env)}
    `
    ,
    'color: red; background-color: yellow; font-size: larger'
  );

  // useRef - initFlag
  const initFlag = useRef(true);
  // store patients
  const [patients, setPatients] = useState([]);
  // store showDialog
  const [showDialog, setShowDialog] = useState(false);
  // store selectedPatient
  const [selectedPatient, setSelectedPatient] = useState(null);

  // 取得患者清單
  const GetPatient = async () => {
    initFlag.current = false;

    const { ErrorCode, ErrorMessage, Data } =
      await PatientGetAsync();

    console.log(
      `%c
      ${moment().format('YYYY-MM-DD HH:mm:ss.SSS')} \r\n
      取得患者清單 \r\n
      ErrorCode -> ${JSON.stringify(ErrorCode)} \r\n
      ErrorMessage -> ${JSON.stringify(ErrorMessage)} \r\n
      Data -> ${JSON.stringify(Data)} \r\n
      `
      ,
      'color: red; background-color: yellow; font-size: larger'
    );

    if (ErrorCode === 0) {
      setPatients(Data);
    } else {
      alert(ErrorMessage);
    }
  };

  // 按下選擇的患者
  const OnSelectPatient = (data) => {
    console.log(
      `%c
      ${moment().format('YYYY-MM-DD HH:mm:ss.SSS')} \r\n
      const OnSelectPatient = (data) \r\n
      data -> ${JSON.stringify(data)}
      `
      ,
      'color: red; background-color: yellow; font-size: larger'
    );

    setSelectedPatient(data);

    setShowDialog(true);
  };

  // useEffect
  useEffect(() => {
    if (initFlag.current) {
      GetPatient();
    }
  }, []);

  return (
    <div className="App">

      {/* <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter> */}

      <Header title="醫囑管理系統" />

      <Main>
        <Patient
          data={patients}
          handleSelectedPatient={OnSelectPatient}
        />

        <OrderDialog
          open={showDialog}
          setShowDialog={setShowDialog}
          data={selectedPatient}
        />
      </Main>

      <Footer />

    </div>
  );
}

export default App;
