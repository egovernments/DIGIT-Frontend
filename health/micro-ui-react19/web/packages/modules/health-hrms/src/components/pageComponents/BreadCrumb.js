import { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const BreadCrumbs = (props) => {
  const [expanded, setExpanded] = useState(false);
  const [crumbsToDisplay, setCrumbsToDisplay] = useState([...props?.crumbs]);

  useEffect(() => {
    if (props?.maxItems && props?.crumbs.length > props?.maxItems && !expanded) {
      const startCrumbs = props.crumbs.slice(0, props?.itemsBeforeCollapse || Math.ceil(props.maxItems / 2));
      const endCrumbs = props.crumbs.slice(-1 * (props?.itemsAfterCollapse || Math.floor(props.maxItems / 2)));
      setCrumbsToDisplay(startCrumbs.concat([{ show: true, content: props?.expandText || "..." }], endCrumbs));
    } else {
      setCrumbsToDisplay([...props.crumbs]);
    }
  }, [props.crumbs, props.maxItems, expanded, props.itemsBeforeCollapse, props.itemsAfterCollapse, props?.expandText]);

  function handleRedirect(path) {
    window.location.href = `${window.location.origin}${path}`;
  }

  function isLast(index) {
    const validCrumbs = crumbsToDisplay?.filter((crumb) => crumb?.show === true);
    const allHaveSameInternalLink = validCrumbs.every((crumb) => crumb.internalLink === validCrumbs[0].internalLink);
    const allHaveSameExternalLink = validCrumbs.every((crumb) => crumb.externalLink === validCrumbs[0].externalLink);

    if (allHaveSameInternalLink || allHaveSameExternalLink) {
      return index === validCrumbs.length - 1;
    }

    return (
      validCrumbs?.findIndex((ob) => {
        const linkToCheck = ob?.externalLink || ob?.internalLink;
        const currentLink = crumbsToDisplay?.[index]?.externalLink || crumbsToDisplay?.[index]?.internalLink;
        return linkToCheck === currentLink;
      }) === validCrumbs?.length - 1
    );
  }

  const validCrumbsMain = crumbsToDisplay?.filter((crumb) => crumb?.show === true);

  return (
    <ol className={`digit-bread-crumb ${props?.className || ""}`} style={props?.style}>
      {validCrumbsMain?.map((crumb, ci) => {
        if (!crumb?.show) return null;
        if (crumb?.isBack)
          return (
            <li key={ci} style={props?.itemStyle} className="digit-bread-crumb--item back-crumb-item">
              <span onClick={() => window.history.back()}>{crumb.content}</span>
            </li>
          );

        return (
          <Fragment key={ci}>
            <li style={props?.itemStyle} className="digit-bread-crumb--item">
              {isLast(ci) || (!crumb?.internalLink && !crumb?.externalLink) ? (
                <span
                  className={`digit-bread-crumb-content ${isLast(ci) ? "current" : "default"}`}
                  style={props?.spanStyle}
                  onClick={crumb.content === "..." || crumb.content === props?.expandText ? () => setExpanded(!expanded) : null}
                >
                  {crumb?.icon && crumb.icon}
                  {crumb.content}
                </span>
              ) : crumb?.externalLink ? (
                <Link className="digit-bread-crumb-content" onClick={() => handleRedirect(crumb?.externalLink)}>
                  {crumb?.icon && crumb.icon}
                  {crumb.content}
                </Link>
              ) : (
                <Link
                  to={{ pathname: crumb.internalLink, state: { count: crumb?.count }, search: crumb?.query }}
                  className={`digit-bread-crumb-content ${isLast(ci) ? "current" : "default"}`}
                >
                  {crumb?.icon && crumb.icon}
                  {crumb.content}
                </Link>
              )}
              {!isLast(ci) && (
                <div className="digit-bread-crumb-seperator">
                  {props?.customSeparator || "/"}
                </div>
              )}
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
};

BreadCrumbs.propTypes = {
  crumbs: PropTypes.array,
  className: PropTypes.string,
  style: PropTypes.object,
  spanStyle: PropTypes.object,
  customSeparator: PropTypes.element,
  maxItems: PropTypes.number,
  itemsAfterCollapse: PropTypes.number,
  itemsBeforeCollapse: PropTypes.number,
  expandText: PropTypes.string,
};

BreadCrumbs.defaultProps = { successful: true };

export default BreadCrumbs;
