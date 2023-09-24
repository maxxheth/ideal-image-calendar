import React, { useState } from "react";
import { animated, useSpring } from "react-spring";
import { api, type RouterInputs } from "~/utils/api";
import { useAtom } from "jotai";
import { newItemIdAtom } from "~/atoms/new-item-id-atom"; // Adjust the import path as needed

// Inside the NewItemModal component

type NewItemModalProps = {
  showModal: boolean;
  onClose: () => void;
  calendarId: number;
  selectedDate: string;
};

export const NewItemModal: React.FC<NewItemModalProps> = ({
  showModal,
  onClose,
  selectedDate,
  calendarId,
}) => {
  const [_, setNewItemId] = useAtom(newItemIdAtom);

  const fadeStyles = useSpring({
    opacity: showModal ? 1 : 0,
    transform: showModal ? "translate(-50%, -50%)" : "translate(-50%, -100%)",
    left: "50%",
    top: "50%",
    position: "fixed",
    width: "22rem",
    zIndex: 2000,
  });

  const [title, setTitle] = useState("");
  const [status, setStatus] =
    useState<RouterInputs["item"]["createItem"]["status"]>("PLANNED");
  const [color, setColor] = useState("");
  const [channelType, setChannelType] = useState("EMAIL");
  const [channelId, setChannelId] = useState("");
  const [leadForecast, setLeadForecast] = useState(0);
  const [leadActual, setLeadActual] = useState(0);

  const createItemMutation = api.item.createItem.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    performance.mark("handleSubmit:start");

    console.time("handleDateClick");

    console.log({ selectedDate });
    try {
      const response = await createItemMutation.mutateAsync({
        title,
        status,
        color,
        channelType,
        channelId,
        leadForecast,
        leadActual,
        date: selectedDate,
        calendarId,
      });

      // Assuming the response object has an 'id' field for the new item
      if (response && response.id) {
        // Update the Jotai atom with the new item's ID
        setNewItemId(response.id);
      }

      onClose();

      performance.mark("handleSubmit:end");
      performance.measure(
        "handleSubmit",
        "handleSubmit:start",
        "handleSubmit:end",
      );
      console.timeEnd("handleDateClick");
    } catch (error) {
      console.error("Error creating item:", error);
    }
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
                Add New Item
              </h3>
              <form onSubmit={handleSubmit} className="mt-2 space-y-5">
                <div>
                  <label
                    htmlFor="title"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    className="focus:border-primary-400 focus:ring-primary-200 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
                    placeholder="Item Title"
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
                      setStatus(
                        e.target
                          .value as RouterInputs["item"]["createItem"]["status"],
                      )
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
                    name="color"
                    id="color"
                    required
                    className="focus:border-primary-400 focus:ring-primary-200 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                  <span>Chosen color: {color}</span>
                </div>
                <div>
                  <label
                    htmlFor="channelType"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Channel Type
                  </label>
                  <select
                    name="channelType"
                    id="channelType"
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
                    name="channelId"
                    id="channelId"
                    required
                    className="focus:border-primary-400 focus:ring-primary-200 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
                    placeholder="Channel ID"
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
                    name="leadForecast"
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
                    name="leadActual"
                    id="leadActual"
                    required
                    className="focus:border-primary-400 focus:ring-primary-200 block w-full rounded-md border-gray-300 shadow-sm focus:ring focus:ring-opacity-50"
                    value={leadActual}
                    onChange={(e) => setLeadActual(Number(e.target.value))}
                  />
                </div>
                <button
                  type="submit"
                  className="border-primary-500 bg-primary-500 hover:border-primary-700 hover:bg-primary-700 focus:ring-primary-200 rounded-lg border px-5 py-2.5 text-center text-sm font-medium text-black shadow-sm transition-all focus:ring"
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
