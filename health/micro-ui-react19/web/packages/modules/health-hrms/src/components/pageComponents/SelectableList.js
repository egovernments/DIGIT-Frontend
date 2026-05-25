import React, { useState } from "react";

export default function SelectableList({ selectableList, onSelect }) {
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleSelect = (userId) => {
    
    setSelectedUserId(userId);
    if (onSelect) {
      onSelect(userId); // send id back to parent
    }
  };


  // return <div>HEHEEH</div>

  return (
    <div>
      {selectableList.map((user) => (
        <div
          key={user.id}
          onClick={() => handleSelect(user)}
          style={{
            cursor: "pointer",
            padding: "10px",
            marginBottom: "5px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: user.id === selectedUserId?.id ? "lightgrey" : "white",
          }}
        >
          {user?.name?.givenName || ""}
        </div>
      ))}
    </div>
  );
}
