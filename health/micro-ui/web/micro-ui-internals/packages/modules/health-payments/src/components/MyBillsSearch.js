import { useTranslation } from "react-i18next";
import DateRangePicker from "./DateRangePicker";
import { billTypeOptions } from "../utils/constants";

/**
 * MyBillsSearch component allows users to search for bills based on bill ID and date range.
 *
 * @param {function} onSubmit - Callback function when search is executed.
 * @param {function} onClear - Callback function when the search is cleared.
 * @returns {JSX.Element} The JSX content for the search component.
 */
const MyBillsSearch = ({ onSubmit = () => { }, onClear = () => { } }) => {
    const { t } = useTranslation();

  const [isDisabled, setIsDisabled] = useState(false);

  const [selectedBillType, setSelectedBillType] = useState(null);

  const [billID, setBillID] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
    title: "",
  });
  // To force re-rendering of DateRangePicker
  const [key, setKey] = useState(0);

  const handleFilterChange = (data) => {
    setDateRange(data.range);
  };

    const handleSearch = (data) => {

        // Check if startDate and endDate are the same
        const isSameDateTime =
            dateRange.startDate &&
            dateRange.endDate &&
            new Date(dateRange.startDate).getTime() === new Date(dateRange.endDate).getTime();

    const finalDateRange = isSameDateTime
      ? { startDate: "", endDate: "", title: "" } // Empty dateRange if start and end are the same
      : dateRange;

    onSubmit(billID, finalDateRange, selectedBillType);
  };

  const handleClear = () => {
    setSelectedBillType(null);
    setIsDisabled(false);
    setDateRange({ startDate: "", endDate: "", title: "" });
    setBillID("");
    setKey((prevKey) => prevKey + 1);
    onClear();
  };

  return (
    <Card variant="search" style={{ marginBottom: "1.5rem", alignItems: "center" }}>
      <div style={{ width: "80%" }}>
        <TextBlock body={`${t("HCM_AM_BILL_ID")}`}></TextBlock>
        <TextInput
          value={billID}
          onChange={(e) => {
            setBillID(e.target.value);
          }}
        />
      </div>
      <div style={{ pointerEvents: isDisabled ? "none" : "auto", opacity: isDisabled ? 0.6 : 1, maxWidth: "100%", width: "100%" }}>
        <DateRangePicker
          key={key} // Add key to force re-render
          values={dateRange}
          onFilterChange={handleFilterChange}
          t={(key) => key} // Simple translation function
          labelClass="custom-label"
          title={t("HCM_AM_SELECTE_DATA_RANGE")}
          epochStartDate={new Date().getTime()}
          epochEndDate={new Date().getTime()}
          disabled={false}
        />
      </div>
      <div style={{ maxWidth: "100%", width: "100%" }}>
        <TextBlock body={`${t("HCM_AM_BILL_TYPE")}`}></TextBlock>

        <Dropdown
          style={{ width: "100%" }}
          t={t}
          option={billTypeOptions}
          optionKey="name"
          selected={selectedBillType}
          select={(value) => {
            if (value.code === "FINAL_AGGREGATE") {
              setIsDisabled(true);
              setDateRange({ startDate: "", endDate: "", title: "" });
              setBillID("");
              setKey((prevKey) => prevKey + 1);
            } else {
              setIsDisabled(false);
            }

            setSelectedBillType(value);
          }}
        />
      </div>
      <div style={{ alignItems: "center" ,margin:"0",padding:"0"}}>
        <ButtonGroup
          style={{ alignItems: "center" ,margin:"0",padding:"0"}}
          buttonsArray={[
            <Button variation="teritiary" label={t(`HCM_AM_CLEAR`)} type="button" onClick={handleClear} size="large" />,
            <Button variation="primary" label={t(`HCM_AM_SEARCH`)} type="button" onClick={handleSearch} size="large" />,
          ]}
        ></ButtonGroup>
      </div>
    </Card>
  );
};

export default MyBillsSearch;
