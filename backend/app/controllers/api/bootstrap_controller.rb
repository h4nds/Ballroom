# frozen_string_literal: true

module Api
  class BootstrapController < ApplicationController
    # GET /api/bootstrap — establishes the session cookie and returns a CSRF token for mutating requests.
    def show
      render json: {
        ok: true,
        csrf_token: form_authenticity_token,
      }
    end
  end
end
