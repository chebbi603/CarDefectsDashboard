import { LineChart } from "@mui/x-charts";
import IconButton from "../IconButton";
import { IconRefresh } from "@tabler/icons-react";
import "./ChartCard.css";

const ChartCard = ({
  title = "Chart name",
  description = "",
  showIcon = true,
  children,
}) => {
  return (
    <div className="grid-chart-container">
      <div className="grid-chart-header">
        <div className="grid-chart-text">
          <h2 className="grid-chart-text-title">{title}</h2>
          {description.length != 0 && (
            <p className="grid-chart-text-desc">{description}</p>
          )}
        </div>
        {showIcon && <IconButton icon={<IconRefresh />} />}
      </div>
      {children}
    </div>
  );
};

export default ChartCard;
