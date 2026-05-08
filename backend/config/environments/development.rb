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

  # Prefer SECRET_KEY_BASE from .env; otherwise persist a dev-only key so first `rails server` works
  # without copying .env (sessions stay valid across restarts).
  secret_path = Rails.root.join("tmp/development_secret_key_base.txt")
  config.secret_key_base = ENV["SECRET_KEY_BASE"].presence || begin
    if secret_path.exist?
      secret_path.read.strip
    else
      FileUtils.mkdir_p(secret_path.dirname)
      secret = SecureRandom.hex(64)
      secret_path.write("#{secret}\n")
      secret
    end
  end
end
