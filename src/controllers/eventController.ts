// Controller class for the Event API endpoints
// The controller has a class and method that call the repository. 

// are these imports supposed to have .js extension? 
import HTTPError from "../errors/HTTPError.js"
import EventsRepository from "../repository/eventRepository.js"
import { Event } from "../types/eventType.js"

const eventsRepository = new EventsRepository(); 

class EventsController {
    getAllEvents(): Event[] {
        return eventsRepository.getAllEvents(); 
    }

    getEvent(id: string): Event {
        const event = eventsRepository.getEvent(id);
    
        if (!event) {
          throw new HTTPError("Event not found.", 400);
        }
    
        return event;
    }    
}

export default EventsController; 