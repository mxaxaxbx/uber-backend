import express from "express";

import { authRoutes } from "./auth.route";
import { driverRoutes } from "./drivers.route";
import { passengeresRoutes } from "./passengers.route";

const routes = express();

routes.use( '/auth', authRoutes );
routes.use( '/drivers', driverRoutes );
routes.use( '/passengers', passengeresRoutes );

export default routes;
