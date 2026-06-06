import "@typespec/http";
import "@typespec/rest";
import "./models.tsp";

using TypeSpec.Http;
using TypeSpec.Rest;
using BookingApp.Models;

@route("/admin")
namespace BookingApp.Admin;

/**
 * Получить профиль владельца календаря.
 */
@get
@route("/owner")
op getOwner(): Owner;

/**
 * Получить список всех типов событий владельца.
 */
@get
@route("/event-types")
op listEventTypes(): EventType[];

/**
 * Создать новый тип события.
 */
@post
@route("/event-types")
op createEventType(@body body: EventTypeCreate): {
  @statusCode statusCode: 201;
  @body eventType: EventType;
} | ErrorResponse;

/**
 * Получить тип события по ID.
 */
@get
@route("/event-types/{id}")
op getEventType(@path id: string): EventType | ErrorResponse;

/**
 * Обновить тип события.
 */
@put
@route("/event-types/{id}")
op updateEventType(@path id: string, @body body: EventTypeCreate): EventType | ErrorResponse;

/**
 * Удалить тип события.
 */
@delete
@route("/event-types/{id}")
op deleteEventType(@path id: string): {
  @statusCode statusCode: 204;
} | ErrorResponse;

/**
 * Получить список всех бронирований (всех типов событий).
 */
@get
@route("/bookings")
op listBookings(
  @query from?: utcDateTime,
  @query to?: utcDateTime,
  @query upcoming?: boolean,
): Booking[];
