import { Card, StatusTable, Row, DetailsCard, SearchIcon, Dropdown, SearchableDropdown,Table, DeleteIcon,SubmitBar,Toast} from '@egovernments/digit-ui-react-components'
import React,{useMemo,useState} from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { Link, useLocation } from "react-router-dom"
import useDebounce from '../../../pageComponents/useDebounce'

const sampleTableData = {
  rows: [
    {
      "name": "Name A",
      "aadhar": "1223-1223-1220",
      "acno": "1213-1241-2121",
      "ifsc": "3242-3423-4322"
    },
    {
      "name": "Name B",
      "aadhar": "1223-1223-1221",
      "acno": "1223-1223-1221",
      "ifsc": "1223-1223-1221"
    },
    {
      "name": "Name C",
      "aadhar": "1223-1223-1222",
      "acno": "1223-1223-1221",
      "ifsc": "1223-1223-1221"
    },
    {
      "name": "Name D",
      "aadhar": "1223-1223-1223",
      "acno": "1223-1223-1221",
      "ifsc": "1223-1223-1221"
    },
    {
      "name": "Name E",
      "aadhar": "1223-1223-1224",
      "acno": "1223-1223-1221",
      "ifsc": "1223-1223-1221"
    },
    {
      "name": "Name F",
      "aadhar": "1223-1223-1225",
      "acno": "1223-1223-1221",
      "ifsc": "1223-1223-1221"
    },
    {
      "name": "Name G",
      "aadhar": "1223-1223-1226",
      "acno": "1223-1223-1221",
      "ifsc": "1223-1223-1221"
    },
    {
      "name": "Name H",
      "aadhar": "1223-1223-1227",
      "acno": "1223-1223-1221",
      "ifsc": "1223-1223-1221"
    }
  ]
}

function useTodos(page, search) {
  let url = `https://jsonplaceholder.typicode.com/todos?_page=${page}`;
  if (!!search) {
    url += `&q=${search}`;
  }

  // see https://react-query.tanstack.com/guides/important-defaults
  // see https://react-query.tanstack.com/guides/paginated-queries
  return useQuery(
    ["todos", { page, search }],
    () => fetch(url).then((res) => res.json())
    // the following can be used to avoid refetches on already fetched data (see paginated queries docs)
    // { keepPreviousData: true, staleTime: 5 * 60 * 1000 }
  );
}

