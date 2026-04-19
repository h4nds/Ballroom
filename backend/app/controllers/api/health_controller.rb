# frozen_string_literal: true

module Api
  class HealthController < ApplicationController
    def show
      render json: {
        ok: true,
        service: "fourmm-api",
        time: Time.now.utc.iso8601(3),
      }
    end
  end
end
