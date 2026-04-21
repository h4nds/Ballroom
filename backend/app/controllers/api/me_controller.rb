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

    def update_password
      unless current_user.authenticate(password_params[:current_password].to_s)
        render json: { error: "current password is incorrect" }, status: :unprocessable_entity
        return
      end

      current_user.password = password_params[:password].to_s
      current_user.password_confirmation = password_params[:password_confirmation].to_s

      if current_user.save
        render json: { ok: true }
      else
        render json: { error: current_user.errors.full_messages.to_sentence }, status: :unprocessable_entity
      end
    end

    private

    def update_params
      params.permit(:display_name, :discipline, :accent, :sounds_enabled, :bio)
    end

    def password_params
      params.permit(:current_password, :password, :password_confirmation)
    end
  end
end
