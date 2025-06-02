import React, {useState} from 'react'
import { useTranslation } from 'react-i18next'

const HorizontalNav = ({ configNavItems, activeLink, setActiveLink, showNav = false, children, customStyle = {}, customClassName = "", inFormComposer = true, navClassName = "", navStyles = {} }) => {
    const { t } = useTranslation()

    const setActive = (item) => {
        setActiveLink(item.name)
    }

    const MenuItem = ({ item }) => {
        let itemComponent = item.code;

        const Item = () => (
            <span className="menu-item">
                <div className="menu-label" aria-current={activeLink === item.name ? "page" : undefined}>{t(itemComponent)}</div>
            </span>
        );

        return (
            <Item />
        );
    };
    return (
        <div className={navClassName} style={{ ...navStyles }}>
            {showNav &&
                <div
                    className={`horizontal-nav ${customClassName}`}
                    style={inFormComposer ? { marginLeft: "16px", marginRight: "16px", ...customStyle } : { ...customStyle }}
                    role="navigation"
                    aria-label="Secondary"
                >
                    {configNavItems?.map((item, index) => (
                        <div className={`sidebar-list ${activeLink === item.name ? "active" : ""}`} key={index} onClick={() => setActive(item)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    setActive(item);
                                }
                            }}
                            aria-pressed={activeLink === item.name}
                            aria-label={item.name}
                        >
                            <MenuItem item={item} />
                        </div>
                    ))}
                </div>
            }
            {children}
        </div>
    )
}

export default HorizontalNav