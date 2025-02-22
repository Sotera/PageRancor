angular.module('com.module.core')
    .directive('rankChart', ['DwUrlRanking',function(DwUrlRanking) {
        return {
            templateUrl: '/modules/core/views/partials/rank-chart',
            restrict: 'E',
            link: function postLink($scope, element) {
                element.text('this is the adminForm directive');

                var network = null;
                var data = null;

                $scope.requester = "jabba";
                $scope.defaultUrl = "http://localhost:3004/testsite";
                $scope.defaultTerms = "batman,robin";
                $scope.load= function() {
                    draw();
                };

                function destroy() {
                    if (network !== null) {
                        network.destroy();
                        network = null;
                    }
                }

                function draw() {
                    destroy();
                    var whereClause={
                        filter: {
                            where: {
                                requester: $scope.requester
                            },
                            fields: {
                                "dwTrailUrlId": true,
                                "extractor": true,
                                "value": true,
                                "nodes": true,
                                "edges": true
                            }
                        }
                    };

                    DwUrlRanking.findOne(whereClause,function(result){
                        data = {nodes: result.nodes, edges: result.edges};
                        var directionInput = "LR";
                        var options = {
                            layout: {
                                hierarchical: {
                                    direction: directionInput
                                }
                            }
                        };
                        var options = {
                            layout: {
                                randomSeed: undefined,
                                improvedLayout: false
                            },
                            nodes: {
                                shape: 'dot',
                                scaling: {
                                    customScalingFunction: function (min,max,total,score) {
                                        return score/total;
                                    },
                                    min:5,
                                    max:150
                                }
                            }
                        };
                        network = new vis.Network(element[0], data, options);

                        network.on("showPopup", function (params) {
                            document.getElementById('eventSpan').innerHTML = '<h2>showPopup event: </h2>' + JSON.stringify(params, null, 4);
                        });
                        // add event listeners
                        network.on('select', function (params) {
                            //document.getElementById('selection').innerHTML = 'Selection: ' + params.nodes;
                            document.getElementById('eventSpan').innerHTML = '<h2>Selected Node: </h2> <a href="' + data.nodes[params.nodes[0]].url + '">' +
                                data.nodes[params.nodes[0]].url + '</a>';
                        });
                    });


                }

                draw();
            }
        };
    }]);