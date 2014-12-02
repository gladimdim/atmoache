define(function (require) {
    var Utils = require("atmoapp/utils");
    var data = [
        {author: "Pete Hunt", text: "This is one comment"},
        {author: "Jordan Walke", text: "This is *another* comment"}
    ];

    var DaysList = React.createClass({
        render: function() {
            var commentNodes = this.props.data.map(function (comment) {
                return (
                <PressureDay author={comment.author}>
                    {comment.text}
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
                <div className="pressureDay">
                    <h2 className="commentAuthor">
                        {this.props.text}
                    </h2>
                    {this.props.up}
                </div>
            );
        }
    });

    var CityForm = React.createClass({
        render: function() {
            return (
                <div className="commentForm">
                Hello, World! I am CommentForm
                </div>
            );
        }
    });

    var MainContent = React.createClass({
        getInitialState: function() {
        return {data: []};
        },
        render: function() {
            return (
                <div className = 'MainContent'>
                <CityForm/>
                <h1> Comments </h1>
                <DaysList data={this.props.data}/>

                </div>
            );
        }
    });

    Utils.showGraph(DaysList);

});

