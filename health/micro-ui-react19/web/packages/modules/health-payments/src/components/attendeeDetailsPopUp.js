import React from "react";
import { useTranslation } from "react-i18next";
import { PopUp } from "@egovernments/digit-ui-components";
import { formatTimestampToDate } from "../utils";
import { I18N_KEYS } from "../utils/i18nKeyConstants";

/**
 * AttendeeDetailsPopUp displays a popup with attendee details.
 *
 * @param {Array} props.attendee - Row data array: [id, name, username, role, daysWorked, gender, dob, phone, uniqueId, userType, enrollmentDate, denrollmentDate]
 * @param {Function} props.onClose - Callback to close the popup.
 */
const AttendeeDetailsPopUp = ({ attendee, onClose }) => {
  const { t } = useTranslation();

  if (!attendee) return null;

  const name = attendee[1] || t(I18N_KEYS.COMMON.ES_COMMON_NA);
  const username = attendee[2] || t(I18N_KEYS.COMMON.ES_COMMON_NA);
  const role = attendee[3] ? t(attendee[3]) : t(I18N_KEYS.COMMON.ES_COMMON_NA);
  const gender = attendee[5] || t(I18N_KEYS.COMMON.ES_COMMON_NA);
  const dob = attendee[6] || t(I18N_KEYS.COMMON.ES_COMMON_NA);
  const phone = attendee[7] || t(I18N_KEYS.COMMON.ES_COMMON_NA);
  const enrollmentDate = attendee[10] ? formatTimestampToDate(attendee[10]) : t(I18N_KEYS.COMMON.ES_COMMON_NA);
  const denrollmentDate = attendee[11] ? formatTimestampToDate(attendee[11]) : t(I18N_KEYS.COMMON.ES_COMMON_NA);
  const isActive = !attendee[11];

  const details = [
    { label: "HCM_AM_FRONTLINE_WORKER", value: name },
    { label: "HCM_AM_WORKER_ID", value: username },
    { label: "HCM_AM_ROLE", value: role },
    { label: "HCM_AM_GENDER", value: gender },
    { label: "HCM_AM_DOB", value: dob },
    { label: "HCM_AM_MOBILE_NUMBER", value: phone },
    { label: "HCM_AM_ENROLLMENT_DATE", value: enrollmentDate },
    { label: "HCM_AM_DENROLLMENT_DATE", value: denrollmentDate },
  ];

  return (
    <PopUp
      style={{ width: "min(440px, 94vw)" }}
      onClose={onClose}
      onOverlayClick={onClose}
      heading={
        <span style={{ color: "#0B4B66" }}>
          {t(I18N_KEYS.COMPONENTS_ATTENDANCE.HCM_AM_USER_DETAILS)}
        </span>
      }
      children={[
        <div key="attendee-details" style={{ paddingTop: 0, paddingBottom: "0.5rem" }}>
          <div style={{ marginBottom: "0.75rem" }}>
            <span
              style={{
                display: "inline-block",
                padding: "0.2rem 0.75rem",
                borderRadius: "999px",
                fontSize: "0.85rem",
                fontWeight: 600,
                backgroundColor: isActive ? "#E8F5E9" : "#FFEBEE",
                color: isActive ? "#256625" : "#B71C1C",
              }}
            >
              {isActive ? t(I18N_KEYS.COMPONENTS_ATTENDANCE.HCM_AM_USER_STATUS_ACTIVE) : t(I18N_KEYS.COMPONENTS_ATTENDANCE.HCM_AM_USER_STATUS_INACTIVE)}
            </span>
          </div>
          {details.map((item, index) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: "1.5rem",
                padding: "0.75rem 0",
                borderBottom: index < details.length - 1 ? "1px solid #D6D5D4" : "none",
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  color: "#0B4B66",
                  fontSize: "1rem",
                  flex: "0 0 28%",
                  minWidth: 0,
                  textAlign: "left",
                }}
              >
                {t(item.label)}
              </span>
              <span
                style={{
                  color: "#505A5F",
                  fontSize: "1rem",
                  flex: "1 1 auto",
                  minWidth: 0,
                  textAlign: "left",
                }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>,
      ]}
      
    />
  );
};

export default AttendeeDetailsPopUp;
