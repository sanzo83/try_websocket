// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".

// To use Phoenix channels, the first step is to import Socket,
// and connect at the socket path in "lib/web/endpoint.ex".
//
// Pass the token on params as below. Or remove it
// from the params if you are not using authentication.
import {Socket} from "phoenix"

let socket = new Socket("/socket", {params: {token: window.userToken}})

// When you connect, you'll often need to authenticate the client.
// For example, imagine you have an authentication plug, `MyAuth`,
// which authenticates the session and assigns a `:current_user`.
// If the current user exists you can assign the user's token in
// the connection for use in the layout.
//
// In your "lib/web/router.ex":
//
//     pipeline :browser do
//       ...
//       plug MyAuth
//       plug :put_user_token
//     end
//
//     defp put_user_token(conn, _) do
//       if current_user = conn.assigns[:current_user] do
//         token = Phoenix.Token.sign(conn, "user socket", current_user.id)
//         assign(conn, :user_token, token)
//       else
//         conn
//       end
//     end
//
// Now you need to pass this token to JavaScript. You can do so
// inside a script tag in "lib/web/templates/layout/app.html.eex":
//
//     <script>window.userToken = "<%= assigns[:user_token] %>";</script>
//
// You will need to verify the user token in the "connect/3" function
// in "lib/web/channels/user_socket.ex":
//
//     def connect(%{"token" => token}, socket, _connect_info) do
//       # max_age: 1209600 is equivalent to two weeks in seconds
//       case Phoenix.Token.verify(socket, "user socket", token, max_age: 1209600) do
//         {:ok, user_id} ->
//           {:ok, assign(socket, :user, user_id)}
//         {:error, reason} ->
//           :error
//       end
//     end
//
// Finally, connect to the socket:
socket.connect()

// Now that you are connected, you can join channels with a topic:
const channel = socket.channel('room:lobby', {})
const chatInput = document.querySelector('#chat-input')
const messagesContainer = document.querySelector('#messages')

chatInput.addEventListener('keypress', event => {
  if (event.keyCode === 13) {
    channel.push('new_msg', { body: chatInput.value })
    chatInput.value = ''
  }
})

channel.on('new_msg', payload => {
  const messageItem = document.createElement('li')
  messageItem.innerText = `[${Date()}] ${payload.body}`
  messagesContainer.appendChild(messageItem)
})

channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) })

var w = 640,
h = 480;

var nodes = d3.range(200).map(function() { return {radius: Math.random() * 12 + 4}; }),
  color = d3.scale.category10();

var force = d3.layout.force()
  .gravity(0.05)
  .charge(function(d, i) { return i ? 0 : -2000; })
  .nodes(nodes)
  .size([w, h]);

var root = nodes[0];
root.radius = 0;
root.fixed = true;
force.start();

var svg = d3.select("body").append("svg:svg")
  .attr("width", w)
  .attr("height", h);

svg.selectAll("circle")
  .data(nodes.slice(1))
.enter().append("svg:circle")
  .attr("r", function(d) { return d.radius - 2; })
  .style("fill", function(d, i) { return color(i % 3); });

force.on("tick", function(e) {
var q = d3.geom.quadtree(nodes),
    i = 0,
    n = nodes.length;
while (++i < n) {
  q.visit(collide(nodes[i]));
}
svg.selectAll("circle")
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });
});

svg.on("mousemove", function() {
  var p1 = d3.mouse(this);
  channel.push("move", {x: p1[0], y: p1[1]});
});

channel.on("move", function(dt) {
  root.px = dt.x;
  root.py = dt.y;
  force.resume();
});

function collide(node) {
var r = node.radius + 16,
    nx1 = node.x - r,
    nx2 = node.x + r,
    ny1 = node.y - r,
    ny2 = node.y + r;
return function(quad, x1, y1, x2, y2) {
  if (quad.point && (quad.point !== node)) {
    var x = node.x - quad.point.x,
        y = node.y - quad.point.y,
        l = Math.sqrt(x * x + y * y),
        r = node.radius + quad.point.radius;
    if (l < r) {
      l = (l - r) / l * .5;
      node.x -= x *= l;
      node.y -= y *= l;
      quad.point.x += x;
      quad.point.y += y;
    }
  }
  return x1 > nx2
      || x2 < nx1
      || y1 > ny2
      || y2 < ny1;
};
}



export default socket
