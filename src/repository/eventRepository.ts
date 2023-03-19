// EventRepository
// Class that accesses the repository (MySQL database) and pulls data from it. 

import { Event } from "../types/eventType.js"
// import local database from the database thingy 

class EventsRepository {

    // Gets the list of all the events 
    getAllEvents(): Event[] {
        // borderline pseudocode that gets the events from the database.
        const eventsMap = localDb["events"];
    
        const events: Event[] = [];
        for (const id in eventsMap) {
          events.push(eventsMap[id]);
        }
    
        return events;
    }

    getEvent(id: string): Event | undefined {
        // borderline pseudocode that gets the events from the database. 
        const eventsMap = localDb["players"];
    
        const event = eventsMap[id];
        return event;
    }
}

export default EventsRepository; 