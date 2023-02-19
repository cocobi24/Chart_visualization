import React from 'react';
import { useState } from "react";
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DateButton from '@/components/common/DateButton';

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
          "search_year": 2018,
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
      setTableData(campaignData);
      setSpinner(false);
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
      <DateButton onClick={getGridData}>저장</DateButton>
      <DataGrid 
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