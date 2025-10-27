// class Listener {
//     private name: string = ""
//     private events: Events

//     constructor(name: string, events: Events) {
//         this.name = name
//         this.events = events
//     }

//     addEvent(event: string) {
//         this.events.add(event)
//     }

//     notify(event: string) {
//         this.events.getEvents.forEach(e => {if (event === e) console.log(e, "atualizado")})
//     }

//     get getName() {
//         return this.name
//     }

//     get getEvents() {
//         return this.events
//     }
// }

export class Events {
	private events: string[] = [];

	constructor(events: string[]) {
		this.events = events;
	}

	add(event: string) {
		this.events.push(event);
	}

	remove(event: string) {
		const events = this.events.filter((e) => e !== event);
		this.events = events;
		return this.events;
	}

	get getEvents() {
		return this.events;
	}
}

interface IEventManager {
	subscribe(event: string, listener: string): void;
	unsubscribe(event: string, listener: string): void;
	notify(event: string, listener: string): void;
}

class EventManager implements IEventManager {
	private listeners: { [key: string]: Events } = {};

	get getListeners() {
		return this.listeners;
	}

	subscribe(event: string, listener: string) {
		const events = this.listeners[listener];
		if (!events) {
			this.listeners[listener] = new Events([event]);
		} else {
			this.listeners[listener] = new Events([...events.getEvents, event]);
		}
	}

	unsubscribe(event: string, listener: string) {
		this.listeners[listener].remove(event);
	}

	notify(event: string, listener: string) {
		if (listener === "") {
			for (const [key, value] of Object.entries(this.listeners)) {
				value.getEvents.forEach((element) => {
					if (element === event)
						console.log(`Notificando ${key}, evento: ${element}`);
				});
			}
		} else {
			for (const [key, value] of Object.entries(this.listeners)) {
				if (listener === key && value.getEvents.includes(event)) {
					console.log(`Notificando ${key}, evento: ${value.getEvents}`);
				}
			}
		}
	}
}

export class StockMarket {
	private eventManager: EventManager;

	constructor() {
		this.eventManager = new EventManager();
	}

	changePrices() {
		this.eventManager.notify("change", "All");
	}

	subscribe(event: string, listener: string) {
		this.eventManager.subscribe(event, listener);
	}

	unsubscribe(event: string, listener: string) {
		this.eventManager.unsubscribe(event, listener);
	}

	notify(event: string, listener: string) {
		this.eventManager.notify(event, listener);
	}
}
