import { ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAppState } from "@/redux/features/appStateSlice";
import { setAppName } from "@/redux/features/appNameSlice";

type Props = {
  state?: string,
  sidebarProps?: {
    displayText: string,
    icon?: ReactNode;
  };
  children: ReactNode;
};

const PageWrapper = (props: Props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.state) {
      dispatch(setAppState(props.state));
    }

    if (props.sidebarProps) {
      dispatch(setAppName(props.sidebarProps.displayText));
    }
  }, [dispatch, props]);

  return (
    <>{props.children}</>
  );
};

export default PageWrapper;