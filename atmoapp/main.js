define(function (require) {
    var Utils = require("atmoapp/utils");
    var utils = new Utils();
    var data = [
    ];

    var DaysList = React.createClass({
        render: function() {
            var pressureNodes = this.props.data.map(function (pressureRecord) {
                var date = new Date(pressureRecord.date);
                return (
                    <PressureDay data={pressureRecord} date={date}>
                    </PressureDay>
                );
            });
            return (
                <div className="daysList">
                    {pressureNodes}
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
        handleClick: function(e) {
            var that = this;
            utils.showByCity(this.props.city).then(function(aArray) {
                mainContent.setProps({data: aArray[0], city: aArray[1]});
            });
        },
        handleCityChange: function(e) {
            this.props.city = e.target.value;
        },
        render: function() {
            return (
                <div className="cityForm">
                <input type="text" onChange={this.handleCityChange}>{this.props.city}</input>
                <button onClick={this.handleClick}>Get Graph</button>
                </div>
            );
        }
    });

    MainContent = React.createClass({
        getInitialState: function() {
            return {data: [], city: ""};
        },
        render: function() {
            return (
                <div className = 'MainContent'>
                    <CityForm city={this.props.city}/>
                    <DaysList data={this.props.data}/>
                </div>
            );
        }
    });

    var mainContent = React.render(
            <MainContent data={[]}/>,
            document.getElementById("content")
        ); 

    utils.showGraph().then(function(aArray) {
        mainContent.setProps({data: aArray[0], city: aArray[1]});
    });
});
