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
    		{this.props.text}
    	        </h2>
            {this.props.up}
    		{converter.makeHtml(this.props.children.toString())}
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

var CommentBox = React.createClass({
    getInitialState: function() {
	return {data: []};
    },
    render: function() {
    	return (
    		<div className = 'commentBox'>
    		<CityForm/>
    		<h1> Comments </h1>
    		<CommentList data={this.props.data}/>

    		</div>
    	);
    }
});

showGraph();
