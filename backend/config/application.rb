# frozen_string_literal: true

require_relative "boot"

require "rails"
# Pick the frameworks you want (lean API surface; add Active Storage later when needed):
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"

# Require the gems listed in Gemfile, including any gems you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Fourmm
  class Application < Rails::Application
    config.load_defaults 8.0

    # API-only stack, but we still want cookie sessions + CSRF for a same-origin SPA.
    config.api_only = true

    # Same-origin browser requests (Vite dev proxy or Nginx) use a normal session cookie.
    config.session_store :cookie_store, key: "_fourmm_session"
    config.middleware.use ActionDispatch::Cookies
    config.middleware.use config.session_store, config.session_options

    # Enable forgery protection defaults for ActionController::API subclasses that opt in.
    config.action_controller.default_protect_from_forgery = true

    # Reasonable modern defaults for session cookies (Rails also sets HttpOnly/Secure where appropriate).
    config.action_dispatch.cookies_same_site_protection = :lax

    config.generators do |g|
      g.orm :active_record
    end
  end
end
