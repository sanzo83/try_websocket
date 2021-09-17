defmodule TryWebsocket.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      TryWebsocket.Repo,
      # Start the Telemetry supervisor
      TryWebsocketWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: TryWebsocket.PubSub},
      # Start the Endpoint (http/https)
      TryWebsocketWeb.Endpoint
      # Start a worker by calling: TryWebsocket.Worker.start_link(arg)
      # {TryWebsocket.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: TryWebsocket.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    TryWebsocketWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
