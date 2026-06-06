import "@typespec/http";
import "@typespec/rest";

using TypeSpec.Http;
using TypeSpec.Rest;

namespace BookingApp.Models;

/**
 * Владелец календаря. Один заранее заданный профиль.
 */
model Owner {
  id: string;
  name: string;
  email: string;
}

/**
 * Тип события, создаваемый владельцем календаря.
 */
model EventType {
  id: string;
  name: string;
  description: string;
  durationMinutes: int32;
}

/**
 * Запрос на создание/обновление типа события.
 */
model EventTypeCreate {
  name: string;
  description: string;
  durationMinutes: int32;
}

/**
 * Свободный слот для бронирования.
 */
model Slot {
  startTime: utcDateTime;
  endTime: utcDateTime;
  available: boolean;
}

/**
 * Бронирование (встреча), созданное гостем.
 */
model Booking {
  id: string;
  eventTypeId: string;
  eventTypeName: string;
  guestName: string;
  startTime: utcDateTime;
  endTime: utcDateTime;
  status: BookingStatus;
}

/**
 * Статус бронирования.
 */
enum BookingStatus {
  confirmed,
}

/**
 * Запрос на создание бронирования от гостя.
 */
model BookingCreate {
  eventTypeId: string;
  guestName: string;
  startTime: utcDateTime;
}

/**
 * Публичное представление типа события для гостя.
 */
model EventTypePublic {
  id: string;
  name: string;
  description: string;
  durationMinutes: int32;
}

/**
 * Ошибка валидации.
 */
model ValidationError {
  code: string;
  message: string;
}

/**
 * Ответ с ошибкой.
 */
@error
model ErrorResponse {
  @statusCode statusCode: 400 | 404 | 409 | 500;
  error: ValidationError;
}
