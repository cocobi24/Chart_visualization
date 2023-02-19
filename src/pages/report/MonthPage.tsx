import React from 'react';
import { useState } from "react";
import dayjs, { Dayjs } from 'dayjs';
import { Box, Grid, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CustomButton from '@/components/common/CustomButton';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import TotalField from '@/components/common/TotalField';

type StatusType = {
  [index: string]: string
  1: string
  2: string
  3: string
  4: string
  5: string
}

const convertDatetime = (time: string) => {
  const match = time.match(/\d+/);
  if (!match) {
    throw new Error("데이터 정제 중 오류가 발생하였습니다.");
  }
  const timestamp = parseInt(match[0]);
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  let formattedDate = `${year}-${month}`;

  if(month<10){
    formattedDate = `${year}-0${month}`;
  }

  return formattedDate;
}

const convertStatus = (status: number) => {
  const ENUM:StatusType = {
    1: "출금 요청", 
    2: "출금 거절", 
    3: "출금 완료", 
    4: "출금 취소", 
    5: "출금 가능"
  }
  return ENUM[status];
}

const MonthPage = () => {
  const [tableData, setTableData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState();
  const [totalCommission, setTotalCommission] = useState();
  const [totalComplete, setTotalComplete] = useState();
  const [pickDate, setPickDate] = React.useState<Dayjs | null>(dayjs('2018-01-01'));
  const [spinner, setSpinner] = useState(false);
  const columns = [
    { 
      field: 'Datetime', 
      headerName: '일자', 
      width: 300, 
      valueGetter: ( params: any) => { return convertDatetime(params.value) },
    }, { 
      field: 'Status', 
      headerName: '정산 상태', 
      width: 200, 
      type: 'string' ,
      valueGetter: ( params: any) => { return convertStatus(params.value) },
    }, { 
      field: 'Revenue', 
      headerName: '수익', 
      width: 150, 
      type: 'number' 
    }, { 
      field: 'Commission', 
      headerName: '수수료', 
      width: 150, 
      type: 'number' 
    }, { 
      field: 'Complete', 
      headerName: '캠페인 완료수', 
      width: 150, 
      type: 'number' 
    }
  ];

  const getGridData = () => {
    setSpinner(true);
    fetch('https://coding-test.adpopcorn.com/ap/v1/partners/demoreport/GetDemoData', {
        method : 'POST',
        headers :{ 'Content-Type' : 'application/json',},
        body : JSON.stringify({
          "search_year": dayjs(pickDate).year(),
          // "search_month": 1
        }),
    })
    .then(res => {
      if (!res.ok){
        throw new Error('데이터 조회 중 오류가 발생하였습니다.');
      }
      return res.json();
    })
    .then(data => {
      const monthlyData = data.Payment.Monthly;
      setTableData(monthlyData);
      setSpinner(false);
      setTotalRevenue(data.Payment.Revenue);
      setTotalCommission(data.Payment.Commission);
      setTotalComplete(data.Payment.Complete);
      console.log(monthlyData)
    })
    .catch(err => {
      console.log(err);
    });

  }

  return (
    <Box 
      sx={{
        height: '500px',
        width: '100%'
      }}
    >
      <Grid container spacing={1}>
        <Box p={1}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={3}>
            <DatePicker
              views={['year']}
              label="Year"
              minDate={dayjs('2018-01-01')}
              maxDate={dayjs('2021-12-01')}
              value={pickDate}
              onChange={(newDate) => {
                setPickDate(newDate);
              }}
              renderInput={(params) => <TextField size="small" {...params} helperText={null} />}
            />
          </Stack>
        </LocalizationProvider>
        </Box>
        <CustomButton onClick={getGridData}>조회</CustomButton>
      </Grid>
      <Grid container spacing={1}>
        <TotalField label="조회기간 수익: " value={totalRevenue}/>
        <TotalField label="조회기간 수수료: " value={totalCommission}/>
        <TotalField label="조회기간 캠페인 완료 수: " value={totalComplete}/>
      </Grid>
      <DataGrid 
        loading={spinner}
        getRowId={(row:any) => row.Complete+row.Revenue}
        rows={tableData} 
        columns={columns}
        rowHeight={25} 
        pageSize={15}
      />
    </Box>
  );
};

export default MonthPage;