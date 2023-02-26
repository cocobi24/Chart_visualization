import { RouteType } from "./config";
import HomePage from "../pages/home/HomePage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import DashboardIcon from '@mui/icons-material/DashboardOutlined';
import CampaignPage from "../pages/report/CampaignPage";
import ReportPageLayout from "../pages/report/ReportPageLayout";
import MonthPage from "../pages/report/MonthPage";
import AppPage from "../pages/report/AppPage";
import ReportOutlinedIcon from '@mui/icons-material/AssessmentOutlined';

const appRoutes: RouteType[] = [
  {
    index: true,
    element: <HomePage />,
    state: "home"
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
    state: "dashboard",
    sidebarProps: {
      displayText: "대시보드",
      icon: <DashboardIcon />
    }
  },
  {
    path: "/report",
    element: <ReportPageLayout />,
    state: "report",
    sidebarProps: {
      displayText: "리포트",
      icon: <ReportOutlinedIcon />
    },
    child: [
      {
        path: "/report/campaign",
        element: <CampaignPage />,
        state: "report.campaign",
        sidebarProps: {
          displayText: "캠페인별 수익 현황"
        },
      },
      {
        path: "/report/month",
        element: <MonthPage />,
        state: "report.month",
        sidebarProps: {
          displayText: "월별 수익 현황"
        }
      },
      {
        path: "/report/app",
        element: <AppPage />,
        state: "report.app",
        sidebarProps: {
          displayText: "앱별 수익 현황"
        }
      }
    ]
  }
];

export default appRoutes;