# frozen_string_literal: true

module Api
  class AuthController < ApplicationController
    def sign_up
      user = User.new(sign_up_params)
      if user.save
        session[:user_id] = user.id
        render_user(user, status: :created)
      else
        render json: { error: user.errors.full_messages.to_sentence }, status: :unprocessable_entity
      end
    end

    def sign_in
      user = User.find_by(username: sign_in_params[:username].to_s.strip.downcase.gsub(/\s+/, "_"))
      unless user&.authenticate(sign_in_params[:password].to_s)
        render json: { error: "invalid username or password" }, status: :unauthorized
        return
      end

      session[:user_id] = user.id
      render_user(user)
    end

    def sign_out
      reset_session
      render json: { ok: true }
    end

    private

    def sign_up_params
      params.permit(:username, :display_name, :password, :password_confirmation)
    end

    def sign_in_params
      params.permit(:username, :password)
    end
  end
end
