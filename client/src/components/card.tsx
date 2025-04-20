import React from "react";
import classNames from "classnames";

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={classNames("bg-white shadow-md rounded-2xl border p-4", className)}>
      {children}
    </div>
  );
};

export const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={classNames("p-2", className)}>{children}</div>;
};
