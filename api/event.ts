// Event Routes
// Implements the routes for the event api endpoints
// Uses a eventController object to get required data.
// Routes uses Controller which calls Repository which calls the DB

import express from "express";
import EventsController from "../src/controllers/eventController"
import { isEmpty } from "../src/utils"
const eventRouter = express.Router();

const eventsController = new EventsController();

/* GET all events. */
eventRouter.get("/", async (req, res) => {
  try {
    const eventsList = await eventsController.getAllEvents();
    res.status(200).json(eventsList);
  } catch (err: unknown) {
    res.status(500).send("Database Error");
  }
});

/* Gets event data for a given event */
eventRouter.get("/:eventId", async (req, res) => {
  try {
    const eventId = req.params["eventId"];
    const event = await eventsController.getEvent(eventId);
    if (isEmpty(event)) {
      res.status(404).send("Event Not Found");
      return;
    }
    res.status(200).send(event);
  } catch (e: unknown) {
    res.status(500).send("Database error");
  }
});

export { eventRouter };
