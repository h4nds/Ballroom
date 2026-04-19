# frozen_string_literal: true

require "active_support/core_ext/integer/time"

Rails.application.configure do
  config.enable_reloading = true
  config.eager_load = false
  config.consider_all_requests_local = true
  config.server_timing = true

  if Rails.root.join("tmp/caching-dev.txt").exist?
    config.action_controller.perform_caching = true
    config.action_controller.enable_fragment_cache_logging = true
    config.public_file_server.headers = { "cache-control" => "public, max-age=#{2.days.to_i}" }
  else
    config.action_controller.perform_caching = false
  end

  config.cache_store = :memory_store

  config.active_support.deprecation = :log
  config.active_support.disallowed_deprecation = :raise
  config.active_support.disallowed_deprecation_warnings = []

  config.active_record.migration_error = :page_load
  config.active_record.verbose_query_logs = true
  config.active_record.query_log_tags_enabled = true

  config.action_mailer.raise_delivery_errors = false
  config.action_mailer.perform_caching = false
  config.action_mailer.default_url_options = { host: "localhost", port: 3000 }

  config.hosts << /.*\.localhost/
  config.hosts << "localhost"
  config.hosts << "127.0.0.1"
  config.hosts << "lvh.me"
  config.hosts << /.*\.lvh\.me/

  # dotenv loads SECRET_KEY_BASE in development when credentials are not configured yet.
  if ENV["SECRET_KEY_BASE"].blank?
    raise <<~MSG.squish
      Missing SECRET_KEY_BASE. Copy backend/.env.example to backend/.env and set SECRET_KEY_BASE
      (run: ruby -e "puts SecureRandom.hex(64)").
    MSG
  end
end
