import React, { useEffect, useState, useRef } from "react";
import { NewItemModal } from "~/components/new-item-modal";
import { EditItemModal } from "~/components/edit-item-modal";
import { api } from "~/utils/api";
import { Calendar } from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";

interface CalendarComponentProps {
  id: number;
}

interface Item {
  title: string;
  date: string;
  calendarId: number;
  id?: number; // Assuming the id might be optional
}

interface FormData {
  title: string;
  status: "PLANNED" | "BRIEFED" | "IN_PROGRESS" | "COMPLETED";
  color: string;
  channelType: "EMAIL" | "TEXT" | "OTHER";
  channelId: string;
  leadForecast: number;
  leadActual: number;
  calendarId: number;
  date: string;
}

export const CalendarComponent: React.FC<CalendarComponentProps> = ({ id }) => {
  const calendarRef = useRef<HTMLDivElement>(null);
  const [localSelectedDate, setLocalSelectedDate] = useState<string | null>(
    null,
  );
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const createItemMutation = api.item.createItem.useMutation();
  const getAllItemsQuery = api.item.getAllItems.useQuery({ enabled: true });

  useEffect(() => {
    if (getAllItemsQuery.data) {
      setFilteredItems(
        getAllItemsQuery.data.filter((item: Item) => item.calendarId === id),
      );
    }
  }, [getAllItemsQuery.data, id]);

  useEffect(() => {
    const calendarEl = calendarRef.current;
    if (!calendarEl) return;

    const calendar = new Calendar(calendarEl, {
      plugins: [interactionPlugin, dayGridPlugin],
      initialView: "dayGridMonth",
      events: filteredItems.map((item: Item) => {
        const date = new Date(item.date);
        date.setDate(date.getDate() + 1);
        return {
          title: item.title,
          start: date.toISOString(),
        };
      }),
      dateClick: (arg) => {
        console.log("date clicked!");
        const isoDateTime = `${arg.dateStr}T00:00:00.000Z`;

        setLocalSelectedDate(isoDateTime);
      },
      eventClick: (info) => {
        const clickedItem = filteredItems.find((item: Item) => {
          const eventDate = new Date(info.event.start.toISOString());
          const itemDate = new Date(item.date);

          // Step 1: Parse itemDate
          const parsedItemDate = new Date(itemDate);

          // Step 2: Parse eventDate
          const parsedEventDate = new Date(eventDate);

          // Step 3: Calculate the difference in days
          const diffInDays = Math.floor(
            (parsedEventDate - parsedItemDate) / (1000 * 60 * 60 * 24),
          );

          // Decrement eventDate by the difference in days
          parsedEventDate.setDate(parsedEventDate.getDate() - diffInDays);

          // Convert the decremented eventDate back to a string if needed
          const decrementedEventDateStr = parsedEventDate.toISOString();

          // Convert both dates to midnight in UTC
          parsedEventDate.setUTCHours(0, 0, 0, 0);
          parsedItemDate.setUTCHours(0, 0, 0, 0);

          const isTitleMatch = item.title === info.event.title;
          const isDateMatch =
            parsedEventDate.getTime() === parsedItemDate.getTime();

          return isTitleMatch && isDateMatch;
        });

        if (clickedItem) {
          console.log("Matched item:", clickedItem);
        }

        setEditingItem(clickedItem);
        setLocalSelectedDate(info.event.start.toISOString());
      },

      eventClassNames: "cursor-pointer",
    });

    calendar.render();

    return () => {
      calendar.destroy();
    };
  }, [filteredItems]);

  const handleSubmit = async (formData: FormData) => {
    try {
      formData.date = new Date(localSelectedDate).toISOString();
      const response = await createItemMutation.mutateAsync(formData);
      if (response?.id) {
        setFilteredItems([...filteredItems, response]);
      }
    } catch (error) {
      console.error("Error creating item:", error);
    }
  };

  const handleNewItemModalClose = () => {
    setLocalSelectedDate(null);
    setEditingItem(null); // Close EditItemModal if it's open
  };

  const handleEditItemModalClose = () => {
    setEditingItem(null);
    setLocalSelectedDate(null); // Close NewItemModal if it's open
  };

  return (
    <div>
      <h1>Calendar</h1>
      <div ref={calendarRef}></div>
      <NewItemModal
        showModal={localSelectedDate !== null && editingItem === null}
        onClose={handleNewItemModalClose}
        calendarId={id}
        handleSubmit={handleSubmit}
      />
      <EditItemModal
        showModal={editingItem !== null}
        onClose={handleEditItemModalClose}
        calendarId={id}
        existingItem={editingItem}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};
