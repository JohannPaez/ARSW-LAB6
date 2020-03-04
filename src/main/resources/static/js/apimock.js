var apimock = (function () {
    var mockdata = [];
    mockdata["JhonConnor"] = [
        {
            author: "JhonConnor",
            name: "house",
            points: [
                {
                    x: 10,
                    y: 20
                },
                {
                    x: 15,
                    y: 25
                },
                {
                    x: 45,
                    y: 25
                }
            ]
        },
        {
            author: "JhonConnor",
            name: "bike",
            points: [
                {
                    x: 30,
                    y: 35
                },
                {
                    x: 40,
                    y: 45
                }
            ]
        }
    ]
    mockdata['LexLuthor'] = [
        {
            author: 'LexLuthor',
            name: 'kryptonite',
            points: [
                {
                    x: 60,
                    y: 65
                },
                {
                    x: 70,
                    y: 75
                }
            ]
        }
    ]
	mockdata["William"] = [
        {
            author: "William",
            name: "room",
            points: [
                {
                    x: 10,
                    y: 30
                },
                {
                    x: 40,
                    y: 60
                },
                {
                    x: 50,
                    y: 100
                }
            ]
        },
        {
            author: "William",
            name: "mouse",
            points: [
                {
                    x: 30,
                    y: 50
                },
                {
                    x: 10,
                    y: 50
                }
            ]
        }
    ]
    return {
        getBlueprintsByAuthor: function(author, callback) {
            callback(null, mockdata[author]);
        },
        getBlueprintsByNameAndAuthor: function(name, author, callback) {
            blueprint = mockdata[author].find(function(blueprint) {
                return blueprint.name == name
            });
            callback(null, blueprint)
        }
    }
})();