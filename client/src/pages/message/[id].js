import React from "react";
import LeftSide from "../../components/message/LeftSide";
import RightSide from "../../components/message/RightSide";

const Conversation = () => {
  return (
    <div className="message message--chat d-flex">
      <div className="message_left_side col-md-4 px-0" style={{ borderRight: "1px solid #ddd" }}>
        <LeftSide />
      </div>

      <div className="message_right_side col-md-8 px-0">
        <RightSide /> 
      </div>
    </div>
  );
};

export default Conversation;
