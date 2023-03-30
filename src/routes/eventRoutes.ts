// Event Routes
// Implements the routes for the event api endpoints
// Uses a eventController object to get required data.
// Routes uses Controller which calls Repository which calls the DB

import EventsController from "../controllers/eventController.js";
import express from "express";
const eventRouter = express.Router();

const eventsController = new EventsController();

/* GET all events. */
eventRouter.get("/", async (req, res, next) => {
  try {
    const eventsList = await eventsController.getAllEvents();
    res.status(200).json(eventsList);
  } catch (err: unknown) {
    next(err);
  }
});

/* Gets event data for a given event */
eventRouter.get("/:eventId", async (req, res, next) => {
  const eventId = req.params["eventId"];
  const event = await eventsController.getEvent(eventId);
  if (!event) {
    res.status(404).send("Event Not Found");
    return;
  }

  res.status(200).send(event);
});

export { eventRouter };
