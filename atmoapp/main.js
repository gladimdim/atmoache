var data = [
    {author: "Pete Hunt", text: "This is one comment"},
    {author: "Jordan Walke", text: "This is *another* comment"}
];

var converter = new Showdown.converter();

var CommentList = React.createClass({
    render: function() {
	var commentNodes = this.props.data.map(function (comment) {
	    return (
		<Comment author={comment.author}>
		    {comment.text}
		</Comment>
	    );
	});
	return (
	    <div className="commentList">
		{commentNodes}
	    </div>
	);
    }
});

var Comment = React.createClass({
    render: function() {
	return (
	    <div className="comment">
		<h2 className="commentAuthor">
		{this.props.author}
	        </h2>
		{converter.makeHtml(this.props.children.toString())}
	    </div>
	);
    }
});

var CommentForm = React.createClass({
    render: function() {
	return (
	    <div className="commentForm">
		Hello, World! I am CommentForm
	    </div>
	);
    }
});

var CommentBox = React.createClass({
    getInitialState: function() {
	return {data: []};
    },
    componentDidMount: function() {
	showGraph();
    },
    render: function() {
	return (
		<div className = 'commentBox'>
		<h1> Comments </h1>
		<CommentList data={this.state.data}/>
		<CommentForm/>
		</div>
	);
    }
});

React.render(<CommentBox url="comments.json"/>,
	     document.getElementById("content")
);

function handleRejection() {
    console.log('rejected geolocation');
};



function showByGeolocation(geolocation) {
    "use strict";
    var sURL = "http://api.openweathermap.org/data/2.5/forecast/daily?lat=" + geolocation.coords.latitude + "&lon=" + geolocation.coords.longitude + "&cnt=7&mode=json";
//        getForecastWithString(sURL);
    console.log("showed url: " + sURL);
};

function showGraph() {
    "use strict";
    /*global navigator */
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            showByGeolocation,
            handleRejection,
            {
                enableHighAccuracy: true,
                timeout : 5000
            }
        );
    } else {
        handleRejection();
    }
};
