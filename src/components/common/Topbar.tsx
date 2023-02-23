import { AppBar, Toolbar, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import colorConfigs from "@/configs/colorConfigs";
import fontConfigs from "@/configs/fontConfigs";
import sizeConfigs from "@/configs/sizeConfigs";
import { RootState } from "@/redux/store";

const Topbar = () => {
  const { appName } = useSelector((state: RootState) => state.appName);
  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${sizeConfigs.sidebar.width})`,
        ml: sizeConfigs.sidebar.width,
        boxShadow: "unset",
        backgroundColor: colorConfigs.topbar.bg,
        color: colorConfigs.topbar.color,
      }}
    >
      <Toolbar>
        <Typography variant="h5" sx={{fontFamily: fontConfigs.topbar.fontFamily}}>
          {appName}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;