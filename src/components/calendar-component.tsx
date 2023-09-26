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
  id?: number;
  leadForecast: number;
  leadActual: number;
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
  const [localSelectedDate, setLocalSelectedDate] = useState<string | null>(null);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [totalForecastLeads, setTotalForecastLeads] = useState<number>(0);
  const [selectedItemInfo, setSelectedItemInfo] = useState<{ actual: number, forecast: number } | null>(null);

  const createItemMutation = api.item.createItem.useMutation();
  const getAllItemsQuery = api.item.getAllItems.useQuery({ enabled: true });

  useEffect(() => {
    if (getAllItemsQuery.data) {
      setFilteredItems(getAllItemsQuery.data.filter((item: Item) => item.calendarId === id));
    }
  }, [getAllItemsQuery.data, id]);

  useEffect(() => {
    const total = filteredItems.reduce((acc, item) => acc + item.leadForecast, 0);
    setTotalForecastLeads(total);
  }, [filteredItems]);

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
          title: `${item.title} (${item.leadForecast})`,
          start: date.toISOString(),
          originalTitle: item.title,
        };
      }),
      dateClick: (arg) => {
        const isoDateTime = `${arg.dateStr}T00:00:00.000Z`;
        setLocalSelectedDate(isoDateTime);
      },
      eventClick: (info) => {
        const clickedItem = filteredItems.find((item: Item) => {
          const eventDate = new Date(info.event.start.toISOString());
          const itemDate = new Date(item.date);
          const parsedItemDate = new Date(itemDate);
          const parsedEventDate = new Date(eventDate);
          const diffInDays = Math.floor((parsedEventDate - parsedItemDate) / (1000 * 60 * 60 * 24));
          parsedEventDate.setDate(parsedEventDate.getDate() - diffInDays);
          parsedEventDate.setUTCHours(0, 0, 0, 0);
          parsedItemDate.setUTCHours(0, 0, 0, 0);
          const isTitleMatch = item.title === info.event.extendedProps.originalTitle;
          const isDateMatch = parsedEventDate.getTime() === parsedItemDate.getTime();

          console.log({isTitleMatch, isDateMatch, parsedEventDateGetTime: parsedEventDate.getTime() , parsedItemDateGetTime: parsedItemDate.getTime(), parsedEventDate, parsedItemDate});
          return isTitleMatch && isDateMatch;
        });
        console.log({clickedItem});
        if (clickedItem) {
          setSelectedItemInfo({ actual: clickedItem.leadActual, forecast: clickedItem.leadForecast });
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
    formData.date = new Date(localSelectedDate).toISOString();
    const response = await createItemMutation.mutateAsync(formData);
    if (response?.id) {
      setFilteredItems([...filteredItems, response]);
    }
  };

  const handleNewItemModalClose = () => {
    setLocalSelectedDate(null);
    setEditingItem(null);
  };

  const handleEditItemModalClose = () => {
    setEditingItem(null);
    setLocalSelectedDate(null);
  };

  return (
    <div>
      <h1>Calendar</h1>
      <div style={{ width: "87%" }} ref={calendarRef}></div>
      <div className="lead-info">
        Total Forecast Leads: {totalForecastLeads}
        {selectedItemInfo && (
          <span> | Selected Item: Actual Leads: {selectedItemInfo.actual}, Forecast Leads: {selectedItemInfo.forecast}</span>
        )}
      </div>
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
      <style jsx>{`
        .lead-info {
          width: 100%;
          text-align: center;
          background-color: #f2f2f2;
          padding: 10px;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

