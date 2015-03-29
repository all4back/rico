# Rico

*Synchronised data service. For more details, visit http://code.all4back.com/rico/.*

## Introduction

Rico is a [noBackend](http://nobackend.org/) solution for rapid application development, with a reactive interface and familiar API. Fetching and filtering data opens a change stream to synchronize data in realtime.

```javascript
import { Rico } from "rico";

var store = new Rico({
  host: "localhost",
  port: 8080
});

// Yields a value every time there
// is a change upstream
store.get("/todos").subscribe(
  todos => render(todos)
);
```

Rico strictly requires [RxJS]() to expose an observable interface and provide a rich library of methods for composing, merging and operating over streams.

## API

### rico.get

Fetch an item or collection of items at a given path and observe changes. This method returns an instance of [Rx.Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md), which can be composed and transformed for more sophisticated behaviour. Read the [RxJS documentation](https://github.com/Reactive-Extensions/RxJS) for more.

#### Arguments

1. path: *string*
2. options: *object, optional*

#### Returns

*[Rx.Observable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md)*

#### Simple examples

*Fetch and observe a filtered collection of todo tasks.*

```javascript
var todos$ = store.get("/todos", {
  where: {
    completed: false
  }
});

todos$.subscribe(
  todos => render(todos)
);
```

*Fetch and observe a single todo task.*

```javascript
store.get("/todos/1").subscribe(
  todo => render(todo)
);
```

#### Example with composition

*Capture a synchronized list of todo tasks, filtered by current status. When the status changes, the observed query reactively updates.*

````javascript
var status$ = new Rx.Subject();

var todos$ = status$.flatMapLatest(
  status => store.get("/todos", {
    where: {
      completed: status
    }
  })
);

todos$.subscribe(
  todos => render(todos)
);

status$.onNext(true);
````

### rico.post

#### Arguments

1. path: *string*
2. data: *object*

#### Returns

*Promise*

### rico.put

#### Arguments

1. path: *string*
2. data: *object*

#### Returns

*Promise*

### rico.patch

#### Arguments

1. path: *string*
2. data: *object*

#### Returns

*Promise*

### rico.delete

#### Arguments

1. path: *string*
2. data: *object*

#### Returns

*Promise*
