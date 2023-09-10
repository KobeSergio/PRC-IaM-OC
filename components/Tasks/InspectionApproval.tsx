import { Inspection } from "@/types/Inspection";
import React, { useState } from "react";
import { Spinner } from "../Spinner";

export default function InspectionApproval({
  inspectionData,
  decision,
  isLoading,
}: {
  inspectionData: Inspection;
  decision: any;
  isLoading: boolean;
}) {
  return (
    <div className="min-h-full bg-white border border-[#D5D7D8] flex flex-col justify-between rounded-[10px] p-6">
      <div className="flex flex-col gap-5">
        <h1 className="font-monts font-bold text-lg text-darkerGray underline">
          Inspection Task - Inspection Approval
        </h1>
        <div className="flex flex-col gap-2">
          <p className="font-monts text-sm text-darkerGray font-normal">
            The inspection date is at:{` `}
            <span className="font-bold">
              {formatDate(inspectionData.inspection_date)}
            </span>
          </p>
          <p className="font-monts text-sm text-darkerGray font-normal">
            Regional Office (RO):{` `}
            <span className="font-bold uppercase">
              {inspectionData.ro_details.office}
            </span>
          </p>
          <p className="font-monts text-sm text-darkerGray font-normal">
            Endorsed by:{` `}
            <span className="font-bold">{inspectionData.acd_details.name}</span>
          </p>
          <p className="font-monts text-sm text-darkerGray font-normal">
            Do you want to add the inspection to the current year?
          </p>
        </div>
      </div>
      <div className="flex flex-row flex-wrap justify-center gap-2">
        <button
          onClick={() => decision(0)}
          type="button"
          className="w-full md:w-fit flex items-center justify-center gap-2 cursor-pointer text-gray border bg-[#973C3C] border-[#973C3C] rounded-lg font-monts font-semibold text-sm text-white h-fit p-2.5"
        >
          {isLoading ? (
            <>
              <Spinner />
            </>
          ) : (
            <> No, I disapprove</>
          )}
        </button>
        <button
          onClick={() => decision(1)}
          type="button"
          className="w-full md:w-fit flex items-center justify-center gap-2 cursor-pointer text-gray border bg-primaryBlue border-primaryBlue rounded-lg font-monts font-semibold text-sm text-white h-fit p-2.5"
        >
          {isLoading ? (
            <>
              <Spinner />
            </>
          ) : (
            <> Yes, I approve</>
          )}
        </button>
      </div>
    </div>
  );
}

function formatDate(dateString: string) {
  // Create a new Date object from the date string
  const date = new Date(dateString);

  // Array of weekday names
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Get the name of the day of the week
  const dayName = weekdays[date.getDay()];

  // Get the year, month, and day
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based, so +1
  const day = String(date.getDate()).padStart(2, "0");

  // Return formatted date string
  return `${dayName}, ${year}/${month}/${day}`;
}
