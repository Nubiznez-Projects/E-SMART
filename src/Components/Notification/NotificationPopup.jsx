import React, { useEffect, useRef } from "react";
import "./NotificationPopup.css";
import { RxCross2 } from "react-icons/rx";

const NotificationPopup = ({ show, onClose, children, closeicon, module }) => {
  if (!show) {
    return null;
  }

  const componentRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={componentRef} className="modal-overlayn " onClick={onClose}>
      <div
        className={`modal-contentn  ${
          module == "profile"
            ? "bg-gray-200 w-[20vw] "
            : "p-[1.5vw] bg-white w-[25vw]"
        } `}
        // style={modalStyle}

        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default NotificationPopup;
