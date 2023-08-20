import React from "react";

export default function InspectionCancellation() {
  return (
    <div className="min-h-full bg-white border border-[#D5D7D8] flex flex-col justify-between rounded-[10px] p-6">
      <div className="flex flex-col gap-5">
        <h1 className="font-monts font-bold text-lg text-darkerGray underline">
          Inspection Task - Inspection Cancellation
        </h1>
        <div className="flex flex-col gap-2">
          <p className="font-monts text-sm text-darkerGray font-normal">
            Reason:{` `}
            <span className="font-bold">Others</span>
          </p>
          <p className="font-monts text-sm text-darkerGray font-normal">
            Remarks:{` `}
            <span className="">My dog died.</span>
          </p>
          <p className="font-monts text-sm text-darkerGray font-normal">
            Endorsed by:{` `}
            <span className="font-bold">ACD 1 on Thursday, 6/28/2023</span>
          </p>
          <p className="font-monts text-sm text-darkerGray font-normal">
            Do you approve the cancellation request?
          </p>
        </div>
      </div>
      <div className="flex flex-row flex-wrap justify-center gap-2">
        <button
          type="button"
          className="w-full md:w-fit flex items-center justify-center gap-2 cursor-pointer text-gray border bg-[#973C3C] border-[#973C3C] rounded-lg font-monts font-semibold text-sm text-white h-fit p-2.5"
        >
          No, I disapprove
        </button>
        <button
          type="button"
          className="w-full md:w-fit flex items-center justify-center gap-2 cursor-pointer text-gray border bg-primaryBlue border-primaryBlue rounded-lg font-monts font-semibold text-sm text-white h-fit p-2.5"
        >
          Yes, I approve
        </button>
      </div>
    </div>
  );
}
