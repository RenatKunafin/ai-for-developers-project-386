import "@typespec/http";
import "@typespec/rest";
import "./models.tsp";

using TypeSpec.Http;
using TypeSpec.Rest;
using BookingApp.Models;

@route("/")
namespace BookingApp.Public;

/**
 * Получить публичный список типов событий.
 */
@get
@route("event-types")
op listPublicEventTypes(): EventTypePublic[];

/**
 * Получить публичную информацию о типе события.
 */
@get
@route("event-types/{id}")
op getPublicEventType(@path id: string): EventTypePublic | ErrorResponse;

/**
 * Получить доступные слоты для типа события.
 * Слоты формируются на 14 дней, начиная с текущей даты.
 * Недоступные (занятые) слоты могут отсутствовать в ответе или иметь available: false.
 */
@get
@route("event-types/{id}/slots")
op getAvailableSlots(
  @path id: string,
  @query from?: utcDateTime,
  @query to?: utcDateTime,
  @query date?: utcDateTime,
): Slot[] | ErrorResponse;

/**
 * Создать бронирование.
 * Ограничения:
 * - Слот должен быть в окне 14 дней от текущей даты.
 * - На одно и то же время нельзя создать две записи (даже разные типы событий).
 */
@post
@route("bookings")
op createBooking(@body body: BookingCreate): {
  @statusCode statusCode: 201;
  @body booking: Booking;
} | ErrorResponse;
