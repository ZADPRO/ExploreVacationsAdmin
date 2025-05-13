import React, { useState, useEffect } from "react";
// import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { TiTickOutline } from "react-icons/ti";
import { decryptAPIResponse } from "../../utils";
import axios from "axios";

interface Notification {
  refNotificationsId: number;
  refSubject: string;
  refDescription: string;
  refNotes: string;
  refUserTypeId: string[];
}

const StaffNotification: React.FC = () => {
  const [_read, setRead] = useState<Notification[]>([]);
  const [readNotifications, setReadNotifications] = useState<Notification[]>(
    []
  );
  const [unReadNotifications, setUnReadNotifications] = useState<
    Notification[]
  >([]);
  const [_loading, setLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);

  const fetchReadData = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/notificationRoutes/staffNotifications",
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      const data = decryptAPIResponse(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );
      console.log("fetchReadData");
      console.log("fetchReadData------", data);
      if (data.success) {
        localStorage.setItem("token", "Bearer " + data.token);
        setReadNotifications(data.readNotification || []);
        setUnReadNotifications(data.unReadNotification || []);
        setRead(data.unReadNotification || []);
        console.log("fetchReadData------", data);
      }
    } catch (e: any) {
      console.log("Error fetching ReadData:", e);
    }
  };

  const fetchRead = async (refNotificationsId: string) => {
    console.log("packageID", refNotificationsId);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/notificationRoutes/updateReadStatus`,
        { refNotificationsId: refNotificationsId },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      const data = decryptAPIResponse(
        response.data[1],
        response.data[0],
        import.meta.env.VITE_ENCRYPTION_KEY
      );

      console.log("data---->fetchRead", data);

      if (data.success) {
        console.log("fetchRead:", data.tourDetails);
      } else {
        setError("Failed to fetch Reading.");
      }
    } catch (err) {
      setError("Error fetching reading.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadData();
  }, []);

  const markAsRead = (rowData: Notification) => {
    const isAlreadyRead = readNotifications.some(
      (item) => item.refNotificationsId === rowData.refNotificationsId
    );

    if (!isAlreadyRead) {
      setReadNotifications((prev) => [...prev, rowData]);
      setUnReadNotifications((prev) =>
        prev.filter(
          (item) => item.refNotificationsId !== rowData.refNotificationsId
        )
      );
      setRead((prev) =>
        prev.filter(
          (item) => item.refNotificationsId !== rowData.refNotificationsId
        )
      );

      fetchRead(rowData.refNotificationsId.toString());
    } else {
      // setUnReadNotifications((prev) => [...prev, rowData]);
      // setReadNotifications((prev) =>
      //   prev.filter(
      //     (item) => item.refNotificationsId !== rowData.refNotificationsId
      //   )
      // );
      // setRead((prev) => [...prev, rowData]);
    }
  };

  return (
    <div className="flex flex-col justify-between p-4">
      <h2 className="text-2xl font-semibold">Staff Notification</h2>
      <div className="flex flex-col gap-4 mt-4">
        <DataTable
          value={[...unReadNotifications, ...readNotifications]}
          tableStyle={{ minWidth: "50rem" }}
          paginator
          rows={4}
        >
          <Column
            header="S.No"
            headerStyle={{ width: "3rem" }}
            body={(_, options) => options.rowIndex + 1}
          />
          <Column
            headerStyle={{ width: "15rem" }}
            field="refSubject"
            header="Subject"
          />
          {/* <Column
            headerStyle={{ width: "15rem" }}
            field="refUserType"
            header="Employee Type"
            body={(rowData) =>
              Array.isArray(rowData.refUserType)
                ? rowData.refUserType.join(", ")
                : rowData.refUserType
            }
          /> */}
          <Column
            headerStyle={{ width: "15rem" }}
            field="refDescription"
            header="Description"
          />
          <Column
            field="refNotes"
            header="Notes"
            headerStyle={{ width: "15rem" }}
            body={(rowData) => {
              const isLink =
                typeof rowData.refNotes === "string" &&
                rowData.refNotes.startsWith("http");
              return isLink ? (
                <a
                  href={rowData.refNotes}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#326fd1] underline"
                >
                  {rowData.refNotes}
                </a>
              ) : (
                <span>{rowData.refNotes}</span>
              );
            }}
          />
          <Column
            header="Read"
            body={(rowData: Notification) => {
              const isRead = readNotifications.some(
                (item) => item.refNotificationsId === rowData.refNotificationsId
              );
              return (
                <button
                  onClick={() => !isRead && markAsRead(rowData)}
                  disabled={isRead}
                >
                  <TiTickOutline
                    className={`text-3xl cursor-pointer ${
                      isRead ? "text-[#00b50c96]" : "text-[#ef1e0796]"
                    }`}
                  />
                </button>
              );
            }}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default StaffNotification;
