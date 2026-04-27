# frozen_string_literal: true

module Api
  class ForumThreadsController < ApplicationController
    before_action :require_auth!, only: %i[create create_post]

    def show
      thread = ForumThread.includes(:forum_board, :user, forum_posts: :user).find(params[:id])
      render json: {
        thread: serialize_thread(thread),
        posts: thread.forum_posts.order(:created_at).map { |post| serialize_post(post) },
      }
    end

    def create
      board = ForumBoard.find_by!(slug: params[:board_slug])
      thread = board.forum_threads.new(thread_params.merge(user: current_user))
      if thread.save
        render json: { thread: serialize_thread(thread) }, status: :created
      else
        render json: { error: thread.errors.full_messages.to_sentence }, status: :unprocessable_entity
      end
    end

    def create_post
      thread = ForumThread.find(params[:id])
      post = thread.forum_posts.new(post_params.merge(user: current_user))
      if post.save
        render json: { post: serialize_post(post) }, status: :created
      else
        render json: { error: post.errors.full_messages.to_sentence }, status: :unprocessable_entity
      end
    end

    private

    def thread_params
      params.permit(:subject, :body)
    end

    def post_params
      params.permit(:body)
    end

    def serialize_thread(thread)
      {
        id: thread.id,
        boardSlug: thread.forum_board.slug,
        subject: thread.subject,
        opBody: thread.body,
        authorDisplayName: thread.user.display_name,
        authorUsername: thread.user.username,
        createdAt: thread.created_at.iso8601(3),
        bumpedAt: thread.bumped_at.iso8601(3),
      }
    end

    def serialize_post(post)
      {
        id: post.id,
        threadId: post.forum_thread_id,
        body: post.body,
        authorDisplayName: post.user.display_name,
        authorUsername: post.user.username,
        createdAt: post.created_at.iso8601(3),
      }
    end
  end
end
