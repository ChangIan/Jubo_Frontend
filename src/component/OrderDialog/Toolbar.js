/**
 * 封裝
 * Toolbar
 * Usage:
 *  const buttons = [{
 *    text: "Add",
 *    icon: <AddIcon />,
 *    disabled: false,
 *    handler: () => console.log('Toggle Add!'),
 *  }, ...];
 *
 *  <Toolbar buttons={buttons} />
 */

import { Stack, Typography } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import EditIcon from '@mui/icons-material/Edit';

import ToolbarButton from "./ToolbarButton";

export default function Toolbar({ buttons }) {
  return (
    <Stack direction="row" spacing={2} padding={"10px 0"}>
      <Typography
        component="div"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          color: "var(--black-jubo-color)",
          flexGrow: 1,
        }}
      >
        {/* <HelpOutlineIcon /> */}
        <EditIcon />
        <span
          style={{
            paddingLeft: "5px",
          }}
        >
          點擊兩下醫囑內容即可編輯
        </span>
      </Typography>
      {buttons.map((item, index) => (
        <ToolbarButton key={`toolbar-button-${index}`} {...item} />
      ))}
    </Stack>
  );
}
