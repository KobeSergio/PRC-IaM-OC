"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import InspectionApproval from "@/components/Tasks/InspectionApproval";
import InspectionCancellation from "@/components/Tasks/InspectionCancellation";
import { useState, useEffect } from "react";
import { BsPencil, BsX } from "react-icons/bs";
import Firebase from "@/lib/firebase";
import { Inspection } from "@/types/Inspection";
import { Client } from "@/types/Client";
import { useSession } from "next-auth/react";
import { Log } from "@/types/Log";
import PendingWaiting from "@/components/Tasks/PendingWaiting";
import { extractFilenameFromFirebaseURL } from "@/lib/filenameExtractor";
import { formatDateToDash } from "@/lib/formatDates";
import InspectionSummary from "@/components/Tasks/InspectionSummary";
const firebase = new Firebase();

export default function Page({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(false);

  const { data }: any = useSession();
  const [inspectionData, setInspectionData] = useState<Inspection>(
    {} as Inspection
  );

  useEffect(() => {
    if (params.id) {
      firebase
        .getInspection(params.id as string)
        .then((data) => {
          if (data == null) return;
          setInspectionData(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [params.id]);

  const handleCancellationApproval = async (decision: number) => {
    if (
      !confirm(
        `Are you sure you want to ${
          decision == 0 ? "not approve" : "approve"
        } this inspection cancellation?`
      )
    ) {
      return;
    }

    setIsLoading(true);

    let inspection: Inspection = {} as Inspection;
    let log: Log = {} as Log;

    if (decision == 0) {
      //Continue with the inspection
      //Previous inspection_task
      const previousInspectionTask = inspectionData.inspection_task
        .split("<")[1]
        .split("/")[2]
        .replace(">", "");

      inspection = {
        ...inspectionData,
        inspection_task: previousInspectionTask,
      };

      log = {
        log_id: "",
        timestamp: new Date().toLocaleString(),
        client_details: inspectionData.client_details as Client,
        author_details: inspectionData.oc_details,
        action: "Cancelled cancellation approval",
        author_type: "",
        author_id: "",
      };
    } else if (decision == 1) {
      //Mark as cancelled
      inspection = {
        ...inspectionData,
        inspection_task: "Cancelled",
        status: "Cancelled",
      };

      log = {
        log_id: "",
        timestamp: new Date().toLocaleString(),
        client_details: inspectionData.client_details as Client,
        author_details: inspectionData.oc_details,
        action: "Accomplished cancellation approval",
        author_type: "",
        author_id: "",
      };
    }

    await firebase.createLog(log, data.acd_id);
    await firebase.updateInspection(inspection);
    setInspectionData(inspection);
    setIsLoading(false);
  };

  const handleScheduleApproval = async (decision: Number) => {
    if (
      !confirm(
        `Are you sure you want to ${
          decision == 0 ? "not approve" : "approve"
        } this inspection forward?`
      )
    ) {
      console.log("first");
      return;
    }

    setIsLoading(true);

    let inspection: Inspection = {} as Inspection;
    let log: Log = {} as Log;
    if (decision == 0) {
      inspection = {
        ...inspectionData,
        inspection_task: "Inspection declined",
        status: "Cancelled",
      };

      log = {
        log_id: "",
        timestamp: new Date().toLocaleString(),
        client_details: inspectionData.client_details as Client,
        author_details: inspectionData.oc_details,
        action: "Cancelled inspection approval",
        author_type: "",
        author_id: "",
      };
    } else if (decision == 1) {
      //Make inspection for NIM
      inspection = {
        ...inspectionData,
        inspection_task: `For NIM <${formatDateToDash(
          new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        )}>`,
        status: "Additional",
      };
      log = {
        log_id: "",
        timestamp: new Date().toLocaleString(),
        client_details: inspectionData.client_details as Client,
        author_details: inspectionData.oc_details,
        action: "Accomplished inspection approval",
        author_type: "",
        author_id: "",
      };
    }

    await firebase.createLog(log, data.oc_id);
    await firebase.updateInspection(inspection);
    setInspectionData(inspection);
    setIsLoading(false);
  };

  if (Object.keys(inspectionData).length == 0) return <></>;

  const breadcrumbItems = [
    {
      name: "Home",
      route: "/dashboard",
    },
    {
      name: inspectionData.client_details.name,
    },
  ];

  const task = inspectionData.inspection_task.toLowerCase();

  return (
    <>
      <div className="min-h-[75vh] w-full flex flex-col gap-5">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="w-full bg-white border border-[#D5D7D8] flex flex-col rounded-[10px] p-6 gap-2">
          <div className="flex flex-row justify-between items-center">
            <h1 className="font-monts font-bold text-lg text-darkerGray">
              Inspection Details
            </h1>
          </div>
          <div className="flex flex-col lg:flex-row justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h6 className="font-monts text-sm font-semibold text-darkGray">
                Name
              </h6>
              <p className="font-monts text-sm font-semibold text-darkerGray">
                {inspectionData.client_details.name}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <h6 className="font-monts text-sm font-semibold text-darkGray">
                Type
              </h6>
              <p className="font-monts text-sm font-semibold text-darkerGray">
                {inspectionData.client_details.type}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <h6 className="font-monts text-sm font-semibold text-darkGray">
                Location
              </h6>
              <p className="font-monts text-sm font-semibold text-darkerGray">
                {inspectionData.client_details.address}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <h6 className="font-monts text-sm font-semibold text-darkGray">
                Email
              </h6>
              <p className="font-monts text-sm font-semibold text-primaryBlue hover:underline">
                {inspectionData.client_details.email}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <h6 className="font-monts text-sm font-semibold text-darkGray">
                Mode
              </h6>
              <p className="font-monts text-sm font-semibold text-darkerGray">
                {inspectionData.inspection_mode}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <h6 className="font-monts text-sm font-semibold text-darkGray">
                Date Issued
              </h6>
              <p className="font-monts text-sm font-semibold text-darkerGray">
                {formatDateToDash(new Date(inspectionData.createdAt))}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <h6 className="font-monts text-sm font-semibold text-darkGray">
                Inspection Date
              </h6>
              <p className="font-monts text-sm font-semibold text-darkerGray">
                {inspectionData.inspection_task == "Scheduling"
                  ? "TBD"
                  : inspectionData.inspection_date}
              </p>
            </div>
          </div>
          <div className="flex w-full justify-between mt-4">
            {inspectionData.inspection_TO !== "" && (
              <h6 className="font-monts text-sm font-semibold text-darkerGray">
                Travel Order:{" "}
                <a
                  className="text-primaryBlue"
                  href={inspectionData.inspection_TO}
                  target="_blank"
                >
                  #
                  {extractFilenameFromFirebaseURL(inspectionData.inspection_TO)}
                </a>
              </h6>
            )}
            {inspectionData.inspection_COC !== "" && (
              <a
                href={inspectionData.inspection_COC}
                target="_blank"
                className="font-monts text-sm font-semibold text-primaryBlue underline"
              >
                Certificate of Compliance is valid until{" "}
                {
                  //Add 5 years to the fulfilledAt date
                  formatDateToDash(
                    new Date(
                      new Date(inspectionData.fulfilledAt).setFullYear(
                        new Date(inspectionData.fulfilledAt).getFullYear() + 3
                      )
                    )
                  )
                }
              </a>
            )}
          </div>
        </div>

        {task.includes("inspection approval") ? (
          <InspectionApproval
            inspectionData={inspectionData}
            decision={handleScheduleApproval}
            isLoading={isLoading}
          />
        ) : task.includes("cancellation approval") ? (
          <InspectionCancellation
            inspectionData={inspectionData}
            decision={handleCancellationApproval}
            isLoading={isLoading}
          />
        ) : task.includes("finished") ? (
          <>
            <InspectionSummary inspectionDetails={inspectionData} />
          </>
        ) : (
          <PendingWaiting task={task} />
        )}
      </div>
    </>
  );
}
