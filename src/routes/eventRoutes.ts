// Event Routes 
// Implements the routes for the event api endpoints
// Uses a eventController object to get required data. 
// Routes uses Controller which calls Repository which calls the DB

import EventsController from "../controllers/eventController.js"
import express from "express";
const router = express.Router()

const eventsController = new EventsController();

/* GET all events. */
router.get("/", (_req, res, next) => {
    try {
      const eventsList = eventsController.getAllEvents();
      res.status(200).json(eventsList);
    } catch (err: unknown) {
      next(err);
    }
});

/* Gets event data for a given event */
router.get("/:eventId", (req, res, next) => {
    try {
        const eventId = req.params["eventId"];
        const event = eventsController.getEvent(eventId);
        res.status(200).json(event);
    } catch (err: unknown) {
        next(err);
    }
});
  
module.exports = router;