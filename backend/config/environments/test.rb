# frozen_string_literal: true

require "active_support/core_ext/integer/time"

Rails.application.configure do
  # CI-friendly fallback when backend/.env is not loaded; prefer a real secret in .env locally.
  ENV["SECRET_KEY_BASE"] ||= "0" * 64

  config.enable_reloading = false
  config.eager_load = false
  config.public_file_server.enabled = true
  config.public_file_server.headers = { "cache-control" => "public, max-age=3600" }

  config.consider_all_requests_local = true
  config.action_controller.perform_caching = false
  config.cache_store = :null_store

  config.action_dispatch.show_exceptions = :rescuable
  config.action_controller.allow_forgery_protection = true

  config.active_support.deprecation = :stderr
  config.active_support.disallowed_deprecation = :raise
  config.active_support.disallowed_deprecation_warnings = []

  config.action_mailer.delivery_method = :test
  config.action_mailer.perform_caching = false
  config.action_mailer.default_url_options = { host: "www.example.com" }

  config.active_record.maintain_test_schema = true if defined?(ActiveRecord::Base)
end
