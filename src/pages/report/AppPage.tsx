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


const AppPage = () => {
  const [tableData, setTableData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState();
  const [totalCommission, setTotalCommission] = useState();
  const [totalComplete, setTotalComplete] = useState();
  const [pickDate, setPickDate] = React.useState<Dayjs | null>(dayjs('2018-01-01'));
  const [spinner, setSpinner] = useState(false);

  let appData: any = [];
  const columns = [
    { 
      field: 'Datetime', 
      headerName: '일자', 
      width: 300, 
      type: 'date',
      valueGetter: ( params: any) => { return convertDatetime(params.value) },
    }, { 
      field: 'AppName', 
      headerName: '앱명', 
      width: 200, 
    }, { 
      field: 'Revenue', 
      headerName: '월 수익', 
      width: 200, 
      type: 'number' 
    }, { 
      field: 'Commission', 
      headerName: '월 수수료', 
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
      monthlyData.forEach((row: any) => {
        row.App[0]['Datetime'] = row.Datetime
        appData.push(row.App[0]);
      });

      let revenue = data.Payment.Revenue;
      let commission = data.Payment.Commission;
      let complete = data.Payment.Complete;
      revenue = revenue? Number(revenue).toLocaleString('ko-KR')+' 원' : 0 ;
      commission = commission? Number(commission).toLocaleString('ko-KR')+' 원' : 0 ;
      complete = complete? Number(complete).toLocaleString('ko-KR')+' 건' : 0 ;
      
      setTableData(appData);
      setSpinner(false);
      setTotalRevenue(revenue);
      setTotalCommission(commission);
      setTotalComplete(complete);
      console.log(appData)
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
        getRowId={(row:any) => row.Revenue+row.Complete}
        rows={tableData} 
        columns={columns}
        rowHeight={25} 
        pageSize={15}
      />
    </Box>
  );
};

export default AppPage;