import { Modal,RadioButtons } from '@egovernments/digit-ui-react-components'
import React from 'react'

const Heading = (props) => {
    return <h1 className="heading-m">{props.t(props.heading)}</h1>;
};

const Close = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF">
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
    </svg>
);

const CloseBtn = (props) => {
    return (
        <div className="icon-bg-secondary" onClick={props.onClick}>
            <Close />
        </div>
    );
};

const SkillSelector = ({t,closeModal,row,dispatch}) => {
    const sampleSkills = [
        {
            level: "Skill 1"
        },
        {
            level: "Skill 2"
        },
        {
            level: "Skill 3"
        }
    ]

    const handleSelect = (value) => {
        //you have access to the row here which contains which attendence checkbox was selected
        //you also have access to the skill selected in value.level
        //so lets dispatch an action of type skill here and set the relevant state
        closeModal(false)
        dispatch({
            type:"skill",
            row,
            selectedSkill:value.level
        })
    }

  return (
      <Modal
          headerBarMain={<Heading t={t} heading={"abcd"} />}
          headerBarEnd={<CloseBtn onClick={() => closeModal(false)} />}
          actionSaveLabel={t("Confirm")}
          actionSaveOnSubmit={()=>{}}
          formId="modal-action"
          headerBarMainStyle={{ marginLeft: "20px" }}
          popupStyles = {{margin:"auto auto",width:"80vw"}}
          style={{"width":"100%"}}
      >
          <RadioButtons
              selectedOption={row.skill}
              onSelect={handleSelect}
              options={sampleSkills}
              optionsKey={"level"}
          />
    </Modal>
  )
}

export default SkillSelector