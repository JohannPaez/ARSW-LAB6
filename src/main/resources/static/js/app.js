var app = (function () {
	var nombreAutor = "";		
	var planos = [];
	var blues = [];
	var cambiarApi = apimock;
    var pointSize = 3;
    function getPosition(event){
         var rect = canvasDrawPoint.getBoundingClientRect();
         var x = event.clientX - rect.left;
         var y = event.clientY - rect.top;
         drawCoordinates(x,y);
    }
    function drawCoordinates(x,y){
      	var ctx = document.getElementById("canvasDrawPoint").getContext("2d");
      	ctx.fillStyle = "blue"; // Red color
        ctx.beginPath();
        ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);
        ctx.fill();
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
			return {
				name: blueprint.name,
				puntos: blueprint.points.length
			}
		});
		var stringTable = table();
		$("#idTable").html(stringTable);
		var getSum = planos.reduce(sumTotalPoints, 0);
		$("#idGetSum").text("Total user points: " + getSum);
		$("#blueprintName").text((datos[0]).author);
	}
	var table = function() {
		var tabla = "<table class='table' style = 'width:500px; align-content:center;'>" +
						"<thead class='thead-dark'>" +
							"<tr>" +
								"<th scope='col'> Blueprint name </th>" +
								"<th scope='col'> Number of points </th>" +
								"<th scope='col'> </th>" +
							"</tr>" +
						"</thead>" +
						"<tbody>";
		planos.forEach(function(plano, i) {
			let butId = plano.name+i;
			tabla += "<tr>" +
						"<td>" + plano.name + "</td>" +
						"<td>" + plano.puntos + "</td>" +
						"<td> <button id='"+butId+"' type='button' class='btn btn-secondary btn-sm'> Open </button> </td>" +
					"</tr>";
					$(document).on("click", "#"+butId, function() {
						var canvas = $("#canvasId")[0];
						var name = $("#blueName");
						name.text(plano.name);
						let ctx = canvas.getContext("2d");
						ctx.beginPath();
						ctx.clearRect(0,0,canvas.width,canvas.height);
						let figure = blues.find(blue => blue.name === plano.name)
						figure.points.forEach( (point , i ) => {
							if (i === 0) {
								ctx.moveTo(point.x, point.y);
							} else {
								ctx.lineTo(point.x, point.y);
							}
							ctx.stroke();
						})
					})
			});
		tabla += "</tbody> </table>";
		return tabla;
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
