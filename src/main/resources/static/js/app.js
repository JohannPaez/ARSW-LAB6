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
		if (planos.length == 0) {
			var name = $("#blueprintName");
			name.empty();	
		}
		var name = $("#blueName");
		name.text("");
		if (planos.length !== 0){
			var thead = $('<thead>');
			var trTable = $('<tr>');
			var thName  = $('<th>').append("Blueprint name");
			var thPoints  = $('<th>').append("Number of points");
			var thButtons  = $('<th>');
			trTable.append(thName,thPoints,thButtons);
			thead.append(trTable);
			table.append(thead);
			var tbody= $('<tbody>');
			var name = $("#blueName");
			name.text("");
			planos.forEach(function(plano) {
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
					buttonCreate();
				});
				buttonTd.append(buttonButton);
				tr.append(nameTd,pointTd,buttonTd);
				tbody.append(tr);
			});
			table.append(tbody);
		}
	}

	var buttonCreate = function() {
		var buttonContainerId = $("#buttonCreate");
		buttonContainerId.empty();
		var buttonId=$('<button>');
		buttonId.append("Create new blueprint");
		buttonId.click(function() {
			buttonContainerId.empty();
			inputBlueprint();
		});		
		buttonContainerId.append(buttonId);		
		
	}

	var inputBlueprint = function() {
		var inputContainer = $("#buttonCreate");
		var inputName=$('<input id = "idInput" name="inputName" value="" />');

		var buttonAccept = $('<button>');
		buttonAccept.append("Create");
		buttonAccept.click(createBlueprint);

		inputContainer.empty();
		inputContainer.append(inputName);
		inputContainer.append(buttonAccept);
	}

	function createBlueprint () {
		var name = $("#idInput").val();
		var newBlue = function () {
			var data = JSON.stringify({author: currentBlueprint.author, name: name});
			var newBlue = $.ajax({
				url:"/blueprints/",
				type: "POST",
				data: data,
				contentType: "application/json",
			})
			newBlue.then(
				function () {
					console.log("OK");
				},
				function (e) {
					console.log("ERROR", e);
				}
			);
			return newBlue;
		}

		var getBlue = function () {
			var promise = $.ajax({
				url:"http://localhost:8080/blueprints/"+ currentBlueprint.author,
				type: "GET"
			});
			promise.then(
				function (data) {
					planos = data.map(function(blueprint) {
						var len = 0
						if (blueprint.points) {
							len = blueprint.points.length; 
						}
						return {
							name: blueprint.name,
							puntos: len								
						}
					});
					currentBlueprint = $("#idInput").val();

				},
				function (e) {
					console.log("ERROR", e);
				}
			);
			return promise;
		};

		var finalAction = function () {
			var getSum = planos.reduce(sumTotalPoints, 0);
			$("#idGetSum").text("Total user points: " + getSum);
		};

		return newBlue()
						.then(getBlue)
						.then(buttonCreate)
                        .then(finalAction)
						.then(table)
						.then(drawCurrentBlueprint);
	}
	function drawCurrentBlueprint() {
		getCanvas();
		canvasCtx.beginPath();
		canvasCtx.clearRect(0,0,500,500);
		if (currentBlueprint) {
			currentBlueprint.points.forEach((point, i) => {
				if (i === 0) {
					canvasCtx.moveTo(point.x, point.y);
				} else {
					canvasCtx.lineTo(point.x, point.y);
				}
				canvasCtx.stroke();
			})
			drawOptions();
		}

	}

	function drawOptions() {
    	var buttonSection = $("#buttonContainer");
    	buttonSection.empty();
    	var save = $('<button>').append("Save/Update");
		var delet = $('<button>').append("Delete");
		buttonSection.append(save,delet);
		save.click(saveBlueprint);
		delet.click(deleteBlueprint);
	}

	function saveBlueprint() {
    	var putPoints = function () {
			var data = JSON.stringify({author: currentBlueprint.author, name: currentBlueprint.name,  points: currentBlueprint.points});
			var putPoints = $.ajax({
				url:"/blueprints/" + currentBlueprint.author + "/" + currentBlueprint.name,
				type: "PUT",
				data: data,
				contentType: "application/json",
			})
			putPoints.then(
				function () {
					console.log("OK");
				},
				function (e) {
					console.log("ERROR", e);
				}
			);
			return putPoints;
		}

		var getPoints = function () {
			var promise = $.ajax({
				url:"http://localhost:8080/blueprints/"+ currentBlueprint.author,
				type: "GET"
			});
			promise.then(
				function (data) {
					planos = data.map(function(blueprint) {
						return {
							name: blueprint.name,
							puntos: blueprint.points.length
						}
					});
				},
				function (e) {
					console.log("ERROR", e);
				}
			);
			return promise;
		};

		var finalAction = function () {
			var getSum = planos.reduce(sumTotalPoints, 0);
			$("#idGetSum").text("Total user points: " + getSum);
		};

		return putPoints()
                        .then(getPoints)
                        .then(finalAction)
						.then(table);


	}

	function deleteBlueprint() {
    	var deleteBlue = function (){
			var deleted = $.ajax({
				url:"/blueprints/" + currentBlueprint.author + "/" + currentBlueprint.name,
				type: "DELETE",
			})
			deleted.then(
				function () {
					console.log("OK");
				},
				function (e) {
					console.log("ERROR", e);
				}
			);
			return deleted ;
		}
		var getBlueprints = function () {
			var promise = $.ajax({
				url:"http://localhost:8080/blueprints/"+ currentBlueprint.author,
				type: "GET"
			});
			promise.then(
				function (data) {
					planos = data.map(function(blueprint) {
						return {
							name: blueprint.name,
							puntos: blueprint.points.length
						}
					});
				},
				function (e) {
					planos = [];
				}
			);
			currentBlueprint=null;
			return promise;
		};

		var finalAction = function () {
			var getSum = planos.reduce(sumTotalPoints, 0);
			$("#idGetSum").text("Total user points: " + getSum);
		};

		function errorCorrection(){
			displayCanvas = false;
			finalAction();
			table();
			drawCurrentBlueprint();
		}
		return deleteBlue()
			.then(getBlueprints)
			.then(errorCorrection)
			.catch(errorCorrection);

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
    }
})();
