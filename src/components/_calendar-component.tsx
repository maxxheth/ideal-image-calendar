import React, { useEffect, useState, useRef } from "react";
import { NewItemModal } from "~/components/new-item-modal";
import { EditItemModal } from "~/components/edit-item-modal";
import { api } from "~/utils/api";
import { Calendar } from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";

type CalendarComponentProps = {
  id: number;
};

type FormData = {
  // Define the shape of your form data here
};

export const CalendarComponent: React.FC<CalendarComponentProps> = ({ id }) => {
  const calendarRef = useRef<HTMLDivElement>(null);
  const [localSelectedDate, setLocalSelectedDate] = useState<string | null>(
    null,
  );
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const createItemMutation = api.item.createItem.useMutation();
  const getAllItemsQuery = api.item.getAllItems.useQuery({ enabled: true });

  useEffect(() => {
    if (getAllItemsQuery.data) {
      setFilteredItems(
        getAllItemsQuery.data.filter((item: any) => item.calendarId === id),
      );
    }
  }, [getAllItemsQuery.data, id]);

  useEffect(() => {
    const calendarEl = calendarRef.current;
    if (!calendarEl) return;

    const calendar = new Calendar(calendarEl, {
      plugins: [interactionPlugin, dayGridPlugin],
      initialView: "dayGridMonth",
      events: filteredItems.map((item: any) => {
        const date = new Date(item.date);
        date.setDate(date.getDate() + 1);
        return {
          title: item.title,
          start: date.toISOString(),
        };
      }),
      dateClick: (arg) => {
        const isoDateTime = `${arg.dateStr}T00:00:00.000Z`;
        setLocalSelectedDate(isoDateTime);
      },
      eventClick: (info) => {
        const clickedItem = filteredItems.find((item: any) => {
          const isTitleMatch = item.title === info.event.title;
          const isDateMatch =
            new Date(item.date).toISOString() ===
            info.event.start.toISOString();
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
    const allFormData = {
      ...formData,
      date: localSelectedDate,
      calendarId: id,
    };

    try {
      const response = await createItemMutation.mutateAsync(allFormData);
      if (response?.id) {
        setFilteredItems([...filteredItems, response]);
      }
    } catch (error) {
      console.error("Error creating item:", error);
    }
  };

  return (
    <div>
      <h1>Calendar</h1>
      <div ref={calendarRef}></div>
      <NewItemModal
        showModal={localSelectedDate !== null && editingItem === null}
        onClose={() => setLocalSelectedDate(null)}
        calendarId={id}
        handleSubmit={handleSubmit}
      />
      <EditItemModal
        showModal={editingItem !== null}
        onClose={() => setEditingItem(null)}
        calendarId={id}
        existingItem={editingItem}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};
