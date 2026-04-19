# frozen_string_literal: true

require "active_support/core_ext/integer/time"

Rails.application.configure do
  config.enable_reloading = false
  config.eager_load = true
  config.consider_all_requests_local = false
  config.action_controller.perform_caching = true

  config.public_file_server.headers = { "cache-control" => "public, max-age=#{1.year.to_i}" }

  config.assume_ssl = ENV.fetch("RAILS_ASSUME_SSL", "1") == "1"
  config.force_ssl = ENV.fetch("RAILS_FORCE_SSL", "1") == "1"

  config.log_tags = [:request_id]
  config.logger = ActiveSupport::Logger.new($stdout)
  config.logger.formatter = config.log_formatter
  config.log_level = ENV.fetch("LOG_LEVEL", "info").to_sym

  config.active_support.report_deprecations = false

  config.cache_store = :memory_store

  config.active_record.dump_schema_after_migration = false

  config.action_mailer.perform_caching = false
  config.action_mailer.default_url_options = { host: ENV.fetch("APP_HOST", "example.com"), protocol: "https" }

  config.i18n.fallbacks = true
end