const ViewProject = ({isLoading=false,resultOk=true,data={}}) => {
  const [tableRow, setTableRow] = useState([])
  const state  = useLocation()
  const { t } = useTranslation()
  const [service, setService] = useState(null);
  const [showExpander,setShowExpander] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const [wageSeekers,setWageSeekers] = useState([])
  const [showToast,setShowToast] = useState(null)
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const { isFetching, isError, data:responseData, error } = useTodos(0, debouncedSearch);
  
  data = [[]]

  const handleDeleteRow = ({ value, column, row }) => {
    setShowToast({label:"ATM_WAGE_SEEKERS_REMOVED"});
    setTableRow((prevState)=>prevState.filter(tableRow => tableRow.aadhar !== row.original.aadhar))
  }

  const handleSubmit = () => {
    setShowToast({ label: "ATM_WAGE_SEEKERS_ADDED" });
  }

  const closeToast = () => {
    setShowToast(null);
  };
  setTimeout(() => {
    closeToast();
  }, 10000); 

  const tableColumns = useMemo(()=>{
    return [
      {
        Header: t("ATM_WAGE_SEEKER_NAME"),
        accessor: "name",
        Cell: ({ value, column, row }) => {
          return String(t(value));
        }
      },
      {
        Header: t("ATM_WAGE_SEEKER_AADHAR"),
        accessor: "aadhar",
        Cell: ({ value, column, row }) => {
          return String(t(value));
        }
      },
      {
        Header: t("ATM_WAGE_SEEKER_ACNO"),
        accessor: "acno",
        Cell: ({ value, column, row }) => {
          return String(t(value));
        }
      },
      {
        Header: t("ATM_WAGE_SEEKER_IFSC"),
        accessor: "ifsc",
        Cell: ({ value, column, row }) => {
          return String(t(value));
        }
      },
      {
        Header: t(""),
        accessor: "delete",
        Cell: ({ value, column, row }) => {
          return <span onClick={()=>handleDeleteRow({value,column,row})}> <DeleteIcon fill={"#B1B4B6"} style={{ "margin": "auto" }} /></span>
        }
      },
    ]
  },[])

  const sampleOptions = [
    {
      "name":"Nipun"
    },
    {
      "name": "Vipul"
    },
    {
      "name": "Shaifali"
    }
  ]

  const propsMobileInboxCards = useMemo(() => {
    if (isLoading) {
      return [];
    }
    
    return data?.map((row) => ({
      [t("ATM_PROJECT_NAME")]: "NA",
      [t("ATM_WIN_CODE")]: "NA",
      [t("ATM_ENGG_INCHARGE")]: "NA",
      [t("ATM_START_DATE")]: "NA",
      [t("REGISTER_STATUS")]: "NA",
    }));
  }, [data]);

  return (
    <React.Fragment>
      <Card className={"card"} style={{ "marginBottom": "1rem" }}>
        <StatusTable>
          <Row className="border-none" label={t("ATM_PROJECT_NAME")} text={"NA"} textStyle={{ whiteSpace: "pre" }} />
          {isExpanded ? 
          <div>
            <Row className="border-none" label={t("ATM_WIN_CODE")} text={"NA"} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none" label={t("ATM_ENGG_INCHARGE")} text={"NA"} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none" label={t("ATM_START_DATE")} text={"NA"} textStyle={{ whiteSpace: "pre" }} />
            {wageSeekers.length > 0 ? <Row className="border-none" label={t("ATM_SEEKERS_COUNT")} text={"NA"} textStyle={{ whiteSpace: "pre" }} /> : null}
            {wageSeekers.length > 0 ? <Row className="border-none" label={t("ATM_LAST_ATTENDENCE_DATE")} text={"NA"} textStyle={{ whiteSpace: "pre" }} /> : null}
            <Row className="border-none" label={t("REGISTER_STATUS")} text={"NA"} textStyle={{ whiteSpace: "pre" }} />
          </div>: null}

          <p>
            <span className='link' style={{ color: "#f47738" }} onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? t("HIDE_REGISTER_DETAILS") : t("VIEW_REGISTER_DETAILS")}
            </span>
          </p>
        </StatusTable>
      </Card>

      <div className='card' style={{"padding":"0px"}}>
        <SearchableDropdown showSearchIcon={true} noBorder={true} placeholder={t("ATM_SEARCH_WAGE_SEEKERS_PLACEHOLDER")} option={responseData} optionKey={"title"} selected={service} select={setService} value={search} setValue={setSearch} tableRow={tableRow} setTableRow={setTableRow} />
      </div>

      {/* Render the table here */}
      {tableRow.length>0 ?<div style={{ "padding": "0px", "overflowX": "scroll" }} className='card'>
        <Table 
          className="table-fixed-first-column-wage-seekers wage-seekers-table" 
          t={t}
          // customTableWrapperClassName={"dss-table-wrapper"}
          disableSort={false}
          autoSort={true}
          manualPagination={false}
          // globalSearch={filterValue}
          initSortId="S N "
          // onSearch={onSearch}
          data={tableRow}
          totalRecords={tableRow.length}
          columns={tableColumns}
          isPaginationRequired={false}
          getCellProps={(cellInfo) => {
            return {
              style: {},
            };
          }}
        />
      </div> : <Card style={{ marginTop: 20 }}>
        {
            t("ATM_NO_WAGE_SEEKERS_FOUND")
            .split("\\n")
            .map((text, index) => (
              <p key={index} style={{ textAlign: "center" }}>
                {text}
              </p>
            ))
        }
      </Card>}
      <div style={{margin:"1rem 8px"}}>
      <SubmitBar onSubmit={handleSubmit} label={t("ATM_SUBMIT")} />
      </div>

      {showToast && <Toast label={t(showToast.label)} onClose={closeToast} />}
    </React.Fragment>
  )
}

export default ViewProject