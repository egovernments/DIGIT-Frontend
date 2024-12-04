import React, { useState } from "react";
import { FormStep } from "@egovernments/digit-ui-react-components";

const ComplaintComment = ({ t, config, onSelect, value }) => {
  const [comment, setComment] = useState(() => {
    const { comment } = value || {};
    return comment || "";
  });

  const makeApiCall = async (commentText) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/categorize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ complaint: commentText }),
      });

      if (response.ok) {
        const result = await response.json();

        // Construct the complaintType and subType objects exactly as in the screenshot
        const complaintType = {
          key: result?.category?.type || "Unknown",
          name: result?.category?.type || "Unknown",
        };

        const subType = {
          key: result?.category?.subtype || "Unknown",
          name: result?.category?.subtype || "Unknown",
        };

        // Store in sessionStorage
        sessionStorage.setItem("complaintType", JSON.stringify(complaintType));
        sessionStorage.setItem("subType", JSON.stringify(subType));

        console.log("Complaint Type:", complaintType);
        console.log("Complaint SubType:", subType);

        // Trigger the next step
        goNext(commentText, complaintType, subType);
      } else {
        console.error("Failed to fetch complaint category:", response.statusText);

        // Handle error by using fallback values
        const complaintType = { key: "Error", name: "Error" };
        const subType = { key: "Error", name: "Error" };

        sessionStorage.setItem("complaintType", JSON.stringify(complaintType));
        sessionStorage.setItem("subType", JSON.stringify(subType));

        goNext(commentText, complaintType, subType);
      }
    } catch (error) {
      console.error("Error during API call:", error);

      // Handle API errors gracefully
      const complaintType = { key: "Error", name: "Error" };
      const subType = { key: "Error", name: "Error" };

      sessionStorage.setItem("complaintType", JSON.stringify(complaintType));
      sessionStorage.setItem("subType", JSON.stringify(subType));

      goNext(commentText, complaintType, subType);
    }
  };

  const goNext = (commentText, complaintType, subType) => {
    onSelect({
      comment: commentText,
      complaintType,
      subType,
    });
  };

  const handleNext = () => {
    if (comment.trim()) {
      makeApiCall(comment);
    } else {
      console.warn("Comment is empty. Skipping API call.");
      const complaintType = { key: "Others", name: "Others" };
      const subType = { key: "Others", name: "Others" };

      sessionStorage.setItem("complaintType", JSON.stringify(complaintType));
      sessionStorage.setItem("subType", JSON.stringify(subType));

      goNext("", complaintType, subType);
    }
  };

  const onChange = (event) => {
    const { value } = event.target;
    setComment(value);
  };

  return (
    <FormStep
      config={config}
      onChange={onChange}
      onSelect={handleNext}
      value={comment}
      t={t}
    />
  );
};

export default ComplaintComment;
