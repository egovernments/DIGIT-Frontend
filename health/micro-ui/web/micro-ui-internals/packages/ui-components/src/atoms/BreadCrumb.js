import React, { useEffect, useState, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const BreadCrumb = (props) => {
  const [expanded, setExpanded] = useState(false);
  const [crumbsToDisplay, setCrumbsToDisplay] = useState([...props?.crumbs]);

  useEffect(() => {
    if (props?.maxItems && props?.crumbs.length > props?.maxItems && !expanded) {
      const startCrumbs = props.crumbs.slice(0, props?.itemsBeforeCollapse || Math.ceil(props.maxItems / 2));
      const endCrumbs = props.crumbs.slice(
        -1 * (props?.itemsAfterCollapse || Math.floor(props.maxItems / 2))
      );

      let updatedCrumbs = startCrumbs.concat(
        [{ show: true, content: props?.expandText || "..." }],
        endCrumbs
      );
      setCrumbsToDisplay(updatedCrumbs);
    } else {
      setCrumbsToDisplay([...props.crumbs]);
    }
  }, [props.crumbs, props.maxItems, expanded, props.itemsBeforeCollapse, props.itemsAfterCollapse, props?.expandText]);

  function handleRedirect(path) {
    const host = window.location.origin; // Dynamically get the base URL
    window.location.href = `${host}${path}`;
  }

  function isLast(index) {
    // Filter crumbs to only include those that are displayed
    let validCrumbs = crumbsToDisplay?.filter((crumb) => crumb?.show === true);

    // Check if all crumbs have the same `internalLink` or `externalLink`
    const allHaveSameInternalLink = validCrumbs.every((crumb) => crumb.internalLink === validCrumbs[0].internalLink);
    const allHaveSameExternalLink = validCrumbs.every((crumb) => crumb.externalLink === validCrumbs[0].externalLink);
    
    // If all visible crumbs have the same link, determine last crumb by index
    if (allHaveSameInternalLink || allHaveSameExternalLink) {
      return index === validCrumbs.length - 1;
    }
    
    // Check if the current crumb is the last one in the validCrumbs list
    return validCrumbs?.findIndex((ob) => {
      const linkToCheck = ob?.externalLink || ob?.internalLink; // Use externalLink if it exists, else internalLink
      const currentLink = crumbsToDisplay?.[index]?.externalLink || crumbsToDisplay?.[index]?.internalLink;
      return linkToCheck === currentLink;
    }) === validCrumbs?.length - 1;
  }

  const handleCrumbClick = () => {
    setExpanded(!expanded);
  };

  const validCrumbsMain = crumbsToDisplay?.filter((crumb) => crumb?.show === true);

  return (
    <nav aria-label="Breadcrumb">
      <ol
      className={`digit-bread-crumb ${
        props?.className ? props?.className : ""
      }`}
        style={props?.style}
      >
        {validCrumbsMain?.map((crumb, ci) => {
          if (!crumb?.show) return null;
        if (crumb?.isBack){
            return (
              <li
                key={ci}
                style={props?.itemStyle}
                className="digit-bread-crumb--item back-crumb-item"
              >
                <span
                  type="button"
                  role="button"
                  onClick={() => window.history.back()}
                  onKeyDown={(key)=>{
                    if (key.key=="Enter" || key.key==" "){
                      window.history.back()
                    }
                  }}
                >
                  {crumb.content}
                </span>
              </li>
            );
          }

          return (
            <Fragment key={ci}>
              <li
                style={props?.itemStyle}
                className="digit-bread-crumb--item"
              >
                {isLast(ci) || !crumb?.path ? (
                  crumb.content === "..." || crumb.content === props?.expandText ? (
                    <button
                      type="button"
                      className={`digit-bread-crumb-content default`}
                      onClick={handleCrumbClick}
                      style={props?.spanStyle}
                      aria-label="Expand breadcrumb"
                    >
                      {crumb?.icon && crumb.icon}
                      {crumb.content}
                    </button>
                  ) : (
                    <span
                      className={`digit-bread-crumb-content ${isLast(ci) ? "current" : "default"}`}
                      style={props?.spanStyle}
                      aria-current={isLast(ci) ? "page" : undefined}
                    >
                      {crumb?.icon && crumb.icon}
                      {crumb.content}
                     
                    </span>
                  )
              ) : (
                <Link
                  to={{ pathname: crumb.internalLink, state: { count: crumb?.count }, search: crumb?.query  }}
                  className="digit-bread-crumb-content"
                >
                  {crumb?.icon && crumb.icon}
                  {crumb.content}
                </Link>
              )}
              {!isLast(ci) && (
                  <div className="digit-bread-crumb-seperator" aria-hidden="true">
                  {props?.customSeparator ? props?.customSeparator : "/"}
                  </div>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

BreadCrumb.propTypes = {
  crumbs: PropTypes.array,
  className: PropTypes.string,
  style: PropTypes.object,
  spanStyle: PropTypes.object,
  customSeparator: PropTypes.element,
  maxItems: PropTypes.number,
  itemsAfterCollapse: PropTypes.number,
  itemsBeforeCollapse: PropTypes.number,
  expandText: PropTypes.string
};

export default BreadCrumb;
