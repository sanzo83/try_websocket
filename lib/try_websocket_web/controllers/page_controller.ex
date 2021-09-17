defmodule TryWebsocketWeb.PageController do
  use TryWebsocketWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
