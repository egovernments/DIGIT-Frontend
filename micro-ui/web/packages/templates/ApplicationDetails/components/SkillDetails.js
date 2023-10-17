import React from 'react'
import { useTranslation } from 'react-i18next'
import { CardLabel } from '@egovernments/digit-ui-react-components'

const SkillDetails = ({ data }) => {
    const { t } = useTranslation()
    return (
        <React.Fragment>
            <div className='skill-details-wrapper'>
                <CardLabel style={{fontSize: "16px", fontWeight: "600", marginBottom: 0}}>{t(data?.title)}</CardLabel>
                <div className='skill-details'>
                    { data?.skillData?.length > 0 ? 
                        data?.skillData?.map((item, index) => (
                            <div key={index}> {t(`COMMON_MASTERS_SKILLS_${item?.level}.${item?.type}`)} </div>
                        ))
                        : t('NA')
                    }
                </div>
            </div>
        </React.Fragment>
    )
}

export default SkillDetails