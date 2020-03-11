# ARSW-LAB6

## Members 
- **Juan Alberto Mejía Schuster**
- **Johann Sebastian Páez Campos**

## Run
gradle bootrun

## Blueprint Management 4 - Heavy Clients

![](img/mock.png)


- Add to the canvas of the page an event handler that allows you to capture the 'clicks' made, either through the mouse, or through a touch screen. For this, consider this example of the use of events of type PointerEvent (not yet supported by all browsers) for this purpose. Remember that unlike the previous example (where the JS code is embedded in the view), it is expected to have the initialization of the event handlers correctly modularized, as shown in this codepen.
- Add what is needed in your modules so that when new points are captured on the open canvas (if a canvas has not been selected, nothing should be done):
  - The point is added at the end of the sequence of points on the current canvas (only in the application memory, NOT EVEN IN THE API!). 
  - The drawing is repainted. 
- Add the Save/Update button. Respecting the client's current module architecture, do that by pressing the button:
  - Perform PUT action, with the updated plan, in its corresponding REST resource. 
  - Perform GET action to the resource /blueprints, to get back all the plans made. 
  - The total points of the user are recalculated. 
  
  For the above, keep in mind:
  - jQuery has no functions for PUT or DELETE requests, so it is necessary to 'configure' them manually through its API for AJAX. For example, to make a PUT request to a resource / resource:
``` javascript
return $.ajax({
    url: "/mirecurso",
    type: 'PUT',
    data: '{"prop1":1000,"prop2":"papas"}',
    contentType: "application/json"
});
```
  - For this note that the 'data' property of the object sent to $.ajax must be a jSON object (in text format). If the data you want to send is a JavaScript object, you can convert it to jSON with:
``` javascript
  JSON.stringify(objetojavascript),
```
  - As in this case there are three operations based on callbacks, and that they need to be performed in a specific order, consider how to use JavaScript promises using any of the available examples.
  
- Add the 'Create new blueprint' button, so that when pressed:
  - The current canvas is deleted. 
  - The name of the new 'blueprint' is requested (you decide how to do it). 
  - This option should change the way the 'save / update' option works, because in this case, when pressed the first time you should (also, using promises):
Post the resource / blueprints to create the new plan. GET to this same resource, to update the list of plans and the user's score. 

- Add the 'DELETE' button, so that (also with promises):
  - Delete the canvas. DELETE the corresponding resource. 
  - Make GET of the plans now available.

## Grade Criteria

The deliver of this workshop should be a link to GitHub repository where the README file contains all the answers (you can use images to support your solution development) and the source code is the solution.

The README file should contains:
- Compile and run instructions.
- Answers to all the workshop questions. 

Another grade criteria will be:
- Use of Maven.
- Use of GitHub.
- Include your own tests.
- Functionality
  - The application loads and draws the plans correctly.
  - The application updates the list of plans when a new one is created and stored (through the API).
  - The application allows you to modify existing plans.
  - The application correctly calculates the total points.
- Design
  - The callback used when loading the plans and calculating the points of an author does NOT use cycles, but map / reduce operations.
  - The update and delete operations make use of promises to ensure that the calculation of the score is done only until the data in the backend has been updated. If nested callbacks are used, it is evaluated as "NOT GOOD".
