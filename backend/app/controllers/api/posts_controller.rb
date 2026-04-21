# frozen_string_literal: true

module Api
  class PostsController < ApplicationController
    before_action :require_auth!, only: [:create]

    def index
      scope = Post.includes(:user).order(created_at: :desc).limit(100)
      scope = scope.where(board_slug: params[:board_id]) if params[:board_id].present?

      render json: { posts: scope.map { |p| serialize_post(p) } }
    end

    def create
      post = current_user.posts.build(
        title: post_params[:title],
        body: post_params[:body],
        board_slug: post_params[:board_id].to_s,
      )

      if post.save
        render json: { post: serialize_post(post) }, status: :created
      else
        render json: { error: post.errors.full_messages.to_sentence }, status: :unprocessable_entity
      end
    end

    private

    def post_params
      params.permit(:title, :body, :board_id)
    end

    def serialize_post(post)
      {
        id: post.id,
        boardId: post.board_slug,
        title: post.title,
        body: post.body,
        authorDisplayName: post.user.display_name,
        authorUsername: post.user.username,
        createdAt: post.created_at.iso8601(3),
      }
    end
  end
end
