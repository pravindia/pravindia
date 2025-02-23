import { CSSProperties, useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";

const cursorStye: CSSProperties = {
  backgroundColor: "#blue",
  height: "32px",
  width: "32px",
  borderRadius: "50%",
  position: "fixed",
  color:'white',
  boxShadow: "currentcolor -156px 0px 40px 2px",
  top: '0',
  left: '0',
  background: 'transperent',
  pointerEvents: "none",
  backfaceVisibility: 'hidden',
  overflow: 'hidden'
};

const Cursor = (props: {variants: Variants, curVariant: string}) => {
  return (
    <motion.div
      style={cursorStye}
      variants={props.variants}
      animate={props.curVariant}
      // transition={{ delay: 1 }}
    />
  );
};

export default Cursor;
