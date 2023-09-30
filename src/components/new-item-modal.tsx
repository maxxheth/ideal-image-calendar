import React, { useState } from "react";
import { animated, useSpring } from "react-spring";
import { type FormData } from "./calendar-component";
import { type Status, type ChannelType } from "@prisma/client";
import { type SetStateAction } from "jotai";

// type FormDataType = {
//   title: string;
//   status: string;
//   color: string;
//   channelType: string;
//   channelId: string;
//   leadForecast: number;
//   leadActual: number;
//   calendarId: number;
// };

type existingItemType = {
  id: number;
  title: string;
  status: string;
  color: string;
  channelType: string;
  channelId: string;
  leadForecast: number;
  leadActual: number;
};

type NewItemModalProps = {
  showModal: boolean;
  onClose: () => void;
  calendarId: number;
  handleSubmit: (formData: FormData) => Promise<void>;
};

export const NewItemModal: React.FC<NewItemModalProps> = ({
  showModal,
  onClose,
  calendarId,
  handleSubmit,
}) => {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<Status>("PLANNED");
  const [color, setColor] = useState("#000000");
  const [channelType, setChannelType] = useState<ChannelType>("EMAIL");
  const [channelId, setChannelId] = useState("");
  const [leadForecast, setLeadForecast] = useState(0);
  const [leadActual, setLeadActual] = useState(0);

  const fadeStyles = useSpring({
    opacity: showModal ? 1 : 0,
    transform: showModal ? "translate(-50%, -50%)" : "translate(-50%, -100%)",
    left: "50%",
    top: "50%",
    position: "fixed",
    width: "22rem",
    zIndex: 2000,
  });

  const formSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      title,
      status,
      color,
      channelType,
      channelId,
      leadForecast,
      leadActual,
      calendarId,
    };
    handleSubmit(formData);
    onClose();
  };

  return (
    <animated.div style={fadeStyles as any}>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="mx-auto overflow-hidden rounded-lg bg-white shadow-xl sm:w-full sm:max-w-xl">
            <div className="relative p-6">
              <button
                type="button"
                onClick={() => {
                  console.log("close");
                  onClose();
                }}
                className="absolute right-4 top-4 rounded-lg bg-red-500 p-1 text-center text-white"
              >
                X
              </button>
              <h3 className="text-secondary-900 text-lg font-medium">
                Add New Item
              </h3>
              <form onSubmit={formSubmit} className="mt-2 space-y-5">
                <div>
                  <label
                    htmlFor="title"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    required
                    className="focus:border-primary-400 focus:ring-primary-200 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="status"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as SetStateAction<Status>)
                    }
                    className="focus:border-primary-400 focus:ring-primary-200 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
                  >
                    <option value="PLANNED">Planned</option>
                    <option value="BRIEFED">Briefed</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="color"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Color
                  </label>
                  <input
                    type="color"
                    id="color"
                    required
                    className="focus:border-primary-400 focus:ring-primary-200 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="channelType"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Channel Type
                  </label>
                  <select
                    id="channelType"
                    name="channelType"
                    value={channelType}
                    onChange={(e) =>
                      setChannelType(
                        e.target.value as SetStateAction<ChannelType>,
                      )
                    }
                    className="focus:border-primary-400 focus:ring-primary-200 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
                  >
                    <option value="EMAIL">Email</option>
                    <option value="TEXT">Text</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="channelId"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Channel ID
                  </label>
                  <input
                    type="text"
                    id="channelId"
                    required
                    className="focus:border-primary-400 focus:ring-primary-200 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
                    value={channelId}
                    onChange={(e) => setChannelId(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    htmlFor="leadForecast"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Lead Forecast
                  </label>
                  <input
                    type="text"
                    pattern="\d*"
                    id="leadForecast"
                    required
                    className="focus:border-primary-400 focus:ring-primary-200 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
                    value={leadForecast}
                    onChange={(e) => setLeadForecast(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label
                    htmlFor="leadActual"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Lead Actual
                  </label>
                  <input
                    type="text"
                    pattern="\d*"
                    id="leadActual"
                    required
                    className="focus:border-primary-400 focus:ring-primary-200 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
                    value={leadActual}
                    onChange={(e) => setLeadActual(Number(e.target.value))}
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-lg border border-blue-500 bg-blue-500 px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all hover:border-blue-700 hover:bg-blue-700 focus:ring focus:ring-blue-200"
                >
                  Add
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </animated.div>
  );
};
