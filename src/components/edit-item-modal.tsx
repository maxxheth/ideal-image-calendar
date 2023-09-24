import React, { useState, useEffect } from "react";
import { animated, useSpring } from "react-spring";
import { api, RouterInputs } from "~/utils/api";
import { useAtom } from "jotai";

type EditItemModalProps = {
  showModal: boolean;
  onClose: () => void;
  calendarId: number;
  existingItem: any;
  handleSubmit: (formData: any) => void;
};

export const EditItemModal: React.FC<EditItemModalProps> = ({
  showModal,
  onClose,
  calendarId,
  existingItem,
  handleSubmit,
}) => {
  const [title, setTitle] = useState(existingItem ? existingItem.title : "");
  const [status, setStatus] = useState(
    existingItem ? existingItem.status : "PLANNED",
  );
  const [color, setColor] = useState(
    existingItem ? existingItem.color : "#000000",
  );
  const [channelType, setChannelType] = useState(
    existingItem ? existingItem.channelType : "EMAIL",
  );
  const [channelId, setChannelId] = useState(
    existingItem ? existingItem.channelId : "",
  );
  const [leadForecast, setLeadForecast] = useState(
    existingItem ? existingItem.leadForecast : 0,
  );
  const [leadActual, setLeadActual] = useState(
    existingItem ? existingItem.leadActual : 0,
  );

  useEffect(() => {
    if (!existingItem) return;
    setTitle(existingItem.title);
    setStatus(existingItem.status);
    setColor(existingItem.color);
    setChannelType(existingItem.channelType);
    setChannelId(existingItem.channelId);
    setLeadForecast(existingItem.leadForecast);
    setLeadActual(existingItem.leadActual);
  }, [existingItem]);

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
    <animated.div style={fadeStyles}>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="mx-auto overflow-hidden rounded-lg bg-white shadow-xl sm:w-full sm:max-w-xl">
            <div className="relative p-6">
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 rounded-lg bg-red-500 p-1 text-center text-white"
              >
                X
              </button>
              <h3 className="text-secondary-900 text-lg font-medium">
                Edit Item
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
                    onChange={(e) => setStatus(e.target.value)}
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
                    onChange={(e) => setChannelType(e.target.value)}
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
                    type="number"
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
                    type="number"
                    id="leadActual"
                    required
                    className="focus:border-primary-400 focus:ring-primary-200 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
                    value={leadActual}
                    onChange={(e) => setLeadActual(Number(e.target.value))}
                  />
                </div>
                <button
                  type="submit"
                  className="border-primary-500 bg-primary-500 hover:border-primary-700 hover:bg-primary-700 focus:ring-primary-200 rounded-lg border px-5 py-2.5 text-center text-sm font-medium text-white shadow-sm transition-all focus:ring"
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
