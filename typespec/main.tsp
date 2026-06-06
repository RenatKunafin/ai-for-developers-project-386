import "@typespec/http";
import "@typespec/rest";
import "@typespec/openapi3";
import "./models.tsp";
import "./owner.tsp";
import "./guest.tsp";

using TypeSpec.Http;
using TypeSpec.Rest;

@service(#{ title: "BookingApp API" })
@server("http://localhost:3000", "Local development server")
namespace BookingApp;
