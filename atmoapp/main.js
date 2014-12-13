define(function (require) {
    var Utils = require("atmoapp/utils");
    var utils = new Utils();
    var data = [
    ];

    var DaysList = React.createClass({
        render: function() {
            var commentNodes = this.props.data.map(function (comment) {
                var date = new Date(comment.date);

                return (
                <PressureDay data={comment} date={date}>

                </PressureDay>
                );
            });
            return (
                <div className="daysList">
                {commentNodes}
                </div>
            );
        }
    });

    var PressureDay = React.createClass({
        render: function() {
            return (
                <div className="pressureDay div-diff" style={this.props.data.colorStyle}>
                    {this.props.date.toLocaleDateString()} {this.props.data.up}
                </div>
            );
        }
    });

    var CityForm = React.createClass({
        handlePress: function() {

        },
        render: function() {
            return (
                <div className="cityForm">
                <input type="text"/>
                <button onClick={utils.showByCity("Moscow")}>Get Graph</button>
                </div>
            );
        }
    });

    MainContent = React.createClass({
        getInitialState: function() {
        return {data: []};
        },
        render: function() {
            return (
                <div className = 'MainContent'>
                <CityForm/>
                <DaysList data={this.props.data}/>

                </div>
            );
        }
    });


    utils.showGraph();
});
