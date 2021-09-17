defmodule TryWebsocket.Repo do
  use Ecto.Repo,
    otp_app: :try_websocket,
    adapter: Ecto.Adapters.MyXQL
end
