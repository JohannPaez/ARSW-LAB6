var app = (function () {
	var nombreAutor = "";		
	var planos = [];
	var blues = [];
	var cambiarApi = apiclient;
    var pointSize = 3;
    var displayCanvas= false;
    var canvasCtx;
	var canvas;
	var currentBlueprint;

    function getCanvas() {
		if (!canvasCtx){
			canvas = document.getElementById("canvasDrawPoint");
			canvasCtx = canvas.getContext("2d");
		}
	}
    function getPosition(event){
		if (displayCanvas){
			var rect = canvasDrawPoint.getBoundingClientRect();
			var x = event.clientX - rect.left;
			var y = event.clientY - rect.top;
			drawCoordinates(x, y);
			currentBlueprint.points.push({x:x,y:y});
			drawCurrentBlueprint();
		}
    }
    function drawCoordinates(x,y){
      	getCanvas();
		canvasCtx.fillStyle = "blue"; // Red color
		canvasCtx.beginPath();
		canvasCtx.arc(x, y, pointSize, 0, Math.PI * 2, true);
		canvasCtx.fill();
        //notifyAlert();
    }
    function notifyAlert() {
        canvasDrawPoint.addEventListener("pointerdown", function(event){
            alert('pointerdown at '+event.pageX+','+event.pageY);

         });
    }


	var callBack = function(error, datos) {
		if (error != null) {
			return;
		}
		blues = datos;
		planos = datos.map(function(blueprint) {
			currentBlueprint=null;
			displayCanvas= false;
			drawCurrentBlueprint();
			return {
				name: blueprint.name,
				puntos: blueprint.points.length
			}
		});
		table();
		var getSum = planos.reduce(sumTotalPoints, 0);
		$("#idGetSum").text("Total user points: " + getSum);
		$("#blueprintName").text((datos[0]).author);
	}
	var table = function() {
    	var table = $("#idTable");
		table.empty();
    	var thead = $('<thead>');
    	var trTable = $('<tr>');
    	var thName  = $('<th>').append("Blueprint name");
		var thPoints  = $('<th>').append("Number of points");
		var thButtons  = $('<th>');
    	trTable.append(thName,thPoints,thButtons);
    	thead.append(trTable);
    	table.append(thead);
		var tbody= $('<tbody>');
		planos.forEach(function(plano) {
			var name = $("#blueName");
			name.text("");
			var tr= $('<tr>');
			var nameTd =$('<td>');
			var pointTd =$('<td>');
			var buttonTd=$('<td>');
			var buttonButton=$('<button>');
			nameTd.append(plano.name);
			pointTd.append(plano.puntos);
			buttonButton.append("Open");
			buttonButton.click(function() {
				displayCanvas = true;
				var name = $("#blueName");
				name.text(plano.name);
				currentBlueprint = blues.find(blue => blue.name === plano.name);
				drawCurrentBlueprint();
			});
			buttonTd.append(buttonButton);
			tr.append(nameTd,pointTd,buttonTd);
			tbody.append(tr);
		});
		table.append(tbody);
	}


	function drawCurrentBlueprint() {
		getCanvas();
		canvasCtx.beginPath();
		canvasCtx.clearRect(0,0,canvas.width,canvas.height);
		if (currentBlueprint) {
			currentBlueprint.points.forEach((point, i) => {
				if (i === 0) {
					canvasCtx.moveTo(point.x, point.y);
				} else {
					canvasCtx.lineTo(point.x, point.y);
				}
				canvasCtx.stroke();
			})
		}
		drawOptions();
	}

	function drawOptions() {

	}
	var sumTotalPoints = function(total, blueprint) {
		return total + blueprint.puntos;
	}
	return {       
		    setNameAuthor: function(author) {
            nombreAutor = author;
        },        
        updatePlanes: function(author) {
        	var Blueprint = cambiarApi.getBlueprintsByAuthor(author, callBack); 
        },
        drawPoint: function() {
            $("#canvasDrawPoint").click(function(e){
                getPosition(e);
            });
        },
        init: function(){
              console.info('initialized');
              //if PointerEvent is suppported by the browser:
              if(window.PointerEvent) {
                canvasDrawPoint.addEventListener("pointerdown", function(event){
                  alert('pointerdown at '+event.pageX+','+event.pageY);

                });
              }
              else {
                canvasDrawPoint.addEventListener("mousedown", function(event){
                            alert('mousedown at '+event.clientX+','+event.clientY);

                  }
                );
              }
              $("#canvasDrawPoint").click(function(e){
                              getPosition(e);
              });
		}
    }
})();
