# frozen_string_literal: true

module Api
  class EchoController < ApplicationController
    # POST /api/echo — sanity check that CSRF + JSON body work from the SPA.
    def create
      render json: {
        ok: true,
        received: params.permit(:ping).to_h,
      }
    end
  end
end
