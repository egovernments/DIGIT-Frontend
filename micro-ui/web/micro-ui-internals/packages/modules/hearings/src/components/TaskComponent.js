import React from 'react';
import { Dropdown, Button } from "@egovernments/digit-ui-components";
import { CardLabel, LabelFieldPair, PropertyHouse } from "@egovernments/digit-ui-react-components";
//[TODO: Static values need to be removed and integrated with API data]
const TasksComponent = () => {
    return (
        <div className="tasks-component">
            <h2>Your Tasks</h2>
            <div className="filters">
                <LabelFieldPair>
                    <CardLabel style={{ width: "16rem" }}>Case Stage and Type</CardLabel>
                    <Dropdown
                        style={{ width: "16rem" }}
                        option={[]}
                        optionKey={"code"}
                        select={(value) => {
                        }}
                    />
                </LabelFieldPair>
                <LabelFieldPair>
                    <CardLabel style={{ width: "16rem" }}>Task Type</CardLabel>
                    <Dropdown
                        style={{ width: "16rem" }}
                        option={[]}
                        optionKey={"code"}
                        select={(value) => {
                        }}
                    />
                </LabelFieldPair>
                {/* <Select defaultValue="Case Stage & Type" variant="outlined" className="filter-select">
                    <MenuItem value="Case Stage & Type">Case Stage & Type</MenuItem>
                </Select>
                <Select defaultValue="Task Type" variant="outlined" className="filter-select">
                    <MenuItem value="Task Type">Task Type</MenuItem>
                </Select> */}
            </div>
            <div className="task-section">
                <div className="task-header">
                    <span>Complete this week (2)</span>
                </div>
                <div className="task-item due-today">
                    <input type="checkbox" />
                    <div className="task-details">
                        <span className="task-title">Reschedule hearing request: Aparna vs Sandesh</span>
                        <span className="task-info">NIA S138 - PB-PT-2023 - Due today</span>
                    </div>
                </div>
                <div className="task-item">
                    <input type="checkbox" />
                    <div className="task-details">
                        <span className="task-title">Delay application request: Raj vs Anushka</span>
                        <span className="task-info">NIA S138 - PB-PT-2023 - Hearing in 2 days</span>
                    </div>
                </div>
                <div className="task-item completed">
                    <input type="checkbox" checked disabled />
                    <div className="task-details">
                        <span className="task-title completed">Reschedule hearing request: Aparna vs Sandesh</span>
                    </div>
                </div>
            </div>
            <div className="task-section">
                <div className="task-header">
                    <span>All other tasks (12)</span>
                </div>
            </div>
            <div className="task-section">
                <div className="task-header">
                    <span>Admit registered cases (32)</span>
                    {/* <Button className="new-tasks">4 new</Button> */}
                </div>
            </div>
        </div>
    );
};
export default TasksComponent;