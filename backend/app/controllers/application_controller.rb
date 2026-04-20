# frozen_string_literal: true

class ApplicationController < ActionController::API
  include ActionController::Cookies
  include ActionController::RequestForgeryProtection

  protect_from_forgery with: :exception

  private

  def current_user
    return @current_user if defined?(@current_user)

    @current_user = User.find_by(id: session[:user_id])
  end

  def require_auth!
    return if current_user

    render json: { error: "unauthorized" }, status: :unauthorized
  end

  def render_user(user, status: :ok)
    render json: {
      user: {
        username: user.username,
        displayName: user.display_name,
        discipline: user.discipline,
        accent: user.accent,
        soundsEnabled: user.sounds_enabled,
      },
    }, status: status
  end
end
