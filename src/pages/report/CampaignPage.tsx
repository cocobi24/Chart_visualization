import React from 'react';
import { useState } from "react";
import dayjs, { Dayjs } from 'dayjs';
import { Box, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import CustomButton from '@/components/common/CustomButton';
import CustomDatePicker from '@/components/common/DatePicker';
import TotalField from '@/components/common/TotalField';
import fontConfigs from '@/configs/fontConfigs';

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

const CampaignPage = () => {
  const [tableData, setTableData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState();
  const [totalCommission, setTotalCommission] = useState();
  const [totalComplete, setTotalComplete] = useState();  
  const [pickDate, setPickDate] = useState<Dayjs | null>(dayjs('2018-01-01'));
  const [spinner, setSpinner] = useState(false);
  
  let campaignData: any = [];
  const columns = [
    { 
      field: 'Datetime', 
      headerName: '캠페인 참여 일자', 
      width: 300, 
      type: 'date',
      valueGetter: ( params: any) => { return convertDatetime(params.value) },
    }, { 
      field: 'CampaignKey', 
      headerName: '캠페인 키', 
      width: 150, 
      type: 'string' 
    }, { 
      field: 'CampaignName', 
      headerName: '캠페인 이름  ', 
      width: 300, 
      type: 'string' 
    }, { 
      field: 'Complete', 
      headerName: '캠페인 참여자 수', 
      width: 150, 
      type: 'number' 
    }, { 
      field: 'Revenue', 
      headerName: '캠페인 참여 수익', 
      width: 150, 
      type: 'number' 
    }, { 
      field: 'Commission', 
      headerName: '캠페인 수수료', 
      width: 150, 
      type: 'number' 
    },
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
        row.App[0].Campaign.forEach((campaign: any) => {
          campaignData.push(campaign);
        });
      });

      let revenue = data.Payment.Revenue;
      let commission = data.Payment.Commission;
      let complete = data.Payment.Complete;
      revenue = revenue? Number(revenue).toLocaleString('ko-KR')+' 원' : 0 ;
      commission = commission? Number(commission).toLocaleString('ko-KR')+' 원' : 0 ;
      complete = complete? Number(complete).toLocaleString('ko-KR')+' 건' : 0 ;

      setTableData(campaignData);
      setSpinner(false);
      setTotalRevenue(revenue);
      setTotalCommission(commission);
      setTotalComplete(complete);
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
          <CustomDatePicker value={pickDate} setDate={setDate} />
        </Box>
        <CustomButton onClick={getGridData}>조회</CustomButton>
      </Grid>
      <Grid container spacing={1}>
        <TotalField label="조회기간 수익: " value={totalRevenue}/>
        <TotalField label="조회기간 수수료: " value={totalCommission}/>
        <TotalField label="조회기간 캠페인 완료 수: " value={totalComplete}/>
      </Grid>
      <DataGrid 
        sx={{fontFamily: fontConfigs.main.fontFamily}}
        loading={spinner}
        getRowId={(row:any) => row.CampaignKey+row.Complete}
        rows={tableData} 
        columns={columns}
        rowHeight={25} 
        pageSize={15}
      />
    </Box>
  );
};

export default CampaignPage;