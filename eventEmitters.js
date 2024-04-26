const EventEmitter = require("events");
const { prependListener } = require("process");

const eventEmitter = new EventEmitter();

eventEmitter.on("event", function f1() {
  //event is registered
  console.log("Event is registered1");
});
eventEmitter.on("event", function f2() {
  //event is registered
  console.log("Event is registered2");
});
eventEmitter.on("event", function f3() {
  //event is registered
  console.log("Event is registered3");
});
eventEmitter.on("foo", function () {
  //event is registered
  console.log("Event is registered");
});
eventEmitter.on("bar", function () {
  //event is registered
  console.log("Event is registered");
});

// By default you can register events with the same event name up to 10 times

eventEmitter.emit("event"); // Event is emitted this is called all on method registered with name of event synchronly

eventEmitter.addListener("message", fun1); // this is also same as on method
function fun1() {
  console.log("Message is emitted");
}

console.log(eventEmitter.eventNames()); // outPut:: [ 'event', 'foo', 'bar', 'message' ]

console.log(eventEmitter.listenerCount("event")); // outPut: 3 because two events named event is registered.

eventEmitter.on("event", function f0() {
  console.log("Event is registered");
});
console.log(eventEmitter.listeners("event")); // gives array of functions that are registered using "event" name.

eventEmitter.once("one", function () {
  console.log("one is emitted only one time"); //this will be emit only on time
});

eventEmitter.prependListener("event", function f0Pre() {
  console.log("it is add to the first element in listeners array0");
});
console.log(eventEmitter.listeners("event")); //like that [ [Function: f0],[Function: f1],[Function: f2],[Function: f3],[Function: f0]]

console.log(eventEmitter.getMaxListeners()); // it is by default 10 we can change using setMaxListeners()
eventEmitter.setMaxListeners(5);
console.log(eventEmitter.getMaxListeners()); // now it is 5 you can only 5 listeners can add to the same name event

eventEmitter.removeAllListeners("event"); // remove all listeners of named event
console.log(eventEmitter.listeners("event")); //output : []
eventEmitter.emit("event"); //no one is listener is emitted
