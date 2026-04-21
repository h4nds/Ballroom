# frozen_string_literal: true

module Api
  class FollowsController < ApplicationController
    before_action :require_auth!

    def create
      target = User.find_by_username_param!(params[:username])
      if target.id == current_user.id
        render json: { error: "cannot follow yourself" }, status: :unprocessable_entity
        return
      end

      follow = current_user.active_follows.find_or_initialize_by(following: target)
      if follow.persisted?
        render json: { ok: true, user: serialize_public_user(target, viewer: current_user) }
        return
      end

      if follow.save
        render json: { ok: true, user: serialize_public_user(target.reload, viewer: current_user) }, status: :created
      else
        render json: { error: follow.errors.full_messages.to_sentence }, status: :unprocessable_entity
      end
    rescue ActiveRecord::RecordNotFound
      render json: { error: "user not found" }, status: :not_found
    end

    def destroy
      target = User.find_by_username_param!(params[:username])
      current_user.active_follows.find_by(following: target)&.destroy
      render json: { ok: true, user: serialize_public_user(target.reload, viewer: current_user) }
    rescue ActiveRecord::RecordNotFound
      render json: { error: "user not found" }, status: :not_found
    end
  end
end
