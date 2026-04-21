# frozen_string_literal: true

module Api
  class UsersController < ApplicationController
    def index
      users = User.order(created_at: :desc).limit(100)
      render json: { users: users.map { |u| serialize_user_card(u) } }
    end

    def show
      user = User.find_by_username_param!(params[:username])
      render json: { user: serialize_public_user(user, viewer: current_user) }
    rescue ActiveRecord::RecordNotFound
      render json: { error: "user not found" }, status: :not_found
    end
  end
end
