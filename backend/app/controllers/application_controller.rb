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
    render json: { user: serialize_user_me(user) }, status: status
  end

  def serialize_user_me(user)
    {
      username: user.username,
      displayName: user.display_name,
      discipline: user.discipline,
      accent: user.accent,
      soundsEnabled: user.sounds_enabled,
      bio: user.bio.to_s,
    }
  end

  def serialize_user_card(user)
    {
      username: user.username,
      displayName: user.display_name,
      discipline: user.discipline,
      accent: user.accent,
    }
  end

  # Public profile for directory / profile sheet (viewer may be nil).
  def serialize_public_user(user, viewer: nil)
    h = {
      username: user.username,
      displayName: user.display_name,
      discipline: user.discipline,
      accent: user.accent,
      bio: user.bio.to_s,
      followersCount: user.passive_follows.size,
      followingCount: user.active_follows.size,
    }
    if viewer
      h[:isSelf] = (viewer.id == user.id)
      h[:isFollowing] =
        if viewer.id == user.id
          false
        else
          viewer.active_follows.exists?(following_id: user.id)
        end
    else
      h[:isSelf] = false
      h[:isFollowing] = false
    end
    h
  end
end
