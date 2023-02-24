import React from 'react';
import { useState } from "react";
import dayjs, { Dayjs } from 'dayjs';
import { Box, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CustomButton from '@/components/common/CustomButton';
import CustomDatePicker from '@/components/common/DatePicker';
import TotalField from '@/components/common/TotalField';
import fontConfigs from '@/configs/fontConfigs';
import { Chart } from "react-google-charts";

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
  const [tableData, setTableData] = useState<Array<any>>([]);
  const [totalRevenue, setTotalRevenue] = useState();
  const [totalCommission, setTotalCommission] = useState();
  const [totalComplete, setTotalComplete] = useState();
  const [pickDate, setPickDate] = useState<Dayjs | null>(dayjs('2018-01-01'));
  const [spinner, setSpinner] = useState(false);
  const [chartData, setChartData] = useState<Object[]>([]);

  const tempChartData: Object[] = [["Task", "App per Revenue"]];
  const chartOptions = {
    title: "앱별 수익 현황",
    backgroundColor: "transparent"
  };

  const columns = [
    { 
      field: 'Datetime', 
      headerName: '일자', 
      width: 300, 
      type: 'date',
      valueGetter: ( params: {value: string}) => { return convertDatetime(params.value) },
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
      let appData: Object[] = [];
      let revenue = data.Payment.Revenue;
      let commission = data.Payment.Commission;
      let complete = data.Payment.Complete;
      let tempSumData: [string, number][] = [];
      const tempSumSet: {[key: string]: number} = {};

      monthlyData.forEach((row: { Datetime: Date, App: { Datetime: Date, AppName: string, Revenue: number }[] }) => {
        row.App[0]['Datetime'] = row.Datetime;
        appData.push(row.App[0]);
        tempSumData.push([row.App[0].AppName, row.App[0].Revenue]);
      });

      tempSumData.forEach((item: [key:string, value:number]) => {
        const key = item[0];
        const value = item[1];
        tempSumSet[key] = (tempSumSet[key] || 0) + value;
      });

      for (var key in tempSumSet) {
        tempChartData.push([key, tempSumSet[key]]);
      }

      revenue = revenue? `${Number(revenue).toLocaleString('ko-KR')} 원` : 0;
      commission = commission? `${Number(commission).toLocaleString('ko-KR')} 원` : 0;
      complete = complete? `${Number(complete).toLocaleString('ko-KR')} 건` : 0;
      
      setTableData(appData);
      setSpinner(false);
      setTotalRevenue(revenue);
      setTotalCommission(commission);
      setTotalComplete(complete);
      setChartData(tempChartData);
    })
    .catch(err => {
      console.log(err);
    });
  }

  const setDate = (newValue: Dayjs | null) => {
    setPickDate(newValue);
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
          <CustomDatePicker views={["year"]} value={pickDate} setDate={setDate} />
        </Box>
        <CustomButton onClick={getGridData}>조회</CustomButton>
        { chartData.length > 0 ?
          <Chart
            chartType="PieChart"
            data={chartData}
            options={chartOptions}
            width={"100%"}
            height={"350px"}
          />
          :
          <></>
        }
      </Grid>
      <Grid container spacing={1}>
        <TotalField label="조회기간 수익: " value={totalRevenue}/>
        <TotalField label="조회기간 수수료: " value={totalCommission}/>
        <TotalField label="조회기간 캠페인 완료 수: " value={totalComplete}/>
      </Grid>
      <DataGrid 
        sx={{fontFamily: fontConfigs.main.fontFamily}}
        loading={spinner}
        getRowId={(row:{Complete:number, Revenue:number}) => row.Revenue+row.Complete}
        rows={tableData} 
        columns={columns}
        rowHeight={25} 
        pageSize={15}
      />
    </Box>
  );
};

export default AppPage;