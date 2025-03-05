import React, { useEffect, useState ,Fragment} from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const BreadCrumb = (props) => {
  const [expanded, setExpanded] = useState(false);
  const [crumbsToDisplay, setCrumbsToDisplay] = useState([...props?.crumbs]);

  useEffect(() => {
    if (props?.maxItems && props?.crumbs.length > props?.maxItems && !expanded) {
      const startCrumbs = props.crumbs.slice(0, props?.itemsBeforeCollapse || Math.ceil(props.maxItems / 2));
      const endCrumbs = props.crumbs.slice(
        props.crumbs.length - (props?.itemsAfterCollapse || Math.floor(props.maxItems / 2))
      );
      let updatedCrumbs = startCrumbs.concat([{ show: true, content: props?.expandText || "..." }], endCrumbs);
      setCrumbsToDisplay(updatedCrumbs);
    } else {
      setCrumbsToDisplay([...props.crumbs]);
    }
  }, [props.crumbs, props.maxItems, expanded,props.itemsBeforeCollapse,props.itemsAfterCollapse,props?.expandText]);

  function isLast(index) {
    return index === crumbsToDisplay.length - 1;
  }

  const handleCrumbClick = () => {
    setExpanded(!expanded);
  };

  return (
    <ol
      className={`digit-bread-crumb ${
        props?.className ? props?.className : ""
      }`}
      style={props?.style}
    >
      {crumbsToDisplay?.map((crumb, ci) => {
        if (!crumb?.show) return null;
        if (crumb?.isBack)
          return (
            <li
              key={ci}
              style={props?.itemStyle}
              className={`digit-bread-crumb--item ${"back-crumb-item"}`}
            >
              <span onClick={() => window.history.back()}>{crumb.content}</span>
            </li>
          );
        return (
          <>
            <li
              key={ci}
              style={props?.itemStyle}
              className="digit-bread-crumb--item"
            >
              {isLast(ci) || !crumb?.path ? (
                <span
                  className={`digit-bread-crumb-content ${
                    isLast(ci) ? "current" : "default"
                  }`}
                  style={props?.spanStyle}
                  onClick={(crumb.content === "..."  || crumb.content === props?.expandText)? handleCrumbClick : null}
                >
                  {crumb?.icon && crumb.icon}
                  {crumb.content}
                </span>
              ) : (
                <Link
                  to={{ pathname: crumb.path, state: { count: crumb?.count } }}
                  className="digit-bread-crumb-content"
                >
                  {crumb?.icon && crumb.icon}
                  {crumb.content}
                </Link>
              )}
              {!isLast(ci) && (
                <div className="digit-bread-crumb-seperator">
                  {props?.customSeperator ? props?.customSeperator : "/"}
                </div>
              )}
            </li>
          </>
        );
      })}
    </ol>
  );
};

BreadCrumb.propTypes = {
  crumbs: PropTypes.array,
  className: PropTypes.string,
  style: PropTypes.object,
  spanStyle: PropTypes.object,
  customSeperator: PropTypes.element,
  maxItems:PropTypes.number,
  itemsAfterCollapse:PropTypes.number,
  itemsBeforeCollapse:PropTypes.number,
  expandText:PropTypes.string
};

BreadCrumb.defaultProps = {
  successful: true,
};

export default BreadCrumb;
