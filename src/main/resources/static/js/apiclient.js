var apiclient = (function () {
    var mockdata = [];
    return {
            getBlueprintsByAuthor: function(author, callback) {
                //callback(null, mockdata[author]);
                $.get({
                    url: "http://localhost:8080/blueprints/" + author,
                    success: function(data) {
                        callback(null, data);
                    }
                });
            },
            getBlueprintsByNameAndAuthor: function(name, author, callback) {
                blueprint = mockdata[author].find(function(blueprint) {
                    return blueprint.name == name;
                });
                callback(null, blueprint)
            }
        }
})();