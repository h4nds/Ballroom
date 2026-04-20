# frozen_string_literal: true

module Api
  class MeController < ApplicationController
    before_action :require_auth!

    def show
      render_user(current_user)
    end

    def update
      if current_user.update(update_params)
        render_user(current_user)
      else
        render json: { error: current_user.errors.full_messages.to_sentence }, status: :unprocessable_entity
      end
    end

    private

    def update_params
      params.permit(:display_name, :discipline, :accent, :sounds_enabled)
    end
  end
end
