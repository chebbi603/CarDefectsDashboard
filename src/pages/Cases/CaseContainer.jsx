import React from "react";
import { Outlet } from "react-router";
import { IconFolderSearch } from "@tabler/icons-react";

const CaseContainer = () => {
  return (
    <div className="flex flex-col gap-8 w-full h-full">
      <div className="dashboard-header flex flex-col gap-2 align-center pt-1">
        <div className="flex flex-row gap-2 align-center header-headline">
          <IconFolderSearch size={32} />
          <p className="text-2xl font-medium">Cases</p>
        </div>
        <p className="text-sm font-normal">Create and track cases progress</p>
      </div>
      <Outlet />
    </div>
  );
};
export default CaseContainer;
